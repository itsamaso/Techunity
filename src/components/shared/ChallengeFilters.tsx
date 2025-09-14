import React from 'react';
import HorizontalDropdown from './HorizontalDropdown';

interface FilterOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

interface ChallengeFiltersProps {
  selectedDifficulty: string;
  selectedCategory: string;
  onDifficultyChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  className?: string;
}

const ChallengeFilters: React.FC<ChallengeFiltersProps> = ({
  selectedDifficulty,
  selectedCategory,
  onDifficultyChange,
  onCategoryChange,
  className
}) => {
  const difficultyOptions: FilterOption[] = [
    { value: 'all', label: 'All Levels', icon: '🎯', color: 'bg-gray-100 text-gray-800' },
    { value: 'Easy', label: 'Easy', icon: '🟢', color: 'bg-green-100 text-green-800' },
    { value: 'Medium', label: 'Medium', icon: '🟡', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Hard', label: 'Hard', icon: '🔴', color: 'bg-red-100 text-red-800' },
  ];

  const categoryOptions: FilterOption[] = [
    { value: 'all', label: 'All Topics', icon: '📚' },
    { value: 'arrays', label: 'Arrays', icon: '📊' },
    { value: 'strings', label: 'Strings', icon: '📝' },
    { value: 'math', label: 'Math', icon: '🔢' },
    { value: 'logic', label: 'Logic', icon: '🧠' },
  ];

  return (
    <div className={`bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-xl p-6 relative w-full overflow-visible ${className}`}>
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200/50 shadow-sm">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-gray-800 tracking-wide">Filter Options</span>
        </div>
      </div>

      {/* Filter Controls Section */}
      <div className="space-y-6">
        {/* Difficulty Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-sm"></div>
            <h3 className="text-lg font-bold text-gray-800 tracking-wide">Difficulty Level</h3>
          </div>
          <HorizontalDropdown
            options={difficultyOptions}
            selectedValue={selectedDifficulty}
            onSelect={onDifficultyChange}
            placeholder="Select Difficulty"
            icon="💪"
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-sm"></div>
            <h3 className="text-lg font-bold text-gray-800 tracking-wide">Category</h3>
          </div>
          <HorizontalDropdown
            options={categoryOptions}
            selectedValue={selectedCategory}
            onSelect={onCategoryChange}
            placeholder="Select Category"
            icon="📚"
            className="w-full"
          />
        </div>

        {/* Clear Filters Button */}
        {(selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
          <div className="pt-4 border-t border-gray-200/60">
            <button
              onClick={() => {
                onDifficultyChange('all');
                onCategoryChange('all');
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 transition-all duration-200 border border-gray-200/50 hover:border-gray-300/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
          <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
          <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFilters;
