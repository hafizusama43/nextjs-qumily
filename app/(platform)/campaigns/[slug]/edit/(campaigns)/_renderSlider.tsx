import TemplateTooltip from "@/components/ui/_tooltip"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { CircleHelp } from "lucide-react"

export const RenderSlider = ({ form, name, max = 5, label = "", helpText = "" }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}&nbsp;
                        {helpText && <TemplateTooltip title={helpText}>
                            <CircleHelp className="inline !text-blue-600 h-3 w-3 mb-[2px] cursor-pointer" />
                        </TemplateTooltip>}
                    </FormLabel>}
                    <FormControl>
                        <Slider onValueChange={field.onChange} value={field.value} max={max}></Slider>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}