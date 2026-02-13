import React from 'react';
import { LucideIcon, Check } from 'lucide-react';

// --- Types ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon | React.ElementType;
  placeholder?: string;
  type?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[] | readonly string[];
  error?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (value: string) => void;
  maxSelections?: number;
  error?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// --- Components ---

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg p-6 md:p-8 flex flex-col h-full overflow-y-auto no-scrollbar ${className}`}>
    {children}
  </div>
);

export const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
  </div>
);

export const InputField = ({ label, error, icon: Icon, className = "", ...props }: InputProps) => (
  <div className={`flex flex-col mb-4 ${className}`}>
    <label className="text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input
        className={`w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-primary/30'} bg-white focus:border-primary focus:ring-4 outline-none transition-all py-2.5 px-4 ${Icon ? 'pl-10' : ''} text-slate-800 placeholder-slate-400`}
        {...props}
      />
    </div>
    {error && <span className="text-red-500 text-xs mt-1 ml-1">{error}</span>}
  </div>
);

export const SelectField = ({ label, options, error, value, ...props }: SelectProps) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        className={`w-full appearance-none bg-white rounded-md border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-primary/30'} focus:border-primary focus:ring-4 outline-none transition-all py-2.5 px-4 text-slate-800`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
      </div>
    </div>
    {error && <span className="text-red-500 text-xs mt-1 ml-1">{error}</span>}
  </div>
);

export const RadioGroup = ({ label, name, options, value, onChange, error }: RadioGroupProps) => (
  <div className="mb-4">
    <label className="text-sm font-medium text-slate-700 mb-2 block ml-1">{label}</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const checked = value === opt;
        return (
          <label
            key={opt}
            className={`flex items-center p-3 rounded-md border cursor-pointer transition-all ${checked
              ? 'bg-white border-primary ring-1 ring-primary'
              : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
          >
            {/* Custom Radio Button Visual */}
            <div className={`flex items-center justify-center w-4 h-4 mr-3 rounded-full border transition-colors ${checked ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            <input
              type="radio"
              name={name}
              value={opt}
              checked={checked}
              onChange={(e) => onChange(e.target.value)}
              className="hidden" // Hide native input
            />
            <span className={`text-sm ${checked ? 'text-primary font-medium' : 'text-slate-600'}`}>
              {opt}
            </span>
          </label>
        );
      })}
    </div>
    {error && <span className="text-red-500 text-xs mt-1 ml-1">{error}</span>}
  </div>
);

export const MultiSelectChips = ({ label, options, selectedValues, onChange, maxSelections = 5, error }: CheckboxGroupProps) => (
  <div className="mb-4">
    <div className="flex justify-between items-end mb-2 ml-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <span className="text-xs text-slate-400">
        {selectedValues.length}/{maxSelections} selected
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selectedValues.includes(opt);
        const disabled = !isSelected && selectedValues.length >= maxSelections;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-all ${isSelected
              ? 'bg-primary text-white border-primary shadow-sm'
              : disabled
                ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
              }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
    {error && <span className="text-red-500 text-xs mt-1 ml-1">{error}</span>}
  </div>
);

export const FileUpload = ({
  label,
  onChange,
  fileName,
  accept = ".pdf,.doc,.docx",
  error,
  progress = 0,
  isUploading = false,
  uploadSuccess = false
}: {
  label: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  fileName?: string,
  accept?: string,
  error?: string,
  progress?: number,
  isUploading?: boolean,
  uploadSuccess?: boolean
}) => (
  <div className="mb-4">
    <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">{label}</label>
    <div className="flex flex-col items-center justify-center w-full">
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${error ? 'border-red-500 bg-red-50' : uploadSuccess ? 'border-accent bg-accent/5' : 'border-slate-300 bg-white hover:border-slate-400'} border-dashed rounded-md cursor-${isUploading ? 'not-allowed' : 'pointer'} transition-colors relative transition-all`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploadSuccess ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-semibold text-accent">Successfully Uploaded</p>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center w-full px-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent shadow-sm"></div>
                <span className="text-sm font-medium text-slate-600">Uploading CV...</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">{progress}% complete</p>
            </div>
          ) : (
            <>
              <svg className={`w-8 h-8 mb-3 ${error ? 'text-red-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className={`text-sm ${error ? 'text-red-500' : 'text-slate-500'}`}><span className="font-semibold">Click to upload</span> or drag and drop</p>
            </>
          )}
          <p className="text-xs text-slate-400 mt-1">{fileName ? `Selected: ${fileName}` : accept.replace(/,/g, ', ')}</p>
        </div>
        <input type="file" className="hidden" onChange={onChange} accept={accept} disabled={isUploading} />
      </label>
    </div>
    {error && <span className="text-red-500 text-xs mt-1 ml-1">{error}</span>}
  </div>
);