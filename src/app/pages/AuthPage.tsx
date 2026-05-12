import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import {
  Stethoscope, User, Mail, Lock, Phone, Eye, EyeOff,
  CheckCircle2, ChevronRight, ArrowLeft, Brain, Shield
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

type Mode = "login" | "signup";
type Role = "patient" | "doctor";

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>(searchParams.get("role") === "doctor" ? "doctor" : "patient");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", specialization: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
      setTimeout(() => navigate(role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"), 800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2744] via-[#1D3F6E] to-[#1D6FA4] flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Smart Doctor Connect</h1>
          <p className="text-white/60 text-sm">AI-powered healthcare platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3.5 text-sm font-medium capitalize transition-all ${
                  mode === m
                    ? "bg-[#1D6FA4] text-white"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F0F7FF]"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Role Selection */}
            <div className="mb-5">
              <p className="text-xs text-[#64748B] mb-2">I am a:</p>
              <div className="flex gap-2">
                {([
                  { id: "patient", label: "Patient", icon: User, desc: "Find & book doctors" },
                  { id: "doctor", label: "Doctor", icon: Stethoscope, desc: "Manage your practice" },
                ] as { id: Role; label: string; icon: any; desc: string }[]).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all text-left ${
                      role === r.id
                        ? "border-[#1D6FA4] bg-[#EBF5FF]"
                        : "border-[#E2ECF8] bg-white hover:border-[#C5DEFF]"
                    }`}
                  >
                    <r.icon className={`w-4 h-4 mb-1 ${role === r.id ? "text-[#1D6FA4]" : "text-[#94A3B8]"}`} />
                    <p className={`text-sm font-medium ${role === r.id ? "text-[#1D6FA4]" : "text-[#1E293B]"}`}>{r.label}</p>
                    <p className="text-[11px] text-[#94A3B8]">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label className="text-xs text-[#64748B] mb-1 block">Full Name</label>
                  <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                    <User className="w-4 h-4 text-[#94A3B8]" />
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Email Address</label>
                <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                  <Mail className="w-4 h-4 text-[#94A3B8]" />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="text-xs text-[#64748B] mb-1 block">Phone Number</label>
                  <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                    <Phone className="w-4 h-4 text-[#94A3B8]" />
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && role === "doctor" && (
                <div>
                  <label className="text-xs text-[#64748B] mb-1 block">Specialization</label>
                  <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                    <Stethoscope className="w-4 h-4 text-[#94A3B8]" />
                    <input
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                      placeholder="e.g. Cardiologist"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Password</label>
                <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                  <Lock className="w-4 h-4 text-[#94A3B8]" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4 text-[#94A3B8]" /> : <Eye className="w-4 h-4 text-[#94A3B8]" />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-[#1D6FA4] hover:underline">Forgot password?</button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#1D6FA4] hover:bg-[#1557A0] text-white rounded-xl h-11 gap-2 mt-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-[#E2ECF8]" />
              <span className="text-xs text-[#94A3B8]">or continue with</span>
              <div className="flex-1 h-px bg-[#E2ECF8]" />
            </div>

            {/* Social Login */}
            <div className="flex gap-2">
              {["Google", "Facebook"].map((provider) => (
                <button
                  key={provider}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E2ECF8] text-sm text-[#475569] hover:bg-[#F0F7FF] transition-colors"
                >
                  {provider === "Google" ? "🔵" : "🔷"} {provider}
                </button>
              ))}
            </div>

            {/* Trust Indicators */}
            {mode === "signup" && (
              <div className="mt-4 space-y-1.5">
                {["PMDC verified doctors only", "256-bit encrypted data", "No spam, ever"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span className="text-xs text-[#64748B]">{t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-white/70 text-sm hover:text-white flex items-center gap-1.5 justify-center">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
