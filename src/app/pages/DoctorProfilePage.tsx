import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Star, MapPin, BadgeCheck, Brain, Clock, Calendar, MessageCircle,
  Phone, Globe, Award, GraduationCap, ChevronLeft, Heart, Share2,
  CheckCircle2, AlertTriangle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { DOCTORS } from "../data/mockData";

const REVIEWS = [
  { name: "Aisha Rehman", rating: 5, comment: "Dr. Ahmed is exceptional! Very thorough and compassionate. Explained everything clearly.", time: "2 days ago", avatar: "AR" },
  { name: "Hassan Mehmood", rating: 5, comment: "Best cardiologist in Lahore. Got appointment quickly and the consultation was excellent.", time: "1 week ago", avatar: "HM" },
  { name: "Sana Butt", rating: 4, comment: "Very professional and knowledgeable doctor. The wait time was a bit long but worth it.", time: "2 weeks ago", avatar: "SB" },
  { name: "Tariq Aziz", rating: 5, comment: "Highly recommend! Diagnosed my condition correctly when other doctors couldn't. A true expert.", time: "1 month ago", avatar: "TA" },
];

export function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = DOCTORS.find((d) => d.id === id) || DOCTORS[0];
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultMode, setConsultMode] = useState<"Online" | "Physical">("Online");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "availability">("overview");

  const todaySlots = doctor.slots.filter((s) => s.date === selectedDate);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#64748B] hover:text-[#1D6FA4] mb-4 text-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to results
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl border border-[#E2ECF8] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1D6FA4] to-[#0F2744] h-24 relative">
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${saved ? "bg-red-500" : "bg-white/20 hover:bg-white/30"}`}
                >
                  <Heart className={`w-4 h-4 ${saved ? "text-white fill-white" : "text-white"}`} />
                </button>
                <button className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-12 mb-4">
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                  {doctor.isOnline && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-[#0F2744]" style={{ fontSize: "1.25rem" }}>{doctor.name}</h1>
                    {doctor.verified && (
                      <span className="flex items-center gap-1 bg-[#EBF5FF] text-[#1D6FA4] text-[11px] px-2 py-0.5 rounded-full font-medium">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[#1D6FA4] text-sm">{doctor.specialization}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-[#64748B]">
                      <MapPin className="w-3 h-3" />{doctor.city}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#64748B]">
                      <GraduationCap className="w-3 h-3" />{doctor.experience} yrs exp
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-[#1E293B]">{doctor.rating}</span>
                      <span className="text-[#94A3B8]">({doctor.reviewCount} reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${
                  doctor.isOnline ? "bg-[#F0FDF4] text-green-700" : "bg-[#F1F5F9] text-[#64748B]"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${doctor.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  {doctor.isOnline ? "Online Now" : "Offline"}
                </span>
                {doctor.consultationType.map((t) => (
                  <Badge key={t} className="text-[11px] bg-[#EBF5FF] text-[#1D6FA4] border-[#C5DEFF]">{t}</Badge>
                ))}
                <span className="flex items-center gap-1 text-xs text-[#64748B]">
                  <Clock className="w-3 h-3" /> Next slot: {doctor.nextSlot}
                </span>
                <span className="text-xs text-[#1E293B] font-semibold ml-auto">
                  PKR {doctor.fee.toLocaleString()} / session
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-[#E2ECF8] p-1">
            {(["overview", "reviews", "availability"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm capitalize transition-all ${
                  activeTab === tab
                    ? "bg-[#1D6FA4] text-white shadow-sm"
                    : "text-[#64748B] hover:bg-[#F0F7FF]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* About */}
              <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
                <h3 className="text-[#1E293B] mb-3">About</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{doctor.about}</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-[#1D6FA4] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#94A3B8]">Education</p>
                      <p className="text-sm text-[#1E293B]">{doctor.education}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-[#1D6FA4] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#94A3B8]">Hospital</p>
                      <p className="text-sm text-[#1E293B]">{doctor.hospital}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#1D6FA4] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#94A3B8]">Languages</p>
                      <p className="text-sm text-[#1E293B]">{doctor.languages.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#1D6FA4] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#94A3B8]">Consultation</p>
                      <p className="text-sm text-[#1E293B]">{doctor.consultationType.join(" & ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-[#EBF5FF] to-[#F0FDF4] rounded-2xl border border-[#C5DEFF] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1D6FA4] flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-[#1E293B]">AI Insights</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <p className="text-[#1D6FA4] text-lg font-bold">4:00 PM</p>
                    <p className="text-xs text-[#64748B]">Best time to visit</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <p className="text-[#0EA572] text-lg font-bold">~15 min</p>
                    <p className="text-xs text-[#64748B]">Estimated wait</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <p className="text-[#EA580C] text-lg font-bold">High</p>
                    <p className="text-xs text-[#64748B]">Demand today</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3">
              {/* Rating Summary */}
              <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#0F2744]">{doctor.rating}</div>
                    <div className="flex gap-0.5 my-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.floor(doctor.rating) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E2ECF8]"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-[#94A3B8]">{doctor.reviewCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-[#64748B] w-3">{s}</span>
                        <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#F59E0B] rounded-full"
                            style={{ width: `${s === 5 ? 75 : s === 4 ? 15 : s === 3 ? 7 : s === 2 ? 2 : 1}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {REVIEWS.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E2ECF8] p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1D6FA4] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {r.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1E293B]">{r.name}</span>
                        <span className="text-xs text-[#94A3B8]">{r.time}</span>
                      </div>
                      <div className="flex gap-0.5 mt-0.5 mb-1.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E2ECF8]"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-[#475569]">{r.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "availability" && (
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
              <h3 className="text-[#1E293B] mb-4">Schedule & Availability</h3>

              {/* Date Tabs */}
              <div className="flex gap-2 mb-4">
                {["Today", "Tomorrow"].map((d) => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                    className={`flex-1 py-2 rounded-xl text-sm transition-all ${
                      selectedDate === d ? "bg-[#1D6FA4] text-white" : "bg-[#F0F7FF] text-[#475569] hover:bg-[#C5DEFF]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Slots */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {todaySlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2 rounded-xl text-xs transition-all ${
                      !slot.available
                        ? "bg-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed line-through"
                        : selectedSlot === slot.time
                        ? "bg-[#1D6FA4] text-white shadow-md"
                        : "bg-[#F0FDF4] text-green-700 border border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              {selectedSlot && (
                <div className="mt-4 p-3 bg-[#EBF5FF] rounded-xl flex items-center justify-between">
                  <span className="text-sm text-[#1D6FA4]">
                    ✅ Selected: <strong>{selectedDate} at {selectedSlot}</strong>
                  </span>
                  <Link to={`/appointment/${doctor.id}?date=${selectedDate}&time=${selectedSlot}`}>
                    <Button size="sm" className="bg-[#1D6FA4] text-white rounded-lg text-xs">
                      Confirm Booking
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Book */}
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5 sticky top-24">
            <p className="text-[#94A3B8] text-xs mb-2">Consultation fee</p>
            <p className="text-2xl font-bold text-[#0F2744] mb-4">PKR {doctor.fee.toLocaleString()}</p>

            {/* Consultation Mode */}
            <div className="flex gap-2 mb-4">
              {doctor.consultationType.map((t) => (
                <button
                  key={t}
                  onClick={() => setConsultMode(t as any)}
                  className={`flex-1 py-2 rounded-xl text-xs transition-all ${
                    consultMode === t ? "bg-[#1D6FA4] text-white" : "bg-[#F0F7FF] text-[#475569]"
                  }`}
                >
                  {t === "Online" ? "📱" : "🏥"} {t}
                </button>
              ))}
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-3 mb-4">
              <div className="flex justify-between text-xs text-[#64748B] mb-1">
                <span>Next available</span>
                <span className="text-green-600 font-medium">{doctor.nextSlot} Today</span>
              </div>
              <div className="flex justify-between text-xs text-[#64748B]">
                <span>Wait time</span>
                <span>~15 min</span>
              </div>
            </div>

            <Link to={`/appointment/${doctor.id}`} className="block">
              <Button className="w-full bg-[#1D6FA4] hover:bg-[#1557A0] text-white rounded-xl gap-2 mb-2">
                <Calendar className="w-4 h-4" /> Book Appointment
              </Button>
            </Link>
            <Link to={`/chat/${doctor.id}`} className="block">
              <Button variant="outline" className="w-full border-[#C5DEFF] text-[#1D6FA4] rounded-xl gap-2">
                <MessageCircle className="w-4 h-4" /> Chat Now
              </Button>
            </Link>

            <div className="mt-4 flex items-start gap-2 text-xs text-[#64748B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
              Free cancellation up to 2 hours before appointment
            </div>
          </div>

          {/* Similar Doctors */}
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-4">
            <h4 className="text-[#1E293B] text-sm mb-3">Similar Doctors</h4>
            <div className="space-y-3">
              {DOCTORS.filter((d) => d.id !== id && d.specialization === doctor.specialization).slice(0, 2).concat(
                DOCTORS.filter((d) => d.id !== id && d.specialization !== doctor.specialization).slice(0, 1)
              ).slice(0, 3).map((d) => (
                <Link key={d.id} to={`/doctor/${d.id}`} className="flex items-center gap-3 hover:bg-[#F0F7FF] rounded-xl p-2 transition-colors">
                  <div className="relative">
                    <img src={d.image} className="w-10 h-10 rounded-lg object-cover" alt={d.name} />
                    {d.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1E293B] truncate">{d.name}</p>
                    <p className="text-[11px] text-[#1D6FA4]">{d.specialization}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-[11px] text-[#64748B]">{d.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}