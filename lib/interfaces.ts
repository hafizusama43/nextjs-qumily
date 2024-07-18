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

export interface ProductTargetingExpressionData {
    state: string;
    bid: number;
    product_targeting_expression: string
}