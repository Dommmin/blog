import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DataItem } from '@/types/blog';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';

interface ComboBoxProps {
    data: DataItem[];
    selectedValues: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

export default function ComboBox({ data, selectedValues, onChange, placeholder = 'Select items...', className }: ComboBoxProps) {
    const [open, setOpen] = React.useState(false);

    const toggleValue = (itemValue: string) => {
        const newValue = selectedValues.includes(itemValue) ? selectedValues.filter((v) => v !== itemValue) : [...selectedValues, itemValue];
        onChange(newValue);
    };

    const selectedLabels = selectedValues.map((val) => data.find((item) => item.value === val)?.label).filter(Boolean);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between', className)}>
                    {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search items..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem key={item.value} value={item.value} onSelect={() => toggleValue(item.value)} className="cursor-pointer">
                                    <div className="flex items-center">
                                        <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(item.value) ? 'opacity-100' : 'opacity-0')} />
                                        {item.label}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
