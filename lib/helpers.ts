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

export const BIDDING_STRATEGY = {
    "Fixed bid": "Fixed bid",
    "Dynamic bids - down only": "Dynamic bids - down only",
    "Dynamic bids - up and down": " Dynamic bids - up and down"
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

export const STEPS = {
    1: "Campaign",
    2: "Bidding Adjustment",
    3: "Ad Group",
    4: "Product Ad",
    5: "Keywords",
}

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