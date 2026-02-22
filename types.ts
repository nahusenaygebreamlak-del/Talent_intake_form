export interface FormData {
  // Section 1
  fullName: string;
  phoneNumber: string;
  email: string;
  afriworkEmail: string;

  // Section 2
  role: string;
  otherRoleSpecify?: string;
  experienceYears: string;
  employmentStatus: string;
  startDate: string;

  // Section 3
  educationLevel: string;
  topSkills: string[];
  hasMeasurableAchievements: boolean;
  measurableAchievement?: string;

  // Section 4
  salaryRange: string;
  workType: string;

  // Section 5 (File names or mock paths)
  cvFile: File | null;
  linkedInUrl: string;
  portfolioUrl: string;

  // Section 6
  commitmentAgreed: boolean;
  priorityReason: string;
}

export interface SectionProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
}

export type RoleType =
  | "Sales"
  | "Accountant / Finance"
  | "Marketing"
  | "Admin / Secretary"
  | "Operations"
  | "Customer Service"
  | "Supervisor / Manager"
  | "IT / Digital Technology"
  | "HR / Recruitment"
  | "Creative / Design"
  | "Logistics / Supply Chain"
  | "Healthcare"
  | "Hospitality"
  | "Driving / Transport"
  | "Other";

export interface SkillSet {
  [key: string]: string[];
}

// Admin Dashboard Types
export type UserRole = 'super_admin' | 'recruiter' | 'guest';
export type ScreeningStatus = 'pending' | 'screened_passed' | 'screened_failed';

export interface Application {
  id: string;
  created_at: string;
  full_name: string;
  phone_number: string;
  email: string;
  afriwork_email: string | null;
  role: string;
  other_role_specify: string | null;
  experience_years: string;
  employment_status: string;
  start_date: string;
  education_level: string;
  top_skills: string[];
  has_measurable_achievements: boolean;
  measurable_achievement: string | null;
  salary_range: string;
  work_type: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  priority_reason: string | null;
  cv_file_path: string | null;
  rating: number | null;
  screening_status: ScreeningStatus | null;
}

export interface FilterState {
  searchQuery: string;
  roles: string[];
  experienceYears: string[];
  educationLevel: string[];
  employmentStatus: string[];
  workType: string[];
  minRating: number[];
  screeningStatus: string[];
}
