export const TEMPLATE_CATEGORY = {
    "sponsored-products-campaigns": "Sponsored Products Campaigns",
    "sponsored-display-campaigns": "Sponsored Display Campaigns",
    "sponsored-brands-campaigns": "Sponsored Brands Campaigns",
}

export const TARGETING_TYPE = {
    "Manual": "Manual",
    "Auto": "Auto",
}

export const CAMPAIGN_STATE = {
    "Enabled": "Enabled",
    "Disabled": "Disabled",
}

export const MATCH_TYPE = {
    "Negative exact": "Negative exact",
    "Negative phrase": "Negative phrase",
}

export const MATCH_TYPE_KEYWORD_TARGETING = {
    "exact": "Exact",
    "broad": "Broad",
    "phrase": "phrase",
}

export const BIDDING_STRATEGY = {
    "Fixed bid": "Fixed bid",
    "Dynamic bids - down only": "Dynamic bids - down only",
    "Dynamic bids - up and down": " Dynamic bids - up and down"
}

export const TARGETING_STRATEGY = {
    "keyword": "Keyword targeting",
    "product": "Product targeting",
}

export const PLACEMENT = {
    "Placement Product Page": "Placement Product Page",
    "Placement Top": "Placement Top",
}

export const SPONSORED_PRODUCTS_CAMPAIGNS = {
    product: 'Product',
    entity: 'Entity',
    operation: 'Operation',
    campaign_id: 'Campaign Id',
    ad_group_id: 'Ad Group Id',
    portfolio_id: 'Portfolio Id',
    ad_id: 'Ad Id',
    keyword_id: 'Keyword Id',
    product_targeting_id: 'Product Targeting Id',
    campaign_name: 'Campaign Name',
    ad_group_name: 'Ad Group Name',
    start_date: 'Start Date',
    end_date: 'End Date',
    targeting_type: 'Targeting Type',
    state: 'State',
    daily_budget: 'Daily Budget',
    sku: 'SKU',
    ad_group_default_bid: 'Ad Group Default Bid',
    bid: 'Bid',
    keyword_text: 'Keyword Text',
    match_type: 'Match Type',
    bidding_strategy: 'Bidding Strategy',
    placement: 'Placement',
    percentage: 'Percentage',
    product_targeting_expression: 'Product Targeting Expression'
};

const STEPS_DEFAULT = {
    1: "Campaign (Required)",
    2: "Bidding Adjustment (Required)",
    3: "Ad Group (Required)",
    4: "Product Ad (Required)",
    5: "Product Targeting (Required)",
};

const STEPS_CAMPAIGN_AUTO = {
    1: "Campaign (Required)",
    2: "Bidding Adjustment (Optional)",
    3: "Ad Group (Required)",
    4: "Product Ad (Required)",
    5: "Campaign negative keyword (Optional)",
    6: "Negative keyword (Optional)",
    7: "Negative product targeting (Optional)",
}

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


const STEPS_CAMPAIGN_MANUAL = {
    1: "Campaign (Required)",
    2: "Bidding Adjustment (Optional)",
    3: "Ad Group (Required)",
    4: "Product Ad (Required)",
    5: "Campaign negative keyword (Optional)",
}


// Function to get the appropriate steps object based on a condition
export const GET_STEPS = (condition: string, targeting: string) => {
    if (condition.toLocaleLowerCase() === 'auto') {
        return STEPS_CAMPAIGN_AUTO;
    } else if (condition.toLocaleLowerCase() === 'manual') {
        console.log(targeting)
        // Build the steps dynamically for manual campaigns
        var stepsManual = {}
        if (targeting === 'keyword') {
            stepsManual = {
                ...STEPS_CAMPAIGN_MANUAL,
                6: "Negative keyword (Optional)",
                7: "Keyword (Required)"
            };
        } else {
            stepsManual = {
                ...STEPS_CAMPAIGN_MANUAL,
                6: "Product targeting (Required)",
                7: "Negative product targeting (Optional)"
            };
        }
        return stepsManual;
    } else {
        return {}; // Default steps object if condition is neither 'auto' nor 'manual'
    }
};



// Helper function to capitalize the first letter of the string
export const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to fetch specific key values from an object
export const getSpecificKeyValues = (obj, keys) => {
    const result = {};
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};

export const getStepName = (str: string) => {
    var stepStr = str.replace(/\(.*?\)/g, '').trim();
    stepStr = stepStr.trim()
    return stepStr
}

export const formatDateToYYYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}