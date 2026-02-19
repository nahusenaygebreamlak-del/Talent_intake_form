import React from 'react';
import {
    Mail, Phone, User, Briefcase, GraduationCap,
    Linkedin, Globe, Share2, X, Eye
} from 'lucide-react';
import { Application } from '../types';
import { StarRating } from './StarRating';
import { supabase } from '../supabase';

interface CandidateProfileProps {
    application: Application;
    onClose: () => void;
    onRate: (rating: number) => void;
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({ application, onClose, onRate }) => {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [isLoadingUrl, setIsLoadingUrl] = React.useState(false);

    React.useEffect(() => {
        const generateUrl = async () => {
            if (!application.cv_file_path) {
                setPreviewUrl(null);
                return;
            }
            try {
                setIsLoadingUrl(true);
                const { data, error } = await supabase.storage
                    .from('cvs')
                    .createSignedUrl(application.cv_file_path, 3600);

                if (error) {
                    console.warn('Signed URL failed, using public fallback:', error.message);
                    const { data: publicData } = supabase.storage
                        .from('cvs')
                        .getPublicUrl(application.cv_file_path);

                    // Manually encode spaces if the library missed them
                    const encodedUrl = publicData.publicUrl.replace(/ /g, '%20');
                    setPreviewUrl(encodedUrl);
                } else if (data?.signedUrl) {
                    setPreviewUrl(data.signedUrl);
                }
            } catch (err) {
                console.error('Error auto-generating preview URL:', err);
                setPreviewUrl(null);
            } finally {
                setIsLoadingUrl(false);
            }
        };
        generateUrl();
    }, [application.cv_file_path]);

    const isPdf = application.cv_file_path?.toLowerCase().endsWith('.pdf');

    const handleShare = async () => {
        const url = new URL(window.location.href);
        url.searchParams.set('candidate', application.id);
        const shareUrl = url.toString();

        const shareData = {
            title: `Candidate: ${application.full_name}`,
            text: `Reviewing ${application.full_name} for the ${application.role} position.`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                alert('Profile link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy profile link:', err);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-scale-in flex flex-col print:shadow-none print:rounded-none print:w-full print:max-w-none print:relative print:overflow-visible">

                {/* Header - Hidden in Print */}
                <div className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between print:hidden">
                    <h2 className="text-xl font-bold text-slate-800">{application.full_name}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share Profile</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Layout Grid */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Column - Details */}
                    <div id="printable-profile" className="flex-1 p-10 overflow-y-auto print:p-0 print:overflow-visible border-r border-slate-100 no-scrollbar">
                        {/* Print-only Header */}
                        <div className="hidden print:flex items-center justify-between mb-10 pb-8 border-b-2 border-slate-100">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-1">{application.full_name}</h1>
                                <p className="text-xl text-primary font-bold">{application.role || 'Candidate Profile'}</p>
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
                                        <p className="text-sm font-bold text-primary truncate">{application.linkedin_url || '-'}</p>
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
                                        <p className="text-[10px) font-bold text-slate-400 uppercase tracking-tight mb-1.5">Experience Level</p>
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
                                <p className="text-sm font-bold text-primary break-all">{application.portfolio_url || 'No portfolio provided'}</p>
                            </section>
                        </div>

                        {/* Print Footer */}
                        <div className="hidden print:block mt-12 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            Generated by Afriwork Admin System • {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* Right Column - CV Live Preview */}
                    <div className="hidden lg:flex w-[60%] bg-slate-50 border-l border-slate-100 flex-col print:hidden">
                        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live CV Preview</span>
                            {previewUrl && (
                                <button
                                    onClick={() => window.open(previewUrl, '_blank')}
                                    className="text-[10px] font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                                >
                                    <Eye className="w-3 h-3" />
                                    Open Fullscreen
                                </button>
                            )}
                        </div>
                        <div className="flex-1 relative bg-slate-200/30">
                            {isLoadingUrl ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generating Secure Preview...</p>
                                    </div>
                                </div>
                            ) : previewUrl ? (
                                isPdf ? (
                                    <iframe
                                        key={previewUrl}
                                        src={`${previewUrl}#toolbar=0`}
                                        className="w-full h-full border-none"
                                        title="CV Preview"
                                        onError={() => console.error('Iframe failed to load')}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                            <Briefcase className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 mb-2">Live Preview Available for PDFs</p>
                                        <p className="text-xs text-slate-500 mb-6 max-w-[240px]">This file is not a PDF. Please use the button below to view or download it.</p>
                                        <button
                                            onClick={() => window.open(previewUrl, '_blank')}
                                            className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
                                        >
                                            Open / Download CV
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                                    <p className="text-sm font-bold text-red-400 mb-2 border-b-2 border-red-100 pb-2">Object Not Found</p>
                                    <p className="text-[10px] text-slate-500 max-w-xs">The file path in the database does not match any file in your Supabase storage bucket.</p>
                                    <p className="text-[10px] text-primary mt-4 font-bold">Try uploading a new test application.</p>
                                </div>
                            )}
                        </div>
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
