import { Button } from '@/components/ui/button'
import React from 'react'
import { CalendarIcon, CircleArrowLeft, CircleArrowRight } from 'lucide-react'

const Step3 = ({ step, STEPS, handlePrevStep, handleNextStep }) => {
    const onSubmit = () => {
        handleNextStep({}, 'Bidding Adjustment')
    }
    return (
        <form onSubmit={(onSubmit)}>
            <div className='flex justify-end gap-4 mt-10'>
                <Button type="button" disabled={step < 2} onClick={handlePrevStep}><CircleArrowLeft /> &nbsp; {step > 1 && STEPS[step - 1]}</Button>
                <Button disabled={step >= 5}>{step < 5 && STEPS[step + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </form>
    )
}

export default Step3