import { NextResponse } from "next/server";

export async function GET() {
  // Graceful fallback for Instagram feed
  const feed = [
    { id: "1", media_url: "/assets/calliper/gift-box-birthday.jpg", permalink: "https://instagram.com/calliper_creations", caption: "Hand-stamped vintage cards" }
  ];
  
  return NextResponse.json(feed);
}
