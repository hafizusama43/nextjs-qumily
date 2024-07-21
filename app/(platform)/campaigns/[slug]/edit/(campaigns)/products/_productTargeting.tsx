import { Button } from '@/components/ui/button'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import React from 'react'

const ProductTargeting = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, biddingData, setSkus, skus, setCampaignProductCount, campaignProductsCount } = useCampaignsStore()
    return (
        <div>
            ProductTargeting

            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                <Button disabled={currentStep >= 6} onClick={() => { setNextStep(); }}>{currentStep < 6 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </div>
    )
}

export default ProductTargeting
