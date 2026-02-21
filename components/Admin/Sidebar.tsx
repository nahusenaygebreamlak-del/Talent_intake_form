import React from 'react';
import {
    LayoutDashboard, ClipboardList, Users as UsersIcon, LogOut
} from 'lucide-react';

interface SidebarProps {
    isSidebarOpen: boolean;
    activeTab: 'dashboard' | 'applications';
    setActiveTab: (tab: 'dashboard' | 'applications') => void;
    applicationsCount: number;
    onBackToForm: () => void;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    activeTab,
    setActiveTab,
    applicationsCount,
    onBackToForm,
    onLogout
}) => {
    return (
        <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} h-screen sticky top-0 bg-[#FBFBFC] border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 overflow-hidden`}>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <h1 className="text-xl font-bold text-slate-800 mb-12">Afriwork Admin</h1>

                <div className="space-y-10">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Overview</h3>

                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center justify-between px-4 py-3 mb-2 rounded-xl font-bold transition-all group ${activeTab === 'dashboard'
                                ? 'bg-white border border-slate-100/50 shadow-sm text-primary'
                                : 'text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-100/50 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="text-sm">Dashboard</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab('applications')}
                            className={`w-full flex items-center justify-between px-4 py-3 mb-4 rounded-xl font-bold transition-all group ${activeTab === 'applications'
                                ? 'bg-white border border-slate-100/50 shadow-sm text-primary'
                                : 'text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-100/50 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <ClipboardList className="w-4 h-4" />
                                <span className="text-sm">Applications</span>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full ${activeTab === 'applications' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {applicationsCount}
                            </span>
                        </button>

                        <button
                            onClick={onBackToForm}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-100/50 hover:shadow-sm rounded-xl font-bold transition-all group"
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
    );
};
