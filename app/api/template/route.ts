import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { auth, clerkClient } from "@clerk/nextjs/server";


// Get all templates
export async function GET() {
    const ITEMS_PER_PAGE = 20;
    // const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const templates = await sql<any>`SELECT
        campaign_templates.*
        FROM campaign_templates
        ORDER BY campaign_templates.campaign_templates_id DESC
        LIMIT ${ITEMS_PER_PAGE}`

        const createdByArray = templates.rows.map(item => item.created_by);

        // Get all users from clerk
        const { data } = await clerkClient.users.getUserList({ userId: createdByArray });
        const userMap = data.reduce((acc, user) => {
            acc[user.id] = user.fullName;
            return acc;
        }, {});
        const templatesData = templates.rows.map(item => {
            return { ...item, username: userMap[item.created_by] };
        });

        return NextResponse.json({ success: true, message: 'Templates fetched successfully.', data: templatesData }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}

// Get all templates
export async function POST(request: NextRequest) {

    const { template_name } = await request.json();
    const { userId } = auth();

    if (!template_name) {
        return NextResponse.json({ success: false, message: 'Template name is required.' }, { status: 404 })
    }
    try {
        // RETURNING * gives the inserted row
        const res = await sql`
      INSERT INTO campaign_templates (camping_name,created_by)
      VALUES (${template_name}, ${userId})
      RETURNING *
    `;
        return NextResponse.json({ success: true, message: 'Template created successfully.', data: res.rows }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Database Error: Failed to create record.', }, { status: 200 })
    }
}