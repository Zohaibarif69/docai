import { useState } from "react";
import { Link } from "react-router";
import {
  Calendar, MessageCircle, User, Clock, Star, Settings,
  ToggleLeft, ToggleRight, Bell, TrendingUp, Eye, CheckCircle2,
  XCircle, ChevronRight, Activity, Plus, Edit
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { DOCTORS } from "../data/mockData";

const doctor = DOCTORS[0]; // Dr. Ahmed Khan as logged-in doctor

const DOCTOR_APPOINTMENTS = [
  { id: "da1", patient: "Ali Khan", age: 28, issue: "Chest pain, shortness of breath", date: "Today", time: "3:00 PM", type: "Online", status: "confirmed" },
  { id: "da2", patient: "Sana Butt", age: 35, issue: "Regular cardiac checkup", date: "Today", time: "4:00 PM", type: "Physical", status: "confirmed" },
  { id: "da3", patient: "Hassan Ahmed", age: 52, issue: "Post-bypass follow-up", date: "Tomorrow", time: "10:00 AM", type: "Physical", status: "pending" },
  { id: "da4", patient: "Maria Khan", age: 44, issue: "Hypertension management", date: "Tomorrow", time: "11:00 AM", type: "Online", status: "confirmed" },
];

const INQUIRIES = [
  { id: "i1", patient: "Imran Shah", message: "I've been having irregular heartbeat for 3 days. Is this serious?", time: "15 min ago", urgent: true },
  { id: "i2", patient: "Nadia Rao", message: "What are the side effects of the medication you prescribed?", time: "1 hour ago", urgent: false },
  { id: "i3", patient: "Tariq Malik", message: "Can I reschedule my appointment from tomorrow to next week?", time: "3 hours ago", urgent: false },
];

type Tab = "overview" | "appointments" | "availability" | "inquiries" | "profile";

export function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isOnline, setIsOnline] = useState(doctor.isOnline);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(["9:00 AM", "10:00 AM", "3:00 PM", "4:00 PM", "5:00 PM"]);

  const allSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) => prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Doctor Header */}
      <div className="bg-gradient-to-r from-[#0F2744] to-[#1D6FA4] rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <img src={doctor.image} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30" alt={doctor.name} />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold ${isOnline ? "bg-green-500" : "bg-gray-400"}`}>
              {isOnline ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-white" style={{ fontSize: "1.1rem" }}>{doctor.name}</h2>
              <span className="bg-[#0EA572] text-white text-[10px] px-2 py-0.5 rounded-full">✅ Verified</span>
            </div>
            <p className="text-white/70 text-xs">{doctor.specialization} · {doctor.hospital}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/70 text-xs flex items-center gap-1">
                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" /> {doctor.rating} ({doctor.reviewCount})
              </span>
              <span className="text-white/70 text-xs">{doctor.experience} yrs exp</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-xs">{isOnline ? "You're Online" : "You're Offline"}</span>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: "Today's Appointments", value: DOCTOR_APPOINTMENTS.filter(a => a.date === "Today").length },
            { label: "Pending Inquiries", value: INQUIRIES.length },
            { label: "This Month", value: 47 },
            { label: "Avg. Rating", value: doctor.rating },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-white text-xl font-bold">{s.value}</div>
              <div className="text-white/60 text-[10px] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#E2ECF8] p-1 mb-6 overflow-x-auto">
        {([
          { id: "overview", label: "Overview", icon: Activity },
          { id: "appointments", label: "Appointments", icon: Calendar },
          { id: "availability", label: "Availability", icon: Clock },
          { id: "inquiries", label: "Inquiries", icon: MessageCircle },
          { id: "profile", label: "Profile", icon: Settings },
        ] as { id: Tab; label: string; icon: any }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 flex-1 py-2 px-3 rounded-lg text-sm whitespace-nowrap transition-all justify-center ${
              activeTab === tab.id ? "bg-[#1D6FA4] text-white shadow-sm" : "text-[#64748B] hover:bg-[#F0F7FF]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-3">Today's Schedule</h3>
              <div className="space-y-2.5">
                {DOCTOR_APPOINTMENTS.filter(a => a.date === "Today").map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 bg-[#F8FAFC] rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center text-sm font-bold text-[#1D6FA4]">
                      {a.patient.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E293B]">{a.patient}</p>
                      <p className="text-xs text-[#64748B] truncate">{a.issue}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-[#1D6FA4] font-medium">{a.time}</span>
                      <Badge className={`text-[9px] px-1.5 py-0.5 ${a.type === "Online" ? "bg-[#EBF5FF] text-[#1D6FA4]" : "bg-[#FFF7ED] text-[#EA580C]"}`}>{a.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-3">New Inquiries</h3>
              <div className="space-y-2.5">
                {INQUIRIES.slice(0, 3).map((inq) => (
                  <div key={inq.id} className={`p-2.5 rounded-xl border ${inq.urgent ? "bg-red-50 border-red-200" : "bg-[#F8FAFC] border-[#E2ECF8]"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[#1E293B] flex items-center gap-1">
                          {inq.patient}
                          {inq.urgent && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded">URGENT</span>}
                        </p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{inq.message}</p>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] shrink-0">{inq.time}</span>
                    </div>
                    <button className="text-xs text-[#1D6FA4] mt-1.5 hover:underline">Reply →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
            <h3 className="text-[#1E293B] mb-4">This Month's Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Appointments", value: "47", change: "+12%", positive: true },
                { label: "Avg. Session", value: "22 min", change: "-3 min", positive: false },
                { label: "Patient Rating", value: "4.9/5", change: "+0.1", positive: true },
                { label: "Revenue", value: "PKR 117K", change: "+8%", positive: true },
              ].map((m) => (
                <div key={m.label} className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-xs text-[#64748B]">{m.label}</p>
                  <p className="text-xl font-bold text-[#1E293B] mt-1">{m.value}</p>
                  <p className={`text-xs mt-0.5 ${m.positive ? "text-green-600" : "text-red-500"}`}>
                    {m.change} this month
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appointments */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["All", "Today", "Tomorrow", "This Week"].map((f) => (
              <button key={f} className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E2ECF8] text-[#475569] hover:border-[#1D6FA4] hover:text-[#1D6FA4] transition-colors">
                {f}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-[#E2ECF8] overflow-hidden">
            {DOCTOR_APPOINTMENTS.map((a, i) => (
              <div key={a.id} className={`flex items-center gap-3 p-4 ${i < DOCTOR_APPOINTMENTS.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center text-sm font-bold text-[#1D6FA4] shrink-0">
                  {a.patient.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1E293B] text-sm">{a.patient} <span className="text-[#94A3B8]">· Age {a.age}</span></p>
                  <p className="text-xs text-[#64748B] truncate">{a.issue}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[#94A3B8] flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date} · {a.time}</span>
                    <Badge className={`text-[9px] ${a.type === "Online" ? "bg-[#EBF5FF] text-[#1D6FA4]" : "bg-[#FFF7ED] text-[#EA580C]"}`}>{a.type}</Badge>
                    <Badge className={`text-[9px] ${a.status === "confirmed" ? "bg-[#F0FDF4] text-green-700" : "bg-[#FFF7ED] text-[#F59E0B]"}`}>{a.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs border-[#C5DEFF] text-[#1D6FA4] px-2">
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" className="text-xs bg-[#1D6FA4] text-white px-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability Manager */}
      {activeTab === "availability" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1E293B]">Manage Available Slots</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B]">Status:</span>
                <span className={`text-xs font-medium ${isOnline ? "text-green-600" : "text-[#64748B]"}`}>{isOnline ? "🟢 Online" : "⚫ Offline"}</span>
                <Switch checked={isOnline} onCheckedChange={setIsOnline} />
              </div>
            </div>
            <p className="text-sm text-[#64748B] mb-4">Select time slots you're available for today. Selected slots will be visible to patients.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {allSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`py-2.5 rounded-xl text-xs transition-all font-medium ${
                    selectedSlots.includes(slot)
                      ? "bg-[#1D6FA4] text-white shadow-sm"
                      : "bg-[#F0F7FF] text-[#475569] border border-[#E2ECF8] hover:border-[#1D6FA4]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Button className="bg-[#1D6FA4] text-white rounded-xl">Save Availability</Button>
              <Button variant="outline" className="border-[#E2ECF8] text-[#64748B] rounded-xl">Reset</Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
            <h3 className="text-[#1E293B] mb-3">Consultation Settings</h3>
            <div className="space-y-3">
              {[
                { label: "Accept Online Consultations", value: true },
                { label: "Accept Physical Consultations", value: true },
                { label: "Auto-confirm Bookings", value: false },
                { label: "AI Mode When Offline", value: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                  <span className="text-sm text-[#475569]">{s.label}</span>
                  <Switch defaultChecked={s.value} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inquiries */}
      {activeTab === "inquiries" && (
        <div className="space-y-3">
          {INQUIRIES.map((inq) => (
            <div key={inq.id} className={`bg-white rounded-2xl border p-4 ${inq.urgent ? "border-red-200" : "border-[#E2ECF8]"}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center text-sm font-bold text-[#1D6FA4] shrink-0">
                  {inq.patient.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#1E293B] text-sm">{inq.patient}</p>
                    {inq.urgent && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">URGENT</span>}
                    <span className="text-[11px] text-[#94A3B8] ml-auto">{inq.time}</span>
                  </div>
                  <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{inq.message}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-[#1D6FA4] text-white rounded-lg text-xs gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> Reply
                    </Button>
                    <Button size="sm" variant="outline" className="border-[#E2ECF8] text-[#64748B] rounded-lg text-xs">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1E293B]">Profile Information</h3>
              <Button size="sm" variant="outline" className="border-[#C5DEFF] text-[#1D6FA4] text-xs gap-1">
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Full Name", value: doctor.name },
                { label: "Specialization", value: doctor.specialization },
                { label: "Experience", value: `${doctor.experience} years` },
                { label: "Hospital", value: doctor.hospital },
                { label: "Education", value: doctor.education },
                { label: "City", value: doctor.city },
                { label: "Fee (PKR)", value: doctor.fee.toLocaleString() },
              ].map((f) => (
                <div key={f.label} className="flex justify-between py-2 border-b border-[#F8FAFC] last:border-0">
                  <span className="text-[#94A3B8]">{f.label}</span>
                  <span className="text-[#1E293B] text-right max-w-[60%]">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-3">Verification Status</h3>
              <div className="flex items-center gap-3 bg-[#F0FDF4] rounded-xl p-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-700 text-sm">PMDC Verified</p>
                  <p className="text-xs text-green-600">License #PKD-2024-08374 · Valid till Dec 2026</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-3">Languages Spoken</h3>
              <div className="flex gap-2 flex-wrap">
                {doctor.languages.map((l) => (
                  <span key={l} className="text-xs bg-[#EBF5FF] text-[#1D6FA4] px-3 py-1 rounded-full">{l}</span>
                ))}
                <button className="text-xs bg-[#F0F7FF] text-[#64748B] px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#C5DEFF]">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
