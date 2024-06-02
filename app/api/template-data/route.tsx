import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");
        if (!slug) {
            return NextResponse.json({ success: false, message: 'Invalid request params' }, { status: 500 });
        }
        console.log(slug)
        var query = `SELECT
        campaign_templates.campaign_templates_id
        FROM campaign_templates
        WHERE campaign_templates.slug = '${slug}' ;`;

        console.log(query)

        const template = await sql.query(query, []);

        console.log(template.rows);
        if (template.rows.length == 0) {
            return NextResponse.json({ success: false, message: 'Invalid template id' }, { status: 500 });
        }
        query = `SELECT
        campaign_templates_data.*
        FROM campaign_templates_data
        WHERE template_id = ${template.rows[0].campaign_templates_id}
        ORDER BY campaign_templates_data.campaign_templates_data_id ASC ;`;

        const template_data = await sql.query(query, []);


        return NextResponse.json({ success: true, message: 'Templates fetched successfully.', data: template_data.rows }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}