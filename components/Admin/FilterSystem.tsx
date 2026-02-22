import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';
import { FilterState } from '../../types';
import {
    ROLES,
    EXPERIENCE_RANGES,
    EDUCATION_LEVELS,
    EMPLOYMENT_STATUS,
    WORK_TYPES,
    SCREENING_STATUSES
} from '../../constants';

interface MultiSelectDropdownProps {
    label: string;
    options: { label: string; value: any }[];
    selectedValues: any[];
    onToggle: (value: any) => void;
    placeholder: string;
    icon?: React.ReactNode;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    label,
    options,
    selectedValues,
    onToggle,
    placeholder,
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayLabel = selectedValues.length === 0
        ? placeholder
        : selectedValues.length === 1
            ? options.find(o => o.value === selectedValues[0])?.label || selectedValues[0]
            : `${selectedValues.length} ${label} Selected`;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold flex items-center justify-between hover:border-slate-300 transition-all ${selectedValues.length > 0 ? 'text-primary' : 'text-slate-600'}`}
            >
                <div className="flex items-center gap-2 truncate text-left">
                    {icon}
                    <span className="truncate">{displayLabel}</span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-hide">
                    {options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => onToggle(option.value)}
                            className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
                        >
                            <span className={`text-xs font-bold ${selectedValues.includes(option.value) ? 'text-primary' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                {option.label}
                            </span>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${selectedValues.includes(option.value) ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                {selectedValues.includes(option.value) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface FilterSystemProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

export const FilterSystem: React.FC<FilterSystemProps> = ({ filters, setFilters }) => {
    const hasActiveFilters = filters.searchQuery !== '' ||
        filters.roles.length > 0 ||
        filters.experienceYears.length > 0 ||
        filters.educationLevel.length > 0 ||
        filters.employmentStatus.length > 0 ||
        filters.workType.length > 0 ||
        filters.minRating.length > 0 ||
        filters.screeningStatus.length > 0;

    const resetFilters = () => {
        setFilters({
            searchQuery: '',
            roles: [],
            experienceYears: [],
            educationLevel: [],
            employmentStatus: [],
            workType: [],
            minRating: [],
            screeningStatus: []
        });
    };

    const toggleFilter = (key: keyof FilterState, value: any) => {
        const current = filters[key] as any[];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setFilters({ ...filters, [key]: updated });
    };

    const ratingOptions = [
        { label: '5 Stars', value: 5 },
        { label: '4 Stars', value: 4 },
        { label: '3 Stars', value: 3 },
        { label: '2 Stars', value: 2 },
        { label: '1 Star', value: 1 },
        { label: 'Unrated', value: 0 },
    ];

    return (
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-bold text-slate-800">Advanced Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-4"
                    >
                        Reset All Filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search */}
                <div className="relative col-span-1 lg:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search name, email, or phone..."
                        value={filters.searchQuery}
                        onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all"
                    />
                </div>

                {/* Roles */}
                <MultiSelectDropdown
                    label="Roles"
                    placeholder="All Roles"
                    options={ROLES.map(r => ({ label: r, value: r }))}
                    selectedValues={filters.roles}
                    onToggle={(v) => toggleFilter('roles', v)}
                />

                {/* Rating */}
                <MultiSelectDropdown
                    label="Ratings"
                    placeholder="Any Rating"
                    options={ratingOptions}
                    selectedValues={filters.minRating}
                    onToggle={(v) => toggleFilter('minRating', v)}
                />

                {/* Experience */}
                <MultiSelectDropdown
                    label="Exp."
                    placeholder="All Experience"
                    options={EXPERIENCE_RANGES.map(r => ({ label: r, value: r }))}
                    selectedValues={filters.experienceYears}
                    onToggle={(v) => toggleFilter('experienceYears', v)}
                />

                {/* Education */}
                <MultiSelectDropdown
                    label="Edu."
                    placeholder="All Education"
                    options={EDUCATION_LEVELS.map(r => ({ label: r, value: r }))}
                    selectedValues={filters.educationLevel}
                    onToggle={(v) => toggleFilter('educationLevel', v)}
                />

                {/* Employment Status */}
                <MultiSelectDropdown
                    label="Status"
                    placeholder="Any Employment"
                    options={EMPLOYMENT_STATUS.map(s => ({ label: s, value: s }))}
                    selectedValues={filters.employmentStatus}
                    onToggle={(v) => toggleFilter('employmentStatus', v)}
                />

                {/* Work Type */}
                <MultiSelectDropdown
                    label="Work"
                    placeholder="Any Work Type"
                    options={WORK_TYPES.map(t => ({ label: t, value: t }))}
                    selectedValues={filters.workType}
                    onToggle={(v) => toggleFilter('workType', v)}
                />

                {/* Screening Status */}
                <MultiSelectDropdown
                    label="Screening"
                    placeholder="All Screening"
                    options={SCREENING_STATUSES.map(s => ({ label: s.label, value: s.value }))}
                    selectedValues={filters.screeningStatus}
                    onToggle={(v) => toggleFilter('screeningStatus', v)}
                />
            </div>
        </div>
    );
};
