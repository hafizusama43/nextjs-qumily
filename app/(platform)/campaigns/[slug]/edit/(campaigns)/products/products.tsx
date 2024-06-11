"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import React, { useCallback, useEffect, useState } from 'react'
import Step1 from './_step1'
import Step2 from './_step2'
import Step3 from './_step3'
import Step4 from './_step4'
import Step5 from './_step5'

const STEPS = {
    1: "Campaign",
    2: "Bidding Adjustment",
    3: "Ad Group",
    4: "Product Ad",
    5: "Keywords",
}
const Products = () => {
    const [step, setStep] = useState(1)

    const handleNextStep = useCallback((data, currStepName) => {
        if (step < 5) {
            console.log(currStepName)
            console.log(data)
            setStep(step + 1)
        }
    }, [step])

    const handlePrevStep = useCallback(() => {
        if (step > 1) {
            setStep(step - 1)
        }
    }, [step])
    return (
        <div className='border border-gray-300 p-5 rounded-lg'>
            <strong><h5>{STEPS[step]}</h5></strong>
            <Separator className='mt-3 mb-3'></Separator>
            {step === 1 && <Step1 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step1>}
            {step === 2 && <Step2 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step2>}
            {step === 3 && <Step3 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step3>}
            {step === 4 && <Step4 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step4>}
            {step === 5 && <Step5 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step5>}
        </div>
    )
}

export default Products