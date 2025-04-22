import { client } from "@/lib/prisma";
import crypto from "node:crypto";
import { NextRequest } from "next/server";

// Force dynamic rendering to ensure the route is not cached
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
  
  try {
    // Get the raw request body as text
    const rawBody = await req.text();
    // Parse the JSON body
    const body = JSON.parse(rawBody);

    // Extract buyerUserId from the custom data in the webhook payload
    const { buyerUserId } = body.meta.custom_data;

    if(!buyerUserId){
      throw new Error("Invalid buyerUserId.");
    }

    // Create an HMAC (Hash-based Message Authentication Code) using SHA-256
    // This will be used to verify the webhook signature
    const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!);
    
    // Create a digest (hash) of the raw request body
    // The digest is our local verification of the data
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    
    // Get the signature from the request headers
    // This is the hash that Lemon Squeezy calculated and sent to us
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");
    
    // Log the values for debugging purposes
    console.log(`signature:`, req.headers.get("X-Signature"));
    console.log(`digest:`, digest);
    console.log(`signature:`, signature);

    // Compare the digest and signature using timing-safe comparison
    // This prevents timing attacks that could leak information about the comparison
    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    // If signature verification passes, update the user's subscription status
    const buyer = await client.user.update({
      where: { id: buyerUserId },
      data:{subscription:true}
    });

    if (!buyer) {
      return Response.json({ message: "Cannot update the subscription.", status: 404 });
    }

    return Response.json({ data: buyer, status: 200 });
  } catch (e) {
    console.error("Error in POST handler:", e);
    return Response.json({ message: "Internal Server Error", status: 500 });
  }
}
