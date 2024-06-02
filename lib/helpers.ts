export const TEMPLATE_CATEGORY = {
    "sponsored_products_campaigns": "Sponsored Products Campaigns",
    "sponsored_display_campaigns": "Sponsored Display Campaigns",
    "sponsored_brands_campaigns": "Sponsored Brands Campaigns",
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


// Helper function to capitalize the first letter of the string
export const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};