import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface InitialState {
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

interface BiddingData {
    placement: string;
    percentage: number;
    id: string
}

interface CampaignNegKeywordData {
    match_type: string;
    keyword_text: string;
    id: string
}

interface ProductTargetingExpressionData {
    state: string;
    bid: number;
    product_targeting_expression: string
}

interface useCampaignsStoreProps {
    campaignData: InitialState[];
    skus: string;
    currentStep: number;
    biddingData: BiddingData[];
    campaignNegKeywordData: CampaignNegKeywordData[];
    targetingType: string;
    productTargetingExpressionData: ProductTargetingExpressionData[],
    setCampaignData: (data: InitialState[]) => void;
    setCampaignNegKeywordData: (data: CampaignNegKeywordData[]) => void;
    setNextStep: (step?: number) => void;
    setPrevStep: (step?: number) => void;
    setBiddingData: (data: BiddingData[]) => void;
    setSkus: (data: string) => void;
    setTargetingType: (data: string) => void;
}
export const useCampaignsStore = create<useCampaignsStoreProps>(((set) => ({
    campaignData: [],
    biddingData: [],
    campaignNegKeywordData: [],
    currentStep: 1,
    skus: '',
    targetingType: '',
    productTargetingExpressionData: [],
    setCampaignData: (data: InitialState[]) => set(() => {
        return { campaignData: data }
    }),
    setCampaignNegKeywordData: (data: CampaignNegKeywordData[]) => set(() => {
        return { campaignNegKeywordData: data }
    }),
    setBiddingData: (data: BiddingData[]) => set(() => {
        return { biddingData: data }
    }),
    setProductTargetingExpressionData: (data: ProductTargetingExpressionData[]) => set(() => {
        return { productTargetingExpressionData: data }
    }),
    setSkus: (data: string) => set(() => {
        return { skus: data }
    }),
    setTargetingType: (data: string) => set(() => {
        return { targetingType: data }
    }),
    setNextStep: (step: number) => set((state) => ({ currentStep: state.currentStep + 1 })),
    setPrevStep: (step: number) => set((state) => {
        return { currentStep: state.currentStep - 1 }
    })
})))