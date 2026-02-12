import { RoleType, SkillSet } from "./types";

export const ROLES: RoleType[] = [
  "Sales",
  "Accountant / Finance",
  "Marketing",
  "Admin / Secretary",
  "Operations",
  "Customer Service",
  "Supervisor / Manager",
  "Other"
];

export const EXPERIENCE_RANGES = ["0–1", "2–3", "4–6", "7+"];

export const EMPLOYMENT_STATUS = [
  "Yes (Full-time)",
  "Yes (Part-time)",
  "No",
  "Freelance / Contract"
];

export const START_DATES = [
  "Immediately",
  "Within 2 weeks",
  "Within 1 month",
  "1–3 months"
];

export const EDUCATION_LEVELS = [
  "Diploma",
  "Bachelor’s",
  "Master’s",
  "Other"
];

export const SALARY_RANGES = [
  "Under 8,000",
  "8,000–15,000",
  "15,000–25,000",
  "25,000+"
];

export const WORK_TYPES = ["On-site", "Hybrid", "Remote", "Any"];

export const ROLE_SKILLS: SkillSet = {
  "Sales": [
    "Lead generation", "Cold calling", "CRM usage", "Negotiation", 
    "Closing", "Client relationship management", "Reporting", "Team leadership"
  ],
  "Accountant / Finance": [
    "Bookkeeping", "Taxation", "Financial Reporting", "Excel/Spreadsheets",
    "Payroll Management", "Auditing", "Budgeting", "QuickBooks/Xero"
  ],
  "Marketing": [
    "SEO/SEM", "Content Creation", "Social Media Management", "Email Marketing",
    "Market Research", "Copywriting", "Analytics", "Brand Strategy"
  ],
  "Admin / Secretary": [
    "Office Management", "Scheduling", "Data Entry", "Communication",
    "Travel Arrangements", "Filing Systems", "Customer Greeting", "Event Planning"
  ],
  "Operations": [
    "Process Improvement", "Logistics", "Inventory Management", "Project Management",
    "Supply Chain", "Vendor Management", "Quality Control", "Team Coordination"
  ],
  "Customer Service": [
    "Conflict Resolution", "Active Listening", "Ticket Systems", "Phone Etiquette",
    "Product Knowledge", "Empathy", "Multitasking", "Live Chat Support"
  ],
  "Supervisor / Manager": [
    "Team Building", "Strategic Planning", "Performance Reviews", "Delegation",
    "Crisis Management", "Mentoring", "Budget Oversight", "KPI Tracking"
  ],
  "Other": [
    "Communication", "Problem Solving", "Time Management", "Adaptability",
    "Technical Skills", "Creativity", "Leadership", "Collaboration"
  ]
};

export const INITIAL_DATA = {
  fullName: "",
  phoneNumber: "",
  email: "",
  afriworkEmail: "",
  role: "",
  otherRoleSpecify: "",
  experienceYears: "",
  employmentStatus: "",
  startDate: "",
  educationLevel: "",
  topSkills: [],
  hasMeasurableAchievements: false,
  measurableAchievement: "",
  salaryRange: "",
  workType: "",
  cvFile: null,
  linkedInUrl: "",
  portfolioUrl: "",
  commitmentAgreed: false,
  priorityReason: ""
};
