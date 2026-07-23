import { useState, useRef } from 'react';
import { X, Check, Upload, ChevronLeft, ChevronRight, User, GraduationCap, FileText } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Employee } from '@/types';

const COMPANIES = [
  'Nippon Paint (Bangladesh) Private Limited',
  'Adrika Textile & Spinning Mills Ltd.',
  'Rotor Spinning Ltd (Pvt.)',
  'Adrika Group (Head Office)',
  'Adrika Weaving Ltd.',
];

const DEPARTMENTS = ['VAT', 'Utility', 'Store', 'Sales & Purchase', 'QA', 'D', 'Production', 'Operation', 'Maintenance', 'IT'];
const DESIGNATIONS = ['Manager', 'Assistant Manager', 'Officer', 'Supervisor', 'Operator', 'Helper', 'Technician'];
const NATIONALITIES = ['Bangladesh', 'India', 'Nepal', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];
const RELIGIONS = ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married'];
const SECTIONS = ['Knitting', 'Dyeing', 'Sewing', 'Finishing'];
const EMPLOYEE_GROUPS = ['General A', 'General B', 'Reliever', 'P/A'];
const EDUCATION_LEVELS = ['SSC', 'HSC', 'Diploma', 'Bachelor', 'Masters', 'PhD'];
const EXPERIENCE_FIELDS = ['Yes', 'No'];

type FormData = {
  // Step 1 - Basic Information
  employeeWorkerName: string;
  employeeId: string;
  fatherHusbandName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  religion: string;
  maritalStatus: string;
  nationality: string;
  nationalId: string;
  photo: string;
  // Step 2 - Educational Qualification & Experience
  educationLevel: string;
  institution: string;
  passingYear: string;
  result: string;
  experienceYears: string;
  previousCompany: string;
  previousDesignation: string;
  // Step 3 - Personal & Official Information
  joiningDate: string;
  presentPhone: string;
  permanentPhone: string;
  company: string;
  department: string;
  designation: string;
  hierarchy: string;
  section: string;
  employeeGroup: string;
  permanentAddress: string;
  presentAddress: string;
  email: string;
};

const STEPS = [
  { label: 'Basic Information', icon: User },
  { label: 'Educational Qualification & Experience', icon: GraduationCap },
  { label: 'Personal & Official Information', icon: FileText },
];

const emptyForm: FormData = {
  employeeWorkerName: '', employeeId: '', fatherHusbandName: '', motherName: '', dateOfBirth: '',
  gender: '', religion: '', maritalStatus: '', nationality: 'Bangladesh', nationalId: '', photo: '',
  educationLevel: '', institution: '', passingYear: '', result: '', experienceYears: '',
  previousCompany: '', previousDesignation: '',
  joiningDate: new Date().toISOString().slice(0, 10), presentPhone: '', permanentPhone: '',
  company: '', department: '', designation: '', hierarchy: '', section: '', employeeGroup: '',
  permanentAddress: '', presentAddress: '', email: '',
};

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`input ${value ? 'text-slate-800' : 'text-slate-400'}`}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1.5">{label}{required && <span className="text-rose-500"> *</span>}</span>
      {children}
    </label>
  );
}

export default function EmployeeOnboardingForm({ onClose }: { onClose: () => void }) {
  const { addEmployee } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [photoName, setPhotoName] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handlePhoto(file: File | null) {
    if (!file) return;
    if (file.size > 50 * 1024) {
      setPhotoError('File must be under 50 KB');
      setPhotoName('');
      set('photo', '');
      return;
    }
    setPhotoError('');
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => set('photo', reader.result as string);
    reader.readAsDataURL(file);
  }

  function validateStep(s: number): boolean {
    if (s === 0) {
      return !!(form.employeeWorkerName && form.employeeId && form.dateOfBirth && form.gender && form.religion && form.maritalStatus && form.nationality);
    }
    if (s === 1) {
      return !!(form.educationLevel && form.institution && form.passingYear && form.experienceYears);
    }
    return !!(form.joiningDate && form.presentPhone && form.company && form.department && form.designation);
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 2));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(2)) return;
    const newEmp: Employee = {
      id: `e${Date.now()}`,
      name: form.employeeWorkerName,
      email: form.email || `${form.employeeId}@adrikagroup.com`,
      phone: form.presentPhone,
      department: form.department,
      position: form.designation,
      joinDate: form.joiningDate,
      salary: 0,
      status: 'active',
      avatar: form.photo || form.employeeWorkerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      role: 'Employee',
      branch: 'b1',
      leaveBalance: 20,
    };
    addEmployee(newEmp);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Employee Onboarding</h2>
            <p className="text-xs text-slate-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const StepIcon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {done ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${active ? 'text-indigo-600' : done ? 'text-emerald-600' : 'text-slate-400'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-5 overflow-y-auto flex-1">
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Employee / Worker Name" required>
                    <input required value={form.employeeWorkerName} onChange={(e) => set('employeeWorkerName', e.target.value)} className="input" placeholder="Enter full name" />
                  </Field>
                  <Field label="Employee Id" required>
                    <input required value={form.employeeId} onChange={(e) => set('employeeId', e.target.value)} className="input" placeholder="EMP-001" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Father / Husband Name">
                    <input value={form.fatherHusbandName} onChange={(e) => set('fatherHusbandName', e.target.value)} className="input" placeholder="Father / Husband name" />
                  </Field>
                  <Field label="Mother's Name">
                    <input value={form.motherName} onChange={(e) => set('motherName', e.target.value)} className="input" placeholder="Mother's name" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Date Of Birth" required>
                    <input required type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} className="input" />
                  </Field>
                  <Field label="Gender" required>
                    <Select value={form.gender} onChange={(v) => set('gender', v)} options={GENDERS} placeholder="Select Gender" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Religion" required>
                    <Select value={form.religion} onChange={(v) => set('religion', v)} options={RELIGIONS} placeholder="Select Religion" />
                  </Field>
                  <Field label="Marital Status" required>
                    <Select value={form.maritalStatus} onChange={(v) => set('maritalStatus', v)} options={MARITAL_STATUSES} placeholder="Select Status" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nationality" required>
                    <Select value={form.nationality} onChange={(v) => set('nationality', v)} options={NATIONALITIES} placeholder="Select Nationality" />
                  </Field>
                  <Field label="National Id">
                    <input value={form.nationalId} onChange={(e) => set('nationalId', e.target.value)} className="input" placeholder="NID number" />
                  </Field>
                </div>
                <Field label="Photo — Max 50 kb">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handlePhoto(e.dataTransfer.files[0]); }}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                  >
                    {form.photo ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={form.photo} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-slate-200" />
                        <span className="text-xs text-slate-500">{photoName}</span>
                        <span className="text-xs text-indigo-500 font-medium">Click to change</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <Upload className="h-6 w-6 text-slate-300" />
                        <span className="text-xs text-slate-400">Drop a file here or click to choose</span>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)} />
                  </div>
                  {photoError && <p className="text-xs text-rose-500 mt-1.5">{photoError}</p>}
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Education Level" required>
                    <Select value={form.educationLevel} onChange={(v) => set('educationLevel', v)} options={EDUCATION_LEVELS} placeholder="Select Level" />
                  </Field>
                  <Field label="Institution" required>
                    <input required value={form.institution} onChange={(e) => set('institution', e.target.value)} className="input" placeholder="Institution name" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Passing Year" required>
                    <input required type="number" value={form.passingYear} onChange={(e) => set('passingYear', e.target.value)} className="input" placeholder="2020" />
                  </Field>
                  <Field label="Result / CGPA">
                    <input value={form.result} onChange={(e) => set('result', e.target.value)} className="input" placeholder="3.50 / A+" />
                  </Field>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Experience</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Previous Experience?" required>
                      <Select value={form.experienceYears} onChange={(v) => set('experienceYears', v)} options={EXPERIENCE_FIELDS} placeholder="Select" />
                    </Field>
                    <Field label="Years of Experience">
                      <input type="number" value={form.experienceYears === 'Yes' ? form.experienceYears : ''} onChange={(e) => set('experienceYears', e.target.value)} className="input" placeholder="0" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <Field label="Previous Company">
                      <input value={form.previousCompany} onChange={(e) => set('previousCompany', e.target.value)} className="input" placeholder="Company name" />
                    </Field>
                    <Field label="Previous Designation">
                      <input value={form.previousDesignation} onChange={(e) => set('previousDesignation', e.target.value)} className="input" placeholder="Last role" />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Joining Date" required>
                    <input required type="date" value={form.joiningDate} onChange={(e) => set('joiningDate', e.target.value)} className="input" />
                  </Field>
                  <Field label="Present Phone Number">
                    <input value={form.presentPhone} onChange={(e) => set('presentPhone', e.target.value)} className="input" placeholder="01XXXXXXXXX" />
                  </Field>
                </div>
                <Field label="Company" required>
                  <Select value={form.company} onChange={(v) => set('company', v)} options={COMPANIES} placeholder="Select Company" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Department" required>
                    <Select value={form.department} onChange={(v) => set('department', v)} options={DEPARTMENTS} placeholder="Select Department" />
                  </Field>
                  <Field label="Designation" required>
                    <Select value={form.designation} onChange={(v) => set('designation', v)} options={DESIGNATIONS} placeholder="Select Designation" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Hierarchy">
                    <input value={form.hierarchy} onChange={(e) => set('hierarchy', e.target.value)} className="input" placeholder="e.g. Level 3" />
                  </Field>
                  <Field label="Section">
                    <Select value={form.section} onChange={(v) => set('section', v)} options={SECTIONS} placeholder="Select Section" />
                  </Field>
                </div>
                <Field label="Employee Group">
                  <Select value={form.employeeGroup} onChange={(v) => set('employeeGroup', v)} options={EMPLOYEE_GROUPS} placeholder="Select Group" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Permanent Phone Number">
                    <input value={form.permanentPhone} onChange={(e) => set('permanentPhone', e.target.value)} className="input" placeholder="01XXXXXXXXX" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input" placeholder="name@company.com" />
                  </Field>
                </div>
                <Field label="Permanent Address">
                  <textarea value={form.permanentAddress} onChange={(e) => set('permanentAddress', e.target.value)} className="input" rows={2} placeholder="Village, Post, Thana, District" />
                </Field>
                <Field label="Present Address">
                  <textarea value={form.presentAddress} onChange={(e) => set('presentAddress', e.target.value)} className="input" rows={2} placeholder="Current address" />
                </Field>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50/50 rounded-b-xl">
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              {step > 0 && (
                <button type="button" onClick={prev} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}
            </div>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary flex items-center gap-1.5">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" className="btn-primary flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
