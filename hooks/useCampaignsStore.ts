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

interface useCampaignsStoreProps {
    campaignData: InitialState[];
    setCampaignData: (data: InitialState[]) => void,
    currentStep: number;
    biddingData: BiddingData[];
    setNextStep: (step?: number) => void;
    setPrevStep: (step?: number) => void;
    setBiddingData: (data: BiddingData[]) => void;
}
export const useCampaignsStore = create<useCampaignsStoreProps>(((set) => ({
    campaignData: [],
    biddingData: [],
    currentStep: 1,
    setCampaignData: (data: InitialState[]) => set(() => {
        return { campaignData: data }
    }),
    setBiddingData: (data: BiddingData[]) => set(() => {
        return { biddingData: data }
    }),
    setNextStep: (step: number) => set((state) => ({ currentStep: state.currentStep + 1 })),
    setPrevStep: (step: number) => set((state) => {
        return { currentStep: state.currentStep - 1 }
    })
})))