import TemplateTooltip from "@/components/ui/_tooltip"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { CircleHelp } from "lucide-react"

export const RenderTextArea = ({ form, name, label, disabled = false, placeholder = "Please enter text here", helpText = "" }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}&nbsp;
                        {helpText && <TemplateTooltip title={helpText}>
                            <CircleHelp className="inline !text-blue-600 h-3 w-3 mb-[2px] cursor-pointer" />
                        </TemplateTooltip>}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            rows={10}
                            placeholder={placeholder}
                            className="resize-none"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}