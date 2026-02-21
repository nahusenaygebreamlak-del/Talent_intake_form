import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { UserRole } from '../../types';
import { Shield, UserCheck, Eye, Loader2 } from 'lucide-react';

interface Profile {
    id: string;
    email: string;
    role: UserRole;
    updated_at: string;
}

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; icon: React.ReactNode }> = {
    super_admin: {
        label: 'Super Admin',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: <Shield className="w-3.5 h-3.5" />
    },
    recruiter: {
        label: 'Recruiter',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <UserCheck className="w-3.5 h-3.5" />
    },
    guest: {
        label: 'Guest',
        color: 'bg-slate-100 text-slate-500 border-slate-200',
        icon: <Eye className="w-3.5 h-3.5" />
    }
};

export const UserManagement: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('id, email, role, updated_at')
                .order('updated_at', { ascending: false });

            if (fetchError) throw fetchError;
            setProfiles(data ?? []);
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id: string, newRole: UserRole) => {
        try {
            setUpdatingId(id);
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: newRole, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (updateError) throw updateError;

            setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p));
            setSuccessId(id);
            setTimeout(() => setSuccessId(null), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to update role');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-800 mb-1">User Management</h3>
                <p className="text-sm text-slate-400 font-medium">Assign and manage dashboard access roles for your team.</p>
            </div>

            {error && (
                <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#FBFBFC] border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Current Role</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Change Role</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.length > 0 ? profiles.map((profile, index) => {
                            const config = ROLE_CONFIG[profile.role];
                            return (
                                <tr
                                    key={profile.id}
                                    className={`border-b last:border-none border-slate-50 transition-colors ${successId === profile.id ? 'bg-green-50' : 'hover:bg-slate-50/50'}`}
                                >
                                    <td className="px-8 py-5">
                                        <span className="text-[11px] font-bold text-slate-300">{index + 1}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-slate-700">{profile.email}</p>
                                        <p className="text-[10px] font-mono text-slate-300 mt-0.5">{profile.id.substring(0, 16)}…</p>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border ${config.color}`}>
                                            {config.icon}
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {updatingId === profile.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                            ) : (
                                                (['super_admin', 'recruiter', 'guest'] as UserRole[]).map(role => (
                                                    <button
                                                        key={role}
                                                        onClick={() => handleRoleChange(profile.id, role)}
                                                        disabled={profile.role === role}
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border
                                                            ${profile.role === role
                                                                ? `${ROLE_CONFIG[role].color} opacity-60 cursor-default`
                                                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-primary hover:text-primary hover:bg-primary/5'
                                                            }`}
                                                    >
                                                        {ROLE_CONFIG[role].label}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-xs font-bold text-slate-400">
                                            {new Date(profile.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No users found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
