import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Using shadcn select
import { SortingOption } from '@/types/catalog';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';

// Объект с доступными иконками
const ICONS: Record<string, LucideIcon> = {
  ArrowUp,
  ArrowDown,
  // Добавьте другие иконки по мере необходимости
};

interface SortingDropdownProps {
  options: SortingOption[];
  currentValue: string;
  onValueChange: (value: string) => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({
  options,
  currentValue,
  onValueChange,
}) => {
  // Find current selected option for displaying icon in trigger
  const selectedOption = options.find(opt => opt.value === currentValue);

  // Получаем компонент иконки для текущего выбранного элемента
  const SelectedIcon = selectedOption?.iconName ? ICONS[selectedOption.iconName] : undefined;

  return (
    <Select value={currentValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Сортировать по...">
          <div className="flex items-center gap-2">
            {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
            <span>{selectedOption?.label || "Сортировать по..."}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          // Получаем компонент иконки для текущего элемента списка
          const Icon = option.iconName ? ICONS[option.iconName] : undefined;
          
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default SortingDropdown; 