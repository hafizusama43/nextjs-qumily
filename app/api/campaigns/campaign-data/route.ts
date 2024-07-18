import { getSpecificKeyValues, MONTH_NAMES } from "@/lib/helpers";
import { SponsoredProductsInterface } from "@/lib/interfaces";
import queryDatabase from "@/lib/queryHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");
        const mode = request.nextUrl.searchParams.get("mode");
        if (!slug) {
            return NextResponse.json({ success: false, message: 'Invalid request params' }, { status: 500 });
        }
        var query = `SELECT
        campaigns.campaign_id
        FROM campaigns
        WHERE campaigns.slug = $1 ;`;
        const campaign = await queryDatabase(query, [slug]);
        if (campaign.rows.length == 0) {
            return NextResponse.json({ success: false, message: 'Invalid campaign id' }, { status: 500 });
        }
        const campaign_id = campaign.rows[0].campaign_id;
        query = `SELECT
        campaign_data.*
        FROM campaign_data
        WHERE campaign_id = $1 ;`;
        var campaign_data = await queryDatabase(query, [campaign_id]);
        campaign_data = campaign_data.rows.length > 0 ? parseValues(campaign_data.rows) : {}

        query = `SELECT
        product, entity, operation, campaign_id, ad_group_id, portfolio_id, ad_id, keyword_id, product_targeting_id, campaign_name, ad_group_name, start_date, end_date, targeting_type, state, daily_budget, sku, ad_group_default_bid, bid, keyword_text, match_type, bidding_strategy, placement, percentage, product_targeting_expression
        FROM campaign_templates_data
        WHERE campaign_templates_data.campaign_id_external = $1 ;`;
        var campaignTemplateData = await queryDatabase(query, [campaign_id]);
        campaignTemplateData = campaignTemplateData.rows.length > 0 ? campaignTemplateData.rows : []

        if (mode && mode === 'view') {
            campaignTemplateData = createCampaignData(campaignTemplateData, campaign_data);
        }
        var campaign_template_data: SponsoredProductsInterface[] = campaignTemplateData ? campaignTemplateData : []

        return NextResponse.json({ success: true, message: 'Templates fetched successfully.', data: { campaign_data, campaign_template_data } }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}

export async function POST(request: NextRequest) {

    const body = await request.json();
    var { campaignData,
        targetingType,
        biddingData,
        skus,
        slug,
        negKeywordData,
        campaignNegKeywordData,
        productTargetingExpression,
        campaignProductsCount
    } = body;
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

    // Insert bidding_data
    biddingData = stringify(biddingData);
    biddingData && await queryDatabase(query, [campaign_id, 'bidding_data', biddingData]);

    // Insert targeting_type
    targetingType = stringify(targetingType);
    targetingType && await queryDatabase(query, [campaign_id, 'targeting_type', targetingType]);

    // Insert skus
    skus = stringify(skus);
    skus && await queryDatabase(query, [campaign_id, 'skus', skus]);

    // Insert neg_keyword_data
    negKeywordData = stringify(negKeywordData);
    negKeywordData && await queryDatabase(query, [campaign_id, 'neg_keyword_data', negKeywordData]);

    // Insert campaign_neg_keyword_data
    campaignNegKeywordData = stringify(campaignNegKeywordData);
    campaignNegKeywordData && await queryDatabase(query, [campaign_id, 'campaign_neg_keyword_data', campaignNegKeywordData]);

    // Insert product_targeting_expression
    productTargetingExpression = stringify(productTargetingExpression);
    productTargetingExpression && await queryDatabase(query, [campaign_id, 'product_targeting_expression', productTargetingExpression]);

    // Insert product_targeting_expression
    campaignProductsCount >= 0 && await queryDatabase(query, [campaign_id, 'campaign_products_count', campaignProductsCount]);

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
    // This function inserts template data make sure to data should have equal object length as no of cols inserted! Cols as listed below
    // product, entity, operation, campaign_id, ad_group_id, portfolio_id, ad_id, keyword_id, product_targeting_id, campaign_name, ad_group_name, start_date, end_date, targeting_type, state, daily_budget, sku, ad_group_default_bid, bid, keyword_text, match_type, bidding_strategy, placement, percentage, product_targeting_expression
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

function parseValues(data) {
    const result = {};

    data.forEach(item => {
        const { key, value } = item;
        try {
            // Attempt to parse the JSON value
            result[key] = JSON.parse(value);
        } catch (error) {
            // If parsing fails (not valid JSON), assign the value as string
            result[key] = value;
        }
    });

    return result;
}

function createCampaignData(campaign_template_data: SponsoredProductsInterface[], campaign_data) {
    // Split products into array
    const products: string[] = (campaign_data.skus as string).split(',');
    console.log(products);
    // Default campaign number
    var numberOfCampaigns: number = 1;
    // User-defined number of products per campaign
    if (campaign_data.campaign_products_count && parseInt(campaign_data.campaign_products_count) > 0) {
        numberOfCampaigns = Math.ceil(products.length / campaign_data.campaign_products_count);
    }
    console.log(numberOfCampaigns);
    const campaigns = [];

    console.log(campaign_data)
    // Replace campaign id and ad-group id for now temp

    var campaignId: string = `SP | ${campaign_data.targeting_type} - (${new Date().getFullYear()} - ${MONTH_NAMES[new Date().getMonth()]}) - %campaignNumber%`;
    var adGroupId: string = campaignId;

    // var adGroupObjExists = campaign_template_data.filter((item) => item.entity.toLowerCase() === "ad group");
    // const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['campaign_id', 'ad_group_id']);

    for (let i = 0; i < numberOfCampaigns; i++) {
        console.log('Campaign number : ', i)
        var campaignId = campaignId.replace('%campaignNumber%', (i + 1).toString());;
        var adGroupId = campaignId;


        console.log(campaignId);
        console.log(adGroupId);

        // Copy base template and replace placeholders
        //     let campaign = campaign_template_data.map(item => ({
        //         ...item,
        //         campaign_id: campaignId,
        //         ad_group_id: item.entity === "Ad Group" || item.entity === "Product Ad (Required)" ? adGroupId : item.ad_group_id
        //     }));


        // Find the index of the "Product Ad (Required)" row
        //     const productAdIndex = campaign.findIndex(item => item.entity === "Product Ad (Required)");

        // Remove the "Product Ad (Required)" row from the template
        //     campaign.splice(productAdIndex, 1);
        //     console.log(productAdIndex)

        // Insert the appropriate "Product Ad" rows at the found index
        //     for (let j = 0; j < productsPerCampaign; j++) {
        //         const productIndex = i * productsPerCampaign + j;
        //         if (productIndex < arr.length) {
        //             const productAd = {
        //                 ...campaign_template_data.find(item => item.entity === "Product Ad"),
        //                 campaign_id: campaignId,
        //                 ad_group_id: adGroupId,
        //                 sku: arr[productIndex]
        //             };
        //             campaign.splice(productAdIndex + j, 0, productAd);
        //         }
        //     }
        //     campaigns.push(campaign);
    }

    return campaigns.flat();
}