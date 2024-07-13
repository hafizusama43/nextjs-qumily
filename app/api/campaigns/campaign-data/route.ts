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

export async function POST(request: NextRequest) {

    const body = await request.json();
    var { campaignData, targetingType, biddingData, skus, slug } = body;
    // console.log(body)

    // Get campaign_id from campaigns
    var query = `SELECT
    campaigns.campaign_id
    FROM campaigns
    WHERE campaigns.slug = '${slug}' ;`;

    const campaign = await queryDatabase(query, []);
    if (campaign.rows.length == 0) {
        return NextResponse.json({ success: false, message: 'Invalid campaign!' }, { status: 500 });
    }
    const campaign_id = campaign.rows[0].campaign_id;

    // Delete campaign-data and campaign-template-data
    var query = `DELETE
    FROM campaign_data
    WHERE campaign_data.campaign_id = $1 ;`;
    await queryDatabase(query, [campaign_id]);

    var query = `DELETE
    FROM campaign_templates_data
    WHERE campaign_templates_data.campaign_id_external = $1 ;`;
    await queryDatabase(query, [campaign_id]);

    // Insert campaign_data against campaign
    var query = `INSERT INTO
    campaign_data
    (campaign_id, key, value)
    VALUES 
    ($1, $2, $3);`;

    // Insert bidding-data
    biddingData = stringify(biddingData);
    biddingData && await queryDatabase(query, [campaign_id, 'bidding-data', biddingData]);

    // Insert targeting-type
    targetingType = stringify(targetingType);
    targetingType && await queryDatabase(query, [campaign_id, 'targeting-type', targetingType]);

    // Insert skus
    skus = stringify(skus);
    skus && await queryDatabase(query, [campaign_id, 'skus', skus]);

    // Insert campaign-template-data
    insertTemplateData(campaignData, campaign_id);

    try {
        return NextResponse.json({ success: true, message: 'Campaign updated successfully.', data: [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error: Failed to update campaign.', }, { status: 500 })
    }
}

function stringify(data: any): string {
    const isArray = Array.isArray(data);
    const dataText = isArray && data.length > 0 ? JSON.stringify(data) : data;
    return dataText ? dataText.toString() : ''
}

async function insertTemplateData(data: any, campaign_id: number) {
    var insert_str = await getCols();
    var value_str = '';

    insert_str += ' VALUES ';
    data.forEach((element, index) => {
        value_str = `(${campaign_id},`;
        const obj = Object.values(element)
        obj.forEach((ele, ele_inde) => {
            // Last index
            value_str += ele ? "'" + ele + "'" : null;
            if (ele_inde !== obj.length - 1) {
                value_str += ', '
            }
        })

        value_str += ')'
        if (index !== data.length - 1) {
            value_str += ', '
        }
        insert_str += value_str;
    });
    queryDatabase(insert_str, [])
}

async function getCols() {
    let query_str = 'INSERT INTO campaign_templates_data (';
    const cols = await queryDatabase(`SELECT *
    FROM information_schema.columns
    WHERE table_name = 'campaign_templates_data'
    ;`, []);

    cols.rows.forEach((element, index) => {
        if (element.column_name !== 'campaign_templates_data_id') {
            query_str += element.column_name;
            if (index !== cols.rows.length - 1) {
                query_str += ', ';
            }
        }
    });
    query_str += ')';
    return query_str;
}