import { NextRequest, NextResponse } from "next/server";
// import { sql } from '@vercel/postgres';
import { auth, clerkClient } from "@clerk/nextjs/server";
import queryDatabase from "@/lib/queryHelper";


// Get all templates
export async function GET() {
    const ITEMS_PER_PAGE = 20;
    // const offset = (currentPage - 1) * ITEMS_PER_PAGE;


    try {
        const templates = await queryDatabase(`SELECT
        campaign_templates.*
        FROM campaign_templates
        ORDER BY campaign_templates.campaign_templates_id DESC
        LIMIT ${ITEMS_PER_PAGE}`, [])

        console.log(templates.rows)

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
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error: Failed to fetch templates', error }, { status: 500 })
    }

}

// Get all templates
export async function POST(request: NextRequest) {

    const { template_name, template_category } = await request.json();
    const { userId } = auth();

    if (!template_name || !template_category) {
        return NextResponse.json({ success: false, message: 'Please provide required fields.' }, { status: 404 })
    }
    try {

        // TODO For now we have table for one category of template campings table we need to check based on template_category from which table to read 
        // default data from and in which to insert to make it generic to insert templates

        const slug = template_name.toLowerCase().split(" ").join("-");
        // RETURNING * gives the inserted row so we can return data and check which category is inserted
        const res = await sql`
        INSERT INTO campaign_templates (template_name, template_category, slug, created_by)
        VALUES (${template_name}, ${template_category},${slug}, ${userId})
        RETURNING * `;

        // Create insert query
        // Get col names to insert by default sorting
        const col_names = await sql`SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'campaign_templates_data' order by ordinal_position ;`;

        // Exclude first index as it is primary key
        const insert_cols = col_names.rows.slice(1).map(item => item.column_name).join(', ');
        let insert_str = `INSERT INTO campaign_templates_data (${insert_cols}) VALUES `

        // Get default template data
        const cols_to_fetch = col_names.rows.slice(2).map(item => item.column_name).join(', ');
        const defaultTemplateData = await sql.query(`
        SELECT ${cols_to_fetch} FROM campaign_templates_data
        WHERE template_id = 0 ;`, []);
        defaultTemplateData.rows.forEach((element, index) => {
            insert_str += `(${res.rows[0].campaign_templates_id}, `;
            const obj = Object.values(element)
            obj.forEach((ele, ele_index) => {
                // Last index
                insert_str += ele ? "'" + ele + "'" : null;
                if (ele_index !== obj.length - 1) {
                    insert_str += ', '
                }
            })
            insert_str += ')'
            if (index !== defaultTemplateData.rows.length - 1) {
                insert_str += ', '
            }
        });

        //  May be handle here if template_data not inserted then delete then delete template ? 
        const insertDefaultTemplate = await sql.query(insert_str, []);

        return NextResponse.json({ success: true, message: 'Template created successfully.', data: res.rows }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error: Failed to create record.', }, { status: 500 })
    }
}