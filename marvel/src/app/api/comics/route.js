import crypto from "crypto";
import { NextResponse } from "next/server";




const ts = new Date().getTime();
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const hash = crypto
  .createHash("md5")
  .update(ts.toString() + privateKey + publicKey)
  .digest("hex");


export const dynamic = "force-dynamic";

export async function GET(request) {

  const comicName = "wolverine";
  try {
    const response = await fetch(
      `https://gateway.marvel.com:443/v1/public/comics?title=${comicName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`,
      {
        cache: "force-cache",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const comics = data.data.results;
console.log(comics);

    return NextResponse.json(comics, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching Data" },
      { status: 500 }
    );
  }
}
