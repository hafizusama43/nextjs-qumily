"use client"
import React from 'react'
import Brands from './(campaigns)/brands/brands';
import Display from './(campaigns)/display/display';
import Products from './(campaigns)/products/products';
import { useSearchParams } from 'next/navigation'

const EditCampaign = () => {
    const searchParams = useSearchParams()
    const category = searchParams.get('category')

    return (
        <div className='mb-20'>
            {/* Need to mount the form according to campaign category */}
            {category && category === "sponsored-products-campaigns" && <Products></Products>}
            {category && category === "sponsored-display-campaigns" && <Display></Display>}
            {category && category === "sponsored-brands-campaigns" && <Brands></Brands>}
        </div>
    )
}

export default EditCampaign