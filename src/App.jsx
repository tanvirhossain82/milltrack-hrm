import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutGrid, Users, Building2, CalendarDays, Clock, Award, Calculator,
  Search, Plus, Pencil, Trash2, ChevronRight, ChevronLeft, ChevronDown, Check, X,
  Bell, UserPlus, Eye, KeyRound, Lock, LogOut, Loader2, Settings, Layers,
  Factory, UserCog, FileSpreadsheet, ChevronsRight, Wallet, Printer, RefreshCcw,
  SlidersHorizontal, PenLine, Copy, FileText, FileDown,
  Boxes, Tags, ClipboardList, Truck,
  Percent, FileClock, TimerReset, Gift, Receipt, HandCoins, Landmark, ClipboardCheck, FileBarChart2,
  TrendingUp, Rocket, History,
  UserX, CalendarClock, Sun, CalendarOff,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import companyLogo from "./assets/company-logo.png";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ------------------------------------------------------------------ */
/*  DESIGN PLAN                                                        */
/*  Subject: a mill-floor HR / payroll register for a garment group    */
/*  running several factories under one head office.                  */
/*  Palette:                                                           */
/*    navy   #16233F  (sidebar / deep structure)                       */
/*    steel  #274472  (sidebar hover / secondary ink)                  */
/*    amber  #E2A93B  (header band, brand mark, primary action)        */
/*    canvas #F4F6FA  (workspace background)                           */
/*    card   #FFFFFF                                                   */
/*    line   #E4E9F2                                                   */
/*    ink    #1C2333 / inkSoft #6B7688                                 */
/*    signal colors for stat cards: green/blue/slate/orange/violet     */
/*  Type: "Poppins" for display/brand + numerals, "Inter" for body/UI.  */
/*  Signature: the amber "mill-band" header + a company ribbon of      */
/*  factory cards on the dashboard (multi-unit group at a glance).     */
/* ------------------------------------------------------------------ */
const T = {
  navy: "#16233F",
  navySoft: "#1E2E52",
  steel: "#2B3E68",
  amber: "#E2A93B",
  amberDeep: "#C68F2C",
  canvas: "#F4F6FA",
  card: "#FFFFFF",
  line: "#E4E9F2",
  ink: "#1C2333",
  inkSoft: "#6B7688",
  green: "#2FA86A",
  blue: "#3D7DE0",
  slate: "#64748B",
  orange: "#E2793D",
  violet: "#7C6FE0",
  red: "#DD5555",
};

const DISPLAY_FONT = "'Poppins', 'Segoe UI', sans-serif";
const BODY_FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

function GoogleFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */
const COMPANIES = [
  {
    key: "nippon", name: "Nippon Paint (Bangladesh) Private Limited", short: "Nippon Paint",
    address: "Unit No: 501,503, (Sel Rose N Dale Apartment), Holding No:116, Village/Area: Kazi Nazrul Islam Avenue, Post office: Ramna, Post code: 1000, Upazila/Police Station: Ramna, District: Dhaka, Division: Dhaka, Country: BANGLADESH",
  },
  { key: "atsm", name: "Adrika Textile & Spinning Mills Ltd.", short: "ATSM" },
  { key: "rotor", name: "Rotor Spinning Ltd (Pvt.)", short: "Rotor" },
  { key: "ho", name: "Adrika Group (Head Office)", short: "H/O" },
  { key: "weave", name: "Adrika Weaving Ltd.", short: "Weave" },
];

const seedDepartments = [
  { id: 1, name: "VAT", code: "14" },
  { id: 2, name: "Utility", code: "13" },
  { id: 3, name: "Store", code: "12" },
  { id: 4, name: "Sales & Purchase", code: "11" },
  { id: 5, name: "QAD", code: "10" },
  { id: 6, name: "Production", code: "9" },
  { id: 7, name: "Operation", code: "8" },
  { id: 8, name: "Maintenance", code: "7" },
  { id: 9, name: "IT", code: "6" },
];

const seedEmployees = [
  { id: "21082061", name: "Aladin", joining: "2021-08-16", company: "atsm", department: "Production", designation: "Asst. Doffer", status: "Activated", phone: "017xxxxxxx1", grossSalary: 9500 },
  { id: "21050549", name: "Shahinur Begum", joining: "2021-05-05", company: "rotor", department: "Production", designation: "Helper", status: "Activated", phone: "017xxxxxxx2", grossSalary: 8500 },
  { id: "21082259", name: "Abdur Salam", joining: "2021-08-10", company: "atsm", department: "Production", designation: "Lineman", status: "Activated", phone: "017xxxxxxx3", grossSalary: 12000 },
  { id: "21082349", name: "Nila Akter", joining: "2021-08-23", company: "atsm", department: "Production", designation: "Operator", status: "Activated", phone: "017xxxxxxx4", grossSalary: 10500 },
  { id: "21081778", name: "Beauty", joining: "2021-09-06", company: "atsm", department: "Production", designation: "Helper", status: "Activated", phone: "017xxxxxxx5", grossSalary: 8500 },
  { id: "21081780", name: "Sarifa Akter", joining: "2021-09-06", company: "atsm", department: "Production", designation: "Helper", status: "Activated", phone: "017xxxxxxx6", grossSalary: 8500 },
  { id: "21060632", name: "Anower Hossain", joining: "2021-06-15", company: "rotor", department: "Electrical", designation: "Electrician", status: "Activated", phone: "017xxxxxxx7", grossSalary: 14500 },
  { id: "19080209", name: "Md. Mahmudul Hasan", joining: "2019-08-18", company: "rotor", department: "Electrical", designation: "Sr. Electrician", status: "Activated", phone: "017xxxxxxx8", grossSalary: 18000 },
];

const seedHolidays = [
  { id: 1, title: "Independence Day", date: "2026-03-26", type: "Government", status: "Active" },
  { id: 2, title: "Eid-ul-Fitr", date: "2026-03-20", type: "Government", status: "Active" },
  { id: 3, title: "Mill Founding Day", date: "2026-07-10", type: "Special", status: "Active" },
  { id: 4, title: "Weekly Off", date: "2026-07-24", type: "Government", status: "Active" },
];

const seedShifts = [
  { id: 1, name: "R/A", company: "rotor", inStart: "06:00", inEnd: "06:15", outStart: "14:00", outEnd: "15:00", hours: 8 },
  { id: 2, name: "R/B", company: "rotor", inStart: "14:00", inEnd: "14:15", outStart: "22:00", outEnd: "23:00", hours: 8 },
  { id: 3, name: "R/C", company: "rotor", inStart: "22:00", inEnd: "22:15", outStart: "06:00", outEnd: "07:00", hours: 8 },
];

const seedBonusTypes = [
  { id: 1, group: "Adrika Textile & Spinning Mills Ltd.", type: "Festival Bonus" },
  { id: 2, group: "Adrika Group (Head Office)", type: "Attendance Bonus" },
];

const seedGazettes = [
  { id: 1, effect: "2026-01", basicPct: 50, hrPct: 30, convValue: 0, convPct: 10, convFixed: false, medValue: 0, medPct: 10, medFixed: false },
];

const seedEmployeeGroups = [
  { id: 1, name: "General A", createdAt: "Aug 07, 2025 08:02:34 PM", updatedAt: "Aug 07, 2025 08:02:34 PM" },
  { id: 2, name: "General B", createdAt: "Aug 07, 2025 08:02:55 PM", updatedAt: "Aug 07, 2025 08:02:55 PM" },
  { id: 3, name: "Reliever", createdAt: "Aug 07, 2025 08:03:18 PM", updatedAt: "Aug 07, 2025 08:03:18 PM" },
  { id: 4, name: "P/A", createdAt: "Aug 07, 2025 08:03:34 PM", updatedAt: "Aug 07, 2025 08:03:34 PM" },
];

const seedProbationPeriods = [];

/* Global Setting — mirrors the reference software's "Global Setting" page.
   Some toggles are fully wired into the app (marked below); a few are kept
   as saved preferences only because there's no matching module yet (e.g. a
   General Store / OutWork module), and are labelled as "reserved" in the UI
   so nothing is silently ignored. */
const defaultGlobalSettings = {
  storeTitle: "",                 // reserved — no General Store module yet
  outworkDatePickerAllOpen: false, // reserved — no Out Work module yet
  summaryGrossSalaryGet: false,    // wired: Gross Salary column in Employee List
  fingerPrintAttendanceSheet: false, // reserved — no Attendance Sheet module yet
  cardNoInList: true,              // wired: Card No column in Employee List
  customFullId: true,              // wired: company-prefixed Full ID vs plain ID
  loginOption: false,              // wired: Admin/Employee login toggle on Login page
  attendanceChart: true,           // wired: show/hide attendance chart on Dashboard
  dashboardPreference: "default",  // wired: "default" | "company" dashboard layout
  lineNumber: true,                // wired: Line field on Employee form/list
  signature: true,                 // wired: Signature field on Employee form
  topbarColor: "#dfe2cd",          // wired: Topbar background color
};

const ROLE_PERMS = {
  Admin: ["Dashboard", "Employees", "Departments", "Holidays", "Shifts", "Bonus", "Gazette", "Payroll", "User Access", "Employee Group", "Probation Period", "Global Setting", "Assets Category", "Asset List", "Logistic Support"],
  "HR Manager": ["Dashboard", "Employees", "Departments", "Holidays", "Shifts", "Bonus", "Payroll", "Employee Group", "Probation Period", "Asset List", "Logistic Support"],
  Viewer: ["Dashboard", "Employees"],
};

/* Payroll Settings — defaults for the Payroll module's own settings page. */
const defaultPayrollSettings = {
  workingDaysPerMonth: 26,
  otRateMultiplier: 2,
  weeklyHours: 48,
  roundNetPay: true,
  autoAttendanceIntegration: true,
  bankAdviceNote: "Please credit the salary of the below-mentioned employees to their respective bank accounts.",
  payslipFooterNote: "This is a computer generated payslip and does not require a signature.",
  /* Attendance Import — sub-structure controlling how raw attendance      */
  /* punches are turned into payroll-ready figures.                       */
  attendanceImport: {
    late: {
      gracePeriodMinutes: 15,
      deductionType: "Per Occurrence",       // None | Per Minute | Per Occurrence | Half Day After Limit
      deductionRate: 100,
      maxLateBeforeHalfDay: 3,
    },
    absent: {
      deductionBasis: "Per Day Gross",       // Per Day Gross | Per Day Basic
      autoMarkCutoffTime: "12:00",
      consecutiveAbsentAsNoPayLeave: 3,
    },
    leave: {
      paidLeaveTypes: ["Casual", "Sick", "Earned"],
      unpaidDeductionBasis: "Per Day Gross", // Per Day Gross | Per Day Basic
      autoDeductUnpaidLeave: true,
    },
    holiday: {
      workOnHolidayMultiplier: 2,
      autoCountAsPresent: true,
      compensatoryOffEnabled: true,
    },
    weekend: {
      weekendDays: ["Friday"],
      workOnWeekendMultiplier: 1.5,
      autoCountAsPresent: true,
    },
  },
};

const seedUsers = [
  { id: 1, username: "admin", password: "admin123", name: "Mr. Admin", role: "Admin" },
  { id: 2, username: "hr.rahim", password: "hr12345", name: "Rahim Uddin", role: "HR Manager" },
];

const attendanceData = [
  { day: "1", present: 220, absent: 40 },
  { day: "5", present: 245, absent: 30 },
  { day: "10", present: 260, absent: 22 },
  { day: "15", present: 235, absent: 45 },
  { day: "20", present: 250, absent: 28 },
  { day: "25", present: 210, absent: 55 },
  { day: "30", present: 258, absent: 18 },
];

const recentLogins = [
  { name: "Durjoy Saha", time: "09:33 AM" },
  { name: "Mr. Admin", time: "09:43 AM" },
  { name: "Sudeb Roy", time: "10:15 AM" },
  { name: "Md. Ashikur Rahman", time: "12:09 PM" },
];

const latestNews = [
  { title: "Eid holiday notice published for all units", time: "2 days ago" },
  { title: "New attendance device installed at Rotor unit", time: "5 days ago" },
  { title: "Q3 bonus disbursement schedule confirmed", time: "1 week ago" },
];

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                    */
/* ------------------------------------------------------------------ */
const STORE_KEYS = {
  employees: "hrm2:employees",
  departments: "hrm2:departments",
  holidays: "hrm2:holidays",
  shifts: "hrm2:shifts",
  bonusTypes: "hrm2:bonusTypes",
  gazettes: "hrm2:gazettes",
  users: "hrm2:users",
  session: "hrm2:session",
  salarySheets: "hrm2:salarySheets",
  employeeGroups: "hrm2:employeeGroups",
  probationPeriods: "hrm2:probationPeriods",
  globalSettings: "hrm2:globalSettings",
  payrollRecords: "hrm2:payrollRecords",
  assetCategories: "hrm2:assetCategories",
  assets: "hrm2:assets",
  logisticSupport: "hrm2:logisticSupport",
  salaryStructures: "hrm2:salaryStructures",
  overtimeRecords: "hrm2:overtimeRecords",
  allowances: "hrm2:allowances",
  deductions: "hrm2:deductions",
  payrollBonuses: "hrm2:payrollBonuses",
  loans: "hrm2:loans",
  finalSettlements: "hrm2:finalSettlements",
  bankAccounts: "hrm2:bankAccounts",
  payrollSettings: "hrm2:payrollSettings",
  salaryRevisions: "hrm2:salaryRevisions",
};

async function storageGet(key) {
  try {
    const { data, error } = await supabase.from("hrm_kv").select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    return data ? data.value : null;
  } catch {
    return null;
  }
}
async function storageSet(key, value) {
  try {
    const { error } = await supabase.from("hrm_kv").upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch {
    /* best effort */
  }
}

/* Login session is per-browser only (not shared), so each person's own
   sign-in stays on their own device while everything else is shared. */
function sessionGet() {
  try {
    const raw = window.localStorage.getItem(STORE_KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function sessionSet(value) {
  try {
    window.localStorage.setItem(STORE_KEYS.session, JSON.stringify(value));
  } catch {
    /* best effort */
  }
}

function useSynced(key, seed, ready) {
  const [value, setValue] = useState(seed);
  useEffect(() => {
    if (!ready) return;
    storageSet(key, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ready]);
  return [value, setValue];
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */
function Panel({ title, right, children, pad = 18 }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 10, boxShadow: "0 1px 2px rgba(22,35,63,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${T.line}` }}>
        <span style={{ fontFamily: DISPLAY_FONT, fontSize: 14.5, letterSpacing: 0.2, color: T.ink, fontWeight: 600 }}>{title}</span>
        {right}
      </div>
      <div style={{ padding: pad }}>{children}</div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small, type = "button", disabled }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: small ? "6px 12px" : "9px 18px",
    fontSize: small ? 12 : 13, fontWeight: 600, letterSpacing: 0.1,
    border: "1px solid transparent", cursor: disabled ? "not-allowed" : "pointer", borderRadius: 7,
    fontFamily: BODY_FONT, opacity: disabled ? 0.5 : 1, transition: "filter .12s ease",
  };
  const variants = {
    primary: { background: T.amber, color: T.navy },
    navy: { background: T.navy, color: "#fff" },
    ghost: { background: "transparent", color: T.navy, borderColor: T.line },
    danger: { background: "transparent", color: T.red, borderColor: T.red },
    quiet: { background: T.canvas, color: T.ink, borderColor: T.line },
  };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.96)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}

function Field({ label, children, required }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, color: T.inkSoft, marginBottom: 5, letterSpacing: 0.2, fontWeight: 600 }}>
        {label} {required && <span style={{ color: T.red }}>*</span>}
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 11px", border: `1px solid ${T.line}`, borderRadius: 6,
  background: T.canvas, fontSize: 13.5, color: T.ink, fontFamily: BODY_FONT, boxSizing: "border-box", outline: "none",
};

function TInput(props) { return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
function TSelect({ children, ...props }) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>{children}</select>;
}

function StatCard({ label, value, accent, icon: Icon }) {
  return (
    <div style={{ background: T.card, borderRadius: 10, border: `1px solid ${T.line}`, borderTop: `3px solid ${accent}`, padding: "16px 18px", flex: 1, minWidth: 150, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: `${accent}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} strokeWidth={2} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontFamily: DISPLAY_FONT, fontWeight: 700, lineHeight: 1, color: T.ink }}>{value}</div>
        <div style={{ fontSize: 11, letterSpacing: 0.3, color: T.inkSoft, marginTop: 5 }}>{label}</div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "green" }) {
  const colors = { green: T.green, red: T.red, orange: T.orange, slate: T.slate, blue: T.blue };
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.2, color: "#fff", background: colors[tone], borderRadius: 20 }}>
      {children}
    </span>
  );
}

function IconBtn({ icon: Icon, onClick, tone = T.blue, title }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 27, height: 27, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 6, background: `${tone}1A`, color: tone, cursor: "pointer", marginRight: 5 }}>
      <Icon size={13} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Export toolbar — Copy / CSV / Excel / PDF, reused across list      */
/*  pages (Employee List, Payroll List, Group, Bonus Type, etc).       */
/* ------------------------------------------------------------------ */
function exportRows(headers, rows) {
  // rows: array of arrays (already stringified for display)
  return { headers, rows };
}

function toCsvValue(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function ExportBar({ title, headers, rows, filename = "export" }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    const text = [headers.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  const doCsv = () => {
    const text = [headers.map(toCsvValue).join(","), ...rows.map((r) => r.map(toCsvValue).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const doExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 28) || "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const doPdf = () => {
    const doc = new jsPDF({ orientation: headers.length > 6 ? "landscape" : "portrait" });
    doc.setFontSize(13);
    doc.text(title, 14, 14);
    autoTable(doc, {
      head: [headers], body: rows, startY: 20, styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 35, 63] },
    });
    doc.save(`${filename}.pdf`);
  };

  const doPrint = () => {
    const win = window.open("", "_blank", "width=900,height=650");
    if (!win) return;
    const tableHtml = `
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>`;
    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #16233F; }
            h2 { margin: 0 0 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d9d9d9; padding: 6px 8px; text-align: left; }
            th { background: #f4f6fa; text-transform: uppercase; font-size: 10.5px; letter-spacing: .3px; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          ${tableHtml}
        </body>
      </html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const buttons = [
    { label: copied ? "Copied!" : "Copy", icon: Copy, onClick: doCopy },
    { label: "CSV", icon: FileText, onClick: doCsv },
    { label: "Excel", icon: FileSpreadsheet, onClick: doExcel },
    { label: "PDF", icon: FileDown, onClick: doPdf },
    { label: "Print", icon: Printer, onClick: doPrint },
  ];

  return (
    <div style={{ display: "inline-flex", borderRadius: 6, overflow: "hidden", border: `1px solid ${T.line}` }}>
      {buttons.map((b, i) => (
        <button
          key={b.label}
          onClick={b.onClick}
          title={b.label}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px",
            fontSize: 12, fontWeight: 600, color: T.inkSoft, background: "#fff", cursor: "pointer",
            border: "none", borderLeft: i === 0 ? "none" : `1px solid ${T.line}`,
          }}
        >
          <b.icon size={12} /> {b.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Login                                                               */
/* ------------------------------------------------------------------ */
function Login({ users, onLogin, loginOption }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAs, setLoginAs] = useState("admin");

  const submit = (e) => {
    e.preventDefault();
    const u = users.find((x) => x.username === username.trim() && x.password === password);
    if (!u) { setError("Incorrect username or password."); return; }
    setError("");
    onLogin(u);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${T.navy}, ${T.navySoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BODY_FONT }}>
      <GoogleFonts />
      <form onSubmit={submit} style={{ background: T.card, width: 370, padding: "36px 34px", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <img src={companyLogo} alt="Nippon Paint" style={{ width: 64, height: "auto", margin: "0 auto 12px", display: "block" }} />
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 18, fontWeight: 800, color: T.ink, lineHeight: 1.3 }}>Nippon Paint (Bangladesh)<br />Private Limited</div>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: T.inkSoft, textTransform: "uppercase", marginTop: 6 }}>Workforce & Payroll Register</div>
        </div>
        {loginOption && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ k: "admin", l: "Admin / HR" }, { k: "employee", l: "Employee" }].map((o) => (
              <button
                type="button"
                key={o.k}
                onClick={() => setLoginAs(o.k)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 7, cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                  border: `1px solid ${loginAs === o.k ? T.amber : T.line}`,
                  background: loginAs === o.k ? T.amber : "transparent",
                  color: loginAs === o.k ? T.navy : T.inkSoft,
                }}
              >
                {o.l}
              </button>
            ))}
          </div>
        )}
        <Field label="Username" required>
          <TInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" autoFocus />
        </Field>
        <Field label="Password" required>
          <TInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        {error && <div style={{ color: T.red, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
        <Btn type="submit" variant="primary">
          <Lock size={13} /> Sign In
        </Btn>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${T.line}`, fontSize: 11.5, color: T.inkSoft, lineHeight: 1.7 }}>
          Demo — <b>admin / admin123</b> (Admin)<br />
          or <b>hr.rahim / hr12345</b> (HR Manager)
        </div>
        {!supabase && (
          <div style={{ marginTop: 12, padding: "9px 12px", background: "#FDF3E7", border: `1px solid ${T.amberDeep}`, borderRadius: 8, fontSize: 11, color: T.amberDeep, lineHeight: 1.6 }}>
            ⚠ Supabase কানেক্ট করা নেই — ডেটা এখনই স্থায়ীভাবে সেভ হবে না। README-এর সেটআপ ধাপ দেখুন।
          </div>
        )}
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav                                                                 */
/* ------------------------------------------------------------------ */
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid, perm: "Dashboard" },
  { key: "globalsettings", label: "Global Setting", icon: SlidersHorizontal, perm: "Global Setting" },
  { key: "employees", label: "Employees", icon: Users, perm: "Employees" },
  {
    key: "payroll", label: "Payroll", icon: Wallet, group: true,
    children: [
      { key: "salarystructure", label: "Salary Structure", icon: Percent, perm: "Payroll" },
      { key: "salarysetup", label: "Employee Salary Setup", icon: Wallet, perm: "Payroll" },
      { key: "attendanceintegration", label: "Attendance Integration", icon: FileClock, perm: "Payroll" },
      { key: "overtime", label: "Overtime", icon: TimerReset, perm: "Payroll" },
      { key: "allowance", label: "Allowance", icon: Gift, perm: "Payroll" },
      { key: "deduction", label: "Deduction", icon: Receipt, perm: "Payroll" },
      { key: "payrollbonus", label: "Bonus", icon: Award, perm: "Payroll" },
      { key: "loanadvance", label: "Loan & Advance", icon: HandCoins, perm: "Payroll" },
      { key: "monthlypayroll", label: "Monthly Payroll", icon: FileSpreadsheet, perm: "Payroll" },
      { key: "payslip", label: "Payslip", icon: Printer, perm: "Payroll" },
      { key: "bankadvice", label: "Bank Advice", icon: Landmark, perm: "Payroll" },
      { key: "finalsettlement", label: "Final Settlement", icon: ClipboardCheck, perm: "Payroll" },
      { key: "payrollreports", label: "Payroll Reports", icon: FileBarChart2, perm: "Payroll" },
      { key: "payrollsettings", label: "Payroll Settings", icon: Settings, perm: "Payroll" },
    ],
  },
  {
    key: "assets", label: "Assets", icon: Boxes, group: true,
    children: [
      { key: "assetcategory", label: "Assets Category", icon: Tags, perm: "Assets Category" },
      { key: "assetlist", label: "Asset List", icon: ClipboardList, perm: "Asset List" },
      { key: "logisticsupport", label: "Logistic Support", icon: Truck, perm: "Logistic Support" },
    ],
  },
  {
    key: "hrsetup", label: "HR Setup", icon: Settings, group: true,
    children: [
      { key: "departments", label: "Department", icon: Building2, perm: "Departments" },
      { key: "holidays", label: "Holiday Calendar", icon: CalendarDays, perm: "Holidays" },
      { key: "probation", label: "Probation Period", icon: UserCog, perm: "Probation Period" },
      { key: "group", label: "Employee Group", icon: Layers, perm: "Employee Group" },
      { key: "shifts", label: "Shifts", icon: Clock, perm: "Shifts" },
      { key: "bonus", label: "Bonus Type", icon: Award, perm: "Bonus" },
      { key: "gazette", label: "Gazette Calculation", icon: Calculator, perm: "Gazette" },
    ],
  },
  { key: "useraccess", label: "User Access", icon: KeyRound, perm: "User Access" },
];

function Sidebar({ view, setView, allowed }) {
  const [openGroup, setOpenGroup] = useState("payroll");
  return (
    <div style={{ width: 232, background: T.navy, color: "#fff", flexShrink: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
        <img src={companyLogo} alt="Nippon Paint" style={{ width: 34, height: "auto", flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>Nippon Paint</div>
          <div style={{ fontSize: 9.5, letterSpacing: 1.5, color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>HRM Suite</div>
        </div>
      </div>
      <div style={{ padding: "10px 0", flex: 1, overflowY: "auto" }}>
        {NAV.filter((n) => n.group || allowed.includes(n.perm)).map((n) => {
          if (n.group) {
            const kids = n.children.filter((c) => allowed.includes(c.perm));
            if (kids.length === 0) return null;
            const isOpen = openGroup === n.key;
            return (
              <div key={n.key}>
                <div onClick={() => setOpenGroup(isOpen ? "" : n.key)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", cursor: "pointer",
                  fontSize: 12.5, letterSpacing: 0.2, color: "rgba(255,255,255,0.65)", fontWeight: 600, textTransform: "uppercase",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}><n.icon size={15} strokeWidth={1.8} /> {n.label}</span>
                  <ChevronDown size={13} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
                </div>
                {isOpen && kids.map((c) => {
                  const active = view === c.key;
                  return (
                    <div key={c.key} onClick={() => setView(c.key)} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 20px 9px 46px", cursor: "pointer",
                      fontSize: 13, color: active ? T.navy : "rgba(255,255,255,0.82)",
                      background: active ? T.amber : "transparent", fontWeight: active ? 700 : 500,
                    }}>
                      <c.icon size={14} strokeWidth={1.8} />
                      {c.label}
                    </div>
                  );
                })}
              </div>
            );
          }
          const active = view === n.key;
          return (
            <div key={n.key} onClick={() => setView(n.key)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", cursor: "pointer",
              fontSize: 13.5, color: active ? T.navy : "rgba(255,255,255,0.88)",
              background: active ? T.amber : "transparent", fontWeight: active ? 700 : 500,
            }}>
              <n.icon size={16} strokeWidth={1.8} />
              {n.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Topbar({ title, user, onLogout, bgColor }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 26px", borderBottom: `1px solid ${T.line}`, background: bgColor || T.card }}>
      <div>
        <div style={{ fontFamily: DISPLAY_FONT, fontSize: 18, fontWeight: 700, color: T.ink }}>{title}</div>
        <div style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 2 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Bell size={18} color={T.inkSoft} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY_FONT, fontWeight: 700, color: T.navy, fontSize: 13 }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ fontSize: 12.5, color: T.ink }}>
            Welcome, <b>{user.name}</b>
            <span style={{ display: "block", fontSize: 10.5, color: T.inkSoft }}>{user.role}</span>
          </div>
        </div>
        <button onClick={onLogout} title="Sign out" style={{ background: "transparent", border: "none", cursor: "pointer", color: T.inkSoft, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                           */
/* ------------------------------------------------------------------ */
function Dashboard({ employees, settings = defaultGlobalSettings }) {
  const total = employees.length;
  const active = employees.filter((e) => e.status === "Activated").length;
  const showCompanyWise = settings.dashboardPreference !== "default";
  const showAttendanceChart = settings.attendanceChart;

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard label="Total Employee" value={total} accent={T.green} icon={Users} />
        <StatCard label="Present Today" value={active} accent={T.blue} icon={Check} />
        <StatCard label="Today Absent" value={total - active} accent={T.slate} icon={X} />
        <StatCard label="Today Leave" value={0} accent={T.orange} icon={CalendarDays} />
        <StatCard label="Out Of Work" value={0} accent={T.violet} icon={ChevronsRight} />
      </div>

      {showCompanyWise && (
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, color: T.inkSoft, textTransform: "uppercase", marginBottom: 10 }}>
            Company-wise overview
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {COMPANIES.map((c, i) => {
              const list = employees.filter((e) => e.company === c.key);
              const activeCount = list.filter((e) => e.status === "Activated").length;
              const barColors = [T.blue, T.green, T.orange, T.violet];
              return (
                <div key={c.key} style={{ flex: "1 1 200px", minWidth: 190, background: T.card, borderRadius: 10, border: `1px solid ${T.line}`, overflow: "hidden" }}>
                  <div style={{ background: barColors[i % barColors.length], color: "#fff", padding: "10px 14px", fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 13.5 }}>{c.short}</div>
                  <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <Row label="Total Employee" value={list.length} />
                    <Row label="Today Attended" value={activeCount} highlight />
                    <Row label="Today Leave" value={0} />
                    <Row label="Today Outwork" value={0} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {showAttendanceChart && (
          <div style={{ flex: 2, minWidth: 380 }}>
            <Panel title="Employee Attendance — Current Cycle">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={attendanceData}>
                  <CartesianGrid stroke={T.line} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.inkSoft }} axisLine={{ stroke: T.line }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: T.inkSoft }} axisLine={{ stroke: T.line }} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="present" name="Present" fill={T.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absent" fill={T.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 20 }}>
          <Panel title="Login Status">
            {recentLogins.map((l, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < recentLogins.length - 1 ? `1px solid ${T.line}` : "none", fontSize: 13 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, color: T.ink }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, display: "inline-block" }} />
                  {l.name}
                </span>
                <span style={{ color: T.inkSoft, fontSize: 11.5 }}>{l.time}</span>
              </div>
            ))}
          </Panel>
          <Panel title="New Employee">
            {employees.slice(0, 4).map((e) => (
              <div key={e.id} style={{ padding: "8px 0", borderBottom: `1px solid ${T.line}`, fontSize: 13 }}>
                <div style={{ fontWeight: 700, color: T.ink }}>{e.name}</div>
                <div style={{ color: T.inkSoft, fontSize: 11.5 }}>{e.department} · ID {e.id}</div>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260, maxWidth: 340 }}>
          <Panel title="Calendar">
            <MiniCalendar />
          </Panel>
        </div>
        <div style={{ flex: 2, minWidth: 300 }}>
          <Panel title="Latest News">
            {latestNews.map((n, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: i < latestNews.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: `${T.amber}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bell size={14} color={T.amberDeep} />
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("en-US", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ textAlign: "center", fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 13.5, color: T.ink, marginBottom: 12 }}>
        {monthName} {year}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: T.inkSoft }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          const isToday = d === today.getDate();
          return (
            <div
              key={i}
              style={{
                textAlign: "center", fontSize: 12, padding: "6px 0", borderRadius: 6,
                color: isToday ? "#fff" : d ? T.ink : "transparent",
                background: isToday ? T.amber : "transparent",
                fontWeight: isToday ? 700 : 500,
              }}
            >
              {d || "·"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
      <span style={{ color: T.inkSoft }}>{label}</span>
      <span style={{ fontWeight: 700, color: highlight ? T.green : T.ink }}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Employees: list + add wizard                                       */
/* ------------------------------------------------------------------ */
function companyName(key) {
  return COMPANIES.find((c) => c.key === key)?.name || key;
}

function fullEmployeeId(e) {
  const c = COMPANIES.find((x) => x.key === e.company);
  const prefix = (c?.short || "EMP").replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 4);
  return `${prefix}-${e.id}`;
}

function EmployeeList({ employees, departments, groups, onAdd, onDelete, canEdit, settings = defaultGlobalSettings }) {
  const [q, setQ] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [adding, setAdding] = useState(false);

  const filtered = employees.filter((e) =>
    (!q || e.name.toLowerCase().includes(q.toLowerCase()) || e.id.includes(q)) &&
    (!deptFilter || e.department === deptFilter) &&
    (!companyFilter || e.company === companyFilter)
  );

  if (adding) return <AddEmployeeWizard departments={departments} groups={groups} settings={settings} onCancel={() => setAdding(false)} onSave={(emp) => { onAdd(emp); setAdding(false); }} />;

  const cols = [
    "ID",
    "Name",
    "Joining Date",
    "Company",
    "Department",
    "Designation",
    ...(settings.cardNoInList ? ["Card No"] : []),
    ...(settings.summaryGrossSalaryGet ? ["Gross Salary"] : []),
    ...(settings.lineNumber ? ["Line"] : []),
    "Status",
    "",
  ];

  const exportHeaders = cols.slice(0, -1);
  const exportRowsData = filtered.map((e) => {
    const row = [settings.customFullId ? fullEmployeeId(e) : e.id, e.name, e.joining, companyName(e.company), e.department, e.designation];
    if (settings.cardNoInList) row.push(e.cardNo || "");
    if (settings.summaryGrossSalaryGet) row.push(e.grossSalary || "");
    if (settings.lineNumber) row.push(e.line || "");
    row.push(e.status);
    return row;
  });

  return (
    <div style={{ padding: 24 }}>
      <Panel title={`Employee List — Total ${employees.length}`} right={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ExportBar title="Employee List" headers={exportHeaders} rows={exportRowsData} filename="employee-list" />
          {canEdit && <Btn variant="primary" onClick={() => setAdding(true)}><UserPlus size={14} /> Add Employee</Btn>}
        </div>
      }>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: T.inkSoft }} />
            <TInput placeholder="Search by name or ID" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
          </div>
          <TSelect value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} style={{ maxWidth: 260 }}>
            <option value="">All Companies</option>
            {COMPANIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
          </TSelect>
          <TSelect value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </TSelect>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              {cols.map((h, i) => (
                <th key={`${h}-${i}`} style={{ padding: "9px 6px", fontSize: 11, letterSpacing: 0.3, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{settings.customFullId ? fullEmployeeId(e) : e.id}</td>
                <td style={{ padding: "10px 6px", fontWeight: 700, color: T.ink }}>{e.name}</td>
                <td style={{ padding: "10px 6px" }}>{e.joining}</td>
                <td style={{ padding: "10px 6px" }}>{companyName(e.company)}</td>
                <td style={{ padding: "10px 6px" }}>{e.department}</td>
                <td style={{ padding: "10px 6px" }}>{e.designation}</td>
                {settings.cardNoInList && <td style={{ padding: "10px 6px" }}>{e.cardNo || "—"}</td>}
                {settings.summaryGrossSalaryGet && <td style={{ padding: "10px 6px" }}>{e.grossSalary ? e.grossSalary.toLocaleString() : "—"}</td>}
                {settings.lineNumber && <td style={{ padding: "10px 6px" }}>{e.line || "—"}</td>}
                <td style={{ padding: "10px 6px" }}><Badge tone={e.status === "Activated" ? "green" : "red"}>{e.status}</Badge></td>
                <td style={{ padding: "10px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                  <IconBtn icon={Eye} tone={T.slate} title="View" />
                  {canEdit && <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" />}
                  {canEdit && <IconBtn icon={Trash2} tone={T.red} title="Delete" onClick={() => onDelete(e.id)} />}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={cols.length} style={{ padding: 24, textAlign: "center", color: T.inkSoft }}>No employees match this search.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function StepDot({ n, active, done, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${active || done ? T.amber : T.line}`, background: done ? T.amber : T.card, color: done ? T.navy : active ? T.amberDeep : T.inkSoft, fontWeight: 700, fontSize: 13 }}>
        {done ? <Check size={14} /> : n}
      </div>
      <div style={{ fontSize: 11, color: active || done ? T.ink : T.inkSoft, fontWeight: active ? 700 : 500, textAlign: "center" }}>{label}</div>
    </div>
  );
}

function AddEmployeeWizard({ departments, groups, onCancel, onSave, settings = defaultGlobalSettings }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    joining: "", company: COMPANIES[0].key, department: departments[0]?.name || "", designation: "",
    empId: "", name: "", hierarchy: "", phone: "", permAddress: "", permPhone: "",
    email: "", nationality: "Bangladesh", nationalId: "",
    fatherHusband: "", motherName: "", dob: "", gender: "", maritalStatus: "",
    religion: "", section: "", group: groups?.[0]?.name || "",
    employeeType: "", fingerPrintId: "", spouseName: "", mfsType: "", mfsNumber: "",
    facilities: "No Facilities", employmentStatus: "Permanent", cardNo: "", overtime: "Yes",
    height: "", weight: "", bloodGroup: "", emergencyName: "", relation: "", emergencyPhone: "",
    line: "", signature: "", grossSalary: "",
  });
  const [education, setEducation] = useState([{ id: 1, exam: "", cgpa: "", year: "", institute: "" }]);
  const [experience, setExperience] = useState([{ id: 1, company: "", designation: "", duration: "" }]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const steps = ["Basic Information", "Educational Qualification & Experience", "Personal & Official Information"];

  const addEduRow = () => setEducation([...education, { id: Date.now(), exam: "", cgpa: "", year: "", institute: "" }]);
  const removeEduRow = (id) => setEducation(education.filter((r) => r.id !== id));
  const setEduField = (id, k) => (e) => setEducation(education.map((r) => (r.id === id ? { ...r, [k]: e.target.value } : r)));

  const addExpRow = () => setExperience([...experience, { id: Date.now(), company: "", designation: "", duration: "" }]);
  const removeExpRow = (id) => setExperience(experience.filter((r) => r.id !== id));
  const setExpField = (id, k) => (e) => setExperience(experience.map((r) => (r.id === id ? { ...r, [k]: e.target.value } : r)));

  const save = () => {
    const id = form.empId.trim() || String(Date.now()).slice(-8);
    onSave({
      id, name: form.name || "Unnamed", joining: form.joining || "—", company: form.company,
      department: form.department, designation: form.designation || "—", status: "Activated", phone: form.phone,
      cardNo: form.cardNo, line: form.line, signature: form.signature,
      grossSalary: form.grossSalary ? Number(form.grossSalary) : undefined,
    });
  };

  const miniTableHeadStyle = { padding: "8px 6px", fontSize: 10.5, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}`, textAlign: "left" };
  const miniTableCellStyle = { padding: "6px", verticalAlign: "top" };

  return (
    <div style={{ padding: 24 }}>
      <Panel title="Add New Employee" right={<Btn variant="quiet" onClick={onCancel}><X size={14} /> Cancel</Btn>}>
        <div style={{ display: "flex", marginBottom: 26, gap: 4 }}>
          {steps.map((s, i) => <StepDot key={s} n={i + 1} label={s} active={step === i + 1} done={step > i + 1} />)}
        </div>
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <Field label="Joining Date" required><TInput type="date" value={form.joining} onChange={set("joining")} /></Field>
            <Field label="Present Phone Number"><TInput value={form.phone} onChange={set("phone")} placeholder="Present Phone Numbers" /></Field>
            <Field label="Company" required>
              <TSelect value={form.company} onChange={set("company")}>{COMPANIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}</TSelect>
            </Field>
            <Field label="Permanent Address"><textarea value={form.permAddress} onChange={set("permAddress")} placeholder="Present Address" rows={2} style={{ ...inputStyle, resize: "vertical" }} /></Field>
            <Field label="Department" required>
              <TSelect value={form.department} onChange={set("department")}>{departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}</TSelect>
            </Field>
            <Field label="Permanent Phone Number"><TInput value={form.permPhone} onChange={set("permPhone")} placeholder="Permanent Phone Numbers" /></Field>
            <Field label="Designation" required><TInput value={form.designation} onChange={set("designation")} placeholder="e.g. Line Operator" /></Field>
            <Field label="Email"><TInput type="email" value={form.email} onChange={set("email")} placeholder="Email" /></Field>
            <Field label="Employee Id"><TInput value={form.empId} onChange={set("empId")} placeholder="Given Id (blank = auto)" /></Field>
            <Field label="Nationality">
              <TSelect value={form.nationality} onChange={set("nationality")}><option>Bangladesh</option><option>India</option><option>Nepal</option><option>Other</option></TSelect>
            </Field>
            <Field label="Employee / Worker Name" required><TInput value={form.name} onChange={set("name")} placeholder="Employee/Worker Name" /></Field>
            <Field label="National Id"><TInput value={form.nationalId} onChange={set("nationalId")} placeholder="National Id" /></Field>
            <Field label="Hierarchy"><TInput value={form.hierarchy} onChange={set("hierarchy")} placeholder="Employee Hierarchy" /></Field>
            <Field label="Father / Husband Name"><TInput value={form.fatherHusband} onChange={set("fatherHusband")} placeholder="Father/Husband Name" /></Field>
            <Field label="Mother's Name"><TInput value={form.motherName} onChange={set("motherName")} placeholder="Mother's Name" /></Field>
            <Field label="Date Of Birth"><TInput type="date" value={form.dob} onChange={set("dob")} /></Field>
            <Field label="Gender">
              <TSelect value={form.gender} onChange={set("gender")}><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></TSelect>
            </Field>
            <Field label="Religion">
              <TSelect value={form.religion} onChange={set("religion")}><option value="">Select Religion</option><option>Islam</option><option>Hinduism</option><option>Christianity</option><option>Buddhism</option><option>Other</option></TSelect>
            </Field>
            <Field label="Marital Status">
              <TSelect value={form.maritalStatus} onChange={set("maritalStatus")}><option value="">Select Status</option><option>Single</option><option>Married</option></TSelect>
            </Field>
            <Field label="Section">
              <TSelect value={form.section} onChange={set("section")}><option value="">Select Section</option><option>Knitting</option><option>Dyeing</option><option>Sewing</option><option>Finishing</option></TSelect>
            </Field>
            <Field label="Employee Group">
              <TSelect value={form.group} onChange={set("group")}>
                <option value="">Select Group</option>
                {(groups || []).map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
              </TSelect>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Photo — Max 50 kb">
                <div style={{ border: `1.5px dashed ${T.line}`, borderRadius: 8, padding: "22px 14px", textAlign: "center", color: T.inkSoft, fontSize: 12.5, background: T.canvas }}>
                  <UserPlus size={20} style={{ marginBottom: 6, opacity: 0.6 }} />
                  <div>Drop a file here or click to choose</div>
                </div>
              </Field>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 10 }}>Educational Qualification</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, marginBottom: 8 }}>
              <thead><tr>
                <th style={{ ...miniTableHeadStyle, width: 34 }}>SL</th>
                <th style={miniTableHeadStyle}>Examination</th>
                <th style={miniTableHeadStyle}>CGPA / Number</th>
                <th style={miniTableHeadStyle}>Passing Year</th>
                <th style={miniTableHeadStyle}>Institute / Board</th>
                <th style={{ ...miniTableHeadStyle, width: 34 }}></th>
              </tr></thead>
              <tbody>
                {education.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                    <td style={miniTableCellStyle}>{i + 1}</td>
                    <td style={miniTableCellStyle}><TInput value={r.exam} onChange={setEduField(r.id, "exam")} /></td>
                    <td style={miniTableCellStyle}><TInput value={r.cgpa} onChange={setEduField(r.id, "cgpa")} /></td>
                    <td style={miniTableCellStyle}><TInput value={r.year} onChange={setEduField(r.id, "year")} /></td>
                    <td style={miniTableCellStyle}><TInput value={r.institute} onChange={setEduField(r.id, "institute")} /></td>
                    <td style={miniTableCellStyle}>{education.length > 1 && <IconBtn icon={X} tone={T.red} onClick={() => removeEduRow(r.id)} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Btn small variant="quiet" onClick={addEduRow}><Plus size={13} /> Add New</Btn>

            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, margin: "20px 0 10px", borderTop: `1px solid ${T.line}`, paddingTop: 16 }}>Experience</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, marginBottom: 8 }}>
              <thead><tr>
                <th style={{ ...miniTableHeadStyle, width: 34 }}>SL</th>
                <th style={miniTableHeadStyle}>Company Name</th>
                <th style={miniTableHeadStyle}>Designation</th>
                <th style={miniTableHeadStyle}>Duration</th>
                <th style={{ ...miniTableHeadStyle, width: 34 }}></th>
              </tr></thead>
              <tbody>
                {experience.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                    <td style={miniTableCellStyle}>{i + 1}</td>
                    <td style={miniTableCellStyle}><TInput value={r.company} onChange={setExpField(r.id, "company")} /></td>
                    <td style={miniTableCellStyle}><TInput value={r.designation} onChange={setExpField(r.id, "designation")} /></td>
                    <td style={miniTableCellStyle}><TInput value={r.duration} onChange={setExpField(r.id, "duration")} placeholder="e.g. 2 years" /></td>
                    <td style={miniTableCellStyle}>{experience.length > 1 && <IconBtn icon={X} tone={T.red} onClick={() => removeExpRow(r.id)} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Btn small variant="quiet" onClick={addExpRow}><Plus size={13} /> Add New</Btn>
          </div>
        )}
        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <Field label="Employee Type" required>
              <TSelect value={form.employeeType} onChange={set("employeeType")}>
                <option value="">Select Employee Type</option>
                <option>Production</option><option>Staff</option><option>Worker</option><option>Officer</option>
              </TSelect>
            </Field>
            <Field label="Finger Print ID"><TInput value={form.fingerPrintId} onChange={set("fingerPrintId")} placeholder="Finger Print ID" /></Field>
            <Field label="Spouse Name"><TInput value={form.spouseName} onChange={set("spouseName")} placeholder="Spouse Name" /></Field>
            <Field label="MFS Type">
              <TSelect value={form.mfsType} onChange={set("mfsType")}><option value="">Select Type</option><option>bKash</option><option>Nagad</option><option>Rocket</option></TSelect>
            </Field>
            <Field label="MFS Number"><TInput value={form.mfsNumber} onChange={set("mfsNumber")} placeholder="MFS" /></Field>
            <Field label="Facilities">
              <TSelect value={form.facilities} onChange={set("facilities")}>
                <option>Quarter Facilities</option><option>Transport Facilities</option><option>No Facilities</option>
              </TSelect>
            </Field>
            <Field label="Employment Status">
              <TSelect value={form.employmentStatus} onChange={set("employmentStatus")}><option>Permanent</option><option>Probation</option><option>Contractual</option><option>Temporary</option></TSelect>
            </Field>
            <Field label="Card No"><TInput value={form.cardNo} onChange={set("cardNo")} placeholder="Card No" /></Field>
            <Field label="Over Time">
              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <RadioDot label="Yes" color={T.green} checked={form.overtime === "Yes"} onClick={() => setForm({ ...form, overtime: "Yes" })} />
                <RadioDot label="No" color={T.slate} checked={form.overtime === "No"} onClick={() => setForm({ ...form, overtime: "No" })} />
              </div>
            </Field>
            <Field label="Blood Group">
              <TSelect value={form.bloodGroup} onChange={set("bloodGroup")}>
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => <option key={b}>{b}</option>)}
              </TSelect>
            </Field>
            <Field label="Height"><TInput value={form.height} onChange={set("height")} placeholder="cm" /></Field>
            <Field label="Weight"><TInput value={form.weight} onChange={set("weight")} placeholder="kg" /></Field>
            <Field label="Emergency Contact Name"><TInput value={form.emergencyName} onChange={set("emergencyName")} /></Field>
            <Field label="Relation"><TInput value={form.relation} onChange={set("relation")} placeholder="e.g. Father, Spouse" /></Field>
            <Field label="Emergency Phone"><TInput value={form.emergencyPhone} onChange={set("emergencyPhone")} /></Field>
            {settings.summaryGrossSalaryGet && (
              <Field label="Gross Salary"><TInput type="number" value={form.grossSalary} onChange={set("grossSalary")} placeholder="e.g. 12000" /></Field>
            )}
            {settings.lineNumber && (
              <Field label="Line"><TInput value={form.line} onChange={set("line")} placeholder="e.g. Line 3" /></Field>
            )}
            {settings.signature && (
              <Field label="Signature">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PenLine size={14} color={T.inkSoft} />
                  <TInput value={form.signature} onChange={set("signature")} placeholder="Type name to record signature on file" />
                </div>
              </Field>
            )}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.line}` }}>
          <Btn variant="quiet" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}><ChevronLeft size={14} /> Previous</Btn>
          {step < 3 ? <Btn variant="navy" onClick={() => setStep((s) => s + 1)}>Next <ChevronRight size={14} /></Btn> : <Btn variant="primary" onClick={save}>Save Employee</Btn>}
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Departments                                                        */
/* ------------------------------------------------------------------ */
function Departments({ departments, setDepartments }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const add = () => {
    if (!name.trim()) return;
    setDepartments([{ id: Date.now(), name: name.trim(), code: code || String(departments.length + 1) }, ...departments]);
    setName(""); setCode("");
  };
  const remove = (id) => setDepartments(departments.filter((d) => d.id !== id));
  return (
    <div style={{ padding: 24, display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        <Panel title="Add Department">
          <Field label="Department Name" required><TInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dyeing" /></Field>
          <Field label="Department Code"><TInput value={code} onChange={(e) => setCode(e.target.value)} placeholder="Auto if blank" /></Field>
          <Btn variant="primary" onClick={add}><Plus size={14} /> Save Department</Btn>
        </Panel>
      </div>
      <div style={{ flex: 2, minWidth: 340 }}>
        <Panel title={`Departments — ${departments.length}`}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ textAlign: "left" }}>
              {["Sl", "Department", "Code", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {departments.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={{ padding: "10px 6px", color: T.inkSoft }}>{i + 1}</td>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{d.name}</td>
                  <td style={{ padding: "10px 6px" }}>{d.code}</td>
                  <td style={{ padding: "10px 6px", textAlign: "right" }}><IconBtn icon={Trash2} tone={T.red} onClick={() => remove(d.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Employee Group                                                     */
/* ------------------------------------------------------------------ */
function nowStamp() {
  return new Date().toLocaleString("en-US", {
    month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
}

function EmployeeGroups({ groups, setGroups }) {
  const [q, setQ] = useState("");
  const [form, setForm] = useState(false); // false | "new" | group object being edited
  const [name, setName] = useState("");

  const openNew = () => { setForm("new"); setName(""); };
  const openEdit = (g) => { setForm(g); setName(g.name); };
  const closeForm = () => setForm(false);

  const save = () => {
    if (!name.trim()) return;
    if (form === "new") {
      setGroups([{ id: Date.now(), name: name.trim(), createdAt: nowStamp(), updatedAt: nowStamp() }, ...groups]);
    } else {
      setGroups(groups.map((g) => (g.id === form.id ? { ...g, name: name.trim(), updatedAt: nowStamp() } : g)));
    }
    setForm(false);
  };
  const remove = (id) => setGroups(groups.filter((g) => g.id !== id));
  const filtered = groups.filter((g) => !q || g.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {form && (
        <Panel title={form === "new" ? "Add Group" : "Edit Group"} right={<Btn variant="quiet" small onClick={closeForm}><X size={14} /> Cancel</Btn>}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Field label="Group Name" required><TInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. General A" /></Field>
            </div>
            <div style={{ marginBottom: 14 }}>
              <Btn variant="primary" onClick={save}><Plus size={14} /> Save</Btn>
            </div>
          </div>
        </Panel>
      )}
      <Panel title="Group" right={<Btn variant="primary" small onClick={openNew}><Plus size={14} /> Add Group</Btn>}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <ExportBar title="Group" headers={["Id", "Name", "Created At", "Updated At"]} rows={filtered.map((g) => [g.id, g.name, g.createdAt, g.updatedAt])} filename="employee-groups" />
          <div style={{ position: "relative", width: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: T.inkSoft }} />
            <TInput placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Id", "Name", "Created At", "Updated At", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{g.id}</td>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{g.name}</td>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{g.createdAt}</td>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{g.updatedAt}</td>
                <td style={{ padding: "10px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                  <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => openEdit(g)} />
                  <IconBtn icon={Trash2} tone={T.red} title="Delete" onClick={() => remove(g.id)} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No groups found.</td></tr>}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
          <Btn small variant="quiet" disabled>Previous</Btn>
          <Btn small variant="navy" disabled>1</Btn>
          <Btn small variant="quiet" disabled>Next</Btn>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Probation Period                                                   */
/* ------------------------------------------------------------------ */
function ProbationPeriod({ periods, setPeriods }) {
  const [form, setForm] = useState(false); // false | "new" | period object being edited
  const [company, setCompany] = useState(COMPANIES[0].key);
  const [months, setMonths] = useState("3");
  const [periodName, setPeriodName] = useState("");

  const openNew = () => { setForm("new"); setCompany(COMPANIES[0].key); setMonths("3"); setPeriodName(""); };
  const openEdit = (p) => { setForm(p); setCompany(p.company); setMonths(p.months); setPeriodName(p.periodName); };
  const closeForm = () => setForm(false);

  const save = () => {
    if (!periodName.trim()) return;
    if (form === "new") {
      setPeriods([{ id: Date.now(), company, months, periodName: periodName.trim(), createdAt: nowStamp(), updatedAt: nowStamp() }, ...periods]);
    } else {
      setPeriods(periods.map((p) => (p.id === form.id ? { ...p, company, months, periodName: periodName.trim(), updatedAt: nowStamp() } : p)));
    }
    setForm(false);
  };
  const remove = (id) => setPeriods(periods.filter((p) => p.id !== id));

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {form && (
        <Panel title={form === "new" ? "Add Probation Period" : "Edit Probation Period"} right={<Btn variant="quiet" small onClick={closeForm}><X size={14} /> Cancel</Btn>}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px", alignItems: "start" }}>
            <Field label="Company" required>
              <TSelect value={company} onChange={(e) => setCompany(e.target.value)}>{COMPANIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}</TSelect>
            </Field>
            <Field label="Period (Months)" required>
              <TInput type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="e.g. 3" />
            </Field>
            <Field label="Period Name" required>
              <TInput value={periodName} onChange={(e) => setPeriodName(e.target.value)} placeholder="e.g. Standard Probation" />
            </Field>
          </div>
          <Btn variant="primary" onClick={save}><Plus size={14} /> Save</Btn>
        </Panel>
      )}
      <Panel title="Probation Period" right={<Btn variant="primary" small onClick={openNew}><Plus size={14} /> Add Probation Period</Btn>}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 12.5, color: T.inkSoft, gap: 10, flexWrap: "wrap" }}>
          <ExportBar title="Probation Period" headers={["Id", "Company", "Period Month", "Period Name", "Created At", "Updated At"]} rows={periods.map((p) => [p.id, companyName(p.company), `${p.months} month(s)`, p.periodName, p.createdAt, p.updatedAt])} filename="probation-period" />
          <div style={{ position: "relative", width: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: T.inkSoft }} />
            <TInput placeholder="Search" style={{ paddingLeft: 32 }} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Id", "Company", "Period Month", "Period Name", "Created At", "Updated At", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{p.id}</td>
                <td style={{ padding: "10px 6px" }}>{companyName(p.company)}</td>
                <td style={{ padding: "10px 6px" }}>{p.months} month(s)</td>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{p.periodName}</td>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{p.createdAt}</td>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{p.updatedAt}</td>
                <td style={{ padding: "10px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                  <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => openEdit(p)} />
                  <IconBtn icon={Trash2} tone={T.red} title="Delete" onClick={() => remove(p.id)} />
                </td>
              </tr>
            ))}
            {periods.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No data available in table</td></tr>}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, fontSize: 12.5, color: T.inkSoft }}>
          <span>Showing {periods.length} of {periods.length} entries</span>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn small variant="quiet" disabled>Previous</Btn>
            <Btn small variant="quiet" disabled>Next</Btn>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Holiday Calendar (with month grid view)                            */
/* ------------------------------------------------------------------ */
function RadioDot({ checked, onClick, label, color }) {
  return (
    <label onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: T.ink, userSelect: "none" }}>
      <span style={{
        width: 16, height: 16, borderRadius: "50%", border: `2px solid ${checked ? (color || T.blue) : T.line}`,
        display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", flexShrink: 0,
      }}>
        {checked && <span style={{ width: 8, height: 8, borderRadius: "50%", background: color || T.blue }} />}
      </span>
      {label}
    </label>
  );
}

function TypePill({ label, checked, onClick, color }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 16px", borderRadius: 20,
      fontSize: 12.5, fontWeight: 700, border: `1.5px solid ${color}`, cursor: "pointer",
      background: checked ? color : "#fff", color: checked ? "#fff" : color,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: checked ? "#fff" : color }} />
      {label}
    </button>
  );
}

const WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const WEEKDAY_INDEX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

function HolidayCalendar({ holidays, setHolidays }) {
  const [company, setCompany] = useState(COMPANIES[0].key);
  const [dayType, setDayType] = useState("Single");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekday, setWeekday] = useState("Friday");
  const [type, setType] = useState("Government");
  const [status, setStatus] = useState("Active");
  const [cursor, setCursor] = useState(new Date(2026, 6, 1));
  const [view, setView] = useState("calendar");

  const add = () => {
    if (!title.trim()) return;
    if (dayType === "Weekly Holiday" && !weekday) return;
    if (dayType !== "Weekly Holiday" && !date) return;
    if (dayType === "Day To Day" && !endDate) return;
    setHolidays([...holidays, {
      id: Date.now(), company, dayType, title,
      date: dayType === "Weekly Holiday" ? "" : date,
      endDate: dayType === "Day To Day" ? endDate : "",
      weekday: dayType === "Weekly Holiday" ? weekday : "",
      type, status,
    }]);
    setTitle(""); setDate(""); setEndDate("");
  };
  const remove = (id) => setHolidays(holidays.filter((h) => h.id !== id));
  const sorted = [...holidays].sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const pad = (n) => String(n).padStart(2, "0");

  const holidayByDate = {};
  holidays.forEach((h) => {
    if (h.dayType === "Weekly Holiday" && h.weekday) {
      for (let d = 1; d <= daysInMonth; d++) {
        if (new Date(year, month, d).getDay() === WEEKDAY_INDEX[h.weekday]) {
          holidayByDate[`${year}-${pad(month + 1)}-${pad(d)}`] = h;
        }
      }
    } else if (h.dayType === "Day To Day" && h.date && h.endDate) {
      let cur = new Date(h.date);
      const end = new Date(h.endDate);
      while (cur <= end) {
        holidayByDate[`${cur.getFullYear()}-${pad(cur.getMonth() + 1)}-${pad(cur.getDate())}`] = h;
        cur.setDate(cur.getDate() + 1);
      }
    } else if (h.date) {
      holidayByDate[h.date] = h;
    }
  });

  return (
    <div style={{ padding: 24, display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <Panel title="Holiday Create">
          <Field label="Company">
            <TSelect value={company} onChange={(e) => setCompany(e.target.value)}>
              {COMPANIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
            </TSelect>
          </Field>
          <Field label="Holiday Day Type">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {["Single", "Day To Day", "Weekly Holiday"].map((o) => (
                <RadioDot key={o} label={o} checked={dayType === o} onClick={() => setDayType(o)} />
              ))}
            </div>
          </Field>
          <Field label="Holiday Title" required>
            <TInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Victory Day" />
          </Field>
          {dayType === "Weekly Holiday" ? (
            <Field label="Weekday" required>
              <TSelect value={weekday} onChange={(e) => setWeekday(e.target.value)}>
                {WEEKDAYS.map((d) => <option key={d}>{d}</option>)}
              </TSelect>
            </Field>
          ) : (
            <Field label={dayType === "Day To Day" ? "Start Date" : "Date"} required>
              <TInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          )}
          {dayType === "Day To Day" && (
            <Field label="End Date" required>
              <TInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Field>
          )}
          <Field label="Holiday Type">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <TypePill label="Government" color={T.red} checked={type === "Government"} onClick={() => setType("Government")} />
              <TypePill label="Special" color={T.amberDeep} checked={type === "Special"} onClick={() => setType("Special")} />
            </div>
          </Field>
          <Field label="Status">
            <div style={{ display: "flex", gap: 16 }}>
              <RadioDot label="Active" color={T.green} checked={status === "Active"} onClick={() => setStatus("Active")} />
              <RadioDot label="In active" color={T.slate} checked={status === "In active"} onClick={() => setStatus("In active")} />
            </div>
          </Field>
          <Btn variant="primary" onClick={add}><Plus size={14} /> Save Holiday</Btn>
        </Panel>
      </div>
      <div style={{ flex: 2, minWidth: 380 }}>
        <Panel
          title="Holiday Calendar"
          right={
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small variant={view === "calendar" ? "navy" : "quiet"} onClick={() => setView("calendar")}>Calendar</Btn>
              <Btn small variant={view === "list" ? "navy" : "quiet"} onClick={() => setView("list")}>List</Btn>
            </div>
          }
        >
          {view === "calendar" ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <button onClick={() => setCursor(new Date(year, month - 1, 1))} style={{ border: "none", background: T.canvas, borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}><ChevronLeft size={14} /></button>
                <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, color: T.ink }}>{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
                <button onClick={() => setCursor(new Date(year, month + 1, 1))} style={{ border: "none", background: T.canvas, borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}><ChevronRight size={14} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} style={{ fontSize: 10.5, fontWeight: 700, color: T.inkSoft, textAlign: "center", padding: "4px 0", textTransform: "uppercase" }}>{d}</div>
                ))}
                {cells.map((d, i) => {
                  const dateStr = d ? `${year}-${pad(month + 1)}-${pad(d)}` : null;
                  const h = dateStr ? holidayByDate[dateStr] : null;
                  return (
                    <div key={i} style={{
                      minHeight: 54, borderRadius: 7, padding: 6, fontSize: 12,
                      background: h ? (h.type === "Government" ? `${T.red}17` : `${T.amber}22`) : T.canvas,
                      border: `1px solid ${T.line}`, color: d ? T.ink : "transparent",
                    }}>
                      <div style={{ fontWeight: 600 }}>{d || ""}</div>
                      {h && <div style={{ fontSize: 9.5, color: h.type === "Government" ? T.red : T.amberDeep, fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>{h.title}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ textAlign: "left" }}>
                {["Company", "When", "Title", "Type", "Status", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {sorted.map((h) => (
                  <tr key={h.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                    <td style={{ padding: "10px 6px", color: T.inkSoft }}>{h.company ? companyName(h.company) : "—"}</td>
                    <td style={{ padding: "10px 6px", color: T.inkSoft }}>
                      {h.dayType === "Weekly Holiday" ? `Every ${h.weekday}` : h.dayType === "Day To Day" ? `${h.date} → ${h.endDate}` : h.date}
                    </td>
                    <td style={{ padding: "10px 6px", fontWeight: 700 }}>{h.title}</td>
                    <td style={{ padding: "10px 6px" }}><Badge tone={h.type === "Government" ? "red" : "orange"}>{h.type}</Badge></td>
                    <td style={{ padding: "10px 6px" }}><Badge tone={h.status === "In active" ? "slate" : "green"}>{h.status || "Active"}</Badge></td>
                    <td style={{ padding: "10px 6px", textAlign: "right" }}><IconBtn icon={Trash2} tone={T.red} onClick={() => remove(h.id)} /></td>
                  </tr>
                ))}
                {sorted.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No holidays scheduled yet.</td></tr>}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shifts                                                              */
/* ------------------------------------------------------------------ */
function Shifts({ shifts, setShifts }) {
  const [form, setForm] = useState({ name: "", company: COMPANIES[1].key, inStart: "", inEnd: "", outStart: "", outEnd: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const hoursBetween = (a, b) => {
    if (!a || !b) return 0;
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);
    let mins = (bh * 60 + bm) - (ah * 60 + am);
    if (mins < 0) mins += 24 * 60;
    return +(mins / 60).toFixed(2);
  };
  const add = () => {
    if (!form.name.trim() || !form.inStart || !form.outStart) return;
    setShifts([...shifts, { id: Date.now(), ...form, hours: hoursBetween(form.inStart, form.outStart) }]);
    setForm({ name: "", company: COMPANIES[1].key, inStart: "", inEnd: "", outStart: "", outEnd: "" });
  };
  const remove = (id) => setShifts(shifts.filter((s) => s.id !== id));
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <Panel title="Add Shift">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0 16px", alignItems: "end" }}>
          <Field label="Shift Name" required><TInput value={form.name} onChange={set("name")} placeholder="e.g. R/A" /></Field>
          <Field label="Company">
            <TSelect value={form.company} onChange={set("company")}>{COMPANIES.map((c) => <option key={c.key} value={c.key}>{c.short}</option>)}</TSelect>
          </Field>
          <Field label="In Time — Start" required><TInput type="time" value={form.inStart} onChange={set("inStart")} /></Field>
          <Field label="In Time — End"><TInput type="time" value={form.inEnd} onChange={set("inEnd")} /></Field>
          <Field label="Out Time — Start" required><TInput type="time" value={form.outStart} onChange={set("outStart")} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", maxWidth: 220 }}>
          <Field label="Out Time — End"><TInput type="time" value={form.outEnd} onChange={set("outEnd")} /></Field>
        </div>
        <Btn variant="primary" onClick={add}><Plus size={14} /> Save Shift</Btn>
      </Panel>
      <Panel title={`Shift Roster — ${shifts.length}`}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Shift", "Company", "In", "Out", "Total Hours", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{s.name}</td>
                <td style={{ padding: "10px 6px" }}>{COMPANIES.find((c) => c.key === s.company)?.short || s.company}</td>
                <td style={{ padding: "10px 6px" }}>{s.inStart} – {s.inEnd || "—"}</td>
                <td style={{ padding: "10px 6px" }}>{s.outStart} – {s.outEnd || "—"}</td>
                <td style={{ padding: "10px 6px" }}>{s.hours}</td>
                <td style={{ padding: "10px 6px", textAlign: "right" }}><IconBtn icon={Trash2} tone={T.red} onClick={() => remove(s.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bonus Types                                                         */
/* ------------------------------------------------------------------ */
function BonusTypes({ bonusTypes, setBonusTypes }) {
  const [group, setGroup] = useState(COMPANIES[0].name);
  const [type, setType] = useState("");
  const add = () => {
    if (!type.trim()) return;
    setBonusTypes([...bonusTypes, { id: Date.now(), group, type }]);
    setType("");
  };
  const remove = (id) => setBonusTypes(bonusTypes.filter((b) => b.id !== id));
  return (
    <div style={{ padding: 24, display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        <Panel title="Add Bonus Type">
          <Field label="Company Group">
            <TSelect value={group} onChange={(e) => setGroup(e.target.value)}>{COMPANIES.map((c) => <option key={c.key} value={c.name}>{c.name}</option>)}</TSelect>
          </Field>
          <Field label="Bonus Type" required><TInput value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Eid Bonus" /></Field>
          <Btn variant="primary" onClick={add}><Plus size={14} /> Save</Btn>
        </Panel>
      </div>
      <div style={{ flex: 2, minWidth: 340 }}>
        <Panel title="Bonus Types" right={<ExportBar title="Bonus Types" headers={["Sl", "Group", "Bonus Type"]} rows={bonusTypes.map((b, i) => [i + 1, b.group, b.type])} filename="bonus-types" />}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ textAlign: "left" }}>
              {["Sl", "Group", "Bonus Type", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {bonusTypes.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={{ padding: "10px 6px", color: T.inkSoft }}>{i + 1}</td>
                  <td style={{ padding: "10px 6px" }}>{b.group}</td>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{b.type}</td>
                  <td style={{ padding: "10px 6px", textAlign: "right" }}><IconBtn icon={Trash2} tone={T.red} onClick={() => remove(b.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gazette Calculation                                                 */
/* ------------------------------------------------------------------ */
function GazetteCalc({ gazettes, setGazettes }) {
  const [form, setForm] = useState({ effect: "", basicPct: "", hrPct: "", convValue: "", convPct: "", convFixed: false, medValue: "", medPct: "", medFixed: false });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (k) => () => setForm({ ...form, [k]: !form[k] });
  const add = () => {
    if (!form.effect) return;
    setGazettes([{ id: Date.now(), ...form }, ...gazettes]);
    setForm({ effect: "", basicPct: "", hrPct: "", convValue: "", convPct: "", convFixed: false, medValue: "", medPct: "", medFixed: false });
  };
  const remove = (id) => setGazettes(gazettes.filter((g) => g.id !== id));
  const fmt = (v) => (v === "" || v === undefined ? "—" : `Gross * ${v}%`);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <Panel title="New Gazette Formula">
        <div style={{ marginBottom: 12, maxWidth: 220 }}>
          <Field label="Effect Date (YYYY-MM)" required><TInput value={form.effect} onChange={set("effect")} placeholder="2026-08" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0 16px" }}>
          <Field label="Basic — Gross %"><TInput value={form.basicPct} onChange={set("basicPct")} placeholder="50" /></Field>
          <Field label="House Rent — Gross %"><TInput value={form.hrPct} onChange={set("hrPct")} placeholder="30" /></Field>
          <Field label={<span>Conveyance — Gross % <label style={{ marginLeft: 6, fontWeight: 400 }}><input type="checkbox" checked={form.convFixed} onChange={toggle("convFixed")} /> Fixed</label></span>}>
            {form.convFixed
              ? <TInput value={form.convValue} onChange={set("convValue")} placeholder="Fixed amount" />
              : <TInput value={form.convPct} onChange={set("convPct")} placeholder="10" />}
          </Field>
          <Field label={<span>Medical — Gross % <label style={{ marginLeft: 6, fontWeight: 400 }}><input type="checkbox" checked={form.medFixed} onChange={toggle("medFixed")} /> Fixed</label></span>}>
            {form.medFixed
              ? <TInput value={form.medValue} onChange={set("medValue")} placeholder="Fixed amount" />
              : <TInput value={form.medPct} onChange={set("medPct")} placeholder="10" />}
          </Field>
        </div>
        <Btn variant="primary" onClick={add}><Plus size={14} /> Save Formula</Btn>
      </Panel>
      <Panel title={`Gazette Formulas — ${gazettes.length}`}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Effect Date", "Basic", "House Rent", "Conveyance", "Medical", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {gazettes.map((g) => (
              <tr key={g.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{g.effect}</td>
                <td style={{ padding: "10px 6px" }}>{fmt(g.basicPct)}</td>
                <td style={{ padding: "10px 6px" }}>{fmt(g.hrPct)}</td>
                <td style={{ padding: "10px 6px" }}>{g.convFixed ? `Fixed ${g.convValue || 0}` : fmt(g.convPct)}</td>
                <td style={{ padding: "10px 6px" }}>{g.medFixed ? `Fixed ${g.medValue || 0}` : fmt(g.medPct)}</td>
                <td style={{ padding: "10px 6px", textAlign: "right" }}><IconBtn icon={Trash2} tone={T.red} onClick={() => remove(g.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  User Access                                                         */
/* ------------------------------------------------------------------ */
function UserAccess({ users, setUsers, currentUser }) {
  const [form, setForm] = useState({ username: "", password: "", name: "", role: "HR Manager" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const add = () => {
    if (!form.username.trim() || !form.password.trim() || !form.name.trim()) return;
    setUsers([...users, { id: Date.now(), ...form }]);
    setForm({ username: "", password: "", name: "", role: "HR Manager" });
  };
  const remove = (id) => {
    if (id === currentUser.id) return;
    setUsers(users.filter((u) => u.id !== id));
  };
  return (
    <div style={{ padding: 24, display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <Panel title="Add User">
          <Field label="Full Name" required><TInput value={form.name} onChange={set("name")} /></Field>
          <Field label="Username" required><TInput value={form.username} onChange={set("username")} /></Field>
          <Field label="Password" required><TInput type="text" value={form.password} onChange={set("password")} /></Field>
          <Field label="Role">
            <TSelect value={form.role} onChange={set("role")}>
              {Object.keys(ROLE_PERMS).map((r) => <option key={r} value={r}>{r}</option>)}
            </TSelect>
          </Field>
          <Btn variant="primary" onClick={add}><Plus size={14} /> Create User</Btn>
        </Panel>
        <div style={{ marginTop: 18 }}>
          <Panel title="Role Permissions">
            {Object.entries(ROLE_PERMS).map(([role, perms]) => (
              <div key={role} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, marginBottom: 4 }}>{role}</div>
                <div style={{ fontSize: 11.5, color: T.inkSoft }}>{perms.join(" · ")}</div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
      <div style={{ flex: 2, minWidth: 340 }}>
        <Panel title={`System Users — ${users.length}`}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ textAlign: "left" }}>
              {["Name", "Username", "Role", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{u.name} {u.id === currentUser.id && <Badge tone="orange">You</Badge>}</td>
                  <td style={{ padding: "10px 6px" }}>{u.username}</td>
                  <td style={{ padding: "10px 6px" }}><Badge tone={u.role === "Admin" ? "green" : "blue"}>{u.role}</Badge></td>
                  <td style={{ padding: "10px 6px", textAlign: "right" }}>
                    {u.id !== currentUser.id && <IconBtn icon={Trash2} tone={T.red} onClick={() => remove(u.id)} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Salary                                                              */
/*  Two panes: Salary Setup (assign gross salary per employee) and      */
/*  Monthly Salary Sheet (generate payable using the active gazette     */
/*  formula + attendance days, persisted per company + month).         */
/* ------------------------------------------------------------------ */
function currentMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function gazetteFor(month, gazettes) {
  const applicable = gazettes.filter((g) => g.effect <= month).sort((a, b) => b.effect.localeCompare(a.effect));
  return applicable[0] || gazettes[0] || null;
}

function breakupOf(gross, g) {
  const G = Number(gross) || 0;
  if (!g) return { basic: 0, houseRent: 0, conveyance: 0, medical: 0 };
  const pct = (p) => +(G * (Number(p) || 0) / 100).toFixed(2);
  return {
    basic: pct(g.basicPct),
    houseRent: pct(g.hrPct),
    conveyance: g.convFixed ? Number(g.convValue) || 0 : pct(g.convPct),
    medical: g.medFixed ? Number(g.medValue) || 0 : pct(g.medPct),
  };
}

function EmployeeSalarySetup({ employees, setEmployees, gazettes, revisions, setRevisions, canEdit }) {
  const [tab, setTab] = useState("wise");

  const addRevision = (rec) => setRevisions([{ id: Date.now(), date: new Date().toISOString().slice(0, 10), ...rec }, ...revisions]);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn variant={tab === "wise" ? "navy" : "quiet"} onClick={() => setTab("wise")}><Wallet size={14} /> Employee Wise Salary</Btn>
        <Btn variant={tab === "history" ? "navy" : "quiet"} onClick={() => setTab("history")}><History size={14} /> Salary Revision History</Btn>
        <Btn variant={tab === "increment" ? "navy" : "quiet"} onClick={() => setTab("increment")}><TrendingUp size={14} /> Increment</Btn>
        <Btn variant={tab === "promotion" ? "navy" : "quiet"} onClick={() => setTab("promotion")}><Rocket size={14} /> Promotion Salary Update</Btn>
      </div>
      {tab === "wise" && <EmployeeWiseSalary employees={employees} setEmployees={setEmployees} gazettes={gazettes} canEdit={canEdit} addRevision={addRevision} />}
      {tab === "history" && <SalaryRevisionHistory revisions={revisions} />}
      {tab === "increment" && <IncrementForm employees={employees} setEmployees={setEmployees} canEdit={canEdit} addRevision={addRevision} />}
      {tab === "promotion" && <PromotionSalaryUpdate employees={employees} setEmployees={setEmployees} canEdit={canEdit} addRevision={addRevision} />}
    </div>
  );
}

function EmployeeWiseSalary({ employees, setEmployees, gazettes, canEdit, addRevision }) {
  const [q, setQ] = useState("");
  const [edited, setEdited] = useState({});
  const month = currentMonthStr();
  const gz = gazetteFor(month, gazettes);

  const filtered = employees.filter((e) => !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.id.includes(q));

  const setDraft = (id, val) => setEdited({ ...edited, [id]: val });
  const save = (id) => {
    const val = edited[id];
    if (val === undefined || val === "") return;
    const emp = employees.find((e) => e.id === id);
    const oldSalary = emp?.grossSalary || 0;
    setEmployees(employees.map((e) => (e.id === id ? { ...e, grossSalary: Number(val) } : e)));
    if (emp && Number(val) !== oldSalary) {
      addRevision({ employeeId: emp.id, employeeName: emp.name, type: "Manual Update", oldSalary, newSalary: Number(val), note: "Updated from Employee Wise Salary" });
    }
    const next = { ...edited };
    delete next[id];
    setEdited(next);
  };

  return (
    <Panel
      title={`Employee Wise Salary — ${employees.length} employees`}
      right={<div style={{ fontSize: 11.5, color: T.inkSoft }}>Active formula: <b style={{ color: T.ink }}>{gz ? gz.effect : "none set"}</b></div>}
    >
      <div style={{ marginBottom: 16, maxWidth: 320 }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: T.inkSoft }} />
          <TInput placeholder="Search by name or ID" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            {["ID", "Name", "Designation", "Basic", "House Rent", "Conveyance", "Medical", "Gross Salary", canEdit ? "" : null].filter(Boolean).map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => {
            const b = breakupOf(e.grossSalary || 0, gz);
            const draft = edited[e.id];
            return (
              <tr key={e.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "9px 6px", color: T.inkSoft }}>{e.id}</td>
                <td style={{ padding: "9px 6px", fontWeight: 700 }}>{e.name}</td>
                <td style={{ padding: "9px 6px" }}>{e.designation}</td>
                <td style={{ padding: "9px 6px" }}>{b.basic.toLocaleString()}</td>
                <td style={{ padding: "9px 6px" }}>{b.houseRent.toLocaleString()}</td>
                <td style={{ padding: "9px 6px" }}>{b.conveyance.toLocaleString()}</td>
                <td style={{ padding: "9px 6px" }}>{b.medical.toLocaleString()}</td>
                <td style={{ padding: "9px 6px" }}>
                  {canEdit ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <TInput
                        type="number"
                        value={draft !== undefined ? draft : e.grossSalary || ""}
                        onChange={(ev) => setDraft(e.id, ev.target.value)}
                        style={{ width: 100, padding: "5px 8px" }}
                      />
                      {draft !== undefined && draft !== String(e.grossSalary) && (
                        <IconBtn icon={Check} tone={T.green} title="Save" onClick={() => save(e.id)} />
                      )}
                    </div>
                  ) : (
                    <b>{(e.grossSalary || 0).toLocaleString()}</b>
                  )}
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No employees match this search.</td></tr>}
        </tbody>
      </table>
      {!gz && <div style={{ marginTop: 14, fontSize: 12.5, color: T.orange }}>No Gazette formula found — add one under HR Setup → Gazette Calculation so Basic/House Rent/Conveyance/Medical can be computed.</div>}
    </Panel>
  );
}

function SalaryRevisionHistory({ revisions }) {
  const [q, setQ] = useState("");
  const filtered = revisions.filter((r) => !q || r.employeeName?.toLowerCase().includes(q.toLowerCase()));

  return (
    <Panel
      title={`Salary Revision History — ${filtered.length}`}
      right={
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <ExportBar
            title="Salary Revision History"
            headers={["Date", "Employee", "Type", "Old Salary", "New Salary", "Change", "Note"]}
            rows={filtered.map((r) => [r.date, r.employeeName, r.type, r.oldSalary || 0, r.newSalary || 0, (r.newSalary || 0) - (r.oldSalary || 0), r.note || ""])}
            filename="salary-revision-history"
          />
          <div style={{ position: "relative", minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 9, color: T.inkSoft }} />
            <TInput placeholder="Search employee" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
          </div>
        </div>
      }
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ textAlign: "left" }}>
          {["Date", "Employee", "Type", "Old Salary", "New Salary", "Change", "Note"].map((h) => (
            <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {filtered.map((r) => {
            const change = (Number(r.newSalary) || 0) - (Number(r.oldSalary) || 0);
            return (
              <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "9px 6px", color: T.inkSoft }}>{r.date}</td>
                <td style={{ padding: "9px 6px", fontWeight: 700 }}>{r.employeeName}</td>
                <td style={{ padding: "9px 6px" }}><Badge tone={r.type === "Promotion" ? "blue" : r.type === "Increment" ? "green" : "slate"}>{r.type}</Badge></td>
                <td style={{ padding: "9px 6px" }}>৳ {Number(r.oldSalary || 0).toLocaleString()}</td>
                <td style={{ padding: "9px 6px", fontWeight: 700 }}>৳ {Number(r.newSalary || 0).toLocaleString()}</td>
                <td style={{ padding: "9px 6px", color: change >= 0 ? T.green : T.red, fontWeight: 700 }}>{change >= 0 ? "+" : ""}৳ {change.toLocaleString()}</td>
                <td style={{ padding: "9px 6px", color: T.inkSoft }}>{r.note || "—"}</td>
              </tr>
            );
          })}
          {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No salary revisions recorded yet.</td></tr>}
        </tbody>
      </table>
    </Panel>
  );
}

function IncrementForm({ employees, setEmployees, canEdit, addRevision }) {
  const empty = { employeeId: "", mode: "percent", value: "", effectiveDate: "", note: "" };
  const [form, setForm] = useState(empty);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const emp = employees.find((e) => e.id === form.employeeId);
  const oldSalary = emp?.grossSalary || 0;
  const newSalary = form.mode === "percent"
    ? Math.round(oldSalary + (oldSalary * (Number(form.value) || 0)) / 100)
    : oldSalary + (Number(form.value) || 0);

  const submit = () => {
    if (!emp || !form.value) return;
    setEmployees(employees.map((e) => (e.id === emp.id ? { ...e, grossSalary: newSalary } : e)));
    addRevision({
      employeeId: emp.id, employeeName: emp.name, type: "Increment", oldSalary, newSalary,
      note: `${form.mode === "percent" ? `${form.value}% increment` : `৳${form.value} flat increment`}${form.effectiveDate ? ` — effective ${form.effectiveDate}` : ""}${form.note ? ` — ${form.note}` : ""}`,
    });
    setForm(empty);
  };

  return (
    <Panel title="Give Increment">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 16px", maxWidth: 760 }}>
        <Field label="Employee" required>
          <TSelect value={form.employeeId} onChange={set("employeeId")}>
            <option value="">Select employee</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
          </TSelect>
        </Field>
        <Field label="Increment Type">
          <TSelect value={form.mode} onChange={set("mode")}>
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount (৳)</option>
          </TSelect>
        </Field>
        <Field label={form.mode === "percent" ? "Increment %" : "Increment Amount (৳)"} required>
          <TInput type="number" value={form.value} onChange={set("value")} placeholder={form.mode === "percent" ? "5" : "1000"} />
        </Field>
        <Field label="Effective Date"><TInput type="date" value={form.effectiveDate} onChange={set("effectiveDate")} /></Field>
        <Field label="Note"><TInput value={form.note} onChange={set("note")} placeholder="e.g. Annual increment" /></Field>
      </div>
      {emp && (
        <div style={{ display: "flex", gap: 20, fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>
          <span>Current Salary: <b style={{ color: T.ink }}>৳ {oldSalary.toLocaleString()}</b></span>
          <span>New Salary: <b style={{ color: T.green }}>৳ {newSalary.toLocaleString()}</b></span>
        </div>
      )}
      {canEdit && <Btn variant="primary" onClick={submit} disabled={!emp || !form.value}><TrendingUp size={14} /> Apply Increment</Btn>}
    </Panel>
  );
}

function PromotionSalaryUpdate({ employees, setEmployees, canEdit, addRevision }) {
  const empty = { employeeId: "", newDesignation: "", newSalary: "", effectiveDate: "", note: "" };
  const [form, setForm] = useState(empty);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const emp = employees.find((e) => e.id === form.employeeId);
  const oldSalary = emp?.grossSalary || 0;

  const submit = () => {
    if (!emp || !form.newSalary) return;
    setEmployees(employees.map((e) => (e.id === emp.id ? { ...e, grossSalary: Number(form.newSalary), designation: form.newDesignation || e.designation } : e)));
    addRevision({
      employeeId: emp.id, employeeName: emp.name, type: "Promotion", oldSalary, newSalary: Number(form.newSalary),
      note: `${form.newDesignation ? `Promoted to ${form.newDesignation}` : "Promotion"}${form.effectiveDate ? ` — effective ${form.effectiveDate}` : ""}${form.note ? ` — ${form.note}` : ""}`,
    });
    setForm(empty);
  };

  return (
    <Panel title="Promotion Salary Update">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 16px", maxWidth: 760 }}>
        <Field label="Employee" required>
          <TSelect value={form.employeeId} onChange={set("employeeId")}>
            <option value="">Select employee</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
          </TSelect>
        </Field>
        <Field label="Current Designation">
          <TInput value={emp?.designation || ""} readOnly style={{ background: T.canvas }} />
        </Field>
        <Field label="New Designation"><TInput value={form.newDesignation} onChange={set("newDesignation")} placeholder="e.g. Senior Officer" /></Field>
        <Field label="New Gross Salary (৳)" required><TInput type="number" value={form.newSalary} onChange={set("newSalary")} placeholder="15000" /></Field>
        <Field label="Effective Date"><TInput type="date" value={form.effectiveDate} onChange={set("effectiveDate")} /></Field>
        <Field label="Note"><TInput value={form.note} onChange={set("note")} placeholder="e.g. Promotion board — Jul 2026" /></Field>
      </div>
      {emp && (
        <div style={{ display: "flex", gap: 20, fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>
          <span>Current Salary: <b style={{ color: T.ink }}>৳ {oldSalary.toLocaleString()}</b></span>
          {form.newSalary && <span>New Salary: <b style={{ color: T.green }}>৳ {Number(form.newSalary).toLocaleString()}</b></span>}
        </div>
      )}
      {canEdit && <Btn variant="primary" onClick={submit} disabled={!emp || !form.newSalary}><Rocket size={14} /> Apply Promotion</Btn>}
    </Panel>
  );
}

function SalarySheet({ employees, gazettes, salarySheets, setSalarySheets, canEdit }) {
  const [company, setCompany] = useState(COMPANIES[0].key);
  const [month, setMonth] = useState(currentMonthStr());
  const [viewing, setViewing] = useState(null);
  const sheetKey = `${company}-${month}`;
  const gz = gazetteFor(month, gazettes);
  const sheet = salarySheets[sheetKey];

  const workingDaysDefault = 26;

  const generate = () => {
    const rows = employees
      .filter((e) => e.company === company)
      .map((e) => {
        const existing = sheet?.rows?.find((r) => r.id === e.id);
        const presentDays = existing ? existing.presentDays : workingDaysDefault;
        return { id: e.id, name: e.name, designation: e.designation, gross: e.grossSalary || 0, presentDays, workingDays: workingDaysDefault };
      });
    setSalarySheets({ ...salarySheets, [sheetKey]: { rows, generatedAt: new Date().toISOString() } });
  };

  const updatePresent = (id, val) => {
    if (!sheet) return;
    const rows = sheet.rows.map((r) => (r.id === id ? { ...r, presentDays: Math.max(0, Math.min(r.workingDays, Number(val) || 0)) } : r));
    setSalarySheets({ ...salarySheets, [sheetKey]: { ...sheet, rows } });
  };

  const rowsWithCalc = (sheet?.rows || []).map((r) => {
    const b = breakupOf(r.gross, gz);
    const calcGross = b.basic + b.houseRent + b.conveyance + b.medical;
    const ratio = r.workingDays ? r.presentDays / r.workingDays : 1;
    const payable = +(calcGross * ratio).toFixed(2);
    return { ...r, ...b, calcGross, payable };
  });

  const totals = rowsWithCalc.reduce((acc, r) => ({
    basic: acc.basic + r.basic, houseRent: acc.houseRent + r.houseRent,
    conveyance: acc.conveyance + r.conveyance, medical: acc.medical + r.medical, payable: acc.payable + r.payable,
  }), { basic: 0, houseRent: 0, conveyance: 0, medical: 0, payable: 0 });

  const viewEmp = viewing ? rowsWithCalc.find((r) => r.id === viewing) : null;

  return (
    <div style={{ padding: 24 }}>
    <Panel
      title="Monthly Payroll — Salary Sheet"
      right={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <TSelect value={company} onChange={(e) => setCompany(e.target.value)} style={{ width: 200 }}>
            {COMPANIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
          </TSelect>
          <TInput type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: 150 }} />
          {canEdit && <Btn small variant="primary" onClick={generate}><RefreshCcw size={13} /> {sheet ? "Regenerate" : "Generate"}</Btn>}
        </div>
      }
    >
      {!gz && <div style={{ marginBottom: 12, fontSize: 12.5, color: T.orange }}>No Gazette formula found for this month — add one under HR Setup → Gazette Calculation first.</div>}
      {!sheet ? (
        <div style={{ padding: 30, textAlign: "center", color: T.inkSoft, fontSize: 13 }}>
          No salary sheet generated yet for <b>{COMPANIES.find((c) => c.key === company)?.short}</b> — {month}. Click <b>Generate</b> above.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <ExportBar
              title="Monthly Salary Sheet"
              headers={["ID", "Name", "Basic", "House Rent", "Conveyance", "Medical", "Present", "Working", "Payable"]}
              rows={rowsWithCalc.map((r) => [r.id, r.name, r.basic, r.houseRent, r.conveyance, r.medical, r.presentDays, r.workingDays, r.payable])}
              filename={`salary-sheet-${company}-${month}`}
            />
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                {["ID", "Name", "Basic", "House Rent", "Conveyance", "Medical", "Present / Working", "Payable", ""].map((h) => (
                  <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsWithCalc.map((r) => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={{ padding: "9px 6px", color: T.inkSoft }}>{r.id}</td>
                  <td style={{ padding: "9px 6px", fontWeight: 700 }}>{r.name}</td>
                  <td style={{ padding: "9px 6px" }}>{r.basic.toLocaleString()}</td>
                  <td style={{ padding: "9px 6px" }}>{r.houseRent.toLocaleString()}</td>
                  <td style={{ padding: "9px 6px" }}>{r.conveyance.toLocaleString()}</td>
                  <td style={{ padding: "9px 6px" }}>{r.medical.toLocaleString()}</td>
                  <td style={{ padding: "9px 6px" }}>
                    {canEdit ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <TInput type="number" value={r.presentDays} onChange={(e) => updatePresent(r.id, e.target.value)} style={{ width: 58, padding: "4px 6px" }} />
                        <span style={{ color: T.inkSoft }}>/ {r.workingDays}</span>
                      </span>
                    ) : `${r.presentDays} / ${r.workingDays}`}
                  </td>
                  <td style={{ padding: "9px 6px", fontWeight: 700, color: T.green }}>৳ {r.payable.toLocaleString()}</td>
                  <td style={{ padding: "9px 6px", textAlign: "right" }}>
                    <IconBtn icon={Eye} tone={T.blue} title="View payslip" onClick={() => setViewing(r.id)} />
                  </td>
                </tr>
              ))}
              {rowsWithCalc.length === 0 && <tr><td colSpan={9} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No employees found for this company.</td></tr>}
            </tbody>
            {rowsWithCalc.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: `2px solid ${T.ink}` }}>
                  <td colSpan={2} style={{ padding: "10px 6px", fontWeight: 700 }}>Total</td>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{totals.basic.toLocaleString()}</td>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{totals.houseRent.toLocaleString()}</td>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{totals.conveyance.toLocaleString()}</td>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{totals.medical.toLocaleString()}</td>
                  <td />
                  <td style={{ padding: "10px 6px", fontWeight: 700, color: T.green }}>৳ {totals.payable.toLocaleString()}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>

          {viewEmp && (
            <div style={{ marginTop: 20, border: `1px dashed ${T.line}`, borderRadius: 10, padding: 20, background: T.canvas }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 15, color: T.ink }}>Payslip — {viewEmp.name} ({month})</div>
                <Btn small variant="quiet" onClick={() => setViewing(null)}><X size={13} /> Close</Btn>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 30px", fontSize: 13 }}>
                <Row label="Employee ID" value={viewEmp.id} />
                <Row label="Designation" value={viewEmp.designation} />
                <Row label="Basic" value={viewEmp.basic.toLocaleString()} />
                <Row label="House Rent" value={viewEmp.houseRent.toLocaleString()} />
                <Row label="Conveyance" value={viewEmp.conveyance.toLocaleString()} />
                <Row label="Medical" value={viewEmp.medical.toLocaleString()} />
                <Row label="Attendance" value={`${viewEmp.presentDays} / ${viewEmp.workingDays} days`} />
                <Row label="Net Payable" value={`৳ ${viewEmp.payable.toLocaleString()}`} highlight />
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Payroll List — a running ledger of individual payroll runs, plus   */
/*  a "Salary Arrangement" form to add/adjust one entry at a time, and */
/*  a printable payslip/invoice view. Mirrors the reference software.  */
/* ------------------------------------------------------------------ */
function PayslipInvoice({ record, employee, gazettes, onClose }) {
  const gz = gazetteFor(record.month, gazettes);
  const b = breakupOf(record.basicSalary, gz);
  const deductions = (Number(record.deduction) || 0) + (Number(record.loan) || 0);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,26,40,0.55)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "30px 16px", zIndex: 50, overflowY: "auto" }}>
      <div style={{ background: "#fff", width: 640, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }} className="payslip-print">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${T.line}` }} className="no-print">
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 15 }}>Invoice / Payslip</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn small variant="primary" onClick={() => window.print()}><Printer size={13} /> Print</Btn>
            <Btn small variant="quiet" onClick={onClose}><X size={13} /> Close</Btn>
          </div>
        </div>
        <div style={{ padding: "26px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <img src={companyLogo} alt="" style={{ width: 40, height: "auto" }} />
              <div>
                <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 15, color: T.ink }}>Nippon Paint (Bangladesh) Pvt. Ltd.</div>
                <div style={{ fontSize: 11, color: T.inkSoft }}>Workforce & Payroll Register</div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12.5, color: T.ink, fontWeight: 700 }}>
              Payslip for {record.month}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 24px", fontSize: 12.5, marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${T.line}` }}>
            <Row label="Employee PIN" value={employee?.id || record.employeeId} />
            <Row label="Employee Name" value={employee?.name || record.employeeName} />
            <Row label="Department" value={employee?.department || "—"} />
            <Row label="Designation" value={employee?.designation || "—"} />
            <Row label="Pay Date" value={record.payDate || "—"} />
            <Row label="Days / Hours Worked" value={record.hoursWorked || "—"} />
            <Row label="Paid Type" value={record.paidType} />
            <Row label="Status" value={record.status} />
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: T.canvas }}>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft }}>Description</th>
                <th style={{ textAlign: "right", padding: "8px 10px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft }}>Earnings</th>
                <th style={{ textAlign: "right", padding: "8px 10px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft }}>Deductions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Basic Salary", b.basic, ""],
                ["Medical Allowance", b.medical, ""],
                ["House Rent", b.houseRent, ""],
                ["Conveyance Allowance", b.conveyance, ""],
                ["Deduction", "", record.deduction || 0],
                ["Loan", "", record.loan || 0],
              ].map(([label, earn, ded]) => (
                <tr key={label} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={{ padding: "7px 10px" }}>{label}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right" }}>{earn === "" ? "" : `৳ ${Number(earn).toLocaleString()}`}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", color: T.red }}>{ded === "" ? "" : `৳ ${Number(ded).toLocaleString()}`}</td>
                </tr>
              ))}
              <tr style={{ borderTop: `2px solid ${T.ink}` }}>
                <td style={{ padding: "9px 10px", fontWeight: 700 }}>Working Hours: {record.workingHours || "—"}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700 }}>৳ {(b.basic + b.medical + b.houseRent + b.conveyance).toLocaleString()}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700, color: T.red }}>৳ {deductions.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
            <div style={{ minWidth: 220 }}>
              <Row label="Final Salary" value={`৳ ${Number(record.finalSalary || 0).toLocaleString()}`} highlight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalaryArrangementModal({ employees, record, onClose, onSubmit }) {
  const [form, setForm] = useState(record || {
    employeeId: employees[0]?.id || "", month: currentMonthStr(),
    basicSalary: "", workingHours: "", hoursWorked: "", payDate: "",
    deduction: "0", loan: "0", status: "Process", paidType: "Hand Cash",
  });
  const set = (k) => (v) => setForm({ ...form, [k]: v });
  const finalSalary = (Number(form.basicSalary) || 0) - (Number(form.deduction) || 0) - (Number(form.loan) || 0);

  const submit = () => {
    const emp = employees.find((e) => e.id === form.employeeId);
    onSubmit({
      ...form,
      id: record?.id || String(Date.now()),
      employeeName: emp?.name || "Unknown",
      finalSalary,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,26,40,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}>
      <div style={{ background: "#fff", width: 560, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.35)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${T.line}` }}>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 15 }}>Salary Arrangement</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft }}><X size={18} /></button>
        </div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
          <Field label="Employee">
            <TSelect value={form.employeeId} onChange={(e) => set("employeeId")(e.target.value)}>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </TSelect>
          </Field>
          <Field label="Month">
            <TInput type="month" value={form.month} onChange={(e) => set("month")(e.target.value)} />
          </Field>
          <Field label="Basic Salary">
            <TInput type="number" value={form.basicSalary} onChange={(e) => set("basicSalary")(e.target.value)} />
          </Field>
          <Field label="Deduction">
            <TInput type="number" value={form.deduction} onChange={(e) => set("deduction")(e.target.value)} />
          </Field>
          <Field label="Working hours">
            <TInput type="number" value={form.workingHours} onChange={(e) => set("workingHours")(e.target.value)} />
          </Field>
          <Field label="Loan">
            <TInput type="number" value={form.loan} onChange={(e) => set("loan")(e.target.value)} />
          </Field>
          <Field label="Hours worked">
            <TInput type="number" value={form.hoursWorked} onChange={(e) => set("hoursWorked")(e.target.value)} />
          </Field>
          <Field label="Final Salary">
            <TInput readOnly value={finalSalary} style={{ background: T.canvas, fontWeight: 700, color: T.green }} />
          </Field>
          <Field label="Pay Date">
            <TInput type="date" value={form.payDate} onChange={(e) => set("payDate")(e.target.value)} />
          </Field>
          <Field label="Status">
            <div style={{ display: "flex", gap: 16, paddingTop: 6 }}>
              <RadioDot label="Paid" color={T.green} checked={form.status === "Paid"} onClick={() => set("status")("Paid")} />
              <RadioDot label="Process" color={T.amberDeep} checked={form.status === "Process"} onClick={() => set("status")("Process")} />
            </div>
          </Field>
          <Field label="Paid Type">
            <div style={{ display: "flex", gap: 16, paddingTop: 6 }}>
              <RadioDot label="Hand Cash" color={T.blue} checked={form.paidType === "Hand Cash"} onClick={() => set("paidType")("Hand Cash")} />
              <RadioDot label="Bank" color={T.blue} checked={form.paidType === "Bank"} onClick={() => set("paidType")("Bank")} />
            </div>
          </Field>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 20px", borderTop: `1px solid ${T.line}` }}>
          <Btn variant="quiet" onClick={onClose}>Close</Btn>
          <Btn variant="primary" onClick={submit} disabled={!form.employeeId || !form.basicSalary}>Submit</Btn>
        </div>
      </div>
    </div>
  );
}

function PayrollList({ employees, gazettes, records, setRecords, canEdit }) {
  const [q, setQ] = useState("");
  const [modalRecord, setModalRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [payslipFor, setPayslipFor] = useState(null);

  const filtered = records.filter((r) => !q ||
    r.employeeName?.toLowerCase().includes(q.toLowerCase()) ||
    r.employeeId?.toLowerCase?.().includes(q.toLowerCase())
  );

  const upsert = (rec) => {
    const exists = records.some((r) => r.id === rec.id);
    setRecords(exists ? records.map((r) => (r.id === rec.id ? rec : r)) : [rec, ...records]);
    setShowModal(false);
    setModalRecord(null);
  };

  const remove = (id) => setRecords(records.filter((r) => r.id !== id));

  const payslipEmployee = payslipFor ? employees.find((e) => e.id === payslipFor.employeeId) : null;

  return (
    <div style={{ padding: 24 }}>
    <Panel
      title="Payslip Register"
      right={canEdit && (
        <Btn variant="primary" small onClick={() => { setModalRecord(null); setShowModal(true); }}><Plus size={13} /> Generate Payslip</Btn>
      )}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <ExportBar
          title="Payslip Register"
          headers={["PIN", "Employee", "Month", "Salary", "Loan", "Hours", "Deduction", "Total Paid", "Pay Date", "Status"]}
          rows={filtered.map((r) => [r.employeeId, r.employeeName, r.month, r.basicSalary || 0, r.loan || 0, r.hoursWorked || "", r.deduction || 0, r.finalSalary || 0, r.payDate || "", r.status])}
          filename="payslip-register"
        />
        <div style={{ position: "relative", minWidth: 220 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 9, color: T.inkSoft }} />
          <TInput placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            {["PIN", "Employee", "Month", "Salary", "Loan", "Hours", "Deduction", "Total Paid", "Pay Date", "Status", "Action"].map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
              <td style={{ padding: "9px 6px", color: T.inkSoft }}>{r.employeeId}</td>
              <td style={{ padding: "9px 6px", fontWeight: 700 }}>{r.employeeName}</td>
              <td style={{ padding: "9px 6px" }}>{r.month}</td>
              <td style={{ padding: "9px 6px" }}>৳ {Number(r.basicSalary || 0).toLocaleString()}</td>
              <td style={{ padding: "9px 6px" }}>৳ {Number(r.loan || 0).toLocaleString()}</td>
              <td style={{ padding: "9px 6px" }}>{r.hoursWorked || "—"}</td>
              <td style={{ padding: "9px 6px" }}>৳ {Number(r.deduction || 0).toLocaleString()}</td>
              <td style={{ padding: "9px 6px", fontWeight: 700, color: T.green }}>৳ {Number(r.finalSalary || 0).toLocaleString()}</td>
              <td style={{ padding: "9px 6px" }}>{r.payDate || "—"}</td>
              <td style={{ padding: "9px 6px" }}><Badge tone={r.status === "Paid" ? "green" : "orange"}>{r.status}</Badge></td>
              <td style={{ padding: "9px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                <IconBtn icon={Eye} tone={T.blue} title="View payslip" onClick={() => setPayslipFor(r)} />
                {canEdit && <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => { setModalRecord(r); setShowModal(true); }} />}
                {canEdit && <IconBtn icon={Lock} tone={T.red} title="Remove" onClick={() => remove(r.id)} />}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={11} style={{ padding: 24, textAlign: "center", color: T.inkSoft }}>No payslips yet — click <b>Generate Payslip</b> to add one.</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <SalaryArrangementModal
          employees={employees}
          record={modalRecord}
          onClose={() => { setShowModal(false); setModalRecord(null); }}
          onSubmit={upsert}
        />
      )}
      {payslipFor && (
        <PayslipInvoice record={payslipFor} employee={payslipEmployee} gazettes={gazettes} onClose={() => setPayslipFor(null)} />
      )}
    </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Salary Structure — grade/designation-wise pay structure templates  */
/* ------------------------------------------------------------------ */
const SALARY_STRUCTURE_AMOUNT_FIELDS = ["basic", "houseRent", "medical", "conveyance", "food", "special"];

function SalaryStructure({ structures, setStructures, canEdit }) {
  const empty = { grade: "", basic: "", houseRent: "", medical: "", conveyance: "", food: "", special: "" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const grossOf = (obj) => SALARY_STRUCTURE_AMOUNT_FIELDS.reduce((s, k) => s + (Number(obj[k]) || 0), 0);
  const gross = grossOf(form);

  const submit = () => {
    if (!form.grade.trim()) return;
    const rec = { id: editingId || Date.now(), ...form };
    setStructures(editingId ? structures.map((s) => (s.id === editingId ? rec : s)) : [rec, ...structures]);
    setForm(empty);
    setEditingId(null);
  };
  const edit = (s) => { setForm({ ...s }); setEditingId(s.id); };
  const remove = (id) => { setStructures(structures.filter((s) => s.id !== id)); if (editingId === id) { setEditingId(null); setForm(empty); } };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {canEdit && (
        <Panel title={editingId ? "Edit Salary Structure" : "New Salary Structure"}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 16px" }}>
            <Field label="Salary Grade" required><TInput value={form.grade} onChange={set("grade")} placeholder="e.g. Grade A — Officer" /></Field>
            <Field label="Basic Salary (৳)"><TInput type="number" value={form.basic} onChange={set("basic")} placeholder="10000" /></Field>
            <Field label="House Rent (৳)"><TInput type="number" value={form.houseRent} onChange={set("houseRent")} placeholder="6000" /></Field>
            <Field label="Medical Allowance (৳)"><TInput type="number" value={form.medical} onChange={set("medical")} placeholder="1000" /></Field>
            <Field label="Conveyance (৳)"><TInput type="number" value={form.conveyance} onChange={set("conveyance")} placeholder="1000" /></Field>
            <Field label="Food Allowance (৳)"><TInput type="number" value={form.food} onChange={set("food")} placeholder="0" /></Field>
            <Field label="Special Allowance (৳)"><TInput type="number" value={form.special} onChange={set("special")} placeholder="0" /></Field>
          </div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 12 }}>Gross Salary: <b style={{ color: T.green }}>৳ {gross.toLocaleString()}</b></div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={submit}><Plus size={14} /> {editingId ? "Update" : "Save"} Structure</Btn>
            {editingId && <Btn variant="quiet" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</Btn>}
          </div>
        </Panel>
      )}
      <Panel
        title={`Salary Structures — ${structures.length}`}
        right={<ExportBar title="Salary Structures" headers={["Salary Grade", "Basic Salary", "House Rent", "Medical Allowance", "Conveyance", "Food Allowance", "Special Allowance", "Gross Salary"]} rows={structures.map((s) => [s.grade, s.basic || 0, s.houseRent || 0, s.medical || 0, s.conveyance || 0, s.food || 0, s.special || 0, grossOf(s)])} filename="salary-structures" />}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Salary Grade", "Basic Salary", "House Rent", "Medical Allowance", "Conveyance", "Food Allowance", "Special Allowance", "Gross Salary", ""].map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {structures.map((s) => {
              const t = grossOf(s);
              return (
                <tr key={s.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={{ padding: "10px 6px", fontWeight: 700 }}>{s.grade}</td>
                  <td style={{ padding: "10px 6px" }}>{(Number(s.basic) || 0).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px" }}>{(Number(s.houseRent) || 0).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px" }}>{(Number(s.medical) || 0).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px" }}>{(Number(s.conveyance) || 0).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px" }}>{(Number(s.food) || 0).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px" }}>{(Number(s.special) || 0).toLocaleString()}</td>
                  <td style={{ padding: "10px 6px", fontWeight: 700, color: T.green }}>৳ {t.toLocaleString()}</td>
                  <td style={{ padding: "10px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                    {canEdit && <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => edit(s)} />}
                    {canEdit && <IconBtn icon={Trash2} tone={T.red} title="Remove" onClick={() => remove(s.id)} />}
                  </td>
                </tr>
              );
            })}
            {structures.length === 0 && <tr><td colSpan={9} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No salary structures defined yet.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Attendance Integration — how attendance feeds into payroll         */
/* ------------------------------------------------------------------ */
const ATTENDANCE_IMPORT_TABS = [
  { key: "late", label: "Late Calculation", icon: Clock },
  { key: "absent", label: "Absent Calculation", icon: UserX },
  { key: "leave", label: "Leave Adjustment", icon: CalendarClock },
  { key: "holiday", label: "Holiday Adjustment", icon: Sun },
  { key: "weekend", label: "Weekend Adjustment", icon: CalendarOff },
];

function ChipToggle({ options, value, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((o) => {
        const active = value.includes(o);
        return (
          <button
            key={o} type="button" onClick={() => onToggle(o)}
            style={{
              padding: "6px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: BODY_FONT,
              border: `1px solid ${active ? T.amber : T.line}`, background: active ? "#FCF1DA" : T.canvas, color: active ? T.navy : T.inkSoft,
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function AttendanceIntegration({ employees, settings, setSettings, canEdit }) {
  const [form, setForm] = useState(settings);
  useEffect(() => setForm(settings), [settings]);
  const dirty = JSON.stringify(form) !== JSON.stringify(settings);
  const [importTab, setImportTab] = useState("late");

  const ai = form.attendanceImport;
  const updAI = (section, key) => (value) =>
    setForm({ ...form, attendanceImport: { ...ai, [section]: { ...ai[section], [key]: value } } });
  const toggleAIList = (section, key, value) => {
    const list = ai[section][key];
    updAI(section, key)(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const companyRows = COMPANIES.map((c) => {
    const list = employees.filter((e) => e.company === c.key);
    const present = Math.round(list.length * 0.92);
    return { ...c, total: list.length, present, absent: list.length - present };
  });

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <Panel
        title="Attendance → Payroll Integration"
        right={canEdit && <Btn variant="primary" small onClick={() => setSettings(form)} disabled={!dirty}><Check size={13} /> Save</Btn>}
      >
        <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 14, lineHeight: 1.6 }}>
          Present/absent days recorded against each employee feed directly into <b>Monthly Payroll</b> as the attendance ratio used to prorate gross pay.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", maxWidth: 640 }}>
          <Field label="Working Days per Month"><TInput type="number" value={form.workingDaysPerMonth} onChange={(e) => setForm({ ...form, workingDaysPerMonth: e.target.value })} /></Field>
          <Field label="Standard Weekly Hours"><TInput type="number" value={form.weeklyHours} onChange={(e) => setForm({ ...form, weeklyHours: e.target.value })} /></Field>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Auto-pull Attendance for Payroll</div>
        <YesNoRow value={form.autoAttendanceIntegration} onChange={(v) => setForm({ ...form, autoAttendanceIntegration: v })} />
      </Panel>

      <Panel
        title="Attendance Import"
        right={canEdit && <Btn variant="primary" small onClick={() => setSettings(form)} disabled={!dirty}><Check size={13} /> Save</Btn>}
      >
        <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 16, lineHeight: 1.6 }}>
          Rules used while importing raw device punches — how lateness, absence, leave, holidays and weekends are each turned into payroll-ready figures.
        </div>
        <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${T.line}`, marginBottom: 18, flexWrap: "wrap" }}>
          {ATTENDANCE_IMPORT_TABS.map((t) => {
            const Icon = t.icon;
            const active = importTab === t.key;
            return (
              <button
                key={t.key} type="button" onClick={() => setImportTab(t.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
                  fontFamily: BODY_FONT, border: "none", borderBottom: active ? `2px solid ${T.amber}` : "2px solid transparent",
                  background: "transparent", color: active ? T.ink : T.inkSoft, cursor: "pointer", marginBottom: -1,
                }}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {importTab === "late" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", maxWidth: 640 }}>
            <Field label="Grace Period (minutes)">
              <TInput type="number" value={ai.late.gracePeriodMinutes} onChange={(e) => updAI("late", "gracePeriodMinutes")(Number(e.target.value))} />
            </Field>
            <Field label="Deduction Type">
              <TSelect value={ai.late.deductionType} onChange={(e) => updAI("late", "deductionType")(e.target.value)}>
                {["None", "Per Minute", "Per Occurrence", "Half Day After Limit"].map((o) => <option key={o} value={o}>{o}</option>)}
              </TSelect>
            </Field>
            <Field label={ai.late.deductionType === "Per Minute" ? "Deduction Rate (৳ / minute)" : "Deduction Rate (৳ / occurrence)"}>
              <TInput type="number" value={ai.late.deductionRate} onChange={(e) => updAI("late", "deductionRate")(Number(e.target.value))} />
            </Field>
            <Field label="Mark Half-Day After (late count)">
              <TInput type="number" value={ai.late.maxLateBeforeHalfDay} onChange={(e) => updAI("late", "maxLateBeforeHalfDay")(Number(e.target.value))} />
            </Field>
          </div>
        )}

        {importTab === "absent" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", maxWidth: 640 }}>
            <Field label="Deduction Basis">
              <TSelect value={ai.absent.deductionBasis} onChange={(e) => updAI("absent", "deductionBasis")(e.target.value)}>
                {["Per Day Gross", "Per Day Basic"].map((o) => <option key={o} value={o}>{o}</option>)}
              </TSelect>
            </Field>
            <Field label="Auto-mark Absent Cutoff Time">
              <TInput type="time" value={ai.absent.autoMarkCutoffTime} onChange={(e) => updAI("absent", "autoMarkCutoffTime")(e.target.value)} />
            </Field>
            <Field label="Consecutive Absent Days → No-Pay Leave">
              <TInput type="number" value={ai.absent.consecutiveAbsentAsNoPayLeave} onChange={(e) => updAI("absent", "consecutiveAbsentAsNoPayLeave")(Number(e.target.value))} />
            </Field>
          </div>
        )}

        {importTab === "leave" && (
          <div style={{ maxWidth: 640 }}>
            <Field label="Paid Leave Types">
              <ChipToggle options={["Casual", "Sick", "Earned", "Maternity"]} value={ai.leave.paidLeaveTypes} onToggle={(v) => toggleAIList("leave", "paidLeaveTypes", v)} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="Unpaid Leave Deduction Basis">
                <TSelect value={ai.leave.unpaidDeductionBasis} onChange={(e) => updAI("leave", "unpaidDeductionBasis")(e.target.value)}>
                  {["Per Day Gross", "Per Day Basic"].map((o) => <option key={o} value={o}>{o}</option>)}
                </TSelect>
              </Field>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, margin: "10px 0 6px" }}>Auto-deduct Unpaid Leave</div>
            <YesNoRow value={ai.leave.autoDeductUnpaidLeave} onChange={(v) => updAI("leave", "autoDeductUnpaidLeave")(v)} />
          </div>
        )}

        {importTab === "holiday" && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="Work-on-Holiday Pay Multiplier">
                <TInput type="number" step="0.1" value={ai.holiday.workOnHolidayMultiplier} onChange={(e) => updAI("holiday", "workOnHolidayMultiplier")(Number(e.target.value))} />
              </Field>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, margin: "10px 0 6px" }}>Auto-count Holidays as Present</div>
            <YesNoRow value={ai.holiday.autoCountAsPresent} onChange={(v) => updAI("holiday", "autoCountAsPresent")(v)} />
            <div style={{ fontSize: 13, fontWeight: 600, margin: "14px 0 6px" }}>Enable Compensatory Off</div>
            <YesNoRow value={ai.holiday.compensatoryOffEnabled} onChange={(v) => updAI("holiday", "compensatoryOffEnabled")(v)} />
          </div>
        )}

        {importTab === "weekend" && (
          <div style={{ maxWidth: 640 }}>
            <Field label="Weekend Day(s)">
              <ChipToggle options={WEEKDAYS} value={ai.weekend.weekendDays} onToggle={(v) => toggleAIList("weekend", "weekendDays", v)} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="Work-on-Weekend Pay Multiplier">
                <TInput type="number" step="0.1" value={ai.weekend.workOnWeekendMultiplier} onChange={(e) => updAI("weekend", "workOnWeekendMultiplier")(Number(e.target.value))} />
              </Field>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, margin: "10px 0 6px" }}>Auto-count Weekend as Present</div>
            <YesNoRow value={ai.weekend.autoCountAsPresent} onChange={(v) => updAI("weekend", "autoCountAsPresent")(v)} />
          </div>
        )}
      </Panel>

      <Panel title="Company-wise Attendance Summary — Current Cycle">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Company", "Total Employee", "Present", "Absent", "Attendance %"].map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {companyRows.map((c) => (
              <tr key={c.key} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{c.short}</td>
                <td style={{ padding: "10px 6px" }}>{c.total}</td>
                <td style={{ padding: "10px 6px", color: T.green }}>{c.present}</td>
                <td style={{ padding: "10px 6px", color: T.red }}>{c.absent}</td>
                <td style={{ padding: "10px 6px" }}>{c.total ? Math.round((c.present / c.total) * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic ledger module — shared by Overtime, Allowance, Deduction,  */
/*  Bonus and Loan & Advance. Each employee/month record carries a     */
/*  small set of custom fields plus an amount and a status.            */
/* ------------------------------------------------------------------ */
function LedgerModule({
  title, employees, records, setRecords, canEdit, fields,
  computeAmount, amountLabel = "Amount", statusOptions = ["Pending", "Approved", "Paid"], exportName,
}) {
  const [q, setQ] = useState("");
  const emptyForm = () => {
    const f = { employeeId: "", month: currentMonthStr(), status: statusOptions[0] };
    fields.forEach((fl) => (f[fl.key] = ""));
    if (!computeAmount) f.amount = "";
    return f;
  };
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const liveAmount = computeAmount ? computeAmount(form) : Number(form.amount) || 0;

  const filtered = records.filter((r) => !q || r.employeeName?.toLowerCase().includes(q.toLowerCase()) || r.employeeId?.toLowerCase?.().includes(q.toLowerCase()));

  const submit = () => {
    if (!form.employeeId) return;
    const emp = employees.find((e) => e.id === form.employeeId);
    const rec = { ...form, id: editingId || Date.now(), employeeId: emp.id, employeeName: emp.name, amount: liveAmount };
    setRecords(editingId ? records.map((r) => (r.id === editingId ? rec : r)) : [rec, ...records]);
    setForm(emptyForm());
    setEditingId(null);
  };
  const edit = (r) => { setForm({ ...r }); setEditingId(r.id); };
  const remove = (id) => { setRecords(records.filter((r) => r.id !== id)); if (editingId === id) { setEditingId(null); setForm(emptyForm()); } };

  const fieldCols = fields.map((f) => f.label);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {canEdit && (
        <Panel title={editingId ? `Edit ${title} Entry` : `New ${title} Entry`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 16px" }}>
            <Field label="Employee" required>
              <TSelect value={form.employeeId} onChange={set("employeeId")}>
                <option value="">Select employee</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </TSelect>
            </Field>
            <Field label="Month"><TInput type="month" value={form.month} onChange={set("month")} /></Field>
            {fields.map((fl) => (
              <Field key={fl.key} label={fl.label}>
                {fl.type === "select" ? (
                  <TSelect value={form[fl.key] || ""} onChange={set(fl.key)}>
                    <option value="">Select</option>
                    {fl.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </TSelect>
                ) : (
                  <TInput type={fl.type || "text"} value={form[fl.key] || ""} onChange={set(fl.key)} placeholder={fl.placeholder} />
                )}
              </Field>
            ))}
            {!computeAmount && <Field label={amountLabel}><TInput type="number" value={form.amount || ""} onChange={set("amount")} /></Field>}
            <Field label="Status">
              <TSelect value={form.status} onChange={set("status")}>
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </TSelect>
            </Field>
          </div>
          {computeAmount && (
            <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 12 }}>
              Computed {amountLabel}: <b style={{ color: T.green }}>৳ {liveAmount.toLocaleString()}</b>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={submit} disabled={!form.employeeId}><Plus size={14} /> {editingId ? "Update" : "Save"}</Btn>
            {editingId && <Btn variant="quiet" onClick={() => { setEditingId(null); setForm(emptyForm()); }}>Cancel</Btn>}
          </div>
        </Panel>
      )}
      <Panel
        title={`${title} — ${filtered.length}`}
        right={
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ExportBar
              title={title}
              headers={["Employee", "Month", ...fieldCols, amountLabel, "Status"]}
              rows={filtered.map((r) => [r.employeeName, r.month, ...fields.map((fl) => r[fl.key] ?? ""), r.amount || 0, r.status])}
              filename={exportName}
            />
            <div style={{ position: "relative", minWidth: 200 }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: 9, color: T.inkSoft }} />
              <TInput placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
            </div>
          </div>
        }
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Employee", "Month", ...fieldCols, amountLabel, "Status", canEdit ? "" : null].filter((x) => x !== null).map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "9px 6px", fontWeight: 700 }}>{r.employeeName}</td>
                <td style={{ padding: "9px 6px" }}>{r.month}</td>
                {fields.map((fl) => <td key={fl.key} style={{ padding: "9px 6px" }}>{r[fl.key] ?? "—"}</td>)}
                <td style={{ padding: "9px 6px", fontWeight: 700, color: T.green }}>৳ {Number(r.amount || 0).toLocaleString()}</td>
                <td style={{ padding: "9px 6px" }}><Badge tone={r.status === "Paid" || r.status === "Approved" || r.status === "Closed" ? "green" : r.status === "Rejected" ? "red" : "orange"}>{r.status}</Badge></td>
                {canEdit && (
                  <td style={{ padding: "9px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => edit(r)} />
                    <IconBtn icon={Trash2} tone={T.red} title="Remove" onClick={() => remove(r.id)} />
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={fieldCols.length + (canEdit ? 5 : 4)} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No {title.toLowerCase()} entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function Overtime({ employees, records, setRecords, canEdit, otRateMultiplier }) {
  return (
    <LedgerModule
      title="Overtime"
      employees={employees}
      records={records}
      setRecords={setRecords}
      canEdit={canEdit}
      exportName="overtime"
      statusOptions={["Pending", "Approved", "Paid"]}
      fields={[
        { key: "hours", label: "OT Hours", type: "number", placeholder: "10" },
        { key: "rate", label: "Rate / Hour (৳)", type: "number", placeholder: "50" },
      ]}
      computeAmount={(f) => (Number(f.hours) || 0) * (Number(f.rate) || 0) * (Number(otRateMultiplier) || 1)}
    />
  );
}

function Allowance({ employees, records, setRecords, canEdit }) {
  return (
    <LedgerModule
      title="Allowance"
      employees={employees}
      records={records}
      setRecords={setRecords}
      canEdit={canEdit}
      exportName="allowances"
      statusOptions={["Pending", "Approved", "Paid"]}
      fields={[
        { key: "type", label: "Allowance Type", type: "select", options: ["Transport", "Food", "Housing", "Mobile", "Special", "Others"] },
      ]}
    />
  );
}

function Deduction({ employees, records, setRecords, canEdit }) {
  return (
    <LedgerModule
      title="Deduction"
      employees={employees}
      records={records}
      setRecords={setRecords}
      canEdit={canEdit}
      exportName="deductions"
      statusOptions={["Pending", "Applied"]}
      fields={[
        { key: "type", label: "Deduction Type", type: "select", options: ["Absence", "Late Fine", "Provident Fund", "Tax", "Damage/Loss", "Others"] },
      ]}
    />
  );
}

function PayrollBonus({ employees, bonusTypes, records, setRecords, canEdit }) {
  return (
    <LedgerModule
      title="Bonus"
      employees={employees}
      records={records}
      setRecords={setRecords}
      canEdit={canEdit}
      exportName="payroll-bonus"
      statusOptions={["Pending", "Approved", "Paid"]}
      fields={[
        { key: "type", label: "Bonus Type", type: "select", options: bonusTypes.length ? bonusTypes.map((b) => b.type) : ["Festival Bonus", "Attendance Bonus"] },
      ]}
    />
  );
}

function LoanAdvance({ employees, records, setRecords, canEdit }) {
  return (
    <LedgerModule
      title="Loan & Advance"
      employees={employees}
      records={records}
      setRecords={setRecords}
      canEdit={canEdit}
      exportName="loan-advance"
      statusOptions={["Active", "Closed"]}
      fields={[
        { key: "type", label: "Type", type: "select", options: ["Loan", "Advance"] },
        { key: "installments", label: "Installments", type: "number", placeholder: "6" },
      ]}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Bank Advice — bank transfer instruction sheet for a company/month  */
/* ------------------------------------------------------------------ */
function BankAdvice({ employees, bankAccounts, setBankAccounts, payrollSettings }) {
  const [company, setCompany] = useState(COMPANIES[0].key);
  const [month, setMonth] = useState(currentMonthStr());

  const list = employees.filter((e) => e.company === company);
  const setAccount = (id, field, val) => {
    const cur = bankAccounts[id] || {};
    setBankAccounts({ ...bankAccounts, [id]: { ...cur, [field]: val } });
  };

  const rows = list.map((e) => {
    const acc = bankAccounts[e.id] || {};
    return { id: e.id, name: e.name, designation: e.designation, bankName: acc.bankName || "", accountNo: acc.accountNo || "", branch: acc.branch || "", amount: e.grossSalary || 0 };
  });
  const total = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <Panel
        title="Bank Advice"
        right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <TSelect value={company} onChange={(e) => setCompany(e.target.value)} style={{ width: 200 }}>
              {COMPANIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
            </TSelect>
            <TInput type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: 150 }} />
          </div>
        }
      >
        <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>{payrollSettings.bankAdviceNote}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <ExportBar
            title="Bank Advice"
            headers={["ID", "Name", "Designation", "Bank Name", "Account No", "Branch", "Amount"]}
            rows={rows.map((r) => [r.id, r.name, r.designation, r.bankName, r.accountNo, r.branch, r.amount])}
            filename={`bank-advice-${company}-${month}`}
          />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["ID", "Name", "Designation", "Bank Name", "Account No", "Branch", "Amount"].map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "9px 6px", color: T.inkSoft }}>{r.id}</td>
                <td style={{ padding: "9px 6px", fontWeight: 700 }}>{r.name}</td>
                <td style={{ padding: "9px 6px" }}>{r.designation}</td>
                <td style={{ padding: "9px 6px" }}><TInput value={r.bankName} onChange={(e) => setAccount(r.id, "bankName", e.target.value)} placeholder="Bank name" style={{ width: 120, padding: "5px 8px" }} /></td>
                <td style={{ padding: "9px 6px" }}><TInput value={r.accountNo} onChange={(e) => setAccount(r.id, "accountNo", e.target.value)} placeholder="Account no." style={{ width: 130, padding: "5px 8px" }} /></td>
                <td style={{ padding: "9px 6px" }}><TInput value={r.branch} onChange={(e) => setAccount(r.id, "branch", e.target.value)} placeholder="Branch" style={{ width: 110, padding: "5px 8px" }} /></td>
                <td style={{ padding: "9px 6px", fontWeight: 700, color: T.green }}>৳ {Number(r.amount).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No employees found for this company.</td></tr>}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: `2px solid ${T.ink}` }}>
                <td colSpan={6} style={{ padding: "10px 6px", fontWeight: 700 }}>Total</td>
                <td style={{ padding: "10px 6px", fontWeight: 700, color: T.green }}>৳ {total.toLocaleString()}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Final Settlement — dues/deductions on separation                   */
/* ------------------------------------------------------------------ */
function FinalSettlement({ employees, records, setRecords, canEdit }) {
  const empty = { employeeId: "", lastWorkingDate: "", unpaidSalary: "", leaveEncashment: "", otherDues: "", loanOutstanding: "", otherDeduction: "", status: "Pending" };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const netPayable = (Number(form.unpaidSalary) || 0) + (Number(form.leaveEncashment) || 0) + (Number(form.otherDues) || 0)
    - (Number(form.loanOutstanding) || 0) - (Number(form.otherDeduction) || 0);

  const submit = () => {
    if (!form.employeeId) return;
    const emp = employees.find((e) => e.id === form.employeeId);
    const rec = { ...form, id: editingId || Date.now(), employeeId: emp.id, employeeName: emp.name, netPayable };
    setRecords(editingId ? records.map((r) => (r.id === editingId ? rec : r)) : [rec, ...records]);
    setForm(empty);
    setEditingId(null);
  };
  const edit = (r) => { setForm({ ...r }); setEditingId(r.id); };
  const remove = (id) => { setRecords(records.filter((r) => r.id !== id)); if (editingId === id) { setEditingId(null); setForm(empty); } };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {canEdit && (
        <Panel title={editingId ? "Edit Final Settlement" : "New Final Settlement"}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 16px" }}>
            <Field label="Employee" required>
              <TSelect value={form.employeeId} onChange={set("employeeId")}>
                <option value="">Select employee</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </TSelect>
            </Field>
            <Field label="Last Working Date"><TInput type="date" value={form.lastWorkingDate} onChange={set("lastWorkingDate")} /></Field>
            <Field label="Status">
              <TSelect value={form.status} onChange={set("status")}>
                <option value="Pending">Pending</option>
                <option value="Settled">Settled</option>
              </TSelect>
            </Field>
            <Field label="Unpaid Salary (৳)"><TInput type="number" value={form.unpaidSalary} onChange={set("unpaidSalary")} /></Field>
            <Field label="Leave Encashment (৳)"><TInput type="number" value={form.leaveEncashment} onChange={set("leaveEncashment")} /></Field>
            <Field label="Other Dues (৳)"><TInput type="number" value={form.otherDues} onChange={set("otherDues")} /></Field>
            <Field label="Loan Outstanding (৳)"><TInput type="number" value={form.loanOutstanding} onChange={set("loanOutstanding")} /></Field>
            <Field label="Other Deduction (৳)"><TInput type="number" value={form.otherDeduction} onChange={set("otherDeduction")} /></Field>
          </div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 12 }}>Net Payable: <b style={{ color: T.green }}>৳ {netPayable.toLocaleString()}</b></div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={submit} disabled={!form.employeeId}><Plus size={14} /> {editingId ? "Update" : "Save"}</Btn>
            {editingId && <Btn variant="quiet" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</Btn>}
          </div>
        </Panel>
      )}
      <Panel
        title={`Final Settlements — ${records.length}`}
        right={<ExportBar title="Final Settlements" headers={["Employee", "Last Working Date", "Unpaid Salary", "Leave Encashment", "Other Dues", "Loan Outstanding", "Other Deduction", "Net Payable", "Status"]} rows={records.map((r) => [r.employeeName, r.lastWorkingDate, r.unpaidSalary || 0, r.leaveEncashment || 0, r.otherDues || 0, r.loanOutstanding || 0, r.otherDeduction || 0, r.netPayable || 0, r.status])} filename="final-settlements" />}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Employee", "Last Working Date", "Dues", "Deductions", "Net Payable", "Status", canEdit ? "" : null].filter((x) => x !== null).map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {records.map((r) => {
              const dues = (Number(r.unpaidSalary) || 0) + (Number(r.leaveEncashment) || 0) + (Number(r.otherDues) || 0);
              const ded = (Number(r.loanOutstanding) || 0) + (Number(r.otherDeduction) || 0);
              return (
                <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={{ padding: "9px 6px", fontWeight: 700 }}>{r.employeeName}</td>
                  <td style={{ padding: "9px 6px" }}>{r.lastWorkingDate || "—"}</td>
                  <td style={{ padding: "9px 6px" }}>৳ {dues.toLocaleString()}</td>
                  <td style={{ padding: "9px 6px" }}>৳ {ded.toLocaleString()}</td>
                  <td style={{ padding: "9px 6px", fontWeight: 700, color: T.green }}>৳ {Number(r.netPayable || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 6px" }}><Badge tone={r.status === "Settled" ? "green" : "orange"}>{r.status}</Badge></td>
                  {canEdit && (
                    <td style={{ padding: "9px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => edit(r)} />
                      <IconBtn icon={Trash2} tone={T.red} title="Remove" onClick={() => remove(r.id)} />
                    </td>
                  )}
                </tr>
              );
            })}
            {records.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No final settlements recorded yet.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Payroll Reports — summary reports across the payroll sub-modules   */
/* ------------------------------------------------------------------ */
function PayrollReports({ payrollRecords, overtimeRecords, allowances, deductions, payrollBonuses, loans, finalSettlements }) {
  const [reportType, setReportType] = useState("payroll");

  const reports = {
    payroll: { label: "Monthly Payroll Summary", headers: ["Employee", "Month", "Salary", "Deduction", "Total Paid", "Status"], rows: payrollRecords.map((r) => [r.employeeName, r.month, r.basicSalary || 0, r.deduction || 0, r.finalSalary || 0, r.status]) },
    overtime: { label: "Overtime Summary", headers: ["Employee", "Month", "Hours", "Amount", "Status"], rows: overtimeRecords.map((r) => [r.employeeName, r.month, r.hours || 0, r.amount || 0, r.status]) },
    allowance: { label: "Allowance Summary", headers: ["Employee", "Month", "Type", "Amount", "Status"], rows: allowances.map((r) => [r.employeeName, r.month, r.type, r.amount || 0, r.status]) },
    deduction: { label: "Deduction Summary", headers: ["Employee", "Month", "Type", "Amount", "Status"], rows: deductions.map((r) => [r.employeeName, r.month, r.type, r.amount || 0, r.status]) },
    bonus: { label: "Bonus Summary", headers: ["Employee", "Month", "Type", "Amount", "Status"], rows: payrollBonuses.map((r) => [r.employeeName, r.month, r.type, r.amount || 0, r.status]) },
    loan: { label: "Loan & Advance Summary", headers: ["Employee", "Month", "Type", "Installments", "Amount", "Status"], rows: loans.map((r) => [r.employeeName, r.month, r.type, r.installments || "", r.amount || 0, r.status]) },
    settlement: { label: "Final Settlement Summary", headers: ["Employee", "Last Working Date", "Net Payable", "Status"], rows: finalSettlements.map((r) => [r.employeeName, r.lastWorkingDate, r.netPayable || 0, r.status]) },
  };
  const active = reports[reportType];
  const amountCol = active.headers.length - 2;
  const total = active.rows.reduce((s, r) => s + (Number(r[amountCol]) || 0), 0);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(reports).map(([key, r]) => (
          <Btn key={key} small variant={reportType === key ? "navy" : "quiet"} onClick={() => setReportType(key)}>{r.label}</Btn>
        ))}
      </div>
      <Panel
        title={active.label}
        right={<ExportBar title={active.label} headers={active.headers} rows={active.rows} filename={`payroll-report-${reportType}`} />}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {active.headers.map((h) => (
              <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {active.rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.line}` }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "9px 6px", fontWeight: j === 0 ? 700 : 400 }}>
                    {j === amountCol ? `৳ ${Number(cell || 0).toLocaleString()}` : (cell ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
            {active.rows.length === 0 && <tr><td colSpan={active.headers.length} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No data for this report yet.</td></tr>}
          </tbody>
          {active.rows.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: `2px solid ${T.ink}` }}>
                <td colSpan={amountCol} style={{ padding: "10px 6px", fontWeight: 700 }}>Total</td>
                <td style={{ padding: "10px 6px", fontWeight: 700, color: T.green }}>৳ {total.toLocaleString()}</td>
                <td colSpan={active.headers.length - amountCol - 1} />
              </tr>
            </tfoot>
          )}
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Payroll Settings                                                    */
/* ------------------------------------------------------------------ */
function PayrollSettings({ settings, setSettings }) {
  const [form, setForm] = useState(settings);
  useEffect(() => setForm(settings), [settings]);
  const upd = (k) => (v) => setForm({ ...form, [k]: v });
  const save = () => setSettings(form);
  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  return (
    <div style={{ padding: 24 }}>
      <Panel
        title="Payroll Settings"
        right={<Btn variant="primary" small onClick={save} disabled={!dirty}><Check size={13} /> Save Changes</Btn>}
        pad={0}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.canvas }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.3, color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>Title</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.3, color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <SettingRow title="Working Days per Month" note="Used as the default denominator when prorating pay by attendance.">
              <TInput type="number" value={form.workingDaysPerMonth} onChange={(e) => upd("workingDaysPerMonth")(Number(e.target.value))} style={{ maxWidth: 140 }} />
            </SettingRow>
            <SettingRow title="Overtime Rate Multiplier" note="Multiplier applied to hourly rate when computing Overtime pay.">
              <TInput type="number" step="0.1" value={form.otRateMultiplier} onChange={(e) => upd("otRateMultiplier")(Number(e.target.value))} style={{ maxWidth: 140 }} />
            </SettingRow>
            <SettingRow title="Standard Weekly Hours">
              <TInput type="number" value={form.weeklyHours} onChange={(e) => upd("weeklyHours")(Number(e.target.value))} style={{ maxWidth: 140 }} />
            </SettingRow>
            <SettingRow title="Round Net Pay" note="Rounds computed net pay to the nearest Taka.">
              <YesNoRow value={form.roundNetPay} onChange={upd("roundNetPay")} />
            </SettingRow>
            <SettingRow title="Auto Attendance Integration" note="Automatically pulls present/absent days into Monthly Payroll.">
              <YesNoRow value={form.autoAttendanceIntegration} onChange={upd("autoAttendanceIntegration")} />
            </SettingRow>
            <SettingRow title="Bank Advice Note" note="Shown at the top of the Bank Advice sheet.">
              <TInput value={form.bankAdviceNote} onChange={(e) => upd("bankAdviceNote")(e.target.value)} style={{ width: "100%" }} />
            </SettingRow>
            <SettingRow title="Payslip Footer Note" last>
              <TInput value={form.payslipFooterNote} onChange={(e) => upd("payslipFooterNote")(e.target.value)} style={{ width: "100%" }} />
            </SettingRow>
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Assets — Assets Category, Asset List, Logistic Support             */
/* ------------------------------------------------------------------ */
function AssetsCategory({ categories, setCategories }) {
  const [q, setQ] = useState("");
  const [form, setForm] = useState(false);
  const [name, setName] = useState("");

  const openNew = () => { setForm("new"); setName(""); };
  const openEdit = (c) => { setForm(c); setName(c.name); };
  const closeForm = () => setForm(false);

  const save = () => {
    if (!name.trim()) return;
    if (form === "new") {
      setCategories([{ id: Date.now(), name: name.trim(), createdAt: nowStamp(), updatedAt: nowStamp() }, ...categories]);
    } else {
      setCategories(categories.map((c) => (c.id === form.id ? { ...c, name: name.trim(), updatedAt: nowStamp() } : c)));
    }
    setForm(false);
  };
  const remove = (id) => setCategories(categories.filter((c) => c.id !== id));
  const filtered = categories.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {form && (
        <Panel title={form === "new" ? "Add Assets Category" : "Edit Assets Category"} right={<Btn variant="quiet" small onClick={closeForm}><X size={14} /> Cancel</Btn>}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Field label="Category Name" required><TInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Furniture" /></Field>
            </div>
            <div style={{ marginBottom: 14 }}>
              <Btn variant="primary" onClick={save}><Plus size={14} /> Save</Btn>
            </div>
          </div>
        </Panel>
      )}
      <Panel title="Assets Category" right={<Btn variant="primary" small onClick={openNew}><Plus size={14} /> Add Category</Btn>}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <ExportBar title="Assets Category" headers={["Id", "Name", "Created At", "Updated At"]} rows={filtered.map((c) => [c.id, c.name, c.createdAt, c.updatedAt])} filename="assets-category" />
          <div style={{ position: "relative", width: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: T.inkSoft }} />
            <TInput placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Id", "Name", "Created At", "Updated At", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{c.id}</td>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{c.name}</td>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{c.createdAt}</td>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{c.updatedAt}</td>
                <td style={{ padding: "10px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                  <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => openEdit(c)} />
                  <IconBtn icon={Trash2} tone={T.red} title="Delete" onClick={() => remove(c.id)} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No categories found.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

const ASSET_STATUSES = ["In Use", "In Store", "Under Repair", "Damaged", "Returned"];

function AssetList({ assets, setAssets, categories, employees, canEdit }) {
  const [q, setQ] = useState("");
  const [form, setForm] = useState(false);
  const [draft, setDraft] = useState({ name: "", category: categories[0]?.name || "", assignedTo: "", purchaseDate: "", value: "", status: "In Store" });

  const openNew = () => { setForm("new"); setDraft({ name: "", category: categories[0]?.name || "", assignedTo: "", purchaseDate: "", value: "", status: "In Store" }); };
  const openEdit = (a) => { setForm(a); setDraft(a); };
  const closeForm = () => setForm(false);

  const save = () => {
    if (!draft.name.trim()) return;
    if (form === "new") {
      setAssets([{ ...draft, id: `AST-${Date.now().toString().slice(-6)}`, createdAt: nowStamp() }, ...assets]);
    } else {
      setAssets(assets.map((a) => (a.id === form.id ? { ...draft, id: form.id, createdAt: form.createdAt } : a)));
    }
    setForm(false);
  };
  const remove = (id) => setAssets(assets.filter((a) => a.id !== id));
  const filtered = assets.filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {form && (
        <Panel title={form === "new" ? "Add Asset" : "Edit Asset"} right={<Btn variant="quiet" small onClick={closeForm}><X size={14} /> Cancel</Btn>}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
            <Field label="Asset Name" required><TInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Dell Laptop" /></Field>
            <Field label="Category">
              <TSelect value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                {categories.length === 0 && <option value="">Add a category first</option>}
              </TSelect>
            </Field>
            <Field label="Assigned To">
              <TSelect value={draft.assignedTo} onChange={(e) => setDraft({ ...draft, assignedTo: e.target.value })}>
                <option value="">— Store / Unassigned —</option>
                {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
              </TSelect>
            </Field>
            <Field label="Purchase Date"><TInput type="date" value={draft.purchaseDate} onChange={(e) => setDraft({ ...draft, purchaseDate: e.target.value })} /></Field>
            <Field label="Value (৳)"><TInput type="number" value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} /></Field>
            <Field label="Status">
              <TSelect value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                {ASSET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </TSelect>
            </Field>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <Btn variant="primary" onClick={save}><Plus size={14} /> Save</Btn>
          </div>
        </Panel>
      )}
      <Panel title={`Asset List — Total ${assets.length}`} right={canEdit && <Btn variant="primary" small onClick={openNew}><Plus size={14} /> Add Asset</Btn>}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <ExportBar
            title="Asset List"
            headers={["Asset ID", "Name", "Category", "Assigned To", "Purchase Date", "Value", "Status"]}
            rows={filtered.map((a) => [a.id, a.name, a.category, a.assignedTo || "Store", a.purchaseDate, a.value || 0, a.status])}
            filename="asset-list"
          />
          <div style={{ position: "relative", width: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: T.inkSoft }} />
            <TInput placeholder="Search by name or ID" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Asset ID", "Name", "Category", "Assigned To", "Purchase Date", "Value", "Status", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", color: T.inkSoft }}>{a.id}</td>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{a.name}</td>
                <td style={{ padding: "10px 6px" }}>{a.category || "—"}</td>
                <td style={{ padding: "10px 6px" }}>{a.assignedTo || "Store"}</td>
                <td style={{ padding: "10px 6px" }}>{a.purchaseDate || "—"}</td>
                <td style={{ padding: "10px 6px" }}>{a.value ? `৳ ${Number(a.value).toLocaleString()}` : "—"}</td>
                <td style={{ padding: "10px 6px" }}><Badge tone={a.status === "In Use" ? "green" : a.status === "Damaged" ? "red" : "slate"}>{a.status}</Badge></td>
                <td style={{ padding: "10px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                  {canEdit && <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => openEdit(a)} />}
                  {canEdit && <IconBtn icon={Trash2} tone={T.red} title="Delete" onClick={() => remove(a.id)} />}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No assets found.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

const LOGISTIC_STATUSES = ["Pending", "Approved", "In Progress", "Completed", "Cancelled"];

function LogisticSupport({ records, setRecords, employees, canEdit }) {
  const [q, setQ] = useState("");
  const [form, setForm] = useState(false);
  const [draft, setDraft] = useState({ requestedBy: "", supportType: "Vehicle", purpose: "", from: "", to: "", date: "", status: "Pending" });

  const openNew = () => { setForm("new"); setDraft({ requestedBy: employees[0]?.name || "", supportType: "Vehicle", purpose: "", from: "", to: "", date: "", status: "Pending" }); };
  const openEdit = (r) => { setForm(r); setDraft(r); };
  const closeForm = () => setForm(false);

  const save = () => {
    if (!draft.purpose.trim()) return;
    if (form === "new") {
      setRecords([{ ...draft, id: Date.now(), createdAt: nowStamp() }, ...records]);
    } else {
      setRecords(records.map((r) => (r.id === form.id ? { ...draft, id: form.id, createdAt: form.createdAt } : r)));
    }
    setForm(false);
  };
  const remove = (id) => setRecords(records.filter((r) => r.id !== id));
  const filtered = records.filter((r) => !q || r.purpose.toLowerCase().includes(q.toLowerCase()) || r.requestedBy?.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {form && (
        <Panel title={form === "new" ? "Add Logistic Support Request" : "Edit Logistic Support Request"} right={<Btn variant="quiet" small onClick={closeForm}><X size={14} /> Cancel</Btn>}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
            <Field label="Requested By">
              <TSelect value={draft.requestedBy} onChange={(e) => setDraft({ ...draft, requestedBy: e.target.value })}>
                {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
              </TSelect>
            </Field>
            <Field label="Support Type">
              <TSelect value={draft.supportType} onChange={(e) => setDraft({ ...draft, supportType: e.target.value })}>
                {["Vehicle", "Courier", "Transport", "Warehouse", "Other"].map((s) => <option key={s} value={s}>{s}</option>)}
              </TSelect>
            </Field>
            <Field label="Date"><TInput type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></Field>
            <Field label="From"><TInput value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} placeholder="e.g. Head Office" /></Field>
            <Field label="To"><TInput value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} placeholder="e.g. Gazipur Factory" /></Field>
            <Field label="Status">
              <TSelect value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                {LOGISTIC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </TSelect>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Purpose" required><TInput value={draft.purpose} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })} placeholder="e.g. Deliver raw materials to factory" /></Field>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <Btn variant="primary" onClick={save}><Plus size={14} /> Save</Btn>
          </div>
        </Panel>
      )}
      <Panel title={`Logistic Support — Total ${records.length}`} right={canEdit && <Btn variant="primary" small onClick={openNew}><Plus size={14} /> Add Request</Btn>}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <ExportBar
            title="Logistic Support"
            headers={["Requested By", "Support Type", "Purpose", "From", "To", "Date", "Status"]}
            rows={filtered.map((r) => [r.requestedBy, r.supportType, r.purpose, r.from, r.to, r.date, r.status])}
            filename="logistic-support"
          />
          <div style={{ position: "relative", width: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: T.inkSoft }} />
            <TInput placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left" }}>
            {["Requested By", "Support Type", "Purpose", "From", "To", "Date", "Status", ""].map((h) => <th key={h} style={{ padding: "9px 6px", fontSize: 11, textTransform: "uppercase", color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td style={{ padding: "10px 6px", fontWeight: 700 }}>{r.requestedBy || "—"}</td>
                <td style={{ padding: "10px 6px" }}>{r.supportType}</td>
                <td style={{ padding: "10px 6px" }}>{r.purpose}</td>
                <td style={{ padding: "10px 6px" }}>{r.from || "—"}</td>
                <td style={{ padding: "10px 6px" }}>{r.to || "—"}</td>
                <td style={{ padding: "10px 6px" }}>{r.date || "—"}</td>
                <td style={{ padding: "10px 6px" }}><Badge tone={r.status === "Completed" ? "green" : r.status === "Cancelled" ? "red" : r.status === "Pending" ? "orange" : "blue"}>{r.status}</Badge></td>
                <td style={{ padding: "10px 6px", textAlign: "right", whiteSpace: "nowrap" }}>
                  {canEdit && <IconBtn icon={Pencil} tone={T.amberDeep} title="Edit" onClick={() => openEdit(r)} />}
                  {canEdit && <IconBtn icon={Trash2} tone={T.red} title="Delete" onClick={() => remove(r.id)} />}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 20, textAlign: "center", color: T.inkSoft }}>No logistic support requests found.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Global Setting                                                      */
/* ------------------------------------------------------------------ */
function YesNoRow({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 18 }}>
      <RadioDot label="Yes" color={T.green} checked={!!value} onClick={() => onChange(true)} />
      <RadioDot label="No" color={T.slate} checked={!value} onClick={() => onChange(false)} />
    </div>
  );
}

function SettingRow({ title, note, children, last }) {
  return (
    <tr style={{ borderBottom: last ? "none" : `1px solid ${T.line}` }}>
      <td style={{ padding: "12px 14px", verticalAlign: "top", width: "55%" }}>
        <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 600 }}>{title}</div>
        {note && <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 3 }}>{note}</div>}
      </td>
      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>{children}</td>
    </tr>
  );
}

function GlobalSettings({ settings, setSettings }) {
  const [form, setForm] = useState(settings);
  useEffect(() => setForm(settings), [settings]);
  const upd = (k) => (v) => setForm({ ...form, [k]: v });
  const save = () => setSettings(form);
  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  return (
    <div style={{ padding: 24 }}>
      <Panel
        title="Global Setting"
        right={<Btn variant="primary" small onClick={save} disabled={!dirty}><Check size={13} /> Save Changes</Btn>}
        pad={0}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.canvas }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.3, color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>Title</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.3, color: T.inkSoft, borderBottom: `2px solid ${T.line}` }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <SettingRow title="General Store (Reference) Title Change" note="Reserved — will apply once a General Store module is added.">
              <TInput value={form.storeTitle} onChange={(e) => upd("storeTitle")(e.target.value)} placeholder="Custom title" style={{ maxWidth: 260 }} />
            </SettingRow>
            <SettingRow title="OutWork DatePicker All Open" note="Reserved — will apply once an Out Work module is added.">
              <YesNoRow value={form.outworkDatePickerAllOpen} onChange={upd("outworkDatePickerAllOpen")} />
            </SettingRow>
            <SettingRow title="Employee Summary Gross Salary Get" note="Shows a Gross Salary column in the Employee List.">
              <YesNoRow value={form.summaryGrossSalaryGet} onChange={upd("summaryGrossSalaryGet")} />
            </SettingRow>
            <SettingRow title="Finger Print Id Get Attendance Sheet" note="Reserved — will apply once an Attendance Sheet module is added.">
              <YesNoRow value={form.fingerPrintAttendanceSheet} onChange={upd("fingerPrintAttendanceSheet")} />
            </SettingRow>
            <SettingRow title="Set Employee List Card No" note="Shows a Card No column in the Employee List.">
              <YesNoRow value={form.cardNoInList} onChange={upd("cardNoInList")} />
            </SettingRow>
            <SettingRow title="Custom Employee Full Id" note="Shows company-prefixed Full ID (e.g. ATSM-21082061) instead of plain ID.">
              <YesNoRow value={form.customFullId} onChange={upd("customFullId")} />
            </SettingRow>
            <SettingRow title="Admin & Employee Login Option" note="Adds an Admin/Employee switch on the Login page.">
              <YesNoRow value={form.loginOption} onChange={upd("loginOption")} />
            </SettingRow>
            <SettingRow title="Employee Attendance Chart" note="Shows/hides the attendance chart on the Dashboard.">
              <YesNoRow value={form.attendanceChart} onChange={upd("attendanceChart")} />
            </SettingRow>
            <SettingRow title="Would you prefer which Dashboard?" note="Default hides per-company breakdown; Company Wise shows it.">
              <div style={{ display: "flex", gap: 18 }}>
                <RadioDot label="Default" color={T.blue} checked={form.dashboardPreference === "default"} onClick={() => upd("dashboardPreference")("default")} />
                <RadioDot label="Company Wise" color={T.blue} checked={form.dashboardPreference === "company"} onClick={() => upd("dashboardPreference")("company")} />
              </div>
            </SettingRow>
            <SettingRow title="Employee Line Number" note="Adds a Line field on the Employee form and a Line column in the list.">
              <YesNoRow value={form.lineNumber} onChange={upd("lineNumber")} />
            </SettingRow>
            <SettingRow title="Employee Signature" note="Adds a Signature field on the Employee form.">
              <YesNoRow value={form.signature} onChange={upd("signature")} />
            </SettingRow>
            <SettingRow title="Topbar Background Color (color name/code)" last>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="color" value={form.topbarColor} onChange={(e) => upd("topbarColor")(e.target.value)} style={{ width: 34, height: 30, border: `1px solid ${T.line}`, borderRadius: 6, padding: 0, cursor: "pointer" }} />
                <TInput value={form.topbarColor} onChange={(e) => upd("topbarColor")(e.target.value)} style={{ maxWidth: 140 }} />
              </div>
            </SettingRow>
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App shell                                                           */
/* ------------------------------------------------------------------ */
function NoDbBanner() {
  return (
    <div style={{
      background: "#FDF3E7", borderBottom: `1px solid ${T.amberDeep}`, color: T.amberDeep,
      padding: "9px 26px", fontSize: 12.5, display: "flex", alignItems: "center", gap: 8, fontWeight: 600,
    }}>
      <span style={{ fontSize: 15 }}>⚠</span>
      Supabase কানেক্ট করা নেই — যা যোগ করছেন তা এই ব্রাউজারেই সাময়িকভাবে থাকছে, রিফ্রেশ দিলে বা অন্য ডিভাইস থেকে খুললে হারিয়ে যাবে। স্থায়ীভাবে সেভ করতে README-এর "৪. শেয়ার্ড ডেটাবেস (Supabase)" ধাপ অনুসরণ করে <code>.env</code>-এ <code>VITE_SUPABASE_URL</code> ও <code>VITE_SUPABASE_ANON_KEY</code> যোগ করুন।
    </div>
  );
}

const TITLES = {
  dashboard: "Dashboard", employees: "Employee List", departments: "Department",
  holidays: "Holiday Calendar", shifts: "Shift Roster", bonus: "Bonus Type",
  gazette: "Gazette Calculation", useraccess: "User Access",
  group: "Group", probation: "Probation Period", globalsettings: "Global Setting",
  assetcategory: "Assets Category", assetlist: "Asset List", logisticsupport: "Logistic Support",
  salarystructure: "Salary Structure", salarysetup: "Employee Salary Setup",
  attendanceintegration: "Attendance Integration", overtime: "Overtime",
  allowance: "Allowance", deduction: "Deduction", payrollbonus: "Bonus",
  loanadvance: "Loan & Advance", monthlypayroll: "Monthly Payroll", payslip: "Payslip",
  bankadvice: "Bank Advice", finalsettlement: "Final Settlement",
  payrollreports: "Payroll Reports", payrollsettings: "Payroll Settings",
};
const PERM_OF = {
  dashboard: "Dashboard", employees: "Employees", departments: "Departments", holidays: "Holidays",
  shifts: "Shifts", bonus: "Bonus", gazette: "Gazette", useraccess: "User Access",
  group: "Employee Group", probation: "Probation Period", globalsettings: "Global Setting",
  assetcategory: "Assets Category", assetlist: "Asset List", logisticsupport: "Logistic Support",
  salarystructure: "Payroll", salarysetup: "Payroll", attendanceintegration: "Payroll",
  overtime: "Payroll", allowance: "Payroll", deduction: "Payroll", payrollbonus: "Payroll",
  loanadvance: "Payroll", monthlypayroll: "Payroll", payslip: "Payroll", bankadvice: "Payroll",
  finalsettlement: "Payroll", payrollreports: "Payroll", payrollsettings: "Payroll",
};

export default function App() {
  const [booting, setBooting] = useState(true);
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(null);
  const [view, setView] = useState("dashboard");

  const [employees, setEmployees] = useSynced(STORE_KEYS.employees, seedEmployees, ready);
  const [departments, setDepartments] = useSynced(STORE_KEYS.departments, seedDepartments, ready);
  const [holidays, setHolidays] = useSynced(STORE_KEYS.holidays, seedHolidays, ready);
  const [shifts, setShifts] = useSynced(STORE_KEYS.shifts, seedShifts, ready);
  const [bonusTypes, setBonusTypes] = useSynced(STORE_KEYS.bonusTypes, seedBonusTypes, ready);
  const [gazettes, setGazettes] = useSynced(STORE_KEYS.gazettes, seedGazettes, ready);
  const [users, setUsers] = useSynced(STORE_KEYS.users, seedUsers, ready);
  const [salarySheets, setSalarySheets] = useSynced(STORE_KEYS.salarySheets, {}, ready);
  const [employeeGroups, setEmployeeGroups] = useSynced(STORE_KEYS.employeeGroups, seedEmployeeGroups, ready);
  const [probationPeriods, setProbationPeriods] = useSynced(STORE_KEYS.probationPeriods, seedProbationPeriods, ready);
  const [globalSettings, setGlobalSettings] = useSynced(STORE_KEYS.globalSettings, defaultGlobalSettings, ready);
  const [payrollRecords, setPayrollRecords] = useSynced(STORE_KEYS.payrollRecords, [], ready);
  const [assetCategories, setAssetCategories] = useSynced(STORE_KEYS.assetCategories, [], ready);
  const [assets, setAssets] = useSynced(STORE_KEYS.assets, [], ready);
  const [logisticSupport, setLogisticSupport] = useSynced(STORE_KEYS.logisticSupport, [], ready);
  const [salaryStructures, setSalaryStructures] = useSynced(STORE_KEYS.salaryStructures, [], ready);
  const [overtimeRecords, setOvertimeRecords] = useSynced(STORE_KEYS.overtimeRecords, [], ready);
  const [allowances, setAllowances] = useSynced(STORE_KEYS.allowances, [], ready);
  const [deductions, setDeductions] = useSynced(STORE_KEYS.deductions, [], ready);
  const [payrollBonuses, setPayrollBonuses] = useSynced(STORE_KEYS.payrollBonuses, [], ready);
  const [loans, setLoans] = useSynced(STORE_KEYS.loans, [], ready);
  const [finalSettlements, setFinalSettlements] = useSynced(STORE_KEYS.finalSettlements, [], ready);
  const [bankAccounts, setBankAccounts] = useSynced(STORE_KEYS.bankAccounts, {}, ready);
  const [payrollSettings, setPayrollSettings] = useSynced(STORE_KEYS.payrollSettings, defaultPayrollSettings, ready);
  const [salaryRevisions, setSalaryRevisions] = useSynced(STORE_KEYS.salaryRevisions, [], ready);

  useEffect(() => {
    (async () => {
      const [emp, dep, hol, shf, bon, gaz, usr, sal, grp, prb, gset, pay, acat, ast, logi, sstr, ot, alw, ded, pbon, lns, fset, bacc, pset, srev] = await Promise.all([
        storageGet(STORE_KEYS.employees), storageGet(STORE_KEYS.departments),
        storageGet(STORE_KEYS.holidays), storageGet(STORE_KEYS.shifts),
        storageGet(STORE_KEYS.bonusTypes), storageGet(STORE_KEYS.gazettes),
        storageGet(STORE_KEYS.users),
        storageGet(STORE_KEYS.salarySheets),
        storageGet(STORE_KEYS.employeeGroups),
        storageGet(STORE_KEYS.probationPeriods),
        storageGet(STORE_KEYS.globalSettings),
        storageGet(STORE_KEYS.payrollRecords),
        storageGet(STORE_KEYS.assetCategories),
        storageGet(STORE_KEYS.assets),
        storageGet(STORE_KEYS.logisticSupport),
        storageGet(STORE_KEYS.salaryStructures),
        storageGet(STORE_KEYS.overtimeRecords),
        storageGet(STORE_KEYS.allowances),
        storageGet(STORE_KEYS.deductions),
        storageGet(STORE_KEYS.payrollBonuses),
        storageGet(STORE_KEYS.loans),
        storageGet(STORE_KEYS.finalSettlements),
        storageGet(STORE_KEYS.bankAccounts),
        storageGet(STORE_KEYS.payrollSettings),
        storageGet(STORE_KEYS.salaryRevisions),
      ]);
      const session = sessionGet();
      if (emp) setEmployees(emp);
      if (dep) setDepartments(dep);
      if (hol) setHolidays(hol);
      if (shf) setShifts(shf);
      if (bon) setBonusTypes(bon);
      if (gaz) setGazettes(gaz);
      if (sal) setSalarySheets(sal);
      if (grp) setEmployeeGroups(grp);
      if (prb) setProbationPeriods(prb);
      if (gset) setGlobalSettings({ ...defaultGlobalSettings, ...gset });
      if (pay) setPayrollRecords(pay);
      if (acat) setAssetCategories(acat);
      if (ast) setAssets(ast);
      if (logi) setLogisticSupport(logi);
      if (sstr) setSalaryStructures(sstr);
      if (ot) setOvertimeRecords(ot);
      if (alw) setAllowances(alw);
      if (ded) setDeductions(ded);
      if (pbon) setPayrollBonuses(pbon);
      if (lns) setLoans(lns);
      if (fset) setFinalSettlements(fset);
      if (bacc) setBankAccounts(bacc);
      if (pset) setPayrollSettings({ ...defaultPayrollSettings, ...pset });
      if (srev) setSalaryRevisions(srev);
      const finalUsers = usr || seedUsers;
      if (usr) setUsers(usr);
      if (session) {
        const u = finalUsers.find((x) => x.id === session.id);
        if (u) setAuthed(u);
      }
      setBooting(false);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (u) => {
    setAuthed(u);
    sessionSet({ id: u.id });
    setView("dashboard");
  };
  const logout = () => {
    setAuthed(null);
    sessionSet(null);
  };

  const addEmployee = (emp) => setEmployees([emp, ...employees]);
  const removeEmployee = (id) => setEmployees(employees.filter((e) => e.id !== id));

  if (booting) {
    return (
      <div style={{ minHeight: "100vh", background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", gap: 10, fontFamily: BODY_FONT }}>
        <GoogleFonts />
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 13 }}>Loading HRM register…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!authed) return <Login users={users} onLogin={login} loginOption={globalSettings.loginOption} />;

  const allowed = ROLE_PERMS[authed.role] || [];
  const canEdit = authed.role !== "Viewer";
  const safeView = allowed.includes(PERM_OF[view]) ? view : "dashboard";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.canvas, fontFamily: BODY_FONT, color: T.ink }}>
      <GoogleFonts />
      <Sidebar view={safeView} setView={setView} allowed={allowed} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {!supabase && <NoDbBanner />}
        <Topbar title={TITLES[safeView]} user={authed} onLogout={logout} bgColor={globalSettings.topbarColor} />
        {safeView === "dashboard" && <Dashboard employees={employees} settings={globalSettings} />}
        {safeView === "globalsettings" && <GlobalSettings settings={globalSettings} setSettings={setGlobalSettings} />}
        {safeView === "employees" && <EmployeeList employees={employees} departments={departments} groups={employeeGroups} onAdd={addEmployee} onDelete={removeEmployee} canEdit={canEdit} settings={globalSettings} />}
        {safeView === "departments" && <Departments departments={departments} setDepartments={setDepartments} />}
        {safeView === "holidays" && <HolidayCalendar holidays={holidays} setHolidays={setHolidays} />}
        {safeView === "shifts" && <Shifts shifts={shifts} setShifts={setShifts} />}
        {safeView === "bonus" && <BonusTypes bonusTypes={bonusTypes} setBonusTypes={setBonusTypes} />}
        {safeView === "gazette" && <GazetteCalc gazettes={gazettes} setGazettes={setGazettes} />}
        {safeView === "group" && <EmployeeGroups groups={employeeGroups} setGroups={setEmployeeGroups} />}
        {safeView === "probation" && <ProbationPeriod periods={probationPeriods} setPeriods={setProbationPeriods} />}
        {safeView === "salarystructure" && <SalaryStructure structures={salaryStructures} setStructures={setSalaryStructures} canEdit={canEdit} />}
        {safeView === "salarysetup" && <EmployeeSalarySetup employees={employees} setEmployees={setEmployees} gazettes={gazettes} revisions={salaryRevisions} setRevisions={setSalaryRevisions} canEdit={canEdit} />}
        {safeView === "attendanceintegration" && <AttendanceIntegration employees={employees} settings={payrollSettings} setSettings={setPayrollSettings} canEdit={canEdit} />}
        {safeView === "overtime" && <Overtime employees={employees} records={overtimeRecords} setRecords={setOvertimeRecords} canEdit={canEdit} otRateMultiplier={payrollSettings.otRateMultiplier} />}
        {safeView === "allowance" && <Allowance employees={employees} records={allowances} setRecords={setAllowances} canEdit={canEdit} />}
        {safeView === "deduction" && <Deduction employees={employees} records={deductions} setRecords={setDeductions} canEdit={canEdit} />}
        {safeView === "payrollbonus" && <PayrollBonus employees={employees} bonusTypes={bonusTypes} records={payrollBonuses} setRecords={setPayrollBonuses} canEdit={canEdit} />}
        {safeView === "loanadvance" && <LoanAdvance employees={employees} records={loans} setRecords={setLoans} canEdit={canEdit} />}
        {safeView === "monthlypayroll" && <SalarySheet employees={employees} gazettes={gazettes} salarySheets={salarySheets} setSalarySheets={setSalarySheets} canEdit={canEdit} />}
        {safeView === "payslip" && (
          <PayrollList employees={employees} gazettes={gazettes} records={payrollRecords} setRecords={setPayrollRecords} canEdit={canEdit} />
        )}
        {safeView === "bankadvice" && <BankAdvice employees={employees} bankAccounts={bankAccounts} setBankAccounts={setBankAccounts} payrollSettings={payrollSettings} />}
        {safeView === "finalsettlement" && <FinalSettlement employees={employees} records={finalSettlements} setRecords={setFinalSettlements} canEdit={canEdit} />}
        {safeView === "payrollreports" && (
          <PayrollReports
            payrollRecords={payrollRecords}
            overtimeRecords={overtimeRecords}
            allowances={allowances}
            deductions={deductions}
            payrollBonuses={payrollBonuses}
            loans={loans}
            finalSettlements={finalSettlements}
          />
        )}
        {safeView === "payrollsettings" && <PayrollSettings settings={payrollSettings} setSettings={setPayrollSettings} />}
        {safeView === "useraccess" && <UserAccess users={users} setUsers={setUsers} currentUser={authed} />}
        {safeView === "assetcategory" && <AssetsCategory categories={assetCategories} setCategories={setAssetCategories} />}
        {safeView === "assetlist" && <AssetList assets={assets} setAssets={setAssets} categories={assetCategories} employees={employees} canEdit={canEdit} />}
        {safeView === "logisticsupport" && <LogisticSupport records={logisticSupport} setRecords={setLogisticSupport} employees={employees} canEdit={canEdit} />}
      </div>
    </div>
  );
}
