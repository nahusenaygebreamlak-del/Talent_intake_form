import React from 'react';
import { ChevronUp, ChevronDown, Check, X, Lock } from 'lucide-react';
import { Application, ScreeningStatus, UserRole } from '../../types';
import { StarRating } from '../StarRating';

interface CandidateTableProps {
    applications: Application[];
    onSelectCandidate: (app: Application) => void;
    handleRate: (id: string, rating: number) => void;
    handleStatusUpdate: (id: string, status: ScreeningStatus) => void;
    handleSort: (key: keyof Application) => void;
    sortConfig: {
        key: keyof Application | null;
        direction: 'asc' | 'desc' | null;
    };
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    userRole: UserRole;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
    applications,
    onSelectCandidate,
    handleRate,
    handleStatusUpdate,
    handleSort,
    sortConfig,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    userRole
}) => {
    const isAllSelected = applications.length > 0 && selectedIds.length === applications.length;

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#FBFBFC] border-b border-slate-100">
                        <th className="px-4 py-5 w-10">
                            <div className="flex justify-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={onToggleSelectAll}
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                                />
                            </div>
                        </th>
                        <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-12">#</th>
                        <th
                            className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors group/h"
                            onClick={() => handleSort('full_name')}
                        >
                            <div className="flex items-center gap-2">
                                Candidate
                                <span className="flex flex-col -gap-1 opacity-0 group-hover/h:opacity-100 transition-opacity">
                                    <ChevronUp className={`w-2.5 h-2.5 ${sortConfig.key === 'full_name' && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                    <ChevronDown className={`w-2.5 h-2.5 ${sortConfig.key === 'full_name' && sortConfig.direction === 'desc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center cursor-pointer hover:text-primary transition-colors group/h"
                            onClick={() => handleSort('screening_status')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                Screening
                                <span className="flex flex-col -gap-1 opacity-0 group-hover/h:opacity-100 transition-opacity">
                                    <ChevronUp className={`w-2.5 h-2.5 ${sortConfig.key === 'screening_status' && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                    <ChevronDown className={`w-2.5 h-2.5 ${sortConfig.key === 'screening_status' && sortConfig.direction === 'desc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center cursor-pointer hover:text-primary transition-colors group/h"
                            onClick={() => handleSort('role')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                Role
                                <span className="flex flex-col -gap-1 opacity-0 group-hover/h:opacity-100 transition-opacity">
                                    <ChevronUp className={`w-2.5 h-2.5 ${sortConfig.key === 'role' && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                    <ChevronDown className={`w-2.5 h-2.5 ${sortConfig.key === 'role' && sortConfig.direction === 'desc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center cursor-pointer hover:text-primary transition-colors group/h"
                            onClick={() => handleSort('experience_years')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                Experience
                                <span className="flex flex-col -gap-1 opacity-0 group-hover/h:opacity-100 transition-opacity">
                                    <ChevronUp className={`w-2.5 h-2.5 ${sortConfig.key === 'experience_years' && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                    <ChevronDown className={`w-2.5 h-2.5 ${sortConfig.key === 'experience_years' && sortConfig.direction === 'desc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center cursor-pointer hover:text-primary transition-colors group/h"
                            onClick={() => handleSort('created_at')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                Applied Date
                                <span className="flex flex-col -gap-1 opacity-0 group-hover/h:opacity-100 transition-opacity">
                                    <ChevronUp className={`w-2.5 h-2.5 ${sortConfig.key === 'created_at' && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                    <ChevronDown className={`w-2.5 h-2.5 ${sortConfig.key === 'created_at' && sortConfig.direction === 'desc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right cursor-pointer hover:text-primary transition-colors group/h"
                            onClick={() => handleSort('rating')}
                        >
                            <div className="flex items-center justify-end gap-2">
                                Grade
                                <span className="flex flex-col -gap-1 opacity-0 group-hover/h:opacity-100 transition-opacity">
                                    <ChevronUp className={`w-2.5 h-2.5 ${sortConfig.key === 'rating' && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                    <ChevronDown className={`w-2.5 h-2.5 ${sortConfig.key === 'rating' && sortConfig.direction === 'desc' ? 'text-primary opacity-100' : 'text-slate-300'}`} />
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length > 0 ? (
                        applications.map((app, index) => (
                            <tr
                                key={app.id}
                                onClick={() => onSelectCandidate(app)}
                                className={`group hover:bg-slate-50/80 cursor-pointer border-b last:border-none border-slate-50 transition-colors ${selectedIds.includes(app.id) ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                            >
                                <td className="px-4 py-5" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(app.id)}
                                            onChange={() => onToggleSelect(app.id)}
                                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="text-[11px] font-bold text-slate-300">{index + 1}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm mb-0.5">{app.full_name}</p>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[11px] font-medium text-slate-400">{app.email}</p>
                                                {app.screening_status && app.screening_status !== 'pending' && (
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${app.screening_status === 'screened_passed'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        {app.screening_status === 'screened_passed' ? 'Passed' : 'Failed'}
                                                    </span>
                                                )}
                                            </div>
                                            {app.phone_number && (
                                                <p className="text-[10px] font-bold text-slate-300 tracking-wider">
                                                    {app.phone_number}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        {userRole !== 'guest' ? (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'screened_passed')}
                                                    className={`p-1.5 rounded-lg transition-all ${app.screening_status === 'screened_passed'
                                                        ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                                                        : 'bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-500 border border-slate-100'
                                                        }`}
                                                    title="Pass Screening"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'screened_failed')}
                                                    className={`p-1.5 rounded-lg transition-all ${app.screening_status === 'screened_failed'
                                                        ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                                        : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-100'
                                                        }`}
                                                    title="Fail Screening"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        ) : (
                                            <span title="View Only" className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-300">
                                                <Lock className="w-3.5 h-3.5" />
                                            </span>
                                        )}
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
                                            onRate={userRole !== 'guest' ? (r) => handleRate(app.id, r) : undefined}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-8 py-20 text-center">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching candidates</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
