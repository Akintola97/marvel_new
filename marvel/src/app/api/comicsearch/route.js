// import { NextResponse } from "next/server";
// import axios from "axios";
// import crypto from "crypto";

// export async function POST(request) {
//   const { comicTitle, issueNumber } = await request.json();
//   const PRIVATE_KEY = process.env.PRIVATE_KEY;
//   const PUBLIC_KEY = process.env.PUBLIC_KEY;
//   const ts = new Date().getTime();
//   const hash = crypto
//     .createHash("md5")
//     .update(ts.toString() + PRIVATE_KEY + PUBLIC_KEY)
//     .digest("hex");

//   try {
//     let url = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

//     if (comicTitle) {
//       url += `&title=${encodeURIComponent(comicTitle)}`;
//     }
//     if (issueNumber) {
//       url += `&issueNumber=${issueNumber}`;
//     }

//     const response = await axios.get(url);
//     return NextResponse.json(response.data.data.results, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json(
//       { message: "Error fetching data" },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(request) {
  const { query } = await request.json();

  // Split the query if it contains an issue number.
  const parts = query.split(",").map((part) => part.trim());
  const comicTitle = parts[0] || "";
  let issueNumber = "";
  if (parts.length > 1 && parts[1].startsWith("#")) {
    issueNumber = parts[1].substring(1);
  }

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  const ts = new Date().getTime();
  const hash = crypto
    .createHash("md5")
    .update(ts.toString() + PRIVATE_KEY + PUBLIC_KEY)
    .digest("hex");

  try {
    let url = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
    if (comicTitle) {
      url += `&title=${encodeURIComponent(comicTitle)}`;
    }
    if (issueNumber) {
      url += `&issueNumber=${issueNumber}`;
    }
    const response = await axios.get(url);
    return NextResponse.json(response.data.data.results, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}