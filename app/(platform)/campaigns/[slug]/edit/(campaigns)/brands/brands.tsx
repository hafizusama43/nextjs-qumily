"use client"
import TemplateHeader from '@/components/ui/_header'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/Skeleton';
import { useCampaignsStore } from '@/hooks/useSponsoredBrandsStore';
import { capitalizeFirstLetter, GET_SB_STEPS } from '@/lib/helpers';
import { Separator } from '@radix-ui/react-separator';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const initialState = {
  product: '',                            // Product
  entity: '',                             // Entity
  operation: '',                          // Operation
  campaign_id: '',                        // Campaign Id
  ad_group_id: '',                        // Draft Campaign Id (assuming it's for ad group)
  portfolio_id: '',                       // Portfolio Id
  campaign_name: '',                      // Campaign Name
  start_date: '',                         // Start Date
  end_date: '',                           // End Date
  state: '',                              // State
  daily_budget: 0,                        // Budget
  ad_group_default_bid: 0,                // Bid (default for ad group)
  bid: '',                                // Bid (custom bid)
  keyword_text: '',                       // Keyword Text
  match_type: '',                         // Match Type
  product_targeting_expression: '',       // Product Targeting Expression
  bidding_strategy: '',                   // Bid Optimization
  percentage: '',                         // Bid Multiplier (percentage)
  targeting_type: '',                     // Ad Format
  landing_page_url: '',                   // Landing Page URL
  landing_page_asins: [],                 // Landing Page asins (assuming array)
  brand_entity_id: '',                    // Brand Entity Id
  brand_name: '',                         // Brand Name
  brand_logo_asset_id: '',                // Brand Logo Asset Id
  brand_logo_url: '',                     // Brand Logo URL
  creative_headline: '',                  // Creative Headline
  creative_asins: [],                     // Creative asins (assuming array)
  video_media_ids: [],                    // Video Media Ids (assuming array)
  creative_type: ''                       // Creative Type
};


/*
 For bulk sponsored brands campaigns
 Refer to amazon sponsored adds documentation here : https://advertising.amazon.com/API/docs/en-us/bulksheets/2-0/create-sb-campaign
 Author : Usama Abdur Rehman <hafizusama43@gmail.com>
*/

const Brands = () => {
  const params = useParams<{ slug: string }>();
  const [STEPS, setSteps] = useState({})
  const [pending, setPending] = useState(false);
  const {
    currentStep,
    targetingStrategy,
    // setCampaignData,
    // setTargetingType,
    // setBiddingData,
    // setSkus,
    // setNegKeywordData,
    // setCampaignNegKeywordData,
    // setProductTargetingExpression,
    // setCampaignProductCount,
    // setTargetingStrategy,
    // setKeywordTargetingData,
    // setProductTargetingData,
    // setProductTargetingType
  } = useCampaignsStore()

  useEffect(() => {
    setSteps(GET_SB_STEPS(targetingStrategy));
  }, [targetingStrategy])

  return (
    <React.Fragment>
      <TemplateHeader>
        <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; campaign</Label>
        <div className='flex gap-2'>
          <Link href="/campaigns">
            <Button>Campaigns</Button>
          </Link>
        </div>
      </TemplateHeader>
      {pending ?
        <Skeleton className="h-[400px] w-[100%] rounded-xl" /> :
        <div className='border border-gray-300 p-5 rounded-lg'>
          <strong><h5>{STEPS[currentStep]}</h5></strong>
          {/* {process.env.NEXT_PUBLIC_ENV === 'development' && <span className='text-red-400'>[Current Step : {currentStep}, Targeting Type : {targetingType} {targetingType == "Manual" && ",Targeting Strategy : " + targetingStrategy}]</span>} */}
          <Separator className='mt-3 mb-3'></Separator>
          {/* <StepRenderer targetingType={targetingType} currentStep={currentStep} steps={STEPS} /> */}
        </div>
      }
    </React.Fragment>
  )
}

export default Brands