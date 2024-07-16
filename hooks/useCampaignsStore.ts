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

interface NegKeywordData {
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
    productTargetingExpressionData: ProductTargetingExpressionData[];
    negKeywordData: NegKeywordData[];
    productTargetingExpression: string;
    campaignProductsCount: number;
    pendingSave: boolean;
    setCampaignData: (data: InitialState[]) => void;
    setCampaignNegKeywordData: (data: CampaignNegKeywordData[]) => void;
    setNegKeywordData: (data: NegKeywordData[]) => void;
    setNextStep: (step?: number) => void;
    setPrevStep: (step?: number) => void;
    setBiddingData: (data: BiddingData[]) => void;
    setSkus: (data: string) => void;
    setProductTargetingExpression: (data: string) => void;
    setTargetingType: (data: string) => void;
    setPendingSave: (data: boolean) => void;
    setCampaignProductCount: (data: number) => void;
}
export const useCampaignsStore = create<useCampaignsStoreProps>(((set) => ({
    pendingSave: false,
    campaignProductsCount: 0,
    campaignData: [],
    biddingData: [],
    campaignNegKeywordData: [],
    negKeywordData: [],
    currentStep: 1,
    skus: '',
    targetingType: '',
    productTargetingExpressionData: [],
    productTargetingExpression: '',
    setPendingSave: (data: boolean) => set(() => {
        return { pendingSave: data }
    }),
    setCampaignProductCount: (data: number) => set(() => {
        return { campaignProductsCount: data }
    }),
    setCampaignData: (data: InitialState[]) => set(() => {
        return { campaignData: data }
    }),
    setCampaignNegKeywordData: (data: CampaignNegKeywordData[]) => set(() => {
        return { campaignNegKeywordData: data }
    }),
    setNegKeywordData: (data: NegKeywordData[]) => set(() => {
        return { negKeywordData: data }
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
    setProductTargetingExpression: (data: string) => set(() => {
        return { productTargetingExpression: data }
    }),
    setTargetingType: (data: string) => set(() => {
        return { targetingType: data }
    }),
    setNextStep: (step: number) => set((state) => {
        return { currentStep: state.currentStep + 1 }
    }),
    setPrevStep: (step: number) => set((state) => {
        return { currentStep: state.currentStep - 1 }
    })
})))