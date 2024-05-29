import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import verifyAPIKey from "@/app/lib/verifyKey";

type Params = {
  address: string | undefined;
  eventName: string | undefined;
};

export async function GET(req: NextRequest, _context: { params: Params }) {
  try {
    const apiKey = req.headers.get("api-key");
    const campaignId = req.headers.get("campaign-id");
    const eventName = req.nextUrl.searchParams.get("eventName");
    const address = req.nextUrl.searchParams.get("address");
    if (apiKey && (await verifyAPIKey(apiKey))) {
      if (eventName) {
        const data =
          await sql`SELECT * FROM event WHERE address = ${address} AND event_name = ${eventName} AND campaign_id = ${campaignId} ORDER BY timestamp desc;`;
        return NextResponse.json({ rows: data.rows }, { status: 200 });
      } else {
        const data =
          await sql`SELECT * FROM point WHERE address = ${address} AND campaign_id = ${campaignId};`;
        return NextResponse.json({ rows: data.rows }, { status: 200 });
      }
    }
    return NextResponse.json({ error: "Invalid API Key" }, { status: 405 });
  } catch (e) {
    console.error(`Error getting points:  ${e}`);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
