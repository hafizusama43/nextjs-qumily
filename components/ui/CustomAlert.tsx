import React from 'react'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import DynamicLucideIcon from './DynamicLucideIcon';

const alertVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "",
                error: "border-red-600 dark:border-red-500",
                success: "border-green-600 dark:border-green-500",
                danger: "border-orange-400 dark:border-orange-400",
                info: "border-blue-600 dark:border-blue-500",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const alertTextVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "",
                error: "!text-red-600 dark:text-red-500",
                success: "!text-green-600 dark:text-green-500",
                danger: "!text-orange-400 dark:text-orange-400",
                info: "!text-blue-600 dark:text-blue-500",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

interface CustomAlertProps extends VariantProps<typeof alertVariants> {
    description?: string;
    title: string;
    iconName: any | string
}


const CustomAlert = ({ description = "", title, iconName, variant }: CustomAlertProps) => {
    const descriptionHtml = { __html: description };
    return (
        <React.Fragment>
            <Alert className={cn(alertVariants({ variant }), 'my-3')}>
                <DynamicLucideIcon className={cn('h-4 w-4', alertTextVariants({ variant }))} name={iconName}></DynamicLucideIcon>
                <AlertTitle className={cn(alertTextVariants({ variant }))}>{title}</AlertTitle>
                {description && <AlertDescription dangerouslySetInnerHTML={descriptionHtml}></AlertDescription>}
            </Alert>
        </React.Fragment>
    )
}

export default CustomAlert
