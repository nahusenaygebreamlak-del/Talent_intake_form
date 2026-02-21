import React, { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, Briefcase, GraduationCap, DollarSign,
  Linkedin, Globe, Upload, CheckCircle, ArrowRight, ArrowLeft, Check, UserCircle, LogOut, Settings
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import { FormData, Application, UserRole } from './types';
import {
  ROLES, EXPERIENCE_RANGES, EMPLOYMENT_STATUS, START_DATES,
  EDUCATION_LEVELS, SALARY_RANGES, WORK_TYPES, ROLE_SKILLS, INITIAL_DATA
} from './constants';
import {
  Card, SectionHeader, InputField, SelectField, RadioGroup,
  MultiSelectChips, FileUpload
} from './components/FormComponents';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginForm } from './components/LoginForm';
import { CandidateProfile } from './components/CandidateProfile';

import { supabase } from './supabase';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'admin' | 'login' | 'public-profile'>('form');
  const [publicCandidate, setPublicCandidate] = useState<Application | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  // Loading state
  const totalSteps = 6;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cvFilePath, setCvFilePath] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Check auth state and handle deep links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidateId = params.get('candidate');

    // Helper to fetch role from profiles table
    const fetchUserRole = async (userId: string) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        return (profile?.role as UserRole) ?? 'recruiter';
      } catch {
        return 'recruiter';
      }
    };

    // Handle deep links for public candidate profiles
    const handleDeepLink = async (id: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user.id).then(role => {
          setUserRole(role);
        });
        setCurrentView('admin');
      } else {
        try {
          const { data } = await supabase
            .from('job_applications')
            .select('*')
            .eq('id', id)
            .single();
          if (data) {
            setPublicCandidate(data);
            setCurrentView('public-profile');
          } else {
            setCurrentView('form');
          }
        } catch {
          setCurrentView('form');
        }
      }
      setAuthLoading(false);
    };

    if (candidateId) {
      handleDeepLink(candidateId);
    }

    // Use onAuthStateChange as the single source of truth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then(role => {
          setUserRole(role);
        });
      } else {
        setUserRole(null);
      }

      setAuthLoading(false);
    });

    // Explicitly check for session on mount to handle cases where onAuthStateChange might delay
    const initAuth = async () => {
      if (candidateId) {
        await handleDeepLink(candidateId);
      } else {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            fetchUserRole(session.user.id).then(role => {
              setUserRole(role);
            });
          }
        } catch (err) {
          console.error('[AUTH] Initial session check failed:', err);
        } finally {
          setAuthLoading(false);
        }
      }
    };

    initAuth();

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    console.log('[AUTH] Logout initiated');
    setShowProfileMenu(false);
    setCurrentView('form');
    setUser(null);
    setUserRole(null);

    try {
      await supabase.auth.signOut();
      console.log('[AUTH] Sign out complete');
    } catch (err) {
      console.error('[AUTH] Sign out error:', err);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
    setShowProfileMenu(false);
  };

  const updateData = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
    // Clear errors for fields being updated
    if (Object.keys(errors).length > 0) {
      const newErrors = { ...errors };
      Object.keys(fields).forEach(key => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  const validateStep = (stepIndex: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    switch (stepIndex) {
      case 0: // Basic Info
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email Address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        break;

      case 1: // Role & Experience
        if (!formData.role) newErrors.role = 'Please select your role';
        if (formData.role === 'Other' && !formData.otherRoleSpecify.trim()) {
          newErrors.otherRoleSpecify = 'Please specify your role';
        }
        if (!formData.experienceYears) newErrors.experienceYears = 'Please select your experience level';
        if (!formData.employmentStatus) newErrors.employmentStatus = 'Please select your current status';
        if (!formData.startDate) newErrors.startDate = 'Please select your availability';
        break;

      case 2: // Skills & Qualification
        if (!formData.educationLevel) newErrors.educationLevel = 'Please select your education level';
        if (formData.topSkills.length === 0) newErrors.topSkills = 'Select at least one skill';
        if (formData.hasMeasurableAchievements && !formData.measurableAchievement.trim()) {
          newErrors.measurableAchievement = 'Please describe your achievement';
        }
        break;

      case 3: // Compensation
        if (!formData.salaryRange) newErrors.salaryRange = 'Please select your salary range';
        if (!formData.workType) newErrors.workType = 'Please select your work preference';
        break;

      case 4: // Professional Presence
        if (!formData.cvFile) newErrors.cvFile = 'Please upload your CV';
        else if (isUploading) newErrors.cvFile = 'Upload in progress...';
        else if (!cvFilePath) newErrors.cvFile = 'Upload failed, please try again';
        break;

      case 5: // Commitment
        if (!formData.commitmentAgreed) newErrors.commitmentAgreed = 'You must agree to proceed';
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
        setErrors({});
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT BUTTON CLICKED ===');
    console.log('Current step:', currentStep);
    console.log('Validating step...');

    if (!validateStep(currentStep)) {
      console.log('Validation failed');
      return;
    }

    console.log('Validation passed, starting submission...');
    setIsSubmitting(true);

    try {
      // 1. CV is already uploaded
      if (!cvFilePath) {
        throw new Error("CV file is not uploaded yet.");
      }

      // 2. Insert record into database
      console.log('Inserting application into database...');
      const { error, data } = await supabase
        .from('job_applications')
        .insert([
          {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            email: formData.email,
            afriwork_email: formData.afriworkEmail,
            role: formData.role,
            other_role_specify: formData.otherRoleSpecify,
            experience_years: formData.experienceYears,
            employment_status: formData.employmentStatus,
            start_date: formData.startDate,
            education_level: formData.educationLevel,
            top_skills: formData.topSkills,
            has_measurable_achievements: formData.hasMeasurableAchievements,
            measurable_achievement: formData.measurableAchievement,
            salary_range: formData.salaryRange,
            work_type: formData.workType,
            linkedin_url: formData.linkedInUrl,
            portfolio_url: formData.portfolioUrl,
            priority_reason: formData.priorityReason,
            cv_file_path: cvFilePath,
          }
        ])
        .select();

      if (error) {
        console.error('Database insertion error:', error);
        throw new Error(`Failed to save application: ${error.message}`);
      }

      console.log('✅ Application saved successfully:', data);
      console.log('Setting isSubmitting to false...');
      setIsSubmitting(false);

      console.log('Setting isSubmitted to true...');
      // Use setTimeout to ensure state update happens in next tick
      setTimeout(() => {
        setIsSubmitted(true);
        console.log('✅✅✅ SUCCESS SCREEN SHOULD NOW BE VISIBLE ✅✅✅');
      }, 0);

    } catch (err: any) {
      console.error('❌ Submission error:', err);
      setIsSubmitting(false);
      const errorMessage = err.message || 'Unknown error occurred';
      alert(`Failed to submit application: ${errorMessage}`);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      const skills = prev.topSkills.includes(skill)
        ? prev.topSkills.filter(s => s !== skill)
        : [...prev.topSkills, skill];

      if (skills.length > 5) return prev;
      return { ...prev, topSkills: skills };
    });
    if (errors.topSkills) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.topSkills;
        return newErrors;
      });
    }
  };

  // Memoize steps to prevent re-rendering entire form on every keystroke
  // IMPORTANT: This must be called before any conditional returns to follow React's Rules of Hooks
  const steps = React.useMemo(() => [
    // SECTION 1: Basic Information
    <Card key="step1" className="w-full shrink-0">
      <SectionHeader
        title="Basic Information"
        subtitle="Let's get started with your contact details."
      />
      <div className="space-y-4">
        <InputField
          label="Full Name"
          placeholder="e.g. Abebe Bikila"
          icon={User}
          value={formData.fullName}
          onChange={e => updateData({ fullName: e.target.value })}
          error={errors.fullName}
        />
        <InputField
          label="Phone Number"
          type="tel"
          placeholder="+251 911 234 567"
          icon={Phone}
          value={formData.phoneNumber}
          onChange={e => updateData({ phoneNumber: e.target.value })}
          error={errors.phoneNumber}
        />
        <InputField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={e => updateData({ email: e.target.value })}
          error={errors.email}
        />
        <InputField
          label="Afriwork Profile Email"
          type="email"
          placeholder="If different from above"
          icon={Mail}
          value={formData.afriworkEmail}
          onChange={e => updateData({ afriworkEmail: e.target.value })}
          error={errors.afriworkEmail}
        />
      </div>
    </Card>,

    // SECTION 2: Role & Experience
    <Card key="step2" className="w-full shrink-0">
      <SectionHeader
        title="Role & Experience"
        subtitle="Tell us about your professional background."
      />
      <div className="space-y-4">
        <SelectField
          label="Category/Role"
          options={ROLES}
          value={formData.role}
          onChange={e => {
            updateData({ role: e.target.value, topSkills: [] });
          }}
          error={errors.role}
        />
        {formData.role === "Other" && (
          <InputField
            label="Specify Role"
            placeholder="Please specify your role"
            value={formData.otherRoleSpecify}
            onChange={e => updateData({ otherRoleSpecify: e.target.value })}
            error={errors.otherRoleSpecify}
          />
        )}
        <RadioGroup
          label="Years of Experience"
          name="experience"
          options={EXPERIENCE_RANGES}
          value={formData.experienceYears}
          onChange={val => updateData({ experienceYears: val })}
          error={errors.experienceYears}
        />
        <RadioGroup
          label="Current Employment Status"
          name="employed"
          options={EMPLOYMENT_STATUS}
          value={formData.employmentStatus}
          onChange={val => updateData({ employmentStatus: val })}
          error={errors.employmentStatus}
        />
        <SelectField
          label="Earliest Possible Start Date"
          options={START_DATES}
          value={formData.startDate}
          onChange={e => updateData({ startDate: e.target.value })}
          error={errors.startDate}
        />
      </div>
    </Card>,

    // SECTION 3: Skills & Qualification
    <Card key="step3" className="w-full shrink-0">
      <SectionHeader
        title="Skills & Qualification"
        subtitle="Highlight your expertise and achievements."
      />
      <div className="space-y-6">
        <SelectField
          label="Highest Education Level"
          options={EDUCATION_LEVELS}
          value={formData.educationLevel}
          onChange={e => updateData({ educationLevel: e.target.value })}
          error={errors.educationLevel}
        />

        {formData.role && (
          <MultiSelectChips
            label="Top Professional Skills (Select up to 5)"
            options={ROLE_SKILLS[formData.role] || ROLE_SKILLS['Other']}
            selectedValues={formData.topSkills}
            onChange={toggleSkill}
            maxSelections={5}
            error={errors.topSkills}
          />
        )}

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block ml-1">Do you have a measurable achievement?</label>
          <div className="flex gap-4 mb-3">
            <button
              onClick={() => updateData({ hasMeasurableAchievements: true })}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${formData.hasMeasurableAchievements ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Yes
            </button>
            <button
              onClick={() => updateData({ hasMeasurableAchievements: false })}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${!formData.hasMeasurableAchievements ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              No
            </button>
          </div>

          {formData.hasMeasurableAchievements && (
            <InputField
              label="Briefly state ONE measurable achievement"
              placeholder="e.g. Increased sales by 20% in Q3..."
              value={formData.measurableAchievement}
              onChange={e => updateData({ measurableAchievement: e.target.value })}
              error={errors.measurableAchievement}
            />
          )}
        </div>
      </div>
    </Card>,

    // SECTION 4: Compensation & Expectations
    <Card key="step4" className="w-full shrink-0">
      <SectionHeader
        title="Compensation"
        subtitle="Set your expectations clearly."
      />
      <div className="space-y-6">
        <RadioGroup
          label="Desired Net Monthly Salary (ETB)"
          name="salary"
          options={SALARY_RANGES}
          value={formData.salaryRange}
          onChange={val => updateData({ salaryRange: val })}
          error={errors.salaryRange}
        />
        <RadioGroup
          label="Work Preference"
          name="workType"
          options={WORK_TYPES}
          value={formData.workType}
          onChange={val => updateData({ workType: val })}
          error={errors.workType}
        />
      </div>
    </Card>,

    // SECTION 5: Professional Presence
    <Card key="step5" className="w-full shrink-0">
      <SectionHeader
        title="Professional Presence"
        subtitle="Upload your documents and links."
      />
      <div className="space-y-4">
        <FileUpload
          label="Upload Professional CV (PDF Preferred)"
          fileName={formData.cvFile?.name}
          error={errors.cvFile}
          progress={uploadProgress}
          isUploading={isUploading}
          uploadSuccess={!!cvFilePath}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              updateData({ cvFile: file });
              setCvFilePath(null);
              setIsUploading(true);
              setUploadProgress(10);

              try {
                const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

                // Simulate progress since standard upload doesn't provide it
                const progressInterval = setInterval(() => {
                  setUploadProgress(prev => (prev < 90 ? prev + 5 : prev));
                }, 200);

                const { error: uploadError } = await supabase.storage
                  .from('cvs')
                  .upload(fileName, file);

                clearInterval(progressInterval);

                if (uploadError) {
                  throw uploadError;
                }

                setUploadProgress(100);
                setCvFilePath(fileName);
                delete errors.cvFile;
              } catch (err) {
                console.error('CV Upload error:', err);
                setErrors(prev => ({ ...prev, cvFile: 'Failed to upload CV. Please try again.' }));
              } finally {
                setIsUploading(false);
              }
            }
          }}
        />
        <InputField
          label="LinkedIn Profile URL"
          icon={Linkedin}
          placeholder="https://linkedin.com/in/..."
          value={formData.linkedInUrl}
          onChange={e => updateData({ linkedInUrl: e.target.value })}
          error={errors.linkedInUrl}
        />
        <InputField
          label="Portfolio/Work Samples URL"
          icon={Globe}
          placeholder="https://myportfolio.com"
          value={formData.portfolioUrl}
          onChange={e => updateData({ portfolioUrl: e.target.value })}
          error={errors.portfolioUrl}
        />
      </div>
    </Card>,

    // SECTION 6: Commitment Filter
    <Card key="step6" className="w-full shrink-0">
      <SectionHeader
        title="Commitment"
        subtitle="Final check before we proceed."
      />
      <div className="space-y-6">
        <div>
          <div className={`p-4 rounded-lg border bg-slate-50 ${errors.commitmentAgreed ? 'border-red-200' : 'border-slate-200'}`}>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">If selected, are you willing to:</h3>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 mb-4">
              <li>Attend a short screening call?</li>
              <li>Provide references if requested?</li>
              <li>Keep your profile updated?</li>
            </ul>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.commitmentAgreed}
                onChange={e => updateData({ commitmentAgreed: e.target.checked })}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mr-3 ${formData.commitmentAgreed ? 'bg-primary border-primary' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                {formData.commitmentAgreed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
              <span className={`text-sm font-medium ${errors.commitmentAgreed ? 'text-red-600' : 'text-slate-800'}`}>I agree to be professional & responsive</span>
            </label>
          </div>
          {errors.commitmentAgreed && <span className="text-red-500 text-xs mt-1 ml-1">{errors.commitmentAgreed}</span>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">Why should we prioritize your application? (Optional)</label>
          <textarea
            className={`w-full rounded-lg border ${errors.priorityReason ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-primary focus:ring-primary/30'} bg-white focus:ring-4 outline-none transition-all py-3 px-4 text-slate-800 min-h-[120px] resize-none`}
            placeholder="Tell us what makes you unique..."
            value={formData.priorityReason}
            onChange={e => updateData({ priorityReason: e.target.value })}
          />
          {errors.priorityReason && <span className="text-red-500 text-xs mt-1 ml-1">{errors.priorityReason}</span>}
        </div>
      </div>
    </Card>
  ], [formData, errors]); // Dependencies for useMemo

  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Show login form if trying to access admin without auth
  if (currentView === 'login') {
    if (user && !authLoading) {
      setCurrentView('admin');
      return null;
    }
    return (
      <LoginForm
        onSuccess={() => setCurrentView('admin')}
        onCancel={() => setCurrentView('form')}
      />
    );
  }

  // Render admin dashboard if in admin view and authenticated
  if (currentView === 'admin') {
    if (!user && !authLoading) {
      setCurrentView('login');
      return null;
    }
    return <AdminDashboard onBackToForm={() => setCurrentView('form')} onLogout={handleLogout} userRole={userRole ?? 'guest'} />;
  }

  // Render public profile view
  if (currentView === 'public-profile' && publicCandidate) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans relative">
        <CandidateProfile
          application={publicCandidate}
          onClose={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('candidate');
            window.history.replaceState({}, '', url);
            setCurrentView('form');
          }}
          onRate={() => { }} // Public users cannot rate
        />
        {/* Simple return to form button if modal is closed or for accessibility */}
        {!publicCandidate && setCurrentView('form')}
      </div>
    );
  }

  // Check if submitted AFTER all hooks have been called
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-accent to-accent/80 rounded-full flex items-center justify-center mb-8 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Application Sent!</h2>
          <p className="text-slate-600 mb-10 text-lg leading-relaxed">
            Your journey with <span className="font-bold text-primary">Afriwork</span> starts here. We've received your profile and will be in touch soon.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(0);
                setFormData(INITIAL_DATA);
              }}
              className="inline-flex items-center px-10 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transform hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl active:scale-95"
            >
              Start New Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-6 font-sans">

      <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Afriwork</h1>
          <p className="text-slate-500 text-sm md:text-base">Talent Intake Form</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-accent block">Step {currentStep + 1} of {totalSteps}</span>
          <span className="text-xs text-slate-400">Complete all sections</span>
        </div>
      </div>

      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-3 left-2 right-2 h-1.5 bg-slate-200 rounded-full overflow-hidden z-10">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="overflow-hidden rounded-2xl shadow-2xl bg-white border border-slate-100/50">
          <div
            ref={containerRef}
            className="flex transition-transform duration-500 ease-in-out will-change-transform"
            style={{
              transform: `translateX(-${(currentStep * 100) / totalSteps}%)`,
              width: `${totalSteps * 100}%`
            }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="w-full"
                style={{ width: `${100 / totalSteps}%` }}
                // Accessibility: Hide off-screen steps from screen readers and tab order
                inert={currentStep !== index ? "true" : undefined}
                aria-hidden={currentStep !== index}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center px-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all ${currentStep === 0
              ? 'opacity-0 pointer-events-none'
              : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200'
              }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {currentStep === totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center px-8 py-3 rounded-xl bg-primary text-white shadow-lg hover:bg-primary-dark hover:shadow-primary/20 hover:-translate-y-0.5 transition-all font-semibold ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              {!isSubmitting && <CheckCircle className="w-4 h-4 ml-2" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={isUploading}
              className={`flex items-center px-8 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 hover:-translate-y-0.5 transition-all font-semibold ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Uploading...' : 'Next Step'}
              {!isUploading && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          )}
        </div>
      </div>

      {/* Settings Icon - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-14 h-14 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 hover:border-slate-300 transition-all"
          >
            <Settings className="w-6 h-6 text-slate-600" />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 -z-10"
                onClick={() => setShowProfileMenu(false)}
              />

              {/* Menu */}
              <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 min-w-[200px]">
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-slate-200 mb-2">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 rotate-180" />
                    Admin Login
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;