import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinVariants = cva(
    "flex items-center justify-center animate-spin rounded-full",
    {
        variants: {
            variant: {
                default: "border-gray-300 border-t-blue-400",
                primary: "border-primary border-t-primary-foreground",
                light: "border-white border-t-black",
                destructive: "border-destructive border-t-destructive-foreground",
            },
            size: {
                default: "w-14 h-14 border-4",
                sm: "w-4 h-4 border-2",
                lg: "w-40 h-40 border-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface SpinProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinVariants> { }

const Spin = React.forwardRef<HTMLDivElement, SpinProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <div
                className={cn(spinVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Spin.displayName = "Spin"

export { Spin, spinVariants }
