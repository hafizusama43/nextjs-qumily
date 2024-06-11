import { Button } from '@/components/ui/button'
import React from 'react'

const Step5 = ({ step, STEPS, handlePrevStep, handleNextStep }) => {
    const onSubmit = () => {
        handleNextStep({}, 'Bidding Adjustment')
    }
    return (
        <form onSubmit={(onSubmit)}>
            <div className='flex justify-end gap-4 mt-10'>
                <Button type="button" disabled={step < 2} onClick={handlePrevStep}>Previous {step > 1 && "<= " + STEPS[step - 1]}</Button>
                <Button disabled={step >= 5}>Next {step < 5 && "=> " + STEPS[step + 1]}</Button>
            </div>
        </form>
    )
}

export default Step5