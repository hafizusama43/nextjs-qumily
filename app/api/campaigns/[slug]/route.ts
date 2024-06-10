import queryDatabase from "@/lib/queryHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;
    console.log(slug)
    try {
        var query = `SELECT
        campaigns.campaign_id
        FROM campaigns
        WHERE campaigns.slug = '${slug}' ;`;
        const campaign = await queryDatabase(query, []);
        if (campaign.rows.length == 0) {
            return NextResponse.json({ success: false, message: 'Invalid template id' }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: 'Campaigns fetched successfully.', data: campaign }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error: Failed to fetch campaigns', error }, { status: 500 })
    }
}