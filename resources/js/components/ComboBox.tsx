import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type DataItem } from '@/types/blog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface ComboBoxProps {
    data: DataItem[];
    selectedValues: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function ComboBox({ data, selectedValues, onChange, placeholder = 'Select...', className }: ComboBoxProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between', className)}>
                    {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        {data.map((item) => (
                            <CommandItem
                                key={item.value}
                                onSelect={() => {
                                    const newSelectedValues = selectedValues.includes(item.value)
                                        ? selectedValues.filter((value) => value !== item.value)
                                        : [...selectedValues, item.value];
                                    onChange(newSelectedValues);
                                }}
                            >
                                <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(item.value) ? 'opacity-100' : 'opacity-0')} />
                                {item.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
