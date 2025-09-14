import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

interface HorizontalDropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
  icon?: string;
  className?: string;
}

const HorizontalDropdown: React.FC<HorizontalDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  icon,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("w-full relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 w-full",
          "bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm border-2 border-gray-200/60 shadow-lg hover:shadow-xl",
          "hover:scale-[1.02] active:scale-[0.98] hover:border-primary-300/50",
          isOpen && "ring-2 ring-primary-500/30 border-primary-400 bg-gradient-to-r from-primary-50 to-secondary-50 shadow-xl"
        )}
      >
        <span className="text-lg">
          {selectedOption ? selectedOption.icon : icon}
        </span>
        <span className="text-gray-700">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-300",
            isOpen && "rotate-180"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Vertical Options Menu - Below Trigger */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-white/98 to-gray-50/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-2xl z-[100] animate-in slide-in-from-top-2 fade-in-0 duration-300">
          <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left",
                  "hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm",
                  selectedValue === option.value 
                    ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 border border-primary-300 shadow-md font-semibold" 
                    : "text-gray-700 hover:text-gray-900 border border-transparent"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {option.icon && <span className="text-base">{option.icon}</span>}
                <span className="flex-1 truncate">{option.label}</span>
                {selectedValue === option.value && (
                  <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalDropdown;