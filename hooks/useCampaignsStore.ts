import { BiddingData, CampaignNegKeywordData, NegKeywordData, ProductTargetingExpressionData, SponsoredProductsInterface } from '@/lib/interfaces';
import { create } from 'zustand'

interface useCampaignsStoreProps {
    campaignData: SponsoredProductsInterface[];
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
    setCampaignData: (data: SponsoredProductsInterface[]) => void;
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
    setCampaignData: (data: SponsoredProductsInterface[]) => set(() => {
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