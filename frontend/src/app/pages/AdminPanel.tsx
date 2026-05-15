import { useState } from "react";
import {
  Users, Stethoscope, Calendar, TrendingUp, Shield, Activity,
  CheckCircle2, XCircle, Eye, Search, Filter, AlertTriangle,
  BarChart2, PieChart, Bell, Settings, ChevronRight, Star
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { DOCTORS, ADMIN_STATS } from "../data/mockData";

type Tab = "overview" | "doctors" | "analytics" | "verifications" | "settings";

const VERIFICATION_REQUESTS = [
  { id: "v1", name: "Dr. Yusuf Raza", specialization: "Gastroenterologist", city: "Islamabad", submitted: "2 days ago", docs: 3 },
  { id: "v2", name: "Dr. Amna Siddiqui", specialization: "Radiologist", city: "Karachi", submitted: "1 day ago", docs: 4 },
  { id: "v3", name: "Dr. Khalid Hassan", specialization: "Pulmonologist", city: "Lahore", submitted: "5 hours ago", docs: 2 },
];

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = DOCTORS.filter((d) =>
    !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#0F2744] to-[#1D3F6E] rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-[#60BAFF]" />
              <span className="text-white/70 text-xs font-medium uppercase tracking-wide">Admin Panel</span>
            </div>
            <h2 className="text-white" style={{ fontSize: "1.3rem" }}>Smart Doctor Connect</h2>
            <p className="text-white/60 text-xs mt-0.5">System Administration & Analytics Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs">System Online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#E2ECF8] p-1 mb-6 overflow-x-auto">
        {([
          { id: "overview", label: "Overview", icon: Activity },
          { id: "doctors", label: "Doctors", icon: Stethoscope },
          { id: "analytics", label: "Analytics", icon: BarChart2 },
          { id: "verifications", label: "Verifications", icon: Shield },
          { id: "settings", label: "Settings", icon: Settings },
        ] as { id: Tab; label: string; icon: any }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 flex-1 py-2 px-3 rounded-lg text-sm whitespace-nowrap transition-all justify-center ${
              activeTab === tab.id ? "bg-[#0F2744] text-white shadow-sm" : "text-[#64748B] hover:bg-[#F0F7FF]"
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
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Total Doctors", value: ADMIN_STATS.totalDoctors, icon: Stethoscope, color: "text-[#1D6FA4]", bg: "bg-[#EBF5FF]" },
              { label: "Total Patients", value: ADMIN_STATS.totalPatients.toLocaleString(), icon: Users, color: "text-[#0EA572]", bg: "bg-[#F0FDF4]" },
              { label: "Today's Bookings", value: ADMIN_STATS.todayAppointments, icon: Calendar, color: "text-[#F59E0B]", bg: "bg-[#FFF7ED]" },
              { label: "Pending Verify", value: ADMIN_STATS.pendingVerifications, icon: Shield, color: "text-[#EA580C]", bg: "bg-[#FFF7ED]" },
              { label: "Active Chats", value: ADMIN_STATS.activeChats, icon: Bell, color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" },
              { label: "Revenue (PKR)", value: `${(ADMIN_STATS.monthlyRevenue / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "text-[#16A34A]", bg: "bg-[#F0FDF4]" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#E2ECF8] p-4">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-[#64748B] mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-3">Recent Registrations</h3>
              <div className="space-y-3">
                {DOCTORS.slice(0, 4).map((d) => (
                  <div key={d.id} className="flex items-center gap-3">
                    <img src={d.image} className="w-9 h-9 rounded-xl object-cover" alt={d.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E293B] truncate">{d.name}</p>
                      <p className="text-xs text-[#64748B]">{d.specialization} · {d.city}</p>
                    </div>
                    <Badge className={`text-[9px] ${d.verified ? "bg-[#F0FDF4] text-green-700 border-green-200" : "bg-[#FFF7ED] text-[#F59E0B] border-orange-200"}`}>
                      {d.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-3">System Alerts</h3>
              <div className="space-y-2.5">
                {[
                  { type: "warning", msg: "12 verification requests pending review", time: "Now" },
                  { type: "info", msg: "Server load at 67% — Normal range", time: "5 min ago" },
                  { type: "success", msg: "Daily backup completed successfully", time: "1 hour ago" },
                  { type: "warning", msg: "Dr. Kamran Ali reported an issue", time: "2 hours ago" },
                ].map((a, i) => (
                  <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl ${
                    a.type === "warning" ? "bg-[#FFF7ED]" : a.type === "info" ? "bg-[#EBF5FF]" : "bg-[#F0FDF4]"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      a.type === "warning" ? "bg-[#F59E0B]" : a.type === "info" ? "bg-[#1D6FA4]" : "bg-green-500"
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs text-[#1E293B]">{a.msg}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Management */}
      {activeTab === "doctors" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#E2ECF8] rounded-xl px-3 min-w-48">
              <Search className="w-4 h-4 text-[#94A3B8]" />
              <input
                className="flex-1 py-2 outline-none text-sm placeholder:text-[#94A3B8]"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="border-[#E2ECF8] text-[#64748B] gap-1.5">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button size="sm" className="bg-[#0F2744] text-white rounded-xl">+ Add Doctor</Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2ECF8] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2ECF8]">
                  <th className="text-left px-4 py-3 text-xs text-[#64748B] font-medium">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs text-[#64748B] font-medium hidden sm:table-cell">Specialization</th>
                  <th className="text-left px-4 py-3 text-xs text-[#64748B] font-medium hidden md:table-cell">City</th>
                  <th className="text-left px-4 py-3 text-xs text-[#64748B] font-medium hidden lg:table-cell">Rating</th>
                  <th className="text-left px-4 py-3 text-xs text-[#64748B] font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-[#64748B] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} className={`border-b border-[#F8FAFC] hover:bg-[#FAFBFD] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={d.image} className="w-8 h-8 rounded-lg object-cover" alt={d.name} />
                        <span className="text-sm text-[#1E293B] whitespace-nowrap">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#64748B] hidden sm:table-cell">{d.specialization}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B] hidden md:table-cell">{d.city}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                        {d.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${d.isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                        <Badge className={`text-[9px] ${d.verified ? "bg-[#F0FDF4] text-green-700 border-green-200" : "bg-[#FFF7ED] text-[#F59E0B] border-orange-200"}`}>
                          {d.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg bg-[#EBF5FF] flex items-center justify-center hover:bg-[#C5DEFF] transition-colors">
                          <Eye className="w-3.5 h-3.5 text-[#1D6FA4]" />
                        </button>
                        {!d.verified && (
                          <button className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center hover:bg-green-200 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          </button>
                        )}
                        <button className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Bar Chart Visual */}
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-4">Monthly Appointments</h3>
              <div className="flex items-end gap-2 h-32">
                {[42, 65, 58, 80, 72, 95, 88, 102, 91, 115, 107, 130].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-[#1D6FA4] to-[#60BAFF]"
                      style={{ height: `${(v / 130) * 100}%` }}
                    />
                    <span className="text-[8px] text-[#94A3B8]">
                      {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialization Distribution */}
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-4">Top Specializations</h3>
              <div className="space-y-2.5">
                {[
                  { name: "General Physician", value: 32, color: "bg-[#1D6FA4]" },
                  { name: "Dermatologist", value: 18, color: "bg-[#0EA572]" },
                  { name: "Cardiologist", value: 15, color: "bg-[#F59E0B]" },
                  { name: "Gynecologist", value: 12, color: "bg-[#8B5CF6]" },
                  { name: "Pediatrician", value: 10, color: "bg-[#EA580C]" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs text-[#64748B] w-32 shrink-0">{s.name}</span>
                    <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.value * 3}%` }} />
                    </div>
                    <span className="text-xs text-[#64748B] w-8">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Online vs Physical", values: [62, 38], labels: ["Online", "Physical"], colors: ["bg-[#1D6FA4]", "bg-[#0EA572]"] },
              { title: "City Distribution", values: [45, 35, 20], labels: ["Karachi", "Lahore", "Islamabad"], colors: ["bg-[#F59E0B]", "bg-[#EA580C]", "bg-[#8B5CF6]"] },
              { title: "Patient Satisfaction", values: [78, 17, 5], labels: ["Excellent", "Good", "Average"], colors: ["bg-[#0EA572]", "bg-[#1D6FA4]", "bg-[#F59E0B]"] },
            ].map((chart) => (
              <div key={chart.title} className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
                <h4 className="text-[#1E293B] text-sm mb-3">{chart.title}</h4>
                <div className="space-y-2">
                  {chart.values.map((v, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-[#64748B] mb-1">
                        <span>{chart.labels[i]}</span><span>{v}%</span>
                      </div>
                      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className={`h-full ${chart.colors[i]} rounded-full`} style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verifications */}
      {activeTab === "verifications" && (
        <div className="space-y-4">
          <div className="bg-[#FFF7ED] border border-orange-200 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <p className="text-sm text-[#92400E]">
              <strong>{ADMIN_STATS.pendingVerifications}</strong> verification requests awaiting review
            </p>
          </div>
          <div className="space-y-3">
            {VERIFICATION_REQUESTS.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EBF5FF] flex items-center justify-center text-lg font-bold text-[#1D6FA4]">
                    {r.name.split(" ").slice(1).map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1E293B]">{r.name}</p>
                    <p className="text-xs text-[#64748B]">{r.specialization} · {r.city}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">Submitted {r.submitted} · {r.docs} documents attached</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-[#0EA572] text-white rounded-lg gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-500 rounded-lg text-xs gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#E2ECF8] text-[#64748B] rounded-lg text-xs gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Review Documents
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Platform Settings",
              items: ["Allow new doctor registrations", "Require manual verification", "Enable AI chat mode", "Send automated reminders", "Allow online consultations"],
            },
            {
              title: "Notification Settings",
              items: ["Email on new booking", "SMS on appointment confirmation", "Push notifications for doctors", "Weekly summary reports", "System alert emails"],
            },
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item} className="flex items-center justify-between py-1.5 border-b border-[#F8FAFC] last:border-0">
                    <span className="text-sm text-[#475569]">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#E2ECF8] peer-checked:bg-[#1D6FA4] rounded-full peer-checked:after:translate-x-4 after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
