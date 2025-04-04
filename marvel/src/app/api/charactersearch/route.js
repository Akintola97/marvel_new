import crypto from "crypto";
import axios from "axios";
import { NextResponse } from "next/server";
const ts = new Date().getTime();
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const hash = crypto
  .createHash("md5")
  .update(ts.toString() + privateKey + publicKey)
  .digest("hex");


  export async function POST(request){
    const {characterSearch} = await request.json();
    try {
        const response = await axios.get(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${encodeURIComponent(characterSearch)}&ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        return NextResponse.json(response.data.data.results,{status: 200})
    } catch (error) {
        console.error("Error fetching data:", error)
        return NextResponse.json({message: "Error fetching Data"}, {status:500})
    }
  }
