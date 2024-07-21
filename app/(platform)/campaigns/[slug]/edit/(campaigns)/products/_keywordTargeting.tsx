import React from 'react'
import { Button } from '@/components/ui/button'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { CircleArrowLeft, CircleArrowRight, SaveIcon } from 'lucide-react'
import { Spin } from '@/components/ui/spin'

const KeywordTargeting = ({ steps }) => {
    const { pendingSave, campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, biddingData, setSkus, skus, setCampaignProductCount, campaignProductsCount } = useCampaignsStore()
    return (
        <div>
            KeywordTargeting

            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                <Button type="submit" disabled={pendingSave}>{pendingSave ? <Spin variant="light" size="sm"></Spin> : <SaveIcon />} &nbsp; Save changes</Button>
            </div>
        </div>
    )
}

export default KeywordTargeting
