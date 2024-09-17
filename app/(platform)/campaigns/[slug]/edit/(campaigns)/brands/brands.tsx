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
import React, { useCallback, useEffect, useState } from 'react'
import Campaign from './_campaign';
import NegKeyword from './_negKeyword';
import NegProductTargeting from './_negProductTargeting';
import KeywordTargeting from './_keywordTargeting';
import ProductTargeting from './_productTargeting';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

export const initialState = {
  product: '',
  entity: '',
  operation: '',
  campaign_id: '',
  draft_campaign_id: '',
  portfolio_id: '',
  campaign_name: '',
  start_date: '',
  end_date: '',
  state: '',
  budget_type: '',
  budget: 0,
  bid_optimization: '',
  bid_multiplier: 0,
  bid: '',
  keyword_text: '',
  match_type: '',
  product_targeting_expression: '',
  ad_format: '',
  landing_page_url: '',
  landing_page_asins: '',
  brand_entity_id: '',
  brand_name: '',
  brand_logo_asset_id: '',
  brand_logo_url: '',
  creative_headline: '',
  creative_asins: '',
  video_media_ids: '',
  creative_type: ''
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
    setCampaignData,
    setNegKeywordData,
    setTargetingStrategy,
    setKeywordTargetingData,
    setProductTargetingData,
    setProductTargetingType
  } = useCampaignsStore()

  useEffect(() => {
    setSteps(GET_SB_STEPS(targetingStrategy));
  }, [targetingStrategy])


  const getCampaignData = useCallback(async () => {
    try {
      console.log('Setting api response data in store.')
      setPending(true)
      const res = await axios.get(`/api/campaigns/campaign-data?slug=${params.slug}`);
      if (res.data.success) {

        const { campaign_template_data, campaign_data } = res.data.data
        campaign_template_data && setCampaignData(campaign_template_data);
        campaign_data.neg_keyword_data && setNegKeywordData(campaign_data.neg_keyword_data);
        campaign_data.targeting_strategy && setTargetingStrategy(campaign_data.targeting_strategy);
        campaign_data.keyword_targeting_data && setKeywordTargetingData(campaign_data.keyword_targeting_data);
        campaign_data.product_targeting_data && setProductTargetingData(campaign_data.product_targeting_data);
        campaign_data.product_targeting_type && setProductTargetingType(campaign_data.product_targeting_type);
      }
      setPending(false)
    } catch (error) {
      setPending(false)
      toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
    }
  }, [params.slug, setCampaignData, setKeywordTargetingData, setNegKeywordData, setProductTargetingData, setProductTargetingType, setTargetingStrategy])

  useEffect(() => {
    // Get campaign template and campaign data
    getCampaignData()
  }, [getCampaignData])

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
          {process.env.NEXT_PUBLIC_ENV === 'development' && <span className='text-red-400'>[Current Step : {currentStep}, Targeting Strategy : {targetingStrategy}]</span>}
          <Separator className='mt-3 mb-3'></Separator>
          <StepRenderer currentStep={currentStep} steps={STEPS} />
        </div>
      }
    </React.Fragment>
  )
}

// Component mapping
const COMPONENT_MAP = {
  "Campaign (Required)": Campaign,
  "Negative keyword (Optional)": NegKeyword,
  "Negative product targeting (Optional)": NegProductTargeting,
  "Keyword (Required)": KeywordTargeting,
  "Product targeting (Required)": ProductTargeting
};

const StepRenderer = ({ currentStep, steps }) => {
  const stepName: string = steps[currentStep];
  const StepComponent = COMPONENT_MAP[stepName];
  return StepComponent ? <StepComponent steps={steps} /> : null;
};

export default Brands