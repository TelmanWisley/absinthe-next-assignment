import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function POST(_req: NextRequest) {
  try {
    const apiKey = nanoid(32);
    const hashedKey = await bcrypt.hash(apiKey, 10);
    const campaignId = nanoid(16);
    await sql`INSERT INTO api_key (api_key_hash) VALUES (${hashedKey});`;
    await sql`INSERT INTO campaign (api_key_hash, campaign_id) VALUES (${hashedKey}, ${campaignId});`;

    return NextResponse.json(
      {
        API_KEY: apiKey,
        WARNING:
          "Store this key securely. You can't be able to access it again.",
        CAMPAIGN_ID: campaignId,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error generating and storing API Key: ", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
