import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

// Get all templates
export async function GET() {
    const ITEMS_PER_PAGE = 20;
    // const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const invoices = await sql<any>`SELECT
        campaign_templates.*
        FROM campaign_templates
        ORDER BY campaign_templates.campaign_templates_id DESC
        LIMIT ${ITEMS_PER_PAGE}`

        return NextResponse.json({ success: true, message: 'Templates fetched successfully.', data: invoices.rows }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}

// Get all templates
export async function POST(request: NextRequest) {
    const { template_name } = await request.json();
    if (!template_name) {
        return NextResponse.json({ success: true, message: 'Template name is required.' }, { status: 404 })
    }
    try {
        await sql`
      INSERT INTO campaign_templates (camping_name)
      VALUES (${template_name})
    `;
    } catch (error) {
        return NextResponse.json({ success: true, message: 'Database Error: Failed to create record.', }, { status: 200 })
    }

    // const data = await res.json()
    return NextResponse.json({ success: true, message: 'Template created successfully.' }, { status: 200 })
}