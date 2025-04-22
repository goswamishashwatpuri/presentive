import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log(req);
  
  console.log("Hello")
   return Response.json({message: "hello"})
}