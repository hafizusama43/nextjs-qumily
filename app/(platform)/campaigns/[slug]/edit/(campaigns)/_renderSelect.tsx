import TemplateTooltip from "@/components/ui/_tooltip"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CircleHelp } from "lucide-react"

export const RenderSelect = ({ form, name, label = "", options, helpText = "" }) => {
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
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a campaign category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.keys(options).map((item, index) => <SelectItem
                                key={index}
                                value={item}>
                                {options[item]}
                            </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}