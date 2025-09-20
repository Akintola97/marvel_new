// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const { messages } = await request.json();
//   const API_KEY = process.env.OPENAI_KEY;

//   if (!API_KEY) {
//     console.error("API key is not set in environment variables");
//     return NextResponse.json(
//       { message: "API key is not configured" },
//       { status: 500 }
//     );
//   }
//   try {
//     const response = await axios.post(
//       `https://api.openai.com/v1/chat/completions`,
//       {
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content:
//               "This assistant is specialized in discussing marvel movies, tv-shows and comics",
//           },
//           ...messages.map((msg) => ({
//             role: msg.from === "user" ? "user" : "assistant",
//             content: msg.message,
//           })),
//         ],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const aiResponse = response.data.choices[0].message.content.trim();
//     return NextResponse.json({ response: aiResponse }, { status: 200 });
//   } catch (error) {
//     console.error(
//       "Error occurred:",
//       error.response ? error.response.data : error.message
//     );
//     return NextResponse.json(
//       { message: "Something went wrong", error: error.message },
//       { status: 500 }
//     );
//   }
// }






import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  const { messages } = await request.json();
  const OPENAI_KEY = process.env.OPENAI_KEY;
  const TMDB_KEY = process.env.API_KEY;

  if (!OPENAI_KEY) {
    return NextResponse.json({ message: "OpenAI key not set" }, { status: 500 });
  }

  const userMessage = messages?.[messages.length - 1]?.message || "";
  let tmdb = null;

  // --- 1) Normalize the search to improve matching ---
  function extractTitle(raw) {
    if (!raw) return "";
    const lower = raw.toLowerCase();

    // remove common noise words
    const noise = [
      "official", "trailer", "teaser", "release date", "release", "cast",
      "plot", "story", "when is", "when did", "what is", "marvel", "movie", "film",
      "show", "series", "season", "episode"
    ];
    let cleaned = lower;
    for (const n of noise) cleaned = cleaned.replace(new RegExp(`\\b${n}\\b`, "g"), " ");

    // collapse whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    // if they typed quotes, prefer what's inside: e.g. `"Logan" trailer`
    const quoted = raw.match(/"([^"]+)"/);
    if (quoted?.[1]) return quoted[1].trim();

    // otherwise, title-case the cleaned words (helps TMDB relevance a bit)
    return cleaned
      .split(" ")
      .map(w => w ? w[0].toUpperCase() + w.slice(1) : w)
      .join(" ");
  }

  async function pickTrailerKey(videos = []) {
    if (!videos.length) return null;

    // Prefer Official Trailer
    const official = videos.find(v =>
      v.site === "YouTube" && v.type === "Trailer" && /official/i.test(v.name || "")
    );
    if (official?.key) return official.key;

    // Any Trailer
    const trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer");
    if (trailer?.key) return trailer.key;

    // Fallback Teaser
    const teaser = videos.find(v => v.site === "YouTube" && v.type === "Teaser");
    if (teaser?.key) return teaser.key;

    // Last resort: any YouTube video
    const anyYT = videos.find(v => v.site === "YouTube");
    return anyYT?.key || null;
  }

  async function fetchTMDBInfo(rawQuery) {
    if (!TMDB_KEY) return null;

    const query = extractTitle(rawQuery);
    if (!query) return null;

    const common = {
      api_key: TMDB_KEY,
      include_adult: false,
      language: "en-US",
      region: "US",
    };

    try {
      // --- 2) Use multi search for better matching across movie/tv/person ---
      const multiRes = await axios.get("https://api.themoviedb.org/3/search/multi", {
        params: { ...common, query },
      });

      const results = (multiRes.data?.results || []).filter(
        r => r.media_type === "movie" || r.media_type === "tv"
      );

      if (!results.length) return null;

      // heuristic: highest popularity wins
      results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      const top = results[0];
      const type = top.media_type; // "movie" | "tv"

      // Details (overview, cast, poster)
      const detailsRes = await axios.get(
        `https://api.themoviedb.org/3/${type}/${top.id}`,
        { params: { ...common, append_to_response: "credits" } }
      );
      const d = detailsRes.data;

      // Videos: fetch with wider language allowance
      const videosRes = await axios.get(
        `https://api.themoviedb.org/3/${type}/${top.id}/videos`,
        {
          params: {
            ...common,
            include_video_language: "en,null",
          },
        }
      );
      const videos = videosRes.data?.results || [];
      const trailerKey = await pickTrailerKey(videos);

      const baseImg = "https://image.tmdb.org/t/p/original";
      const poster_path = top.poster_path || d.poster_path;
      const posterUrl = poster_path ? `${baseImg}${poster_path}` : null;

      return {
        type,
        id: top.id,
        title: type === "movie" ? (top.title || d.title) : (top.name || d.name),
        release_date: d.release_date || d.first_air_date || null,
        overview: d.overview || null,
        cast: (d.credits?.cast || []).slice(0, 5).map(c => c.name),
        trailerKey,
        posterUrl,
      };
    } catch (err) {
      console.error("TMDB fetch error:", err?.response?.data || err?.message || err);
      return null;
    }
  }

  if (/(marvel|movie|film|show|series|season|episode|release|cast|trailer)/i.test(userMessage)) {
    tmdb = await fetchTMDBInfo(userMessage);
  }

  // Ask OpenAI with TMDB grounding
  let aiResponse = "Sorry, I couldn’t get a response.";
  try {
    const openai = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a Marvel entertainment expert. Prefer facts from TMDB_JSON when present (titles, dates, cast). If key info is missing, say you're not certain.",
          },
          ...(tmdb ? [{ role: "system", content: `TMDB_JSON:\n${JSON.stringify(tmdb, null, 2)}` }] : []),
          ...messages.map(m => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.message,
          })),
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    aiResponse = openai.data?.choices?.[0]?.message?.content?.trim() || aiResponse;
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ response: aiResponse, tmdb }, { status: 200 });
}
