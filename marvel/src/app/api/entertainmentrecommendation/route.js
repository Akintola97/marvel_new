import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { itemDetails } = await request.json();

    const API_KEY = process.env.OPENAI_KEY;
    const TMDB_API_KEY = process.env.API_KEY;
    const BASE_URL = "https://api.themoviedb.org/3";

    if (!API_KEY || !TMDB_API_KEY) {
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
        content:
          "You are a helpful assistant that provides 10 Marvel TV/movie recommendations based on the description.",
      },
      {
        role: "user",
        content: `Title: ${title}, Type: ${
          type || "N/A"
        }, Description: ${description}. Please provide each recommendation as a JSON object with the following keys: title, type, description. The response should be a JSON array of 10 objects.`,
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

      // Clean and sanitize AI response
      aiResponse = aiResponse.replace(/```json|```/g, "").trim();

      try {
        const recommendations = JSON.parse(aiResponse);

        if (recommendations.length === 10) {
          // Successfully parsed a valid response with 10 recommendations
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

    // Fetch detailed information from TMDb for each recommendation
    const detailedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        const query = encodeURIComponent(rec.title);
        try {
          const tmdbResponse = await axios.get(
            `${BASE_URL}/search/${rec.type === "tv" ? "tv" : "movie"}`,
            {
              params: {
                api_key: TMDB_API_KEY,
                query,
              },
            }
          );

          const itemDetails = tmdbResponse.data.results[0];
          return {
            ...rec,
            details: itemDetails,
            poster_path: itemDetails?.poster_path,
          };
        } catch (tmdbError) {
          console.error(`Error fetching TMDb details for ${rec.title}:`, tmdbError);
          return { ...rec, details: null, poster_path: null };
        }
      })
    );

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
