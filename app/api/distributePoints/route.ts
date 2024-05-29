import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import verifyAPIKey from "@/app/lib/verifyKey";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("api-key");
    const campaignId = req.headers.get("campaign-id");
    if (apiKey && (await verifyAPIKey(apiKey))) {
      const { eventName, pointsData } = await req.json();
      // update points table for address
      const userPoints =
        await sql`SELECT * FROM point WHERE campaign_id = ${campaignId} AND address = ${pointsData.address};`;
      if (userPoints.rowCount > 0) {
        await sql`
          UPDATE points
          SET points = ${pointsData.points}, last_modified = NOW()
          WHERE campaign_id = ${campaignId} AND address = ${pointsData.address};
        `;
      } else {
        await sql`
          INSERT INTO point (campaign_id, address, points, last_modified)
          VALUES (${campaignId}, ${pointsData.address}, ${pointsData.points}, NOW());
        `;
      }

      await sql`
        INSERT INTO event (campaign_id, address, event_name, points, timestamp)
        VALUES (${campaignId}, ${pointsData.address}, ${eventName}, ${pointsData.points}, NOW());
      `;
      return NextResponse.json({ success: true }, { status: 200 });
    }
    return NextResponse.json({ error: "Invalid API Key" }, { status: 405 });
  } catch (e) {
    console.error(`Error distributing points:  ${e}`);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
