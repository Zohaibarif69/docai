import { useState } from "react";
import { Link } from "react-router";
import {
  Calendar, MessageCircle, Heart, User, Clock, Star, ChevronRight,
  MapPin, CheckCircle2, XCircle, Bell, FileText, Activity
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { APPOINTMENTS, MESSAGES, NOTIFICATIONS, DOCTORS } from "../data/mockData";

type Tab = "overview" | "appointments" | "messages" | "saved";

export function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const upcoming = APPOINTMENTS.filter((a) => a.status === "Upcoming");
  const past = APPOINTMENTS.filter((a) => a.status === "Completed");
  const unreadMessages = MESSAGES.reduce((sum, m) => sum + m.unread, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1D6FA4] to-[#0F2744] rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            AK
          </div>
          <div>
            <p className="text-white/70 text-xs">Welcome back 👋</p>
            <h2 className="text-white" style={{ fontSize: "1.25rem" }}>Ali Khan</h2>
            <p className="text-white/70 text-xs mt-0.5">ali.khan@email.com · +92 311 1234567</p>
          </div>
          <div className="ml-auto hidden sm:flex gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{upcoming.length}</div>
              <div className="text-white/70 text-xs">Upcoming</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">{past.length}</div>
              <div className="text-white/70 text-xs">Completed</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">{unreadMessages}</div>
              <div className="text-white/70 text-xs">Unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#E2ECF8] p-1 mb-6 overflow-x-auto">
        {([
          { id: "overview", label: "Overview", icon: Activity },
          { id: "appointments", label: "Appointments", icon: Calendar },
          { id: "messages", label: "Messages", icon: MessageCircle },
          { id: "saved", label: "Saved Doctors", icon: Heart },
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
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Appointments", value: APPOINTMENTS.length, icon: Calendar, color: "text-[#1D6FA4]", bg: "bg-[#EBF5FF]" },
              { label: "Messages", value: MESSAGES.length, icon: MessageCircle, color: "text-[#0EA572]", bg: "bg-[#F0FDF4]" },
              { label: "Doctors Consulted", value: 4, icon: User, color: "text-[#F59E0B]", bg: "bg-[#FFF7ED]" },
              { label: "Notifications", value: NOTIFICATIONS.filter(n => !n.read).length, icon: Bell, color: "text-[#EA580C]", bg: "bg-[#FFF7ED]" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#E2ECF8] p-4">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1E293B]">Upcoming Appointments</h3>
              <button onClick={() => setActiveTab("appointments")} className="text-xs text-[#1D6FA4] flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2ECF8]">
                  <img src={a.image} className="w-10 h-10 rounded-xl object-cover" alt={a.doctorName} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E293B]">{a.doctorName}</p>
                    <p className="text-xs text-[#1D6FA4]">{a.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-[#94A3B8]" />
                      <span className="text-xs text-[#64748B]">{a.date} · {a.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge className="text-[10px] bg-[#EBF5FF] text-[#1D6FA4] border-[#C5DEFF]">{a.type}</Badge>
                    <Link to={`/chat/${a.doctorId}`}>
                      <button className="text-[10px] text-[#1D6FA4] hover:underline">Chat</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1E293B]">Recent Messages</h3>
              <button onClick={() => setActiveTab("messages")} className="text-xs text-[#1D6FA4] flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {MESSAGES.slice(0, 2).map((m) => (
                <Link key={m.id} to={`/chat/${m.doctorId}`} className="flex items-center gap-3 hover:bg-[#F8FAFC] rounded-xl p-2 -mx-2 transition-colors">
                  <div className="relative">
                    <img src={m.image} className="w-10 h-10 rounded-xl object-cover" alt={m.doctorName} />
                    {m.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-[#1E293B]">{m.doctorName}</p>
                      <span className="text-[11px] text-[#94A3B8]">{m.time}</span>
                    </div>
                    <p className="text-xs text-[#64748B] truncate">{m.lastMessage}</p>
                  </div>
                  {m.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#1D6FA4] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {m.unread}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-[#1E293B] mb-3">Upcoming Appointments</h3>
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2ECF8] p-10 text-center">
                <Calendar className="w-10 h-10 text-[#C5DEFF] mx-auto mb-3" />
                <p className="text-[#64748B] text-sm">No upcoming appointments</p>
                <Link to="/search">
                  <Button size="sm" className="mt-3 bg-[#1D6FA4] text-white rounded-xl">Find a Doctor</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <div key={a.id} className="bg-white rounded-2xl border border-[#E2ECF8] p-4">
                    <div className="flex items-center gap-3">
                      <img src={a.image} className="w-12 h-12 rounded-xl object-cover" alt={a.doctorName} />
                      <div className="flex-1">
                        <p className="font-medium text-[#1E293B]">{a.doctorName}</p>
                        <p className="text-xs text-[#1D6FA4]">{a.specialization}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-[#64748B]">
                            <Calendar className="w-3 h-3" /> {a.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#64748B]">
                            <Clock className="w-3 h-3" /> {a.time}
                          </span>
                          <Badge className="text-[10px] bg-[#EBF5FF] text-[#1D6FA4] border-[#C5DEFF]">{a.type}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/chat/${a.doctorId}`}>
                          <Button size="sm" variant="outline" className="text-xs border-[#C5DEFF] text-[#1D6FA4]">Chat</Button>
                        </Link>
                        <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-500 hover:bg-red-50">Cancel</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[#1E293B] mb-3">Past Appointments</h3>
            <div className="space-y-3">
              {past.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl border border-[#E2ECF8] p-4 opacity-80">
                  <div className="flex items-center gap-3">
                    <img src={a.image} className="w-12 h-12 rounded-xl object-cover grayscale" alt={a.doctorName} />
                    <div className="flex-1">
                      <p className="font-medium text-[#1E293B]">{a.doctorName}</p>
                      <p className="text-xs text-[#64748B]">{a.specialization}</p>
                      <span className="text-xs text-[#64748B]">{a.date} · {a.time}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="text-[10px] bg-[#F0FDF4] text-green-700 border-green-200">Completed</Badge>
                      <button className="text-xs text-[#1D6FA4] hover:underline flex items-center gap-1">
                        <Star className="w-3 h-3" /> Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="bg-white rounded-2xl border border-[#E2ECF8] overflow-hidden">
          {MESSAGES.map((m, i) => (
            <Link
              key={m.id}
              to={`/chat/${m.doctorId}`}
              className={`flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors ${i < MESSAGES.length - 1 ? "border-b border-[#F1F5F9]" : ""} ${m.unread > 0 ? "bg-[#EBF5FF]" : ""}`}
            >
              <div className="relative">
                <img src={m.image} className="w-12 h-12 rounded-xl object-cover" alt={m.doctorName} />
                {m.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-0.5">
                  <span className={`text-sm ${m.unread > 0 ? "font-semibold text-[#1E293B]" : "text-[#1E293B]"}`}>{m.doctorName}</span>
                  <span className="text-[11px] text-[#94A3B8]">{m.time}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">{m.specialization}</p>
                <p className={`text-xs truncate mt-0.5 ${m.unread > 0 ? "text-[#1E293B] font-medium" : "text-[#94A3B8]"}`}>
                  {m.lastMessage}
                </p>
              </div>
              {m.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#1D6FA4] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {m.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Saved Doctors Tab */}
      {activeTab === "saved" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCTORS.slice(0, 3).map((d) => (
              <div key={d.id} className="bg-white rounded-2xl border border-[#E2ECF8] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img src={d.image} className="w-12 h-12 rounded-xl object-cover" alt={d.name} />
                    {d.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-[#1E293B] text-sm">{d.name}</p>
                    <p className="text-xs text-[#1D6FA4]">{d.specialization}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-xs text-[#64748B]">{d.rating} · {d.city}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/appointment/${d.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-[#1D6FA4] text-white rounded-lg text-xs">Book</Button>
                  </Link>
                  <Link to={`/chat/${d.id}`}>
                    <Button size="sm" variant="outline" className="border-[#C5DEFF] text-[#1D6FA4] rounded-lg px-2">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
