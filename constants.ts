import { RoleType, SkillSet } from "./types";

export const ROLES: RoleType[] = [
  "Sales",
  "Accountant / Finance",
  "Marketing",
  "Admin / Secretary",
  "Operations",
  "Customer Service",
  "Supervisor / Manager",
  "IT / Digital Technology",
  "HR / Recruitment",
  "Creative / Design",
  "Logistics / Supply Chain",
  "Healthcare",
  "Hospitality",
  "Driving / Transport",
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

export const SCREENING_STATUSES = [
  { value: 'pending', label: 'No Screening Call' },
  { value: 'screened_passed', label: 'Screened - Passed' },
  { value: 'screened_failed', label: 'Screened - Failed' }
];

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
  "IT / Digital Technology": [
    "Software Development", "Network Administration", "Cybersecurity", "Cloud Computing (AWS/Azure)",
    "Database Management", "Technical Support", "Web Technologies", "IT Project Management"
  ],
  "HR / Recruitment": [
    "Talent Acquisition", "Employee Relations", "Performance Management", "Labor Law Compliance",
    "Onboarding", "Training & Development", "HRIS Management", "Policy Writing"
  ],
  "Creative / Design": [
    "Graphic Design", "UI/UX Design", "Video Editing", "Illustration",
    "Brand Identity", "Adobe Creative Suite", "Motion Graphics", "Photography"
  ],
  "Logistics / Supply Chain": [
    "Inventory Control", "Fleet Management", "Warehouse Management", "Procurement",
    "Freight Forwarding", "Distribution Planning", "Route Optimization", "Supply Chain Analytics"
  ],
  "Healthcare": [
    "Patient Care", "Medical Terminology", "First Aid/CPR", "Electronic Health Records",
    "Clinical Support", "Health & Safety Compliance", "Medical Research", "Public Health"
  ],
  "Hospitality": [
    "Guest Services", "Front Desk Operations", "Food & Beverage Management", "Event Coordination",
    "Housekeeping Management", "Reservation Systems", "Customer Loyalty", "Tourism Knowledge"
  ],
  "Driving / Transport": [
    "Defensive Driving", "Route Navigation", "Vehicle Maintenance", "Logistics Documentation",
    "Passenger Safety", "Heavy Vehicle Operation", "Time Management", "local Geography"
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
