"use client"
import { Button } from '@/components/ui/button'
import React, { useCallback, useEffect, useState } from 'react'

const STEPS = {
    1: "Campaign",
    2: "Bidding Adjustment",
    3: "Ad Group",
    4: "Product Ad",
    5: "Keywords",
}
const Products = () => {
    const [step, setStep] = useState(1)

    const handleNextStep = useCallback(() => {
        if (step < 5) {
            setStep(step + 1)
        }
    }, [step])

    const handlePrevStep = useCallback(() => {
        if (step > 1) {
            setStep(step - 1)
        }
    }, [step])
    return (
        <React.Fragment>
            {step}
            <div className='flex'>
                <Button disabled={step < 2} onClick={handlePrevStep}>Previous {step > 1 && "=> " + STEPS[step - 1]}</Button>
                <Button disabled={step >= 5} onClick={handleNextStep}>Next {step < 5 && "=> " + STEPS[step + 1]}</Button>
            </div>
        </React.Fragment>
    )
}

export default Products