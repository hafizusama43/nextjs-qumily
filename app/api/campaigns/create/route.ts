import queryDatabase from "@/lib/queryHelper";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const { campaign_name, campaign_category } = await request.json();
    const { userId } = auth();

    if (!campaign_name || !campaign_category) {
        return NextResponse.json({ success: false, message: 'Please provide required fields.' }, { status: 404 })
    }

    try {
        // TODO For now we have table for one category of template campings table we need to check based on template_category from which table to read 
        // default data from and in which to insert to make it generic to insert templates
        const slug = campaign_name.toLowerCase().split(" ").join("-");
        // Check if already slug exists 
        var query = `SELECT
        *
        FROM campaigns
        WHERE campaigns.slug = '${slug}' ;`;
        const campaign = await queryDatabase(query, []);
        if (campaign.rows.length > 0) {
            return NextResponse.json({ success: false, message: 'Campaign name already exists!' }, { status: 500 });
        }

        // RETURNING * gives the inserted row so we can return data and check which category is inserted
        const res = await queryDatabase(`
        INSERT INTO campaigns (campaign_name, campaign_category, slug, created_by)
        VALUES ('${campaign_name}', '${campaign_category}', '${slug}', '${userId}')
        RETURNING * `, []);

        return NextResponse.json({ success: true, message: 'Campaign created successfully.', data: res.rows }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error: Failed to create record.', }, { status: 500 })
    }
}