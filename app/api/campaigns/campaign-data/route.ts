// import { getSpecificKeyValues } from "@/lib/helpers";
import { formatDateToYYYYMMDD, MONTH_NAMES } from "@/lib/helpers";
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
            // Benchmarking original implementation
            console.time('Original Implementation');
            campaignTemplateData = createCampaignData(campaignTemplateData, campaign_data);
            console.timeEnd('Original Implementation');
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
        campaignProductsCount,
        targetingStrategy,
        keywordTargetingData
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

    // Insert campaign_products_count
    campaignProductsCount >= 0 && await queryDatabase(query, [campaign_id, 'campaign_products_count', campaignProductsCount]);

    // Insert targeting_strategy
    targetingStrategy = stringify(targetingStrategy);
    targetingStrategy && await queryDatabase(query, [campaign_id, 'targeting_strategy', targetingStrategy]);

    // Insert keyword_targeting_data
    keywordTargetingData = stringify(keywordTargetingData);
    keywordTargetingData && await queryDatabase(query, [campaign_id, 'keyword_targeting_data', keywordTargetingData]);

    // Insert campaign-template-data
    if (targetingType === "Auto") {
        campaignData = campaignData.filter(item => item.entity !== "Keyword" && item.entity !== "Product Targeting");
    } else {
        if (targetingStrategy === "keyword") {
            campaignData = campaignData.filter(item => item.entity !== "Product Targeting" && item.entity !== "Negative product targeting");
        } else {
            campaignData = campaignData.filter(item => item.entity !== "Keyword" && item.entity !== "Negative keyword");
        }
    }
    insertTemplateData(campaignData, campaign_id);

    try {
        return NextResponse.json({ success: true, message: 'Campaign updated successfully.', data: [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error: Failed to update campaign.' }, { status: 500 })
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
        obj.forEach((ele, ele_index) => {
            // Last index
            value_str += ele ? "'" + ele + "'" : null;
            if (ele_index !== obj.length - 1) {
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

    // console.log(campaign_template_data)
    var products: string[] = [];
    if ((campaign_data.skus as string).includes(",")) {
        products = (campaign_data.skus as string).split(',')
    } else if ((campaign_data.skus as string).includes("\n")) {
        products = (campaign_data.skus as string).split('\n')
    } else {
        products = (campaign_data.skus as string).split(' ')
    }
    products = products.filter(item => item !== '')

    // Default campaign number
    var numberOfCampaigns: number = 1;

    // User-defined number of products per campaign
    if (campaign_data.campaign_products_count && parseInt(campaign_data.campaign_products_count) > 0) {
        numberOfCampaigns = Math.ceil(products.length / campaign_data.campaign_products_count);
    }
    const campaigns = [];
    // Replace values for keys like bidding_data, skus, neg_keyword_data, product_targeting_expression

    // Replace bidding_data
    console.log('object1')
    if (campaign_data.bidding_data && campaign_data.bidding_data.length > 0) {
        var biddingAdjustmentObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "bidding adjustment");
        // Make copy of object and remove from index
        var biddingAdjustmentObj = campaign_template_data.filter((item) => item.entity.toLowerCase() === "bidding adjustment");
        campaign_template_data.splice(biddingAdjustmentObjIndex, 1);
        const results = campaign_data.bidding_data.map(data => {
            return {
                ...biddingAdjustmentObj[0],
                placement: data.placement,
                percentage: data.percentage
            };
        });
        const campaignIndex = campaign_template_data.findIndex(item => item.entity === 'Campaign');
        campaign_template_data.splice(campaignIndex + 1, 0, ...results);
    }

    console.log('object2')
    // Replace neg_keyword_data
    if (campaign_data.neg_keyword_data && campaign_data.neg_keyword_data.length > 0) {

        console.log(campaign_data.neg_keyword_data)
        var negKeywordObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "negative keyword");
        if (negKeywordObjIndex !== -1) {
            console.log(negKeywordObjIndex)
            // Make copy of object and remove from index
            var negKeywordObj = campaign_template_data.filter((item) => item.entity.toLowerCase() === "negative keyword");
            campaign_template_data.splice(negKeywordObjIndex, 1);
            const results = campaign_data.neg_keyword_data.map(data => {
                return {
                    ...negKeywordObj[0],
                    keyword_text: data.keyword_text,
                    match_type: data.match_type
                };
            });
            campaign_template_data.splice(campaign_template_data.length, 0, ...results);
        }
    }

    // console.log(campaign_template_data)
    console.log('object3')
    // Replace campaign_neg_keyword_data
    if (campaign_data.campaign_neg_keyword_data && campaign_data.campaign_neg_keyword_data.length > 0) {
        var campaignNegKeywordObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "campaign negative keyword");
        if (campaignNegKeywordObjIndex !== -1) {
            console.log(campaignNegKeywordObjIndex)
            // Make copy of object and remove from index
            var campaignNegKeywordOb = campaign_template_data.filter((item) => item.entity.toLowerCase() === "campaign negative keyword");
            campaign_template_data.splice(campaignNegKeywordObjIndex, 1);
            const results = campaign_data.campaign_neg_keyword_data.map(data => {
                return {
                    ...campaignNegKeywordOb[0],
                    keyword_text: data.keyword_text,
                    match_type: data.match_type
                };
            });
            campaign_template_data.splice(campaign_template_data.length, 0, ...results);
        }
    }

    console.log('object4')
    // Replace product_targeting_expression
    if (campaign_data.product_targeting_expression && campaign_data.product_targeting_expression.length > 0) {
        var negProductTargetingObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "negative product targeting");
        if (negProductTargetingObjIndex !== -1) {
            var arrayExpressions = campaign_data.product_targeting_expression.split(",")
            arrayExpressions = arrayExpressions.filter(item => item !== '');
            // Make copy of object and remove from index
            var negProductTargetingObj = campaign_template_data.filter((item) => item.entity.toLowerCase() === "negative product targeting");
            campaign_template_data.splice(negProductTargetingObjIndex, 1);
            const results = arrayExpressions.map(data => {
                return {
                    ...negProductTargetingObj[0],
                    product_targeting_expression: 'asin=' + data,
                };
            });
            campaign_template_data.splice(campaign_template_data.length, 0, ...results);
        }
    }

    console.log('object5')
    // Replace keyword_targeting keyword data
    if (campaign_data.keyword_targeting_data && campaign_data.keyword_targeting_data.length > 0) {
        var keywordTargetingObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "keyword");
        if (keywordTargetingObjIndex !== -1) {
            // Make copy of object and remove from index
            var keywordTargetingObj = campaign_template_data.filter((item) => item.entity.toLowerCase() === "keyword");
            campaign_template_data.splice(keywordTargetingObjIndex, 1);
            const results = campaign_data.keyword_targeting_data.map(data => {
                return {
                    ...keywordTargetingObj[0],
                    keyword_text: data.keyword_text,
                    match_type: data.match_type,
                    bid: data.bid
                };
            });
            campaign_template_data.splice(campaign_template_data.length, 0, ...results);
        }
    }

    console.log('object6')
    // Update start date format to yyyyMMdd eg. date April 1, 2024 would be 20240401. 
    const campaignObj = campaign_template_data.find(obj => obj.entity === "Campaign");
    if (campaignObj) {
        campaignObj.start_date = formatDateToYYYYMMDD(campaignObj.start_date as string);
    }

    // Replace campaign id and ad-group id for now temp
    var campaignIdTemp: string = `SP | ${campaign_data.targeting_type} - (${new Date().getFullYear()} - ${MONTH_NAMES[new Date().getMonth()]}) - %campaignNumber%`;


    // const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['campaign_id', 'ad_group_id']);

    for (let i = 0; i < numberOfCampaigns; i++) {
        console.log('Campaign number : ', i)
        var campaignId = campaignIdTemp.replace('%campaignNumber%', (i + 1).toString());;
        var adGroupId = campaignId;

        var entityArr: string[] = ["Ad Group", "Product Ad", "Negative keyword", "Negative product targeting", "Keyword"]
        // Copy base template and replace campaign id and ad group id
        let campaign = campaign_template_data.map(item => ({
            ...item,
            campaign_id: campaignId,
            ad_group_id: entityArr.includes(item.entity) ? adGroupId : item.ad_group_id
            // ad_group_id: item.entity === "Ad Group" || item.entity === "Product Ad" || item.entity === "Negative keyword" || item.entity === "Negative product targeting" ? adGroupId : item.ad_group_id
        }));

        // Find the index of the "Product Ad" row
        const productAdIndex = campaign.findIndex(item => item.entity === "Product Ad");
        // Remove the "Product Ad (Required)" row from the template
        campaign.splice(productAdIndex, 1);
        // Insert the appropriate "Product Ad" rows at the found index
        for (let j = 0; j < campaign_data.campaign_products_count; j++) {
            const productIndex = i * campaign_data.campaign_products_count + j;
            if (productIndex < products.length) {
                const productAd = {
                    ...campaign_template_data.find(item => item.entity === "Product Ad"),
                    campaign_id: campaignId,
                    ad_group_id: adGroupId,
                    sku: products[productIndex]
                };
                campaign.splice(productAdIndex + j, 0, productAd);
            }
        }
        campaigns.push(campaign);
    }
    return campaigns.flat();
}

function refactoredUpdateCampaignData(campaign_template_data, campaign_data) {
    // Refactored code goes here
    const findEntity = (entityName) => {
        const index = campaign_template_data.findIndex(item => item.entity.toLowerCase() === entityName.toLowerCase());
        return index !== -1 ? { index, obj: campaign_template_data[index] } : null;
    };

    const replaceData = (entityName, dataArray, mappingFn) => {
        const entity = findEntity(entityName);
        if (entity) {
            campaign_template_data.splice(entity.index, 1);
            const results = dataArray.map(mappingFn.bind(null, entity.obj));
            const insertIndex = campaign_template_data.findIndex(item => item.entity === 'Campaign');
            campaign_template_data.splice(insertIndex + 1, 0, ...results);
        }
    };

    if (campaign_data.bidding_data && campaign_data.bidding_data.length > 0) {
        replaceData("bidding adjustment", campaign_data.bidding_data, (entityObj, data) => ({
            ...entityObj,
            placement: data.placement,
            percentage: data.percentage
        }));
    }

    if (campaign_data.neg_keyword_data && campaign_data.neg_keyword_data.length > 0) {
        replaceData("negative keyword", campaign_data.neg_keyword_data, (entityObj, data) => ({
            ...entityObj,
            keyword_text: data.keyword_text,
            match_type: data.match_type
        }));
    }

    if (campaign_data.campaign_neg_keyword_data && campaign_data.campaign_neg_keyword_data.length > 0) {
        replaceData("campaign negative keyword", campaign_data.campaign_neg_keyword_data, (entityObj, data) => ({
            ...entityObj,
            keyword_text: data.keyword_text,
            match_type: data.match_type
        }));
    }

    if (campaign_data.product_targeting_expression && campaign_data.product_targeting_expression.length > 0) {
        let arrayExpressions = campaign_data.product_targeting_expression.split(",").filter(item => item !== '');
        if (arrayExpressions.length > 0) {
            replaceData("negative product targeting", arrayExpressions, (entityObj, data) => ({
                ...entityObj,
                product_targeting_expression: 'asin=' + data,
            }));
        }
    }
}