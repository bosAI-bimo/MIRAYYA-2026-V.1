"use client"

import * as React from "react"
import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: DateRange;
  setDate: (date?: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Pilih tanggal...",
  className
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleShortcut = (days: number, type: 'days' | 'months' = 'days') => {
    const to = endOfDay(new Date());
    let from = startOfDay(new Date());
    
    if (days > 0) {
      if (type === 'days') {
        from = startOfDay(subDays(new Date(), days));
      } else {
        from = startOfDay(subMonths(new Date(), days));
      }
    }
    
    setDate({ from, to });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[260px] justify-start text-left font-normal border-2 border-slate-200 rounded-lg hover:border-orange-500 focus:ring-2 focus:ring-orange-500/50 text-sm h-10 px-3",
              !date && "text-slate-400",
              isOpen && "border-orange-500 ring-2 ring-orange-500/50",
              className
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "d MMM yyyy", { locale: id })} -{" "}
              {format(date.to, "d MMM yyyy", { locale: id })}
            </>
          ) : (
            format(date.from, "d MMM yyyy", { locale: id })
          )
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[100] border-2 border-orange-500/20" align="start">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col p-3 border-b sm:border-b-0 sm:border-r border-slate-200 gap-2 min-w-[150px] bg-slate-50">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 px-2">Pilih Cepat</span>
            <Button
              variant="ghost"
              className="justify-start hover:bg-orange-100 hover:text-orange-600 font-normal h-8"
              onClick={() => handleShortcut(0)}
            >
              Hari Ini
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-orange-100 hover:text-orange-600 font-normal h-8"
              onClick={() => handleShortcut(7)}
            >
              7 Hari Terakhir
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-orange-100 hover:text-orange-600 font-normal h-8"
              onClick={() => handleShortcut(1, 'months')}
            >
              1 Bulan Terakhir
            </Button>
            <Button
              variant="ghost"
              className="justify-start hover:bg-orange-100 hover:text-orange-600 font-normal h-8"
              onClick={() => handleShortcut(3, 'months')}
            >
              3 Bulan Terakhir
            </Button>
          </div>
          <div className="p-2">
            <Calendar
              mode="range"
              selected={date}
              onSelect={(range) => {
                setDate(range);
                if (range?.from && range?.to) {
                   setIsOpen(false);
                }
              }}
              locale={id}
              className="[&_.rdp-day_data-\\[selected-single\\=true\\]]:bg-orange-500 [&_.rdp-day_data-\\[range-start\\=true\\]]:bg-orange-500 [&_.rdp-day_data-\\[range-end\\=true\\]]:bg-orange-500 [&_.rdp-day_data-\\[range-middle\\=true\\]]:bg-orange-100 [&_.rdp-day_data-\\[range-middle\\=true\\]]:text-orange-900 [&_.rdp-button:hover]:bg-orange-100"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
