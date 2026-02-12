import React from 'react';
import {
    Mail, Phone, User, Briefcase, GraduationCap,
    Linkedin, Globe, Download, X
} from 'lucide-react';
import { Application } from '../types';
import { StarRating } from './StarRating';

interface CandidateProfileProps {
    application: Application;
    onClose: () => void;
    onRate: (rating: number) => void;
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({ application, onClose, onRate }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-scale-in print:shadow-none print:rounded-none print:w-full print:max-w-none print:relative print:overflow-visible">

                {/* Header - Hidden in Print */}
                <div className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between print:hidden">
                    <h2 className="text-xl font-bold text-slate-800">{application.full_name}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Download / Print"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Printable Content Area */}
                <div id="printable-profile" className="p-10 overflow-y-auto max-h-[80vh] print:max-h-none print:p-0 print:overflow-visible">

                    {/* Print-only Header */}
                    <div className="hidden print:flex items-center justify-between mb-10 pb-8 border-b-2 border-slate-100">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{application.full_name}</h1>
                            <p className="text-xl text-blue-600 font-bold">{application.role || 'Candidate Profile'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-slate-800">Afriwork Admin</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Candidate Dossier</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Internal Assessment Section */}
                        <section className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 print:border-none print:bg-white print:p-0 print:mb-8">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Internal Assessment</h3>
                            <div className="flex items-center justify-between">
                                <StarRating
                                    rating={application.rating}
                                    onRate={onRate}
                                />
                                <span className="text-xs font-bold text-slate-500">
                                    {application.rating ? `${application.rating} / 5 Stars` : 'Pending Review'}
                                </span>
                            </div>
                        </section>

                        {/* Contact Info Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <User className="w-4 h-4 text-slate-400 print:hidden" />
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-y-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Phone Number</p>
                                    <p className="text-sm font-bold text-slate-700">{application.phone_number}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Email Address</p>
                                    <p className="text-sm font-bold text-slate-700 truncate">{application.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Afriwork Email</p>
                                    <p className="text-sm font-bold text-slate-700">{application.afriwork_email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">LinkedIn Profile</p>
                                    <p className="text-sm font-bold text-blue-600 truncate">{application.linkedin_url || '-'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Professional Profile Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Briefcase className="w-4 h-4 text-slate-400 print:hidden" />
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience & Role</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-y-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Experience Level</p>
                                    <p className="text-sm font-bold text-slate-700">{application.experience_years}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Employment Status</p>
                                    <p className="text-sm font-bold text-slate-700">{application.employment_status}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Availability Date</p>
                                    <p className="text-sm font-bold text-slate-700">{application.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Work Preference</p>
                                    <p className="text-sm font-bold text-slate-700">{application.work_type}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Salary Expectation (ETB)</p>
                                    <p className="text-sm font-bold text-slate-700">{application.salary_range}</p>
                                </div>
                            </div>
                        </section>

                        {/* Skills & Achievements Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <GraduationCap className="w-4 h-4 text-slate-400 print:hidden" />
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skills & Achievements</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Education Level</p>
                                    <p className="text-sm font-bold text-slate-700">{application.education_level}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2">Top Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {application.top_skills && application.top_skills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200/50 print:bg-white print:border-slate-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {application.measurable_achievement && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1.5">Key Achievement</p>
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{application.measurable_achievement}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="col-span-2">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Portfolio Link</h3>
                            <p className="text-sm font-bold text-blue-600 break-all">{application.portfolio_url || 'No portfolio provided'}</p>
                        </section>
                    </div>

                    {/* Print Footer */}
                    <div className="hidden print:block mt-12 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        Generated by Afriwork Admin System • {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-profile, #printable-profile * {
                        visibility: visible;
                    }
                    #printable-profile {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        max-height: none;
                        padding: 0;
                        margin: 0;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </div>
    );
};
