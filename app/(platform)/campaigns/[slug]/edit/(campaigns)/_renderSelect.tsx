import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const RenderSelect = ({ form, name, label, options }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
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