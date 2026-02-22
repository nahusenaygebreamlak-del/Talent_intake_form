import React from 'react';
import { PieChart as PieIcon, TrendingUp, BarChart3, Star } from 'lucide-react';
import { Application } from '../../types';
import { DashboardStats } from '../DashboardStats';

interface AnalyticsPanelProps {
    applications: Application[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ applications }) => {
    // 1. Role Distribution Data
    const roleCounts: Record<string, number> = {};
    applications.forEach(app => roleCounts[app.role] = (roleCounts[app.role] || 0) + 1);
    const total = applications.length || 1;
    const roleEntries = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
    const chartColors = ['#D60D76', '#E7852F', '#8b5cf6', '#10b981', '#3b82f6', '#f43f5e', '#facc15', '#94a3b8'];


    // 3. Conversion Data
    const screeningPassed = applications.filter(app => app.screening_status === 'screened_passed').length;
    const screeningFailed = applications.filter(app => app.screening_status === 'screened_failed').length;
    const pending = applications.filter(app => !app.screening_status || app.screening_status === 'pending').length;

    // 4. Experience Distribution
    const expRatios = ["0–1", "2–3", "4–6", "7+"].map(range => {
        const count = applications.filter(app => app.experience_years === range).length;
        return { range, count, percent: total > 0 ? (count / total) * 100 : 0 };
    });

    // 5. Quality Index by Role
    const roleQuality = roleEntries.map(([role, count]) => {
        const ratedApps = applications.filter(app => app.role === role && app.rating !== null && app.rating !== undefined);
        const avgRating = ratedApps.length > 0
            ? ratedApps.reduce((acc, app) => acc + (app.rating || 0), 0) / ratedApps.length
            : 0;
        return { role, count, avgRating };
    }).sort((a, b) => b.avgRating - a.avgRating);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DashboardStats applications={applications} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Roles Donut Chart */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <PieIcon className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Roles Distribution</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative w-48 h-48 shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                {(() => {
                                    let cumulativePercent = 0;
                                    return roleEntries.map(([role, count], i) => {
                                        const percent = (count / total) * 100;
                                        const x1 = Math.cos(2 * Math.PI * (cumulativePercent / 100));
                                        const y1 = Math.sin(2 * Math.PI * (cumulativePercent / 100));
                                        cumulativePercent += percent;
                                        const x2 = Math.cos(2 * Math.PI * (cumulativePercent / 100));
                                        const y2 = Math.sin(2 * Math.PI * (cumulativePercent / 100));

                                        const largeArcFlag = percent > 50 ? 1 : 0;
                                        const pathData = `M 50 50 L ${50 + 40 * x1} ${50 + 40 * y1} A 40 40 0 ${largeArcFlag} 1 ${50 + 40 * x2} ${50 + 40 * y2} Z`;

                                        return (
                                            <path
                                                key={role}
                                                d={pathData}
                                                fill={chartColors[i % chartColors.length]}
                                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                            />
                                        );
                                    });
                                })()}
                                <circle cx="50" cy="50" r="25" fill="white" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-bold text-slate-800">{applications.length}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            {roleEntries.slice(0, 5).map(([role, count], i) => (
                                <div key={role} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: chartColors[i % chartColors.length] }}></div>
                                        <span className="text-[10px] font-bold text-slate-600 truncate">{role}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {Math.round((count / total) * 100)}% <span className="text-slate-300 ml-1 text-[9px]">({count})</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <BarChart3 className="w-4 h-4 text-violet-500" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Screening Conversion Funnel</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-32 text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Applied</span>
                            </div>
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400 w-full"></div>
                            </div>
                            <div className="w-16">
                                <span className="text-sm font-bold text-slate-800">{applications.length}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-32 text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Screened</span>
                            </div>
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-violet-500 transition-all duration-1000"
                                    style={{ width: `${((screeningPassed + screeningFailed) / total) * 100}%` }}
                                ></div>
                            </div>
                            <div className="w-16">
                                <span className="text-sm font-bold text-slate-800">{screeningPassed + screeningFailed}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-32 text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Passed Selection</span>
                            </div>
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all duration-1000"
                                    style={{ width: `${(screeningPassed / total) * 100}%` }}
                                ></div>
                            </div>
                            <div className="w-16">
                                <span className="text-sm font-bold text-slate-800">{screeningPassed}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-12">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{Math.round((screeningPassed / total) * 100)}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Pass Rate</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-violet-500">{Math.round(((screeningPassed + screeningFailed) / total) * 100)}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing Rate</p>
                        </div>
                    </div>
                </div>




                {/* Experience Distribution */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Experience Distribution</h3>
                    </div>

                    <div className="space-y-6">
                        {expRatios.map(item => (
                            <div key={item.range} className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-slate-600">{item.range} Years</span>
                                    <span className="text-slate-400">{item.count} Candidates ({Math.round(item.percent)}%)</span>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quality Index by Role */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <BarChart3 className="w-4 h-4 text-accent" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Role Quality Index</h3>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                        {roleQuality.slice(0, 6).map((item, i) => (
                            <div key={item.role} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                                        #{i + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-800 truncate">{item.role}</p>
                                        <p className="text-[9px] font-medium text-slate-400">{item.count} Candidates</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span className="text-[10px] font-bold text-slate-700">{item.avgRating.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
