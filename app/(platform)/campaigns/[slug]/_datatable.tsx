"use client"
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils'
import { Spin } from '@/components/ui/spin'

const Datatable = ({ category, data, pending, campaignMapObj }) => {
  return (
    <Table className='border rounded custom-template-table'>
      <TableHeader>
        <TableRow>
          {campaignMapObj && Object.keys(campaignMapObj).map((item, index) => <TableHead key={index}>{campaignMapObj[item]}</TableHead>)}
          {/* {category === 'sponsored-brands-campaigns' && Object.keys(SPONSORED_BRANDS_CAMPAIGNS).map((item) => <TableHead key={item}>{SPONSORED_BRANDS_CAMPAIGNS[item]}</TableHead>)}
          {category === 'sponsored-display-campaigns' && Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).map((item) => <TableHead key={item}>{SPONSORED_PRODUCTS_CAMPAIGNS[item]}</TableHead>)} */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? <>{data.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {category === 'sponsored-products-campaigns' ?
                <TableRow key={index} className={cn('', item.entity === "Campaign" && 'bg-slate-200 dark:bg-blue-700')}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.entity}</TableCell>
                  <TableCell>{item.operation}</TableCell>
                  <TableCell>{item.campaign_id}</TableCell>
                  <TableCell>{item.ad_group_id}</TableCell>
                  <TableCell>{item.portfolio_id}</TableCell>
                  <TableCell>{item.ad_id}</TableCell>
                  <TableCell>{item.keyword_id}</TableCell>
                  <TableCell>{item.product_targeting_id}</TableCell>
                  <TableCell>{item.campaign_name}</TableCell>
                  <TableCell>{item.ad_group_name}</TableCell>
                  <TableCell>{item.start_date}</TableCell>
                  <TableCell>{item.end_date}</TableCell>
                  <TableCell>{item.targeting_type}</TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell>{item.daily_budget}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.ad_group_default_bid}</TableCell>
                  <TableCell>{item.bid}</TableCell>
                  <TableCell>{item.keyword_text}</TableCell>
                  <TableCell>{item.match_type}</TableCell>
                  <TableCell>{item.bidding_strategy}</TableCell>
                  <TableCell>{item.placement}</TableCell>
                  <TableCell>{item.percentage}</TableCell>
                  <TableCell>{item.product_targeting_expression}</TableCell>
                </TableRow>
                : <TableRow key={index} className={cn('', item.entity === "Campaign" && 'bg-slate-200 dark:bg-blue-700')}>
                  {Object.entries(item).map(([key, value]) => (
                    <TableCell key={key}>{String(value) as React.ReactNode}</TableCell>
                  ))}
                </TableRow>
              }
            </React.Fragment>
          )
        })}</> : <TableRow ><TableCell className="text-center" colSpan={Object.keys(campaignMapObj).length}>
          {pending ? <Spin className="m-auto" variant="light" size="default"></Spin> : 'No results.'}</TableCell></TableRow>}
      </TableBody>
    </Table>
  )
}

export default Datatable