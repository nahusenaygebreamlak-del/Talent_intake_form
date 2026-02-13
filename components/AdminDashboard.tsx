import React, { useState, useEffect } from 'react';
import {
    Search, Filter, X, Eye,
    Briefcase, GraduationCap,
    LayoutDashboard, Users as UsersIcon, Star, RefreshCw,
    LogOut, ClipboardList
} from 'lucide-react';
import { supabase } from '../supabase';
import { Application, FilterState } from '../types';
import { ROLES, EXPERIENCE_RANGES, EDUCATION_LEVELS, EMPLOYMENT_STATUS, WORK_TYPES } from '../constants';
import { StarRating } from './StarRating';
import { CandidateProfile } from './CandidateProfile';

interface AdminDashboardProps {
    onBackToForm: () => void;
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToForm, onLogout }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        searchQuery: '',
        role: '',
        experienceYears: '',
        educationLevel: '',
        employmentStatus: '',
        workType: '',
        minRating: 0
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('job_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            setApplications(data || []);
            setFilteredApplications(data || []);

            // Handle deep linking to a candidate if ID is in URL
            const params = new URLSearchParams(window.location.search);
            const candidateId = params.get('candidate');
            if (candidateId && data) {
                const candidate = data.find(app => app.id === candidateId);
                if (candidate) {
                    setSelectedCandidate(candidate);
                }
            }
        } catch (err: any) {
            console.error('Error fetching applications:', err);
            setError(err.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (id: string, rating: number) => {
        try {
            const { error: updateError } = await supabase
                .from('job_applications')
                .update({ rating })
                .eq('id', id);

            if (updateError) throw updateError;

            const updatedApps = applications.map(app =>
                app.id === id ? { ...app, rating } : app
            );
            setApplications(updatedApps);

            if (selectedCandidate?.id === id) {
                setSelectedCandidate({ ...selectedCandidate, rating });
            }
        } catch (err: any) {
            console.error('Error updating rating:', err);
        }
    };

    useEffect(() => {
        let filtered = [...applications];

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(app =>
                app.full_name.toLowerCase().includes(query) ||
                app.email.toLowerCase().includes(query) ||
                app.phone_number.includes(query)
            );
        }

        if (filters.role) filtered = filtered.filter(app => app.role === filters.role);
        if (filters.experienceYears) filtered = filtered.filter(app => app.experience_years === filters.experienceYears);
        if (filters.educationLevel) filtered = filtered.filter(app => app.education_level === filters.educationLevel);
        if (filters.employmentStatus) filtered = filtered.filter(app => app.employment_status === filters.employmentStatus);
        if (filters.workType) filtered = filtered.filter(app => app.work_type === filters.workType);
        if (filters.minRating > 0) filtered = filtered.filter(app => (app.rating || 0) >= filters.minRating);

        setFilteredApplications(filtered);
    }, [filters, applications]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar - Fixed Height and Sticky */}
            <aside className="w-72 h-screen sticky top-0 bg-[#FBFBFC] border-r border-slate-200 flex flex-col shrink-0">
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <h1 className="text-xl font-bold text-slate-800 mb-12">Afriwork Admin</h1>

                    <div className="space-y-10">
                        <div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Overview</h3>
                            <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-100/50 shadow-sm text-primary rounded-xl font-bold transition-all group">
                                <div className="flex items-center gap-3">
                                    <ClipboardList className="w-4 h-4" />
                                    <span className="text-sm">Applications</span>
                                </div>
                                <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded-full">{applications.length}</span>
                            </button>

                            <button
                                onClick={onBackToForm}
                                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-100/50 hover:shadow-sm rounded-xl font-bold transition-all group"
                            >
                                <UsersIcon className="w-4 h-4" />
                                <span className="text-sm">Back to Intake Form</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-10 border-t border-slate-100 bg-[#FBFBFC]">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors group"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header - Simple */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <UsersIcon className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-bold text-slate-800">Talent Pool Management</h2>
                    </div>
                    <button
                        onClick={fetchApplications}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition-all"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                </header>

                <main className="flex-1 p-10 overflow-y-auto">
                    {/* Previous Better Filters - Grid Layout */}
                    <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-accent" />
                                <h3 className="text-sm font-bold text-slate-800">Advanced Filters</h3>
                            </div>
                            {Object.values(filters).some(v => v !== '' && v !== 0) && (
                                <button
                                    onClick={() => setFilters({ searchQuery: '', role: '', experienceYears: '', educationLevel: '', employmentStatus: '', workType: '', minRating: 0 })}
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
                        </div>
                    </div>

                    {/* Applications Table */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FBFBFC] border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Role</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Experience</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Applied Date</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app) => (
                                        <tr
                                            key={app.id}
                                            onClick={() => setSelectedCandidate(app)}
                                            className="group hover:bg-slate-50/80 cursor-pointer border-b last:border-none border-slate-50 transition-colors"
                                        >
                                            <td className="px-8 py-5">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm mb-0.5">{app.full_name}</p>
                                                    <p className="text-[11px] font-medium text-slate-400">{app.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                {app.role ? (
                                                    <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                        {app.role}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-200">—</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="text-xs font-bold text-slate-600">{app.experience_years}</span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="text-xs font-bold text-slate-400">
                                                    {new Date(app.created_at).toLocaleDateString('en-US', {
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end">
                                                    <StarRating
                                                        rating={app.rating}
                                                        onRate={(r) => handleRate(app.id, r)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching candidates</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Candidate Profile Modal */}
            {
                selectedCandidate && (
                    <CandidateProfile
                        application={selectedCandidate}
                        onClose={() => {
                            setSelectedCandidate(null);
                            // Clear URL param when closing
                            const url = new URL(window.location.href);
                            url.searchParams.delete('candidate');
                            window.history.replaceState({}, '', url);
                        }}
                        onRate={(r) => handleRate(selectedCandidate.id, r)}
                    />
                )
            }

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
            `}</style>
        </div >
    );
};
