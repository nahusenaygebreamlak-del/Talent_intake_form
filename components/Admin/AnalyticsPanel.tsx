import React from 'react';
import { PieChart as PieIcon, TrendingUp, BarChart3 } from 'lucide-react';
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

    // 2. Time-Series Data (Applications per day for last 14 days)
    const last14Days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return d.toISOString().split('T')[0];
    });

    const dailyCounts = last14Days.map(date => {
        return applications.filter(app => app.created_at.startsWith(date)).length;
    });

    const maxDaily = Math.max(...dailyCounts, 5);
    const linePath = dailyCounts.map((count, i) => {
        const x = (i / (dailyCounts.length - 1)) * 400;
        const y = 100 - (count / maxDaily) * 100;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // 3. Conversion Data
    const screeningPassed = applications.filter(app => app.screening_status === 'screened_passed').length;
    const screeningFailed = applications.filter(app => app.screening_status === 'screened_failed').length;
    const pending = applications.filter(app => !app.screening_status || app.screening_status === 'pending').length;

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

                {/* Time-Series Chart */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Application Trends (14d)</h3>
                    </div>

                    <div className="h-48 w-full relative pt-4">
                        <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map(y => (
                                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />
                            ))}

                            {/* Area Gradient with better falloff */}
                            <path
                                d={`${linePath} L 400 100 L 0 100 Z`}
                                fill="url(#areaGradient)"
                                className="opacity-20"
                            />

                            {/* The Line */}
                            <path
                                d={linePath}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="1.2"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Data Points */}
                            {dailyCounts.map((count, i) => {
                                const x = (i / (dailyCounts.length - 1)) * 400;
                                const y = 100 - (count / maxDaily) * 100;
                                return (
                                    <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r="1.2"
                                        fill="#D60D76"
                                        style={{ vectorEffect: 'non-scaling-stroke' }}
                                        className="transition-all hover:r-2 cursor-pointer"
                                    />
                                );
                            })}

                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="100" y2="0">
                                    <stop offset="0%" stopColor="#D60D76" />
                                    <stop offset="100%" stopColor="#E7852F" />
                                </linearGradient>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="100">
                                    <stop offset="0%" stopColor="#D60D76" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#D60D76" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="flex justify-between mt-4">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{last14Days[0].split('-').slice(1).join('/')}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{last14Days[13].split('-').slice(1).join('/')}</span>
                        </div>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm lg:col-span-2">
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
            </div>
        </div>
    );
};
