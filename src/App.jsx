import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutGrid, Users, Building2, CalendarDays, Clock, Award, Calculator,
  Search, Plus, Pencil, Trash2, ChevronRight, ChevronLeft, ChevronDown, Check, X,
  Bell, UserPlus, Eye, KeyRound, Lock, LogOut, Loader2, Settings, Layers,
  Factory, UserCog, FileSpreadsheet, ChevronsRight, Wallet, Printer, RefreshCcw,
  SlidersHorizontal, PenLine,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import companyLogo from "./assets/company-logo.png";

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
  Admin: ["Dashboard", "Employees", "Departments", "Holidays", "Shifts", "Bonus", "Gazette", "Salary", "User Access", "Employee Group", "Probation Period", "Global Setting"],
  "HR Manager": ["Dashboard", "Employees", "Departments", "Holidays", "Shifts", "Bonus", "Salary", "Employee Group", "Probation Period"],
  Viewer: ["Dashboard", "Employees"],
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
  { key: "salary", label: "Salary", icon: Wallet, perm: "Salary" },
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
  const [openGroup, setOpenGroup] = useState("hrsetup");
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

  return (
    <div style={{ padding: 24 }}>
      <Panel title={`Employee List — Total ${employees.length}`} right={canEdit && (
        <Btn variant="primary" onClick={() => setAdding(true)}><UserPlus size={14} /> Add Employee</Btn>
      )}>
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
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 12.5, color: T.inkSoft }}>
          <span>Display 10 records</span>
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
        <Panel title="Bonus Types">
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

function Salary({ employees, setEmployees, gazettes, salarySheets, setSalarySheets, canEdit }) {
  const [tab, setTab] = useState("setup");
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant={tab === "setup" ? "navy" : "quiet"} onClick={() => setTab("setup")}><Wallet size={14} /> Salary Setup</Btn>
        <Btn variant={tab === "sheet" ? "navy" : "quiet"} onClick={() => setTab("sheet")}><FileSpreadsheet size={14} /> Monthly Salary Sheet</Btn>
      </div>
      {tab === "setup"
        ? <SalarySetup employees={employees} setEmployees={setEmployees} gazettes={gazettes} canEdit={canEdit} />
        : <SalarySheet employees={employees} gazettes={gazettes} salarySheets={salarySheets} setSalarySheets={setSalarySheets} canEdit={canEdit} />}
    </div>
  );
}

function SalarySetup({ employees, setEmployees, gazettes, canEdit }) {
  const [q, setQ] = useState("");
  const [edited, setEdited] = useState({});
  const month = currentMonthStr();
  const gz = gazetteFor(month, gazettes);

  const filtered = employees.filter((e) => !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.id.includes(q));

  const setDraft = (id, val) => setEdited({ ...edited, [id]: val });
  const save = (id) => {
    const val = edited[id];
    if (val === undefined || val === "") return;
    setEmployees(employees.map((e) => (e.id === id ? { ...e, grossSalary: Number(val) } : e)));
    const next = { ...edited };
    delete next[id];
    setEdited(next);
  };

  return (
    <Panel
      title={`Salary Setup — ${employees.length} employees`}
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
    <Panel
      title="Monthly Salary Sheet"
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
  gazette: "Gazette Calculation", salary: "Salary", useraccess: "User Access",
  group: "Group", probation: "Probation Period", globalsettings: "Global Setting",
};
const PERM_OF = { dashboard: "Dashboard", employees: "Employees", departments: "Departments", holidays: "Holidays", shifts: "Shifts", bonus: "Bonus", gazette: "Gazette", salary: "Salary", useraccess: "User Access", group: "Employee Group", probation: "Probation Period", globalsettings: "Global Setting" };

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

  useEffect(() => {
    (async () => {
      const [emp, dep, hol, shf, bon, gaz, usr, sal, grp, prb, gset] = await Promise.all([
        storageGet(STORE_KEYS.employees), storageGet(STORE_KEYS.departments),
        storageGet(STORE_KEYS.holidays), storageGet(STORE_KEYS.shifts),
        storageGet(STORE_KEYS.bonusTypes), storageGet(STORE_KEYS.gazettes),
        storageGet(STORE_KEYS.users),
        storageGet(STORE_KEYS.salarySheets),
        storageGet(STORE_KEYS.employeeGroups),
        storageGet(STORE_KEYS.probationPeriods),
        storageGet(STORE_KEYS.globalSettings),
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
        {safeView === "salary" && (
          <Salary
            employees={employees}
            setEmployees={setEmployees}
            gazettes={gazettes}
            salarySheets={salarySheets}
            setSalarySheets={setSalarySheets}
            canEdit={canEdit}
          />
        )}
        {safeView === "useraccess" && <UserAccess users={users} setUsers={setUsers} currentUser={authed} />}
      </div>
    </div>
  );
}
