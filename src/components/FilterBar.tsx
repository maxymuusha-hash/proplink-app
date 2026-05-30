import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CITIES, PROPERTY_TYPES } from '@/data/properties';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedTransaction: string;
  setSelectedTransaction: (transaction: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedBedrooms: string;
  setSelectedBedrooms: (bedrooms: string) => void;
  properties?: any[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedTransaction,
  setSelectedTransaction,
  selectedCity,
  setSelectedCity,
  priceRange,
  setPriceRange,
  showFilters,
  setShowFilters,
  clearFilters,
  activeFiltersCount,
  sortBy,
  setSortBy,
  selectedBedrooms,
  setSelectedBedrooms,
  properties = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const query = value.toLowerCase();
    const suggestionSet = new Set<string>();

    // Suggest from cities
    CITIES.filter(c => c !== 'All Cities' && c.toLowerCase().includes(query))
      .forEach(c => suggestionSet.add(c));

    // Suggest from property titles and locations
    properties.forEach(p => {
      if (p.title?.toLowerCase().includes(query)) suggestionSet.add(p.title);
      if (p.location?.toLowerCase().includes(query)) suggestionSet.add(p.location);
      if (p.city?.toLowerCase().includes(query)) suggestionSet.add(p.city);
      if (p.type?.toLowerCase().includes(query)) {
        const typeLabel = PROPERTY_TYPES.find(t => t.value === p.type)?.label;
        if (typeLabel) suggestionSet.add(typeLabel);
      }
    });

    // Suggest property types
    PROPERTY_TYPES.filter(t => t.value !== 'all' && t.label.toLowerCase().includes(query))
      .forEach(t => suggestionSet.add(t.label));

    setSuggestions(Array.from(suggestionSet).slice(0, 6));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search by title, location, or description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-cyan-50 hover:text-cyan-700 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                >
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700 bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
          style={{ backgroundColor: '#1a365d' }}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Categories</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Transaction Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
              <select
                value={selectedTransaction}
                onChange={(e) => setSelectedTransaction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Rent & Sale</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
              <input
                type="number"
                placeholder="Min price"
                value={priceRange.min || ''}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
              <input
                type="number"
                placeholder="Max price"
                value={priceRange.max || ''}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
