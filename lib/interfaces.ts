export interface SponsoredProductsInterface {
    product: string;
    entity: string;
    operation: string;
    campaign_id: string;
    ad_group_id: string;
    portfolio_id: string;
    ad_id: string;
    keyword_id: string;
    product_targeting_id: string;
    campaign_name: string;
    ad_group_name: string;
    start_date: string | Date;
    end_date: string | Date | null;
    targeting_type: string;
    state: string;
    daily_budget: number;
    sku: string;
    ad_group_default_bid: number;
    bid: string;
    keyword_text: string;
    match_type: string;
    bidding_strategy: string;
    placement: string;
    percentage: string;
    product_targeting_expression: string;
}

export interface SponsoredBrandsInterface {
    product: string;
    entity: string;
    operation: string;
    campaign_id: string;
    draft_campaign_id: string;
    portfolio_id: string;
    campaign_name: string;
    start_date: string | Date;
    end_date: string | Date | null;
    state: string;
    budget_type: string;
    budget: number;
    bid_optimization: string;
    bid_multiplier: number;
    bid: string;
    keyword_text: string;
    match_type: string;
    product_targeting_expression: string;
    ad_format: string;
    landing_page_url: string;
    landing_page_asins: string;
    brand_entity_id: string;
    brand_name: string;
    brand_logo_asset_id: string;
    brand_logo_url: string;
    creative_headline: string;
    creative_asins: string;
    video_media_ids: string;
    creative_type: string;
}


export interface BiddingData {
    placement: string;
    percentage: number;
    id: string
}

export interface CampaignNegKeywordData {
    match_type: string;
    keyword_text: string;
    id: string
}

export interface NegKeywordData {
    match_type: string;
    keyword_text: string;
    id: string
}

export interface KeywordTargetingData {
    match_type: string;
    keyword_text: string;
    bid: number;
    id: string
}

export interface ProductTargetingData {
    // match_type: string;÷
    product_targeting_expression: string;
    bid: number;
    id: string
}

export interface ProductTargetingDataAuto {
    state?: string | any;
    product_targeting_expression?: 'close-match' | 'loose-match' | 'substitutes' | 'complements';
    bid?: number;
}

export interface ProductTargetingExpressionData {
    state: string;
    bid: number;
    product_targeting_expression: string
}

export interface CreatedCampaignType {
    campaign_id: number;
    campaign_name: string;
    slug: string;
    campaign_category: string;
    created_by: string;
    created_at: string;
}

export interface CampaignData {
    [key: string]: any; // Adjust this based on the actual structure of your campaign_data table
}