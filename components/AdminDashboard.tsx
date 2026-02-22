import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Menu, ChevronLeft } from 'lucide-react';
import { supabase } from '../supabase';
import { Application, FilterState, ScreeningStatus, UserRole } from '../types';
import { CandidateProfile } from './CandidateProfile';
import { Sidebar } from './Admin/Sidebar';
import { FilterSystem } from './Admin/FilterSystem';
import { CandidateTable } from './Admin/CandidateTable';
import { AnalyticsPanel } from './Admin/AnalyticsPanel';
import { UserManagement } from './Admin/UserManagement';

interface AdminDashboardProps {
    onBackToForm: () => void;
    onLogout: () => void;
    userRole: UserRole;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToForm, onLogout, userRole }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'users'>('dashboard');

    // Multi-select state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    const [sortConfig, setSortConfig] = useState<{
        key: keyof Application | null;
        direction: 'asc' | 'desc' | null;
    }>({
        key: 'created_at',
        direction: 'desc'
    });

    const [filters, setFilters] = useState<FilterState>({
        searchQuery: '',
        roles: [],
        experienceYears: [],
        educationLevel: [],
        employmentStatus: [],
        workType: [],
        minRating: [],
        screeningStatus: []
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('[FETCH] Starting fetchApplications...');

            const { data, error: fetchError } = await supabase
                .from('job_applications')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('[FETCH] Result:', data?.length ?? 'null', 'error:', fetchError);

            if (fetchError) throw fetchError;

            setApplications(data || []);

            // Handle deep linking
            const params = new URLSearchParams(window.location.search);
            const candidateId = params.get('candidate');
            if (candidateId && data) {
                const candidate = data.find(app => app.id === candidateId);
                if (candidate) setSelectedCandidate(candidate);
            }
        } catch (err: any) {
            console.error('[FETCH] Error:', err);
            setError(err.message || 'Failed to load applications');
        } finally {
            console.log('[FETCH] Done, setting loading = false');
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

            setApplications(prev => prev.map(app => app.id === id ? { ...app, rating } : app));
            if (selectedCandidate?.id === id) setSelectedCandidate({ ...selectedCandidate, rating });
        } catch (err) {
            console.error('Error updating rating:', err);
        }
    };

    const handleStatusUpdate = async (id: string, status: ScreeningStatus) => {
        try {
            const { error: updateError } = await supabase
                .from('job_applications')
                .update({ screening_status: status })
                .eq('id', id);

            if (updateError) throw updateError;

            setApplications(prev => prev.map(app => app.id === id ? { ...app, screening_status: status } : app));
            if (selectedCandidate?.id === id) setSelectedCandidate({ ...selectedCandidate, screening_status: status });
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleBulkStatusUpdate = async (status: ScreeningStatus) => {
        if (selectedIds.length === 0) return;

        try {
            setIsBulkUpdating(true);
            const { error: updateError } = await supabase
                .from('job_applications')
                .update({ screening_status: status })
                .in('id', selectedIds);

            if (updateError) throw updateError;

            setApplications(prev => prev.map(app =>
                selectedIds.includes(app.id) ? { ...app, screening_status: status } : app
            ));
            setSelectedIds([]);
        } catch (err) {
            console.error('Error in bulk update:', err);
        } finally {
            setIsBulkUpdating(false);
        }
    };

    const exportToCSV = () => {
        const selectedApps = applications.filter(app => selectedIds.includes(app.id));
        if (selectedApps.length === 0) return;

        const headers = ['Full Name', 'Email', 'Phone', 'Role', 'Experience', 'Education', 'Status', 'Rating', 'Applied Date'];
        const rows = selectedApps.map(app => [
            `"${app.full_name}"`,
            `"${app.email}"`,
            `"${app.phone_number || ''}"`,
            `"${app.role}"`,
            `"${app.experience_years}"`,
            `"${app.education_level}"`,
            `"${app.screening_status || 'pending'}"`,
            `"${app.rating || 0}"`,
            `"${new Date(app.created_at).toLocaleDateString()}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSort = (key: keyof Application) => {
        let direction: 'asc' | 'desc' | null = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
        setSortConfig({ key, direction });
    };

    const toggleSelectCandidate = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredApplications = useMemo(() => {
        let filtered = [...applications];

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(app =>
                app.full_name.toLowerCase().includes(query) ||
                app.email.toLowerCase().includes(query) ||
                app.phone_number.includes(query)
            );
        }

        if (filters.roles.length > 0) filtered = filtered.filter(app => filters.roles.includes(app.role));
        if (filters.experienceYears.length > 0) filtered = filtered.filter(app => filters.experienceYears.includes(app.experience_years));
        if (filters.educationLevel.length > 0) filtered = filtered.filter(app => filters.educationLevel.includes(app.education_level));
        if (filters.employmentStatus.length > 0) filtered = filtered.filter(app => filters.employmentStatus.includes(app.employment_status));
        if (filters.workType.length > 0) filtered = filtered.filter(app => filters.workType.includes(app.work_type));
        if (filters.minRating.length > 0) filtered = filtered.filter(app => filters.minRating.includes(app.rating || 0));
        if (filters.screeningStatus.length > 0) filtered = filtered.filter(app => filters.screeningStatus.includes(app.screening_status || 'pending'));

        if (sortConfig.key && sortConfig.direction) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];
                if (aValue === bValue) return 0;
                let comparison = 0;
                if (aValue === null || aValue === undefined) comparison = 1;
                else if (bValue === null || bValue === undefined) comparison = -1;
                else if (typeof aValue === 'string' && typeof bValue === 'string') comparison = aValue.localeCompare(bValue);
                else if (typeof aValue === 'number' && typeof bValue === 'number') comparison = aValue - bValue;
                else comparison = String(aValue).localeCompare(String(bValue));
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }

        return filtered;
    }, [filters, applications, sortConfig]);

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                applicationsCount={applications.length}
                onBackToForm={onBackToForm}
                onLogout={onLogout}
                userRole={userRole}
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h2 className="text-lg font-bold text-slate-800">
                            {activeTab === 'dashboard' ? 'Recruitment Dashboard' : activeTab === 'users' ? 'User Management' : 'Talent Pool Management'}
                        </h2>
                    </div>
                    <button
                        onClick={fetchApplications}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition-all"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                </header>

                <main className="flex-1 p-10 overflow-y-auto relative">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <p className="text-sm font-bold text-red-500">{error}</p>
                            <button onClick={fetchApplications} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">
                                Retry
                            </button>
                        </div>
                    ) : activeTab === 'dashboard' ? (
                        <AnalyticsPanel applications={applications} />
                    ) : activeTab === 'users' ? (
                        <UserManagement />
                    ) : (
                        <>
                            <FilterSystem filters={filters} setFilters={setFilters} />

                            {/* Bulk Actions Bar */}
                            {selectedIds.length > 0 && (
                                <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
                                    <div className="bg-white px-8 py-5 rounded-[2rem] flex items-center justify-between border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Selections</span>
                                                <span className="text-xl font-black text-slate-900 leading-none">{selectedIds.length} <span className="text-sm font-bold text-slate-400">Selected</span></span>
                                            </div>

                                            <div className="w-px h-10 bg-slate-100"></div>

                                            <div className="flex items-center gap-3">
                                                {userRole !== 'guest' && (
                                                    <button
                                                        onClick={exportToCSV}
                                                        className="px-5 py-2.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border border-primary/10"
                                                    >
                                                        Export CSV
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {userRole !== 'guest' ? (
                                                <>
                                                    <button
                                                        disabled={isBulkUpdating}
                                                        onClick={() => handleBulkStatusUpdate('screened_passed')}
                                                        className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-green-500/10 disabled:opacity-50"
                                                    >
                                                        Pass Selection
                                                    </button>
                                                    <button
                                                        disabled={isBulkUpdating}
                                                        onClick={() => handleBulkStatusUpdate('screened_failed')}
                                                        className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-500/10 disabled:opacity-50"
                                                    >
                                                        Fail Selection
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-slate-200">
                                                    View Only Access
                                                </div>
                                            )}
                                            <button
                                                disabled={isBulkUpdating}
                                                onClick={() => setSelectedIds([])}
                                                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-200"
                                                title="Clear Selection"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <CandidateTable
                                applications={filteredApplications}
                                onSelectCandidate={setSelectedCandidate}
                                handleRate={handleRate}
                                handleStatusUpdate={handleStatusUpdate}
                                handleSort={handleSort}
                                sortConfig={sortConfig}
                                selectedIds={selectedIds}
                                onToggleSelect={toggleSelectCandidate}
                                onToggleSelectAll={() => {
                                    if (selectedIds.length === filteredApplications.length) setSelectedIds([]);
                                    else setSelectedIds(filteredApplications.map(a => a.id));
                                }}
                                userRole={userRole}
                            />
                        </>
                    )}
                </main>
            </div>

            {selectedCandidate && (
                <CandidateProfile
                    application={selectedCandidate}
                    onClose={() => {
                        setSelectedCandidate(null);
                        const url = new URL(window.location.href);
                        url.searchParams.delete('candidate');
                        window.history.replaceState({}, '', url);
                    }}
                    onRate={(r) => handleRate(selectedCandidate.id, r)}
                    onStatusUpdate={(s) => handleStatusUpdate(selectedCandidate.id, s)}
                    userRole={userRole}
                />
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
            `}</style>
        </div>
    );
};
