import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");
        if (!slug) {
            return NextResponse.json({ success: false, message: 'Invalid request params' }, { status: 500 });
        }
        var query = `SELECT
        campaign_templates.campaign_templates_id
        FROM campaign_templates
        WHERE campaign_templates.slug = '${slug}' ;`;
        const template = await sql.query(query, []);
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

export async function PUT(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");
        const body = await request.json();
        if (!slug) {
            return NextResponse.json({ success: false, message: 'Invalid request params' }, { status: 500 });
        }
        if (!body.data) {
            return NextResponse.json({ success: false, message: 'Invalid request data' }, { status: 500 });
        }

        body.data.forEach(element => {
            const temp_obj = { ...element };
            delete temp_obj.campaign_templates_data_id;
            delete temp_obj.template_id;
            updateCampaignTemplateData(temp_obj, element.template_id, element.campaign_templates_data_id)
        });

        // TODO make slug unique and then update the time when data is updated against template
        // var query = `SELECT
        // campaign_templates.campaign_templates_id
        // FROM campaign_templates
        // WHERE campaign_templates.slug = '${slug}' ;`;

        return NextResponse.json({ success: true, message: 'Template updated successfully.', data: [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}

async function updateCampaignTemplateData(data, template_id, campaign_templates_data_id) {
    try {
        const queryString = `
            UPDATE campaign_templates_data
            SET ${Object.keys(data).map((key, index) => `${key} = $${index + 3}`).join(', ')}
            WHERE campaign_templates_data_id = $1 AND template_id = $2
        `;

        console.log('Updating  campaign_templates_data_id :' + campaign_templates_data_id)
        const res = await sql.query(
            queryString,
            [campaign_templates_data_id, template_id, ...Object.values(data)]
        );
    } catch (error) {
        throw new Error(`Failed to update row: ${error.message}`);
    }
}

