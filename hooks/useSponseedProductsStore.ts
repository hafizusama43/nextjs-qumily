import { BiddingData, CampaignNegKeywordData, KeywordTargetingData, NegKeywordData, ProductTargetingData, ProductTargetingExpressionData, SponsoredProductsInterface } from '@/lib/interfaces';
import { create } from 'zustand'

interface useCampaignsStoreProps {
    campaignData: SponsoredProductsInterface[];
    skus: string;
    currentStep: number;
    biddingData: BiddingData[];
    campaignNegKeywordData: CampaignNegKeywordData[];
    targetingType: string;
    targetingStrategy: string;
    productTargetingExpressionData: ProductTargetingExpressionData[];
    negKeywordData: NegKeywordData[];
    keywordTargetingData: KeywordTargetingData[];
    productTargetingData: ProductTargetingData[];
    productTargetingExpression: string;
    campaignProductsCount: number;
    pendingSave: boolean;
    setCampaignData: (data: SponsoredProductsInterface[]) => void;
    setCampaignNegKeywordData: (data: CampaignNegKeywordData[]) => void;
    setNegKeywordData: (data: NegKeywordData[]) => void;
    setKeywordTargetingData: (data: KeywordTargetingData[]) => void;
    setProductTargetingData: (data: ProductTargetingData[]) => void;
    setNextStep: (step?: number) => void;
    setPrevStep: (step?: number) => void;
    setBiddingData: (data: BiddingData[]) => void;
    setSkus: (data: string) => void;
    setProductTargetingExpression: (data: string) => void;
    setTargetingType: (data: string) => void;
    setTargetingStrategy: (data: string) => void;
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
    keywordTargetingData: [],
    productTargetingData: [],
    currentStep: 1,
    skus: '',
    targetingType: '',
    targetingStrategy: "",
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
    setKeywordTargetingData: (data: KeywordTargetingData[]) => set(() => {
        return { keywordTargetingData: data }
    }),
    setProductTargetingData: (data: ProductTargetingData[]) => set(() => {
        return { productTargetingData: data }
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
    setTargetingStrategy: (data: string) => set(() => {
        return { targetingStrategy: data }
    }),
    setNextStep: (step: number) => set((state) => {
        return { currentStep: state.currentStep + 1 }
    }),
    setPrevStep: (step: number) => set((state) => {
        return { currentStep: state.currentStep - 1 }
    })
})))