import { Button } from '@/components/ui/button'
import React from 'react'
import { CalendarIcon, CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { STEPS } from '@/lib/helpers'

const Step4 = () => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep } = useCampaignsStore()
    const onSubmit = () => {
        // handleNextStep({}, 'product-ad')
    }

    const handleNextStepClick = () => {
        setNextStep();
    }

    return (
        <form onSubmit={(onSubmit)}>
            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && STEPS[currentStep - 1]}</Button>
                <Button onClick={handleNextStepClick} disabled={currentStep >= 5}>{currentStep < 5 && STEPS[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </form>
    )
}

export default Step4