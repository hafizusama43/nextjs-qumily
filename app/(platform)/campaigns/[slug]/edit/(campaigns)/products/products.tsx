"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import React, { useCallback, useEffect, useState } from 'react'
import Step1 from './_step1'

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
            <strong><h5>{STEPS[step]}</h5></strong>
            <Separator className='mt-3 mb-3'></Separator>
            {step === 1 && <Step1 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step1>}
            {/* <div className='flex justify-end gap-4 mt-10'>
                <Button disabled={step < 2} onClick={handlePrevStep}>Previous {step > 1 && "=> " + STEPS[step - 1]}</Button>
                <Button disabled={step >= 5} onClick={handleNextStep}>Next {step < 5 && "=> " + STEPS[step + 1]}</Button>
            </div> */}
        </React.Fragment>
    )
}

export default Products