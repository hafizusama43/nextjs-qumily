import { formatDateToYYYYMMDD } from "@/lib/helpers";
import { CampaignData, CreatedCampaignType, SponsoredProductsInterface } from "@/lib/interfaces";
import queryDatabase from "@/lib/queryHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get("slug");
        const mode = request.nextUrl.searchParams.get("mode");
        if (!slug) {
            return NextResponse.json({ success: false, message: 'Invalid request params' }, { status: 500 });
        }

        const campaign = await getCampaign(slug);

        if (!campaign) {
            return NextResponse.json({ success: false, message: 'Invalid campaign id' }, { status: 500 });
        }
        const campaign_id = campaign.campaign_id;
        const campaign_category = campaign.campaign_category;

        var campaign_data = await getCampaignData(campaign_id);
        var campaignTemplateData = await getCampaignTemplate(campaign_id, campaign_category);

        if (mode && mode === 'view' && campaignTemplateData.length > 0) {
            console.log(campaign_category)
            // Benchmarking original implementation
            // console.time('Original Implementation');
            switch (campaign_category) {
                case 'sponsored-products-campaigns':
                    campaignTemplateData = createSponsoredCampaignData(campaignTemplateData, campaign_data);

                    break;
                // case 'sponsored-display-campaigns':
                //     addSponsoredProductsCampData(body, campaignData, campaign_id, campaign_category)
                //     break;
                // case 'sponsored-brands-campaigns':
                //     addSponsoredProductsCampData(body, campaignData, campaign_id, campaign_category)
                //     break;
                default:
                    break;
            }
            // console.timeEnd('Original Implementation');
        }
        var campaign_template_data = campaignTemplateData ? campaignTemplateData : []

        return NextResponse.json({ success: true, message: 'Templates fetched successfully.', data: { campaign_data, campaign_template_data } }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error:', error }, { status: 500 })
    }

}

export async function POST(request: NextRequest) {



    try {
        const body = await request.json();
        var { campaignData, slug } = body;


        const campaign = await getCampaign(slug);

        if (!campaign) {
            return NextResponse.json({ success: false, message: 'Invalid campaign id' }, { status: 500 });
        }
        const campaign_id = campaign.campaign_id;
        const campaign_category = campaign.campaign_category;

        deleteCampaignData(campaign_id);

        switch (campaign_category) {
            case 'sponsored-products-campaigns':
                addSponsoredProductsCampData(body, campaignData, campaign_id, campaign_category)
                break;
            case 'sponsored-display-campaigns':
                addSponsoredProductsCampData(body, campaignData, campaign_id, campaign_category)
                break;
            case 'sponsored-brands-campaigns':
                addSponsoredBrandsCampData(body, campaignData, campaign_id, campaign_category)
                break;

            default:
                break;
        }
        return NextResponse.json({ success: true, message: 'Campaign updated successfully.', data: [] }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Database Error: Failed to update campaign.' }, { status: 500 })
    }
}

// ---------------------------------------------------------- Local Functions ---------------------------------------------------------- //


/**
 * Fetches campaign template data by external campaign ID.
 * 
 * @param externalCampaignId - The external campaign ID.
 * @param campaign_category 
 * @returns The campaign template data if found, otherwise an empty array.
 */
async function getCampaignTemplate(external_campaign_id: number, campaign_category: string): Promise<any[]> {
    if (campaign_category !== 'sponsored-products-campaigns') {
        // Convert data to json data after verifying using zod schema for each campaign
        var query_str = 'SELECT * from  campaign_templates WHERE campaign_id = $1';
        const result_s = await queryDatabase(query_str, [external_campaign_id])
        return result_s.rows.length > 0 ? result_s.rows[0].json_data : []
    }
    const query = `
        SELECT
            product, entity, operation, campaign_id, ad_group_id, portfolio_id, ad_id, keyword_id, product_targeting_id, campaign_name, ad_group_name, start_date, end_date, targeting_type, state, daily_budget, sku, ad_group_default_bid, bid, keyword_text, match_type, bidding_strategy, placement, percentage, product_targeting_expression
        FROM campaign_templates_data
        WHERE campaign_templates_data.campaign_id_external = $1;
    `;
    const result = await queryDatabase(query, [external_campaign_id]);

    // Return the rows if found, otherwise return an empty array
    return result.rows.length > 0 ? result.rows : [];
}


/**
 * Fetches campaign data by campaign ID.
 * 
 * @param campaign_id - The ID of the campaign.
 * @returns Parsed campaign data if found, otherwise an empty object.
 */
async function getCampaignData(campaign_id: number): Promise<CampaignData> {
    const query = `
        SELECT
            campaign_data.*
        FROM campaign_data
        WHERE campaign_id = $1;
    `;
    const result = await queryDatabase(query, [campaign_id]);

    // Parse the campaign data if found, otherwise return an empty object
    return result.rows.length > 0 ? parseValues(result.rows) : {};
}

/**
 * Fetches a campaign by slug.
 * 
 * @param slug - The slug of the campaign.
 * @returns The campaign object if found, otherwise null.
 */
async function getCampaign(slug: string): Promise<CreatedCampaignType | null> {
    const query = `
        SELECT
            campaigns.*
        FROM campaigns
        WHERE campaigns.slug = $1
        LIMIT 1;
    `;
    const result = await queryDatabase(query, [slug]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * @param any data 
 * @author Abdur Rehman <hafizusama43@gmail.com>
 * 
 * @returns string
 */
function stringify(data: any): string {
    const isArray = Array.isArray(data);
    const dataText = isArray && data.length > 0 ? JSON.stringify(data) : data;
    return dataText ? dataText.toString() : ''
}

/**
 * @param data 
 * @param campaign_id 
 * @param campaign_category
 * @author Abdur Rehman <hafizusama43@gmail.com>
 * 
 * @returns void
 */
async function insertTemplateData(data: any, campaign_id: number, campaign_category: string) {
    if (campaign_category !== 'sponsored-products-campaigns') {
        // Convert data to json data after verifying using zod schema for each campaign
        var insert_str = 'INSERT INTO campaign_templates (campaign_id, json_data) VALUES ($1, $2)';
        await queryDatabase(insert_str, [campaign_id, JSON.stringify(data)])
        return
    }
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
    await queryDatabase(insert_str, [])
}

/**
 * This method returns query string with cols to insert in campaign_templates_data
 * @author Abdur Rehman <hafizusama43@gmail.com>
 * 
 * @returns string 
 */
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

/**
 * Returns the object for campaign_data in in key pair form.
 * 
 * @param data 
 * @author Abdur Rehman <hafizusama43@gmail.com>
 * 
 * @returns object 
 */
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

/**
 * @param array campaign_template_data
 * @param object campaign_data 
 * @author Abdur Rehman <hafizusama43@gmail.com>
 * 
 * @returns array - Created array of campaign data using provided params
 */
function createSponsoredCampaignData(campaign_template_data: SponsoredProductsInterface[], campaign_data: CampaignData) {
    // Split products into array
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

    // Replace neg_keyword_data
    if (campaign_data.neg_keyword_data && campaign_data.neg_keyword_data.length > 0) {
        var negKeywordObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "negative keyword");
        if (negKeywordObjIndex !== -1) {
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

    // Replace campaign_neg_keyword_data
    if (campaign_data.campaign_neg_keyword_data && campaign_data.campaign_neg_keyword_data.length > 0) {
        var campaignNegKeywordObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "campaign negative keyword");
        if (campaignNegKeywordObjIndex !== -1) {
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
                    product_targeting_expression: data,
                };
            });
            campaign_template_data.splice(campaign_template_data.length, 0, ...results);
        }
    }

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

    // Replace product_targeting_data_auto data
    if (campaign_data.product_targeting_data_auto && campaign_data.product_targeting_data_auto.length > 0 && campaign_data.targeting_type === 'Auto') {
        var productTargetingObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "product targeting");
        if (productTargetingObjIndex !== -1) {
            // Make copy of object and remove from index
            var productTargetingObj = campaign_template_data.filter((item) => item.entity.toLowerCase() === "product targeting");
            campaign_template_data.splice(productTargetingObjIndex, 1);
            const results = campaign_data.product_targeting_data_auto.map(data => {
                return {
                    ...productTargetingObj[0],
                    product_targeting_expression: data.product_targeting_expression,
                    bid: data.bid,
                    state: data.state,
                };
            });
            campaign_template_data.splice(campaign_template_data.length, 0, ...results);
        }
    }

    // Replace product_targeting_data data
    if (campaign_data.product_targeting_data && campaign_data.product_targeting_data.length > 0) {
        var productTargetingObjIndex = campaign_template_data.findIndex((item) => item.entity.toLowerCase() === "product targeting");
        if (productTargetingObjIndex !== -1) {
            // Make copy of object and remove from index
            var productTargetingObj = campaign_template_data.filter((item) => item.entity.toLowerCase() === "product targeting");
            campaign_template_data.splice(productTargetingObjIndex, 1);
            const results = campaign_data.product_targeting_data.map(data => {
                return {
                    ...productTargetingObj[0],
                    product_targeting_expression: data.product_targeting_expression,
                    bid: data.bid
                };
            });
            campaign_template_data.splice(campaign_template_data.length, 0, ...results);
        }
    }

    // Update start date format to yyyyMMdd eg. date April 1, 2024 would be 20240401. 
    const campaignObj = campaign_template_data.find(obj => obj.entity === "Campaign");
    if (campaignObj) {
        campaignObj.start_date = formatDateToYYYYMMDD(campaignObj.start_date as string);
    }

    var entityArr: string[] = ["Ad Group", "Product Ad", "Negative keyword", "Negative product targeting", "Keyword"]

    for (let i = 0; i < numberOfCampaigns; i++) {
        console.log('Campaign number : ', i)
        // Copy base template and replace campaign id and ad group id
        let campaign = campaign_template_data.map(item => ({
            ...item,
            campaign_id: item.campaign_id + " " + (i + 1),
            ad_group_id: entityArr.includes(item.entity) ? item.ad_group_id + " " + (i + 1) : item.ad_group_id
        }));

        // Find the index of the "Product Ad" row
        const productAdIndex = campaign.findIndex(item => item.entity === "Product Ad");
        // Remove the "Product Ad (Required)" row from the template
        campaign.splice(productAdIndex, 1);
        // Insert the appropriate "Product Ad" rows at the found index
        for (let j = 0; j < campaign_data.campaign_products_count; j++) {
            const productIndex = i * campaign_data.campaign_products_count + j;
            const prodObj = campaign_template_data.find(item => item.entity === "Product Ad")
            if (productIndex < products.length) {
                const productAd = {
                    ...prodObj,
                    campaign_id: prodObj.campaign_id + " " + (i + 1),
                    ad_group_id: prodObj.ad_group_id + " " + (i + 1),
                    sku: products[productIndex]
                };
                campaign.splice(productAdIndex + j, 0, productAd);
            }
        }
        campaigns.push(campaign);
    }
    return campaigns.flat();
}

/**
 * 
 * @param campaign_template_data 
 * @param campaign_template 
 * @param campaign_id 
 * @param campaign_category 
 */
async function addSponsoredProductsCampData(campaign_template_data: any, campaign_template: SponsoredProductsInterface[], campaign_id: number, campaign_category: string) {

    var {
        targetingType,
        biddingData,
        skus,
        negKeywordData,
        campaignNegKeywordData,
        productTargetingExpression,
        campaignProductsCount,
        targetingStrategy,
        keywordTargetingData,
        productTargetingData,
        productTargetingDataAuto,
        productTargetingType
    } = campaign_template_data;

    // Insert bidding_data
    await updateTemplateData(biddingData, 'bidding_data', campaign_id);

    // Insert targeting_type
    await updateTemplateData(targetingType, 'targeting_type', campaign_id);

    // Insert skus
    await updateTemplateData(skus, 'skus', campaign_id);

    // Insert neg_keyword_data
    await updateTemplateData(negKeywordData, 'neg_keyword_data', campaign_id);

    // Insert campaign_neg_keyword_data
    await updateTemplateData(campaignNegKeywordData, 'campaign_neg_keyword_data', campaign_id);

    // Insert product_targeting_expression
    await updateTemplateData(productTargetingExpression, 'product_targeting_expression', campaign_id);

    // Insert campaign_products_count
    await updateTemplateData(parseInt(campaignProductsCount), 'campaign_products_count', campaign_id);

    // Insert targeting_strategy
    await updateTemplateData(targetingStrategy, 'targeting_strategy', campaign_id);

    // Insert keyword_targeting_data
    await updateTemplateData(keywordTargetingData, 'keyword_targeting_data', campaign_id);

    // Insert product_targeting_data
    await updateTemplateData(productTargetingData, 'product_targeting_data', campaign_id);

    // Insert product_targeting_data_auto
    await updateTemplateData(productTargetingDataAuto, 'product_targeting_data_auto', campaign_id);

    // Insert product_targeting_type
    await updateTemplateData(productTargetingType, 'product_targeting_type', campaign_id);

    // Insert campaign-template-data
    if (targetingType === "Auto") {
        campaign_template = campaign_template.filter(item => item.entity !== "Keyword");
    } else {
        if (targetingStrategy === "keyword") {
            campaign_template = campaign_template.filter(item => item.entity !== "Product Targeting" && item.entity !== "Negative product targeting");
        } else {
            campaign_template = campaign_template.filter(item => item.entity !== "Keyword" && item.entity !== "Negative keyword");
        }
    }

    console.log(campaign_template)
    await insertTemplateData(campaign_template, campaign_id, campaign_category);
}

/**
 * 
 * @param campaign_template_data 
 * @param campaign_template 
 * @param campaign_id 
 * @param campaign_category 
 */
async function addSponsoredDisplayCampData(campaign_template_data: any, campaign_template: SponsoredProductsInterface[], campaign_id: number, campaign_category: string) {
}

/**
 * 
 * @param campaign_template_data 
 * @param campaign_template 
 * @param campaign_id 
 * @param campaign_category 
 */
async function addSponsoredBrandsCampData(campaign_template_data: any, campaign_template: SponsoredProductsInterface[], campaign_id: number, campaign_category: string) {
    var {
        negKeywordData,
        targetingStrategy,
        keywordTargetingData,
        productTargetingExpression,
        productTargetingType,
        productTargetingData
    } = campaign_template_data;

    // Insert neg_keyword_data
    await updateTemplateData(negKeywordData, 'neg_keyword_data', campaign_id);

    // Insert targeting_strategy
    await updateTemplateData(targetingStrategy, 'targeting_strategy', campaign_id);

    // Insert keyword_targeting_data
    await updateTemplateData(keywordTargetingData, 'keyword_targeting_data', campaign_id);

    // Insert product_targeting_expression
    await updateTemplateData(productTargetingExpression, 'product_targeting_expression', campaign_id);

    // Insert product_targeting_type
    await updateTemplateData(productTargetingType, 'product_targeting_type', campaign_id);

    // Insert product_targeting_data
    await updateTemplateData(productTargetingData, 'product_targeting_data', campaign_id);


    if (targetingStrategy === "keyword") {
        campaign_template = campaign_template.filter(item => item.entity !== "Product Targeting" && item.entity !== "Negative product targeting");
    } else {
        campaign_template = campaign_template.filter(item => item.entity !== "Keyword" && item.entity !== "Negative keyword");
    }

    console.log(campaign_template)
    console.log(campaign_category)
    await insertTemplateData(campaign_template, campaign_id, campaign_category);
}

/**
 * 
 * @param template_data 
 * @param key 
 * @param campaign_id 
 * @returns 
 */
async function updateTemplateData(template_data: any, key: string, campaign_id: number) {
    if (campaign_id < 1) {
        return
    }
    // Insert campaign_data against campaign
    var query = `INSERT INTO
        campaign_data
        (campaign_id, key, value)
        VALUES 
        ($1, $2, $3);`;

    if (typeof template_data === 'number') {
        template_data >= 0 && await queryDatabase(query, [campaign_id, key, template_data]);
    } else {
        template_data = stringify(template_data);
        template_data && await queryDatabase(query, [campaign_id, key, template_data]);
    }
}

/**
 * 
 * @param campaign_id 
 * @returns 
 */
async function deleteCampaignData(campaign_id: number) {
    if (campaign_id < 1) {
        return
    }
    // Delete campaign-data and campaign-template-data
    var query = `DELETE
    FROM campaign_data
    WHERE campaign_data.campaign_id = $1 ;`;
    await queryDatabase(query, [campaign_id]);

    var query = `DELETE
    FROM campaign_templates_data
    WHERE campaign_templates_data.campaign_id_external = $1 ;`;
    await queryDatabase(query, [campaign_id]);
}

// TODO check benchmark and implement if better in performance
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