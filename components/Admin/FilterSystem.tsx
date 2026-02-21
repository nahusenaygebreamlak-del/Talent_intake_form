import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterState } from '../../types';
import {
    ROLES,
    EXPERIENCE_RANGES,
    EDUCATION_LEVELS,
    EMPLOYMENT_STATUS,
    WORK_TYPES,
    SCREENING_STATUSES
} from '../../constants';

interface FilterSystemProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

export const FilterSystem: React.FC<FilterSystemProps> = ({ filters, setFilters }) => {
    const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== 0);

    const resetFilters = () => {
        setFilters({
            searchQuery: '',
            role: '',
            experienceYears: '',
            educationLevel: '',
            employmentStatus: '',
            workType: '',
            minRating: 0,
            screeningStatus: ''
        });
    };

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

                {/* Role */}
                <select
                    value={filters.role}
                    onChange={e => setFilters({ ...filters, role: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer"
                >
                    <option value="">All Roles</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                {/* Min Rating */}
                <select
                    value={filters.minRating}
                    onChange={e => setFilters({ ...filters, minRating: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer"
                >
                    <option value="0">Any Rating</option>
                    <option value="5">5 Stars only</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                </select>

                {/* Experience */}
                <select
                    value={filters.experienceYears}
                    onChange={e => setFilters({ ...filters, experienceYears: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer"
                >
                    <option value="">All Experience</option>
                    {EXPERIENCE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                {/* Education */}
                <select
                    value={filters.educationLevel}
                    onChange={e => setFilters({ ...filters, educationLevel: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer"
                >
                    <option value="">All Education</option>
                    {EDUCATION_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                {/* Employment Status */}
                <select
                    value={filters.employmentStatus}
                    onChange={e => setFilters({ ...filters, employmentStatus: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer"
                >
                    <option value="">Any Employment</option>
                    {EMPLOYMENT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {/* Work Type */}
                <select
                    value={filters.workType}
                    onChange={e => setFilters({ ...filters, workType: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer"
                >
                    <option value="">Any Work Type</option>
                    {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Screening Status */}
                <select
                    value={filters.screeningStatus}
                    onChange={e => setFilters({ ...filters, screeningStatus: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:border-slate-300 transition-all cursor-pointer"
                >
                    <option value="">All Screening Status</option>
                    {SCREENING_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>
        </div>
    );
};
