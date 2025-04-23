import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";


export async function POST(request) {
  try {
    const { itemDetails } = await request.json();

    const API_KEY = process.env.OPENAI_KEY;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const ts = new Date().getTime();
    const hash = crypto
      .createHash("md5")
      .update(ts.toString() + PRIVATE_KEY + PUBLIC_KEY)
      .digest("hex");

    if (!API_KEY || !PRIVATE_KEY || !PUBLIC_KEY) {
      console.error("API keys are not set in environment variables");
      return NextResponse.json(
        { message: "API keys are not configured" },
        { status: 500 }
      );
    }

    const { title, type, description } = itemDetails;

    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant that provides 10 Marvel comic recommendations based on description.",
      },
      {
        role: "user",
        content: `Title: ${title}, Type: ${type || "N/A"}, Description: ${description}. Please provide each recommendation as a JSON object with the following keys: title, type, description. The response should be a JSON array of 10 objects.`,
      },
    ];

    let aiResponse;
    let attempts = 0;
    const maxAttempts = 4;

    while (attempts < maxAttempts) {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: messages,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      aiResponse = response.data.choices[0].message.content.trim();
   
      aiResponse = aiResponse.replace(/```json|```/g, "").trim();

      try {
        const recommendations = JSON.parse(aiResponse);

        if (recommendations.length === 10) {
          break;
        }
      } catch (error) {
        console.error("Failed to parse AI response as JSON:", error);
      }

      attempts++;
    }

    if (!aiResponse || attempts === maxAttempts) {
      return NextResponse.json(
        { message: "Failed to get valid AI response after multiple attempts" },
        { status: 500 }
      );
    }

    const recommendations = JSON.parse(aiResponse);


    const detailedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        const query = encodeURIComponent(rec.title);
        try {
          const marvelResponse = await axios.get(
            `https://gateway.marvel.com:443/v1/public/comics?title=${query}&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`
          );
          if (marvelResponse.data.data.results.length > 0) {
            const itemDetails = marvelResponse.data.data.results[0];
            return {
              ...rec,
              id: itemDetails.id, // Generate unique ID
              description: itemDetails.description || "No description available",
              issueNumber: itemDetails.issueNumber || "N/A",
              thumbnail: itemDetails.thumbnail
                ? {
                    path: itemDetails.thumbnail.path,
                    extension: itemDetails.thumbnail.extension,
                  }
                : null,
            };
          } else {
            console.error(`No results found for ${rec.title}`);
            return {
              ...rec,
              id: crypto.randomUUID(), // Generate unique ID
              description: "No description available",
              issueNumber: "N/A",
              thumbnail: null,
            };
          }
        } catch (marvelError) {
          console.error(
            `Error fetching Marvel details for ${rec.title}:`,
            marvelError
          );
          return {
            ...rec,
            id: crypto.randomUUID(), // Generate unique ID
            description: "No description available",
            issueNumber: "N/A",
            thumbnail: null,
          };
        }
      })
    );
    console.log(detailedRecommendations)
    return NextResponse.json(
      { recommendations: detailedRecommendations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
