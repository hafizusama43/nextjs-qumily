"use client"

import React, { useEffect } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useSearchParams } from 'next/navigation';

const TemplatesBreadcrumb = () => {
    const path = usePathname();
    const urlParams = useSearchParams();


    useEffect(() => {
        const arr = path.split("/");
    }, [path]);

    const generateBreadcrumbs = () => {
        console.log(path)
        const category = urlParams.get('category')
        const pathArray = path.split('/').filter(item => item);
        return pathArray.map((item, index) => {
            var href = '';
            href = '/' + pathArray.slice(0, index + 1).join('/');
            if (index > 0 && category) {
                href += '?category=' + category
            }
            return (
                <React.Fragment key={href}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={href}>{item.charAt(0).toUpperCase() + item.slice(1)}</BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < pathArray.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
            );
        });
    };

    return (
        <Breadcrumb className="my-5">
            <BreadcrumbList key={'breadcrum-list'}>
                <BreadcrumbItem key="home">
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {path !== '/' && <BreadcrumbSeparator key="home-separator" />}
                {generateBreadcrumbs()}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default TemplatesBreadcrumb;
