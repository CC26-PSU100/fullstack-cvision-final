import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  position?: "bottom" | "top";
}

export function Select({ value, onChange, options, className, position = "bottom" }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-sm border border-border bg-muted/30 px-3 py-1 text-xs text-foreground shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer text-left",
          className
        )}
      >
        <span>{selectedOption?.label}</span>
        <span className="material-symbols-outlined text-muted-foreground text-sm">
          keyboard_arrow_down
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 w-full min-w-[120px] rounded-sm border border-border bg-card p-1 shadow-lg z-50 animate-in fade-in duration-100",
            position === "top"
              ? "bottom-full top-auto mb-1 slide-in-from-bottom-1"
              : "top-full bottom-auto mt-1 slide-in-from-top-1"
          )}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-xs text-foreground hover:bg-muted text-left transition-colors duration-150 cursor-pointer font-medium",
                opt.value === value && "bg-muted font-bold text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
