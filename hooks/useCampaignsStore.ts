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
    start_date: string;
    end_date: string;
    targeting_type: string;
    state: string;
    daily_budget: number;
    sku: string;
    ad_group_default_bid: string;
    bid: string;
    keyword_text: string;
    match_type: string;
    bidding_strategy: string;
    placement: any[];
    percentage: any[];
    product_targeting_expression: string;
}

interface useCampaignsStoreProps {
    campaignData: InitialState[];
    setCampaignData: (data: InitialState[]) => void,
    currentStep: number,
    setNextStep: (step?: number) => void
    setPrevStep: (step?: number) => void
}
export const useCampaignsStore = create<useCampaignsStoreProps>(((set) => ({
    campaignData: [],
    currentStep: 1,
    setCampaignData: (data: InitialState[]) => set(() => {
        console.log('first')
        return { campaignData: data }
    }),
    setNextStep: (step: number) => set((state) => ({ currentStep: state.currentStep + 1 })),
    setPrevStep: (step: number) => set((state) => {
        console.log('Setting prev step')
        return { currentStep: state.currentStep - 1 }
    })
})))