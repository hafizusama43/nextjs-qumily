import { Button } from '@/components/ui/button';
import { useCampaignsStore } from '@/hooks/useSponseedProductsStore';
import { getStepName } from '@/lib/helpers';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import React from 'react'

const ProductTargetingAuto = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, negKeywordData, setNegKeywordData } = useCampaignsStore()
    // console.log(steps)

    const handleNextStepClick = () => {
        // Bidding adjustments is optional if not added any then skip 
        var entity: string = getStepName(steps[currentStep]);
        // if (negKeywordData.length > 0) {
        //     // Get existing campaign object to retain values in next object
        //     var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
        //     const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'ad_group_id', 'campaign_id', 'state']);
        //     var objExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());
        //     if (objExists.length > 0) {
        //         console.info(`Object "${entity}" found : Updating`)
        //         const updatedObj = {
        //             ...initialState,
        //             ...adGroupObjValues,
        //             'entity': entity,
        //             ['keyword_text']: '%keyword_text%',
        //             ['match_type']: '%match_type%',
        //         };
        //         const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
        //         setCampaignData(arr)
        //     } else {
        //         console.info(`Object "${entity}" not found : Creating`)
        //         const updatedObj = {
        //             ...initialState,
        //             ...adGroupObjValues,
        //             'entity': entity,
        //             ['keyword_text']: '%keyword_text%',
        //             ['match_type']: '%match_type%',
        //         };
        //         campaignData.push(updatedObj);
        //         setCampaignData(campaignData);
        //     }
        // } else {
        //     var entityObjIndex = campaignData.findIndex((item) => item.entity.toLowerCase() === entity.toLowerCase());
        //     if (entityObjIndex !== -1) {
        //         campaignData.splice(entityObjIndex, 1);
        //         setCampaignData(campaignData);
        //     }
        // }
        setNextStep();
    }

    return (
        <div>
            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                {/* <Button onClick={handleNextStepClick} type="button"><SaveIcon /> &nbsp; Save changes</Button> */}
                <Button onClick={handleNextStepClick} disabled={currentStep >= 7}>{currentStep < 7 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </div>
    )
}

export default ProductTargetingAuto
