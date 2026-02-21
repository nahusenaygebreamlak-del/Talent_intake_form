import React from 'react';
import { Users, UserPlus, Star, BarChart3 } from 'lucide-react';
import { Application } from '../types';

interface DashboardStatsProps {
    applications: Application[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ applications }) => {
    const totalApplications = applications.length;

    // Calculate applications in the last 7 days
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const recentApplications = applications.filter(
        app => new Date(app.created_at) > lastWeekDate
    ).length;

    // Calculate average rating
    const ratedApps = applications.filter(app => app.rating !== null && app.rating !== undefined);
    const averageRating = ratedApps.length > 0
        ? (ratedApps.reduce((acc, app) => acc + (app.rating || 0), 0) / ratedApps.length).toFixed(1)
        : '0.0';

    // Find most applied role
    const roleCounts: Record<string, number> = {};
    applications.forEach(app => {
        roleCounts[app.role] = (roleCounts[app.role] || 0) + 1;
    });
    const topRole = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // Calculate pending screening
    const pendingScreening = applications.filter(app => !app.screening_status || app.screening_status === 'pending').length;

    const stats = [
        {
            label: 'Total Applications',
            value: totalApplications,
            icon: Users,
            color: 'bg-primary',
            textColor: 'text-primary',
        },
        {
            label: 'Pending Screening',
            value: pendingScreening,
            icon: UserPlus,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className={`${stat.color} bg-opacity-10 p-4 rounded-xl`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
