import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, History, Settings, Users, Camera, Shield,
  AlertTriangle, CheckCircle, Bell, LogOut, Eye, UserPlus,
  BookOpen, TrendingUp, Clock, Scan, Zap, Activity, Award,
  ChevronRight, RefreshCw, X, Menu, User, GraduationCap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const CYAN = "#00F5FF";
const EMERALD = "#00FF41";
const RED_ALERT = "#FF2D55";
const AMBER = "#FFB800";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
};

const neonCyan: React.CSSProperties = { boxShadow: `0 0 16px ${CYAN}44, 0 0 2px ${CYAN}88` };
const neonGreen: React.CSSProperties = { boxShadow: `0 0 16px ${EMERALD}44, 0 0 2px ${EMERALD}88` };
const neonRed: React.CSSProperties = { boxShadow: `0 0 16px ${RED_ALERT}44, 0 0 2px ${RED_ALERT}88` };

interface Student {
  id: string;
  name: string;
  roll: string;
  dept: string;
  year: number;
  photo: string;
  present: number;
  total: number;
  class: "student";
  password?: string;
}

interface Teacher {
  id: string;
  name: string;
  empId: string;
  dept: string;
  subject: string;
  photo: string;
  class: "teacher";
  password?: string;
}

type UserRecord = Student | Teacher;

const DEFAULT_STUDENTS: Student[] = [
  { id: "S001", name: "Arjun Reddy", roll: "21CS101", dept: "CSE", year: 3, photo: "AR", present: 38, total: 45, class: "student" },
  { id: "S002", name: "Priya Sharma", roll: "21CS102", dept: "CSE", year: 3, photo: "PS", present: 42, total: 45, class: "student" },
  { id: "S003", name: "Rahul Kumar", roll: "21CS103", dept: "CSE", year: 3, photo: "RK", present: 29, total: 45, class: "student" },
  { id: "S004", name: "Sneha Patel", roll: "21CS104", dept: "CSE", year: 3, photo: "SP", present: 44, total: 45, class: "student" },
  { id: "S005", name: "Vikram Nair", roll: "21CS105", dept: "CSE", year: 3, photo: "VN", present: 35, total: 45, class: "student" },
  { id: "S006", name: "Divya Iyer", roll: "21CS106", dept: "CSE", year: 3, photo: "DI", present: 40, total: 45, class: "student" },
];

const DEFAULT_TEACHERS: Teacher[] = [
  { id: "T001", name: "Dr. Suresh Babu", empId: "EMP001", dept: "CSE", subject: "Data Structures", photo: "SB", class: "teacher" },
  { id: "T002", name: "Prof. Meena Rao", empId: "EMP002", dept: "CSE", subject: "Machine Learning", photo: "MR", class: "teacher" },
];

const weeklyData = [
  { day: "Mon", present: 52, absent: 8 }, { day: "Tue", present: 58, absent: 2 },
  { day: "Wed", present: 48, absent: 12 }, { day: "Thu", present: 55, absent: 5 },
  { day: "Fri", present: 50, absent: 10 }, { day: "Sat", present: 45, absent: 15 },
];

const monthlyData = [
  { month: "Jan", rate: 88 }, { month: "Feb", rate: 91 }, { month: "Mar", rate: 85 },
  { month: "Apr", rate: 93 }, { month: "May", rate: 79 }, { month: "Jun", rate: 94 },
];

const liveLog = [
  { name: "Arjun Reddy", time: "09:01:23", status: "present", roll: "21CS101", conf: 99.2 },
  { name: "Priya Sharma", time: "09:02:11", status: "present", roll: "21CS102", conf: 98.7 },
  { name: "Sneha Patel", time: "09:03:45", status: "present", roll: "21CS104", conf: 97.9 },
  { name: "Divya Iyer", time: "09:04:12", status: "present", roll: "21CS106", conf: 99.5 },
  { name: "Unknown Face", time: "09:05:31", status: "fraud", roll: "—", conf: 0 },
  { name: "Vikram Nair", time: "09:06:08", status: "present", roll: "21CS105", conf: 96.1 },
];

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#000;font-family:'Poppins',sans-serif;color:#fff;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:rgba(255,255,255,0.02)}::-webkit-scrollbar-thumb{background:rgba(0,245,255,0.3);border-radius:4px}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinReverse{to{transform:rotate(-360deg)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.05)}}
@keyframes pulseRed{0%,100%{box-shadow:0 0 40px #FF2D5566,0 0 8px #FF2D55cc}50%{box-shadow:0 0 80px #FF2D55bb,0 0 24px #FF2D55ff}}
@keyframes scanLine{0%{top:0%}100%{top:100%}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 16px #00F5FF44,0 0 2px #00F5FF88}50%{box-shadow:0 0 40px #00FF4188,0 0 8px #00FF41cc}}
@keyframes gridAnim{0%{transform:translateY(0)}100%{transform:translateY(40px)}}
@keyframes dotPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.8);opacity:0.6}}
@keyframes checkPop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes fraudFlash{0%,100%{background:rgba(255,45,85,0.08)}50%{background:rgba(255,45,85,0.22)}}
@keyframes stepReveal{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
.fade-up{animation:fadeUp 0.5s ease forwards}
.fade-in{animation:fadeIn 0.4s ease forwards}
.slide-in{animation:slideIn 0.4s ease forwards}
.check-pop{animation:checkPop 0.4s cubic-bezier(.34,1.56,.64,1) forwards}
.step-reveal{animation:stepReveal 0.3s ease forwards}
input,select{outline:none}
input:focus{border-color:rgba(0,245,255,0.5)!important;box-shadow:0 0 0 2px rgba(0,245,255,0.15)!important}
input[type="password"]{letter-spacing:0.15em;font-family:monospace;}
`;

function GridBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: -40, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(0,245,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.8) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        animation: "gridAnim 4s linear infinite",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,245,255,0.03) 0%, transparent 70%)" }} />
    </div>
  );
}

function Avatar({ initials, size = 36, color = CYAN }: { initials: string; size?: number; color?: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = CYAN, delay = 0, sub }: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string; value: string | number; color?: string; delay?: number; sub?: string;
}) {
  return (
    <div className="fade-up" style={{ ...glass, padding: "20px 24px", borderColor: `${color}33`, boxShadow: `0 0 20px ${color}22`, animation: `fadeUp 0.5s ease ${delay}s both` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Sidebar({ page, setPage, user, onLogout }: {
  page: string;
  setPage: (p: string) => void;
  user: UserRecord | null;
  onLogout: () => void;
}) {
  const items = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "attendance", icon: History, label: "Attendance" },
    { id: "students", icon: Users, label: user?.class === "teacher" ? "Students" : "My Record" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];
  return (
    <div style={{ ...glass, width: 64, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", gap: 8, borderRadius: 0, borderRight: "1px solid rgba(0,245,255,0.1)", borderLeft: "none", borderTop: "none", borderBottom: "none", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${CYAN}22`, border: `1px solid ${CYAN}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Scan size={18} color={CYAN} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        {items.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setPage(id)} title={label} style={{ width: "100%", padding: "12px 0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0, background: page === id ? `${CYAN}15` : "transparent", borderLeft: page === id ? `2px solid ${CYAN}` : "2px solid transparent", transition: "all 0.2s" }}>
            <Icon size={18} color={page === id ? CYAN : "rgba(255,255,255,0.35)"} />
          </button>
        ))}
      </div>
      <button onClick={onLogout} title="Logout" style={{ width: "100%", padding: "12px 0", border: "none", cursor: "pointer", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LogOut size={16} color="rgba(255,77,77,0.7)" />
      </button>
    </div>
  );
}

function ScannerHUD({ scanning, recognized, fraudAlert, size = 280, videoRef, cameraActive }: {
  scanning: boolean; recognized: boolean; fraudAlert: boolean;
  size?: number; videoRef: React.RefObject<HTMLVideoElement | null>; cameraActive: boolean;
}) {
  const ringColor = fraudAlert ? RED_ALERT : recognized ? EMERALD : CYAN;
  const outerAnim = fraudAlert
    ? "pulseRed 0.5s ease infinite"
    : recognized
    ? "glowPulse 1s ease infinite"
    : "none";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `2px solid ${ringColor}`,
        animation: outerAnim,
        boxShadow: fraudAlert
          ? `0 0 60px ${RED_ALERT}77, inset 0 0 40px ${RED_ALERT}11`
          : `0 0 40px ${ringColor}55, inset 0 0 40px ${ringColor}11`,
        transition: "all 0.4s",
      }} />
      <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `1px dashed ${ringColor}44`, animation: "spin 8s linear infinite" }} />
      <div style={{ position: "absolute", inset: 16, borderRadius: "50%", border: `1px dashed ${ringColor}22`, animation: "spinReverse 12s linear infinite" }} />
      <div style={{ position: "absolute", inset: 24, borderRadius: "50%", overflow: "hidden", background: fraudAlert ? "rgba(40,0,0,0.9)" : "rgba(0,0,0,0.8)" }}>
        {cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", transform: "scaleX(-1)" }}
          />
        )}
        {!cameraActive && (
          <div style={{ width: "100%", height: "100%", background: fraudAlert ? "linear-gradient(135deg,rgba(255,45,85,0.08) 0%,transparent 100%)" : "linear-gradient(135deg, rgba(0,245,255,0.05) 0%, transparent 50%, rgba(0,255,65,0.05) 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
            {fraudAlert ? <AlertTriangle size={32} color={`${RED_ALERT}cc`} /> : <Camera size={32} color={`${ringColor}88`} />}
            <span style={{ fontSize: 9, color: `${ringColor}cc`, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
              {fraudAlert ? "FRAUD DETECTED" : recognized ? "IDENTIFIED" : scanning ? "SCANNING..." : "READY"}
            </span>
          </div>
        )}
        {cameraActive && (
          <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2 }}>
            <span style={{ fontSize: 8, color: scanning ? `${CYAN}ee` : `${EMERALD}ee`, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, background: "rgba(0,0,0,0.55)", padding: "2px 8px", borderRadius: 4 }}>
              {scanning ? "ANALYZING..." : recognized ? "VERIFIED ✓" : "CAMERA ON"}
            </span>
          </div>
        )}
        {scanning && (
          <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ringColor}, transparent)`, animation: "scanLine 1.5s ease-in-out infinite", zIndex: 3 }} />
        )}
        {fraudAlert && (
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", animation: "fraudFlash 0.5s ease infinite", zIndex: 3 }} />
        )}
      </div>
      {[0, 90, 180, 270].map(deg => (
        <div key={deg} style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: 1, background: `${ringColor}22`, transformOrigin: "0 0", transform: `rotate(${deg}deg)` }} />
      ))}
      {[
        { top: 4, left: 4, borderTop: `2px solid ${ringColor}`, borderLeft: `2px solid ${ringColor}`, borderRadius: "8px 0 0 0" },
        { top: 4, right: 4, borderTop: `2px solid ${ringColor}`, borderRight: `2px solid ${ringColor}`, borderRadius: "0 8px 0 0" },
        { bottom: 4, left: 4, borderBottom: `2px solid ${ringColor}`, borderLeft: `2px solid ${ringColor}`, borderRadius: "0 0 0 8px" },
        { bottom: 4, right: 4, borderBottom: `2px solid ${ringColor}`, borderRight: `2px solid ${ringColor}`, borderRadius: "0 0 8px 0" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 18, height: 18, ...s, transition: "all 0.4s" } as React.CSSProperties} />
      ))}
      <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: ringColor, animation: "dotPulse 1s ease infinite", transition: "background 0.4s" }} />
    </div>
  );
}

const FRAUD_STEPS = [
  { key: "liveness", label: "Liveness Detection", desc: "Blink & micro-movement analysis", icon: Eye },
  { key: "depth", label: "3D Depth Check", desc: "IR sensor depth mapping", icon: Scan },
  { key: "spoof", label: "Photo Spoof Detection", desc: "Texture & reflection analysis", icon: Shield },
  { key: "multiface", label: "Single Face Verified", desc: "No proxy face detected", icon: Users },
];

interface Checks { liveness: boolean; depth: boolean; spoof: boolean; multiface: boolean; }

function AntiFraudPanel({ checks, scanning, fraudAlert }: {
  checks: Checks; scanning: boolean; fraudAlert: boolean; captured: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>Anti-Fraud Verification</p>
      {FRAUD_STEPS.map(({ key, label, desc, icon: Icon }, idx) => {
        const done = checks[key as keyof Checks];
        const isCurrent = scanning && Object.values(checks).filter(Boolean).length === idx;
        const color = fraudAlert && done ? RED_ALERT : done ? EMERALD : "rgba(255,255,255,0.2)";
        return (
          <div key={key} className={done ? "step-reveal" : ""} style={{
            ...glass, padding: "12px 16px",
            borderColor: done ? (fraudAlert ? `${RED_ALERT}33` : `${EMERALD}33`) : "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12,
            transition: "all 0.5s",
            animation: isCurrent ? "pulse 0.5s ease infinite" : "none",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: done ? (fraudAlert ? `${RED_ALERT}15` : `${EMERALD}15`) : "rgba(255,255,255,0.04)", border: `1px solid ${done ? color : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s" }}>
              <Icon size={15} color={done ? color : "rgba(255,255,255,0.2)"} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: done ? "#fff" : "rgba(255,255,255,0.35)", transition: "color 0.4s" }}>{label}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{desc}</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: done ? color : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s" }}>
              {done && <CheckCircle size={12} color={fraudAlert ? "#fff" : "#000"} className="check-pop" />}
              {isCurrent && !done && <div style={{ width: 8, height: 8, borderRadius: "50%", background: CYAN, animation: "dotPulse 0.6s ease infinite" }} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LoginPage({ onLogin, registeredUsers }: {
  onLogin: (u: UserRecord | { goto: string }) => void;
  registeredUsers: UserRecord[];
}) {
  const [form, setForm] = useState({ id: "", pass: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = async () => {
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 900));
    const allUsers: UserRecord[] = [
      ...DEFAULT_STUDENTS,
      ...DEFAULT_TEACHERS,
      ...registeredUsers,
    ];
    const found = allUsers.find(u => {
      const idMatch = (u.class === "student" ? (u as Student).roll : (u as Teacher).empId) === form.id;
      const roleMatch = u.class === form.role;
      return idMatch && roleMatch;
    });
    if (found) {
      const expectedPassword = found.password || "pass123";
      if (form.pass === expectedPassword) {
        onLogin(found);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } else {
      setError("User not found. Check your ID and role selection.");
    }
    setLoading(false);
  };

  const inp: React.CSSProperties = { ...glass, border: "1px solid rgba(255,255,255,0.15)", width: "100%", padding: "12px 16px", color: "#fff", fontSize: 14, background: "rgba(0,0,0,0.4)", borderRadius: 10, fontFamily: "Poppins" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="fade-up" style={{ ...glass, ...neonCyan, padding: 40, width: "100%", maxWidth: 400, borderColor: `${CYAN}33` }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${CYAN}15`, border: `1px solid ${CYAN}44`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Scan size={28} color={CYAN} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Smart Attendance</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>AI-Powered Face Recognition System</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["student", "teacher"].map(r => (
            <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))} style={{ flex: 1, padding: "10px", border: `1px solid ${form.role === r ? CYAN : "rgba(255,255,255,0.1)"}`, borderRadius: 10, background: form.role === r ? `${CYAN}15` : "transparent", color: form.role === r ? CYAN : "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "Poppins", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {r === "student" ? <GraduationCap size={14} /> : <BookOpen size={14} />}
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input style={inp} placeholder={form.role === "student" ? "Roll Number (e.g. 21CS101)" : "Employee ID (e.g. EMP001)"} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} />
          <div style={{ position: "relative" }}>
            <input
              style={{ ...inp, paddingRight: 44 }}
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              value={form.pass}
              onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handle()}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: showPass ? CYAN : "rgba(255,255,255,0.35)", padding: 4, display: "flex", alignItems: "center" }}
            >
              <Eye size={15} />
            </button>
          </div>
          {error && <p style={{ fontSize: 12, color: RED_ALERT, padding: "8px 12px", background: `${RED_ALERT}11`, borderRadius: 8 }}>{error}</p>}
          <button onClick={handle} disabled={loading} style={{ padding: "14px", border: `1px solid ${CYAN}`, borderRadius: 10, background: loading ? "rgba(0,245,255,0.05)" : `${CYAN}15`, color: CYAN, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins", transition: "all 0.2s", ...neonCyan }}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
          <button onClick={() => onLogin({ goto: "register" })} style={{ padding: "10px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "Poppins" }}>
            New user? Register here →
          </button>
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 16 }}>Default users: roll/empId + password "pass123"</p>
      </div>
    </div>
  );
}

function RegisterPage({ onBack, onRegister }: {
  onBack: () => void;
  onRegister: (user: UserRecord) => void;
}) {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [fraudResult, setFraudResult] = useState<"clear" | "fraud" | null>(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", id: "", dept: "CSE", year: "3", subject: "", password: "", confirmPassword: "" });
  const [checks, setChecks] = useState<Checks>({ liveness: false, depth: false, spoof: false, multiface: false });
  const [formError, setFormError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const goStep1 = () => {
    stopCamera();
    setStep(1);
    setScanning(false);
    setCaptured(false);
    setFraudResult(null);
    setCameraError("");
    setChecks({ liveness: false, depth: false, spoof: false, multiface: false });
  };

  useEffect(() => { return () => stopCamera(); }, []);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    }
  }, [cameraActive]);

  const runScan = async () => {
    if (scanning) return;
    setCaptured(false);
    setFraudResult(null);
    setCameraError("");
    setChecks({ liveness: false, depth: false, spoof: false, multiface: false });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      streamRef.current = stream;
      setCameraActive(true);
    } catch {
      setCameraError("Camera access denied. Please allow camera permission and try again.");
      return;
    }

    await new Promise(r => setTimeout(r, 1500));
    setScanning(true);

    await new Promise(r => setTimeout(r, 900));
    setChecks(c => ({ ...c, liveness: true }));
    await new Promise(r => setTimeout(r, 700));
    setChecks(c => ({ ...c, depth: true }));
    await new Promise(r => setTimeout(r, 600));
    setChecks(c => ({ ...c, spoof: true }));
    await new Promise(r => setTimeout(r, 500));
    setChecks(c => ({ ...c, multiface: true }));

    setScanning(false);
    setCaptured(true);
    setFraudResult("clear");
    setTimeout(() => stopCamera(), 2000);
  };

  const handleStep1Next = () => {
    if (!form.name.trim()) { setFormError("Full name is required."); return; }
    if (!form.id.trim()) { setFormError(`${role === "student" ? "Roll number" : "Employee ID"} is required.`); return; }
    if (!form.password) { setFormError("Password is required."); return; }
    if (form.password.length < 6) { setFormError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setFormError("Passwords do not match."); return; }
    setFormError("");
    setStep(2);
  };

  const handleComplete = () => {
    if (!captured || fraudResult !== "clear") return;
    const newUser: UserRecord = role === "student"
      ? {
          id: `S${Date.now()}`,
          name: form.name,
          roll: form.id,
          dept: form.dept,
          year: parseInt(form.year),
          photo: form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
          present: 0,
          total: 0,
          class: "student",
          password: form.password,
        }
      : {
          id: `T${Date.now()}`,
          name: form.name,
          empId: form.id,
          dept: form.dept,
          subject: form.subject,
          photo: form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
          class: "teacher",
          password: form.password,
        };
    onRegister(newUser);
    setDone(true);
  };

  const inp: React.CSSProperties = { ...glass, border: "1px solid rgba(255,255,255,0.15)", width: "100%", padding: "11px 16px", color: "#fff", fontSize: 13, background: "rgba(0,0,0,0.4)", borderRadius: 10, fontFamily: "Poppins" };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="fade-up" style={{ ...glass, padding: 48, maxWidth: 440, width: "100%", textAlign: "center", borderColor: `${EMERALD}44`, ...neonGreen }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${EMERALD}15`, border: `2px solid ${EMERALD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "glowPulse 2s ease infinite" }}>
            <CheckCircle size={36} color={EMERALD} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: EMERALD, marginBottom: 8 }}>Registration Complete!</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 4 }}>{form.name} has been enrolled successfully.</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 4 }}>Face biometrics captured & anti-fraud verified.</p>
          <p style={{ color: `${CYAN}bb`, fontSize: 12, marginBottom: 28 }}>You can now log in with your ID and your chosen password.</p>
          <button onClick={onBack} style={{ padding: "12px 32px", border: `1px solid ${CYAN}`, borderRadius: 10, background: `${CYAN}15`, color: CYAN, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins", ...neonCyan }}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="fade-up" style={{ ...glass, padding: 36, width: "100%", maxWidth: 860, borderColor: `${CYAN}33`, ...neonCyan }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <button onClick={step === 2 ? goStep1 : onBack} style={{ width: 32, height: 32, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, background: "transparent", color: CYAN, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>New Registration</h2>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Face enrollment with anti-spoofing verification</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: s === step ? 32 : 24, height: 4, borderRadius: 4, background: step >= s ? CYAN : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
                <span style={{ fontSize: 10, color: step >= s ? CYAN : "rgba(255,255,255,0.3)" }}>Step {s}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["student", "teacher"] as const).map(r => (
            <button key={r} onClick={() => { if (step === 1) setRole(r); }} style={{ flex: 1, padding: "10px", border: `1px solid ${role === r ? CYAN : "rgba(255,255,255,0.1)"}`, borderRadius: 10, background: role === r ? `${CYAN}15` : "transparent", color: role === r ? CYAN : "rgba(255,255,255,0.4)", fontSize: 13, cursor: step === 1 ? "pointer" : "default", fontFamily: "Poppins", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}>
              {role === r ? <CheckCircle size={13} /> : null}
              {r === "student" ? <GraduationCap size={13} /> : <BookOpen size={13} />}
              {r === "student" ? "Student" : "Teacher"}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>FULL NAME *</label>
              <input style={inp} placeholder="e.g. Arjun Reddy" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>{role === "student" ? "ROLL NUMBER *" : "EMPLOYEE ID *"}</label>
              <input style={inp} placeholder={role === "student" ? "21CS101" : "EMP001"} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>DEPARTMENT</label>
              <select style={{ ...inp, appearance: "none" }} value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}>
                {["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"].map(d => <option key={d} style={{ background: "#111" }}>{d}</option>)}
              </select>
            </div>
            {role === "student" ? (
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>YEAR</label>
                <select style={{ ...inp, appearance: "none" }} value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
                  {["1", "2", "3", "4"].map(y => <option key={y} style={{ background: "#111" }}>Year {y}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>SUBJECT</label>
                <input style={inp} placeholder="e.g. Machine Learning" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              </div>
            )}

            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PASSWORD *</label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inp, paddingRight: 44 }}
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: showPass ? CYAN : "rgba(255,255,255,0.35)", padding: 4, display: "flex", alignItems: "center" }}>
                  <Eye size={15} />
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>CONFIRM PASSWORD *</label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inp, paddingRight: 44, borderColor: form.confirmPassword && form.password !== form.confirmPassword ? `${RED_ALERT}88` : undefined }}
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: showConfirm ? CYAN : "rgba(255,255,255,0.35)", padding: 4, display: "flex", alignItems: "center" }}>
                  <Eye size={15} />
                </button>
              </div>
            </div>

            {formError && (
              <div style={{ gridColumn: "1/-1", padding: "10px 14px", background: `${RED_ALERT}11`, border: `1px solid ${RED_ALERT}33`, borderRadius: 8, fontSize: 12, color: RED_ALERT, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={13} /> {formError}
              </div>
            )}
            <div style={{ gridColumn: "1/-1", marginTop: 8 }}>
              <button onClick={handleStep1Next} style={{ width: "100%", padding: "13px", border: `1px solid ${CYAN}`, borderRadius: 10, background: `${CYAN}15`, color: CYAN, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins", ...neonCyan }}>
                Continue to Face Enrollment →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div style={{ ...glass, padding: "8px 16px", borderColor: `${CYAN}22`, fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 8 }}>
                <User size={12} color={CYAN} />
                <span style={{ color: CYAN, fontWeight: 600 }}>{form.name}</span>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
                <span>{form.id}</span>
              </div>

              <ScannerHUD
                scanning={scanning}
                recognized={captured && fraudResult === "clear"}
                fraudAlert={captured && fraudResult === "fraud"}
                videoRef={videoRef}
                cameraActive={cameraActive}
              />

              {cameraError && (
                <div className="slide-in" style={{ ...glass, padding: "10px 18px", borderColor: `${RED_ALERT}44`, ...neonRed, display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <AlertTriangle size={14} color={RED_ALERT} />
                  <span style={{ fontSize: 11, color: RED_ALERT, fontWeight: 600 }}>{cameraError}</span>
                </div>
              )}

              {captured && fraudResult === "clear" && (
                <div className="slide-in" style={{ ...glass, padding: "10px 18px", borderColor: `${EMERALD}44`, ...neonGreen, display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <CheckCircle size={14} color={EMERALD} />
                  <span style={{ fontSize: 12, color: EMERALD, fontWeight: 600 }}>Face verified — All checks passed</span>
                </div>
              )}
              {captured && fraudResult === "fraud" && (
                <div className="slide-in" style={{ ...glass, padding: "10px 18px", borderColor: `${RED_ALERT}44`, ...neonRed, display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <AlertTriangle size={14} color={RED_ALERT} />
                  <span style={{ fontSize: 12, color: RED_ALERT, fontWeight: 600 }}>Fraud detected — Please retry</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { label: "Liveness", done: checks.liveness },
                  { label: "Anti-Spoof", done: checks.spoof },
                  { label: "Multi-Face", done: checks.multiface },
                  { label: "Depth", done: checks.depth },
                ].map(({ label, done: d }) => (
                  <div key={label} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${d ? EMERALD : "rgba(255,255,255,0.1)"}`, background: d ? `${EMERALD}11` : "transparent", fontSize: 10, color: d ? EMERALD : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 4, transition: "all 0.4s" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: d ? EMERALD : "rgba(255,255,255,0.2)", transition: "all 0.4s" }} /> {label}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={runScan} disabled={scanning || cameraActive} style={{ padding: "11px 22px", border: `1px solid ${CYAN}`, borderRadius: 10, background: (scanning || cameraActive) ? `${CYAN}08` : `${CYAN}15`, color: CYAN, fontSize: 13, fontWeight: 600, cursor: (scanning || cameraActive) ? "not-allowed" : "pointer", fontFamily: "Poppins", display: "flex", alignItems: "center", gap: 6, ...neonCyan, transition: "all 0.2s" }}>
                  <Camera size={14} />
                  {scanning ? "Analyzing..." : cameraActive ? "Camera Active..." : captured ? "Re-scan" : "Capture Face"}
                </button>
              </div>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center", maxWidth: 220, lineHeight: 1.6 }}>
                Click Capture Face — your live camera will open. Position your face in the circle for verification.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <AntiFraudPanel checks={checks} scanning={scanning} fraudAlert={fraudResult === "fraud"} captured={captured} />

              {captured && fraudResult === "clear" && (
                <button onClick={handleComplete} className="slide-in" style={{ marginTop: 4, padding: "13px", border: `1px solid ${EMERALD}`, borderRadius: 10, background: `${EMERALD}15`, color: EMERALD, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins", ...neonGreen, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <CheckCircle size={14} />
                  Complete Registration
                </button>
              )}

              {captured && fraudResult === "fraud" && (
                <button onClick={runScan} className="slide-in" style={{ marginTop: 4, padding: "13px", border: `1px solid ${AMBER}`, borderRadius: 10, background: `${AMBER}11`, color: AMBER, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <RefreshCw size={14} />
                  Retry Scan
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage({ user }: { user: UserRecord }) {
  const [scanning, setScanning] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const [fraudAlert, setFraudAlert] = useState(false);
  const [log, setLog] = useState(liveLog.slice(0, 3));
  const [logIdx, setLogIdx] = useState(3);
  const [studentIdx, setStudentIdx] = useState(0);
  const [fraudSim, setFraudSim] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [lastRecognized, setLastRecognized] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    if (streamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      setCameraActive(true);
    } catch {}
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const toggleCamera = useCallback(() => {
    setCameraEnabled(prev => {
      if (prev) {
        stopCamera();
        return false;
      } else {
        startCamera();
        return true;
      }
    });
  }, [startCamera, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [startCamera]);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    }
  }, [cameraActive, scanning]);

  const triggerScan = useCallback(() => {
    setScanning(s => {
      if (s) return s;
      setRecognized(false); setFraudAlert(false);
      setTimeout(() => {
        setScanning(false);
        setLogIdx(currentIdx => {
          if (currentIdx < liveLog.length) {
            const next = liveLog[currentIdx];
            const isFraud = next.status === "fraud";
            setLog(l => [next, ...l].slice(0, 10));
            setFraudAlert(isFraud);
            setRecognized(!isFraud);
            setFraudSim(isFraud);
            if (!isFraud) setLastRecognized(next.name);
            setTimeout(() => { setRecognized(false); setFraudAlert(false); setFraudSim(false); }, 3500);
            return currentIdx + 1;
          } else {
            setStudentIdx(sIdx => {
              const nextStudentIdx = sIdx % DEFAULT_STUDENTS.length;
              const s2 = DEFAULT_STUDENTS[nextStudentIdx];
              const now = new Date();
              const timeStr = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
              const entry = { name: s2.name, time: timeStr, status: "present", roll: s2.roll, conf: parseFloat((95 + Math.random() * 4.5).toFixed(1)) };
              setLog(l => [entry, ...l].slice(0, 10));
              setRecognized(true);
              setLastRecognized(s2.name);
              setTimeout(() => setRecognized(false), 3000);
              return nextStudentIdx + 1;
            });
            return currentIdx;
          }
        });
      }, 2200);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!cameraEnabled) return;
    const intv = setInterval(() => { triggerScan(); }, 8000);
    const t = setTimeout(() => triggerScan(), 3000);
    return () => { clearInterval(intv); clearTimeout(t); };
  }, [triggerScan, cameraEnabled]);

  return (
    <div style={{ padding: "24px 24px 24px 88px", minHeight: "100vh" }}>
      {fraudSim && (
        <div className="slide-in" style={{ ...glass, padding: "12px 20px", borderColor: `${RED_ALERT}55`, marginBottom: 16, background: `${RED_ALERT}08`, animation: "fraudFlash 0.5s ease infinite", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={16} color={RED_ALERT} />
          <span style={{ fontSize: 13, color: RED_ALERT, fontWeight: 700 }}>FRAUD ALERT — Photo/Proxy spoofing attempt blocked and logged</span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Live Scanner</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Welcome back, {user?.name || "Admin"} — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {/* Camera Toggle Button */}
          <button
            onClick={toggleCamera}
            title={cameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 18px", borderRadius: 10, cursor: "pointer",
              fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
              border: `1px solid ${cameraEnabled ? RED_ALERT : CYAN}55`,
              background: cameraEnabled ? `${RED_ALERT}11` : `${CYAN}11`,
              color: cameraEnabled ? RED_ALERT : CYAN,
              transition: "all 0.25s",
              boxShadow: cameraEnabled ? `0 0 12px ${RED_ALERT}22` : `0 0 12px ${CYAN}22`,
            }}
          >
            <Camera size={14} />
            {cameraEnabled ? "Camera ON" : "Camera OFF"}
            <div style={{
              width: 28, height: 16, borderRadius: 8,
              background: cameraEnabled ? `${RED_ALERT}33` : "rgba(255,255,255,0.08)",
              border: `1px solid ${cameraEnabled ? RED_ALERT : "rgba(255,255,255,0.15)"}55`,
              display: "flex", alignItems: "center",
              padding: "0 2px",
              justifyContent: cameraEnabled ? "flex-end" : "flex-start",
              transition: "all 0.25s",
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: cameraEnabled ? RED_ALERT : "rgba(255,255,255,0.2)",
                transition: "all 0.25s",
              }} />
            </div>
          </button>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: cameraEnabled ? EMERALD : "rgba(255,255,255,0.2)", animation: cameraEnabled ? "dotPulse 1.5s ease infinite" : "none" }} />
          <span style={{ fontSize: 11, color: cameraEnabled ? EMERALD : "rgba(255,255,255,0.35)" }}>{cameraEnabled ? "System Active" : "System Paused"}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard icon={Users} label="Total Enrolled" value="60" sub="+3 this week" delay={0} />
        <StatCard icon={CheckCircle} label="Present Today" value="52" color={EMERALD} sub="86.7% attendance" delay={0.1} />
        <StatCard icon={Activity} label="Accuracy Rate" value="99.2%" color={AMBER} sub="Anti-spoof active" delay={0.2} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div style={{ ...glass, padding: 28, borderColor: `${CYAN}22`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "stretch" }}>
            <Scan size={14} color={CYAN} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>Face Recognition HUD</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: cameraEnabled && cameraActive ? EMERALD : RED_ALERT, animation: cameraEnabled && cameraActive ? "blink 1.5s ease infinite" : "none" }} />
              <span style={{ fontSize: 10, color: cameraEnabled && cameraActive ? EMERALD : RED_ALERT, letterSpacing: 1 }}>
                {cameraEnabled && cameraActive ? "LIVE" : "OFF"}
              </span>
            </div>
          </div>

          {/* Camera OFF overlay wrapper */}
          <div style={{ position: "relative" }}>
            <ScannerHUD scanning={scanning && cameraEnabled} recognized={recognized} fraudAlert={fraudAlert} videoRef={videoRef} cameraActive={cameraActive && cameraEnabled} />
            {!cameraEnabled && (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, zIndex: 10 }}>
                <Camera size={28} color="rgba(255,255,255,0.2)" />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Camera Off</span>
              </div>
            )}
          </div>

          {fraudAlert && (
            <div className="slide-in" style={{ ...glass, padding: "10px 16px", borderColor: `${RED_ALERT}44`, ...neonRed, display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
              <AlertTriangle size={14} color={RED_ALERT} />
              <span style={{ fontSize: 12, color: RED_ALERT }}>FRAUD DETECTED — Photo/Proxy spoofing attempt blocked</span>
            </div>
          )}
          {recognized && !fraudAlert && (
            <div className="slide-in" style={{ ...glass, padding: "10px 16px", borderColor: `${EMERALD}44`, ...neonGreen, display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
              <CheckCircle size={14} color={EMERALD} />
              <span style={{ fontSize: 12, color: EMERALD }}>
                {lastRecognized ? `${lastRecognized} — Attendance marked` : "Attendance marked — Liveness confirmed"}
              </span>
            </div>
          )}
          {!cameraEnabled && (
            <div style={{ ...glass, padding: "10px 16px", borderColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
              <Camera size={14} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Camera is off — attendance scanning continues in background</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Liveness", active: cameraEnabled }, { label: "Anti-Spoof", active: cameraEnabled },
              { label: "Multi-Face", active: cameraEnabled }, { label: "Low-Light OK", active: cameraEnabled },
            ].map(({ label, active }) => (
              <div key={label} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${active ? EMERALD : "rgba(255,255,255,0.1)"}`, background: active ? `${EMERALD}11` : "transparent", fontSize: 10, color: active ? EMERALD : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 4, transition: "all 0.3s" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: active ? EMERALD : "rgba(255,255,255,0.2)", transition: "all 0.3s" }} /> {label}
              </div>
            ))}
          </div>
          <button onClick={triggerScan} disabled={scanning} style={{ padding: "13px 40px", border: `1px solid ${CYAN}`, borderRadius: 12, background: scanning ? `${CYAN}08` : `${CYAN}15`, color: CYAN, fontSize: 14, fontWeight: 600, cursor: scanning ? "not-allowed" : "pointer", fontFamily: "Poppins", ...neonCyan, transition: "all 0.2s" }}>
            {scanning ? <><RefreshCw size={14} style={{ display: "inline", marginRight: 8, animation: "spin 1s linear infinite" }} />Scanning...</> : <><Zap size={14} style={{ display: "inline", marginRight: 8 }} />Mark Attendance</>}
          </button>
        </div>

        <div style={{ ...glass, padding: 20, borderColor: `${EMERALD}22`, display: "flex", flexDirection: "column", gap: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Activity size={13} color={EMERALD} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Live Activity</span>
            <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: EMERALD, animation: "blink 1s ease infinite" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", maxHeight: 420 }}>
            {log.map((e, i) => (
              <div key={`${e.name}-${e.time}`} className={i === 0 ? "slide-in" : ""} style={{ ...glass, padding: "10px 12px", borderColor: e.status === "fraud" ? `${RED_ALERT}33` : `${EMERALD}22`, animation: `slideIn 0.3s ease ${i === 0 ? 0 : i * 0.05}s both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: e.status === "fraud" ? RED_ALERT : EMERALD, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", flex: 1 }}>{e.name}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{e.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: 15 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{e.roll}</span>
                  {e.status === "fraud"
                    ? <span style={{ fontSize: 10, color: RED_ALERT, fontWeight: 700 }}>BLOCKED</span>
                    : <span style={{ fontSize: 10, color: EMERALD }}>{e.conf}% conf.</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  const [view, setView] = useState("weekly");
  return (
    <div style={{ padding: "24px 24px 24px 88px", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Attendance Reports</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Comprehensive analytics & export</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["weekly", "monthly"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${view === v ? CYAN : "rgba(255,255,255,0.1)"}`, background: view === v ? `${CYAN}15` : "transparent", color: view === v ? CYAN : "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "Poppins" }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ ...glass, padding: 20, borderColor: `${CYAN}22` }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
            {view === "weekly" ? "This Week — Present vs Absent" : "Monthly Attendance Rate (%)"}
          </p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              {view === "weekly" ? (
                <BarChart data={weeklyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, fontFamily: "Poppins" }} labelStyle={{ color: CYAN }} />
                  <Bar dataKey="present" fill={EMERALD} radius={[4, 4, 0, 0]} opacity={0.85} name="Present" />
                  <Bar dataKey="absent" fill={RED_ALERT} radius={[4, 4, 0, 0]} opacity={0.65} name="Absent" />
                </BarChart>
              ) : (
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CYAN} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CYAN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, fontFamily: "Poppins" }} labelStyle={{ color: CYAN }} />
                  <Area type="monotone" dataKey="rate" stroke={CYAN} fill="url(#cg)" strokeWidth={2} name="Rate %" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...glass, padding: 20, borderColor: `${CYAN}22` }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Today's Distribution</p>
          <div style={{ height: 200, display: "flex", alignItems: "center", gap: 20 }}>
            <ResponsiveContainer width={180} height="100%">
              <PieChart>
                <Pie data={[{ name: "Present", value: 52 }, { name: "Absent", value: 8 }]} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                  <Cell fill={EMERALD} opacity={0.85} />
                  <Cell fill={RED_ALERT} opacity={0.6} />
                </Pie>
                <Tooltip contentStyle={{ background: "#111", border: `1px solid ${CYAN}44`, borderRadius: 8, fontFamily: "Poppins" }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {[{ label: "Present", val: 52, pct: "86.7%", color: EMERALD }, { label: "Absent", val: 8, pct: "13.3%", color: RED_ALERT }].map(({ label, val, pct, color }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{label}</span>
                    <span style={{ fontSize: 12, color, fontWeight: 700 }}>{val} <span style={{ color: "rgba(255,255,255,0.3)" }}>({pct})</span></span>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ height: "100%", width: pct, borderRadius: 4, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...glass, padding: 20, borderColor: `${CYAN}22` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Users size={13} color={CYAN} />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Student Attendance Summary</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Roll No", "Name", "Dept", "Present", "Total", "Rate", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEFAULT_STUDENTS.map(s => {
                const pct = Math.round(s.present / s.total * 100);
                const color = pct >= 75 ? EMERALD : pct >= 60 ? AMBER : RED_ALERT;
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", color: CYAN, fontSize: 12 }}>{s.roll}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar initials={s.photo} size={28} />
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{s.dept}</td>
                    <td style={{ padding: "10px 12px", color: EMERALD }}>{s.present}</td>
                    <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.4)" }}>{s.total}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", maxWidth: 60 }}>
                          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: color }} />
                        </div>
                        <span style={{ fontSize: 12, color, fontWeight: 600, minWidth: 36 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: `${color}15`, color, border: `1px solid ${color}33` }}>
                        {pct >= 75 ? "Good" : pct >= 60 ? "Low" : "Critical"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ user }: { user: UserRecord }) {
  const isTeacher = user?.class === "teacher";
  const me = DEFAULT_STUDENTS.find(s => s.roll === (user as Student).roll) || DEFAULT_STUDENTS[0];
  const pct = Math.round(me.present / me.total * 100);
  const absentDays = me.total - me.present;

  const subjectData = [
    { subject: "Data Structures & Algorithms", code: "DSA", present: 14, total: 15 },
    { subject: "Machine Learning", code: "ML", present: 12, total: 15 },
    { subject: "Database Management", code: "DBMS", present: 10, total: 15 },
    { subject: "Operating Systems", code: "OS", present: 11, total: 15 },
    { subject: "Computer Networks", code: "CN", present: 9, total: 15 },
    { subject: "Software Engineering", code: "SE", present: 13, total: 15 },
  ];

  return (
    <div style={{ padding: "24px 24px 24px 88px", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isTeacher ? "Students Overview" : "My Attendance"}</h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {isTeacher ? `${DEFAULT_STUDENTS[0].dept} Department — ${DEFAULT_STUDENTS[0].total} classes conducted` : `${me.name} · ${me.roll}`}
        </p>
      </div>

      {!isTeacher && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            <StatCard icon={CheckCircle} label="Present" value={me.present} color={EMERALD} />
            <StatCard icon={X} label="Absent" value={absentDays} color={RED_ALERT} delay={0.05} />
            <StatCard icon={Activity} label="Attendance" value={`${pct}%`} color={pct >= 75 ? EMERALD : AMBER} delay={0.1} />
            <StatCard icon={Award} label="Ranking" value="#2" color={CYAN} delay={0.15} />
          </div>

          {/* Subject-wise Attendance Cards */}
          <div style={{ ...glass, padding: 20, borderColor: `${CYAN}22`, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <BookOpen size={14} color={CYAN} />
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>Subject-wise Attendance</p>
              <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Min. 75% required</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {subjectData.map((s, i) => {
                const spct = Math.round(s.present / s.total * 100);
                const sc = spct >= 75 ? EMERALD : spct >= 60 ? AMBER : RED_ALERT;
                const needed = spct < 75 ? Math.max(0, Math.ceil((0.75 * s.total - s.present) / 0.25)) : 0;
                return (
                  <div key={s.code} className="fade-up" style={{ ...glass, padding: "14px 16px", borderColor: `${sc}22`, animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{s.subject}</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.code} · {s.present}/{s.total} classes</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: sc, lineHeight: 1 }}>{spct}%</div>
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: `${sc}15`, color: sc, border: `1px solid ${sc}33` }}>
                          {spct >= 75 ? "OK" : spct >= 60 ? "Low" : "Critical"}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 5, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${spct}%`, borderRadius: 4, background: sc, transition: "width 1s ease" }} />
                    </div>
                    {needed > 0 && (
                      <p style={{ fontSize: 9, color: AMBER, marginTop: 5 }}>⚠ Attend {needed} more class{needed > 1 ? "es" : ""} to reach 75%</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ ...glass, padding: 20, borderColor: `${CYAN}22` }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Overall Overview</p>
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "Present", value: me.present }, { name: "Absent", value: absentDays }]} cx="50%" cy="50%" innerRadius={52} outerRadius={76} dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                      <Cell fill={EMERALD} opacity={0.85} />
                      <Cell fill="rgba(255,255,255,0.08)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: pct >= 75 ? EMERALD : AMBER }}>{pct}%</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>OVERALL</div>
                </div>
              </div>
            </div>

            <div style={{ ...glass, padding: 20, borderColor: `${CYAN}22` }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Trend — Last 6 Months</p>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#111", border: `1px solid ${CYAN}44`, borderRadius: 8, fontFamily: "Poppins" }} />
                    <Line type="monotone" dataKey="rate" stroke={CYAN} strokeWidth={2} dot={{ fill: CYAN, r: 4 }} activeDot={{ r: 6, fill: EMERALD }} name="Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {isTeacher && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DEFAULT_STUDENTS.map((s, i) => {
            const p = Math.round(s.present / s.total * 100);
            const c = p >= 75 ? EMERALD : p >= 60 ? AMBER : RED_ALERT;
            return (
              <div key={s.id} className="fade-up" style={{ ...glass, padding: "14px 20px", borderColor: `${c}22`, display: "flex", alignItems: "center", gap: 14, animation: `fadeUp 0.3s ease ${i * 0.05}s both` }}>
                <Avatar initials={s.photo} size={40} color={c} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.roll} · {s.dept} Year {s.year}</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: c }}>{p}%</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{s.present}/{s.total} classes</p>
                </div>
                <div style={{ width: 80, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.08)" }}>
                  <div style={{ height: "100%", width: `${p}%`, borderRadius: 4, background: c, transition: "width 1s ease" }} />
                </div>
                <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, background: `${c}15`, color: c, border: `1px solid ${c}33`, minWidth: 64, textAlign: "center" }}>
                  {p >= 75 ? "Good" : p >= 60 ? "Low" : "Critical"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<"login" | "register" | "app">("login");
  const [user, setUser] = useState<UserRecord | null>(null);
  const [page, setPage] = useState("dashboard");
  const [registeredUsers, setRegisteredUsers] = useState<UserRecord[]>([]);

  const handleLogin = (u: UserRecord | { goto: string }) => {
    if ("goto" in u && u.goto === "register") { setScreen("register"); return; }
    setUser(u as UserRecord);
    setScreen("app");
  };

  const handleRegister = (newUser: UserRecord) => {
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Poppins',sans-serif" }}>
        <GridBackground />
        <div style={{ position: "relative", zIndex: 1 }}>
          {screen === "login" && <LoginPage onLogin={handleLogin} registeredUsers={registeredUsers} />}
          {screen === "register" && (
            <RegisterPage
              onBack={() => setScreen("login")}
              onRegister={(u) => { handleRegister(u); }}
            />
          )}
          {screen === "app" && user && (
            <>
              <Sidebar page={page} setPage={setPage} user={user} onLogout={() => { setUser(null); setScreen("login"); setPage("dashboard"); }} />
              {page === "dashboard" && <DashboardPage user={user} />}
              {page === "attendance" && <AttendancePage />}
              {page === "students" && <StudentDashboard user={user} />}
              {page === "settings" && (
                <div style={{ padding: "24px 24px 24px 88px" }}>
                  <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Settings</h1>
                  <div style={{ ...glass, padding: 28, borderColor: `${CYAN}22`, maxWidth: 480 }}>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Logged in as: <span style={{ color: CYAN }}>{user?.name}</span></p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                      Role: {user?.class} · {user?.class === "student" ? (user as Student).roll : (user as Teacher).empId}
                    </p>
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Detection Settings</p>
                      {["Anti-spoofing protection", "Liveness detection", "Multi-face detection", "Low-light enhancement"].map(s => (
                        <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <span style={{ fontSize: 13 }}>{s}</span>
                          <div style={{ width: 36, height: 20, borderRadius: 10, background: `${EMERALD}33`, border: `1px solid ${EMERALD}44`, display: "flex", alignItems: "center", padding: "0 2px", justifyContent: "flex-end" }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: EMERALD }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
