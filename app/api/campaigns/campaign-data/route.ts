import queryDatabase from "@/lib/queryHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");
        if (!slug) {
            return NextResponse.json({ success: false, message: 'Invalid request params' }, { status: 500 });
        }
        var query = `SELECT
        campaigns.campaign_id
        FROM campaigns
        WHERE campaigns.slug = '${slug}' ;`;
        const template = await queryDatabase(query, []);
        if (template.rows.length == 0) {
            return NextResponse.json({ success: false, message: 'Invalid template id' }, { status: 500 });
        }

        // console.log(template.rows);
        // query = `SELECT
        // campaign_data.*
        // FROM campaign_data
        // WHERE campaign_id = ${template.rows[0].campaign_templates_id}
        // ORDER BY campaign_data.campaign_data_id ASC ;`;

        // const template_data = await queryDatabase(query, []);

        return NextResponse.json({ success: true, message: 'Templates fetched successfully.', data: [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}