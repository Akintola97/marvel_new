// import axios from "axios";
// import { NextResponse } from "next/server";

// const key = process.env.API_KEY;

// export async function POST(request) {
//   try {
//     const { media_type, id } = await request.json();

   

//     if (!media_type || !id) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Normalize media_type
//     const normalizedMediaType = media_type === "tv series" ? "tv" : media_type;

//     const response = await axios.get(
//       `https://api.themoviedb.org/3/${normalizedMediaType}/${id}/videos?api_key=${key}&language=en-US`
//     );
//     const data = response.data;
//     const trailer = data.results.find(
//       (video) => video.type === "Trailer" && video.site === "YouTube"
//     );

//     const trailerKey = trailer ? trailer.key : null;
//     return NextResponse.json({ trailerKey }, { status: 200 });
//   } catch (error) {
//     console.error("Failed to fetch trailer:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch trailer" },
//       { status: 500 }
//     );
//   }
// }





import axios from "axios";
import { NextResponse } from "next/server";

const key = process.env.API_KEY;

export async function POST(request) {
  try {
    const { media_type, id } = await request.json();

    if (!media_type || !id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Normalize media_type
    const normalizedMediaType = media_type === "tv series" ? "tv" : media_type;

    const response = await axios.get(
      `https://api.themoviedb.org/3/${normalizedMediaType}/${id}/videos?api_key=${key}&language=en-US`
    );
    const data = response.data;
    const trailer = data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    const trailerKey = trailer ? trailer.key : null;
    return NextResponse.json({ trailerKey }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch trailer:", error);
    return NextResponse.json(
      { error: "Failed to fetch trailer" },
      { status: 500 }
    );
  }
}