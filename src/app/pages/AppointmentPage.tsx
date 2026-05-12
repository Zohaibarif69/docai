import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import {
  ChevronLeft, Calendar, Clock, MapPin, CheckCircle2, Brain,
  AlertTriangle, CreditCard, User, Mail, Phone, FileText
} from "lucide-react";
import { Button } from "../components/ui/button";
import { DOCTORS } from "../data/mockData";
import { toast } from "sonner";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return { date: d.getDate(), day: WEEK_DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], month: d.toLocaleString("default", { month: "short" }), full: d.toDateString() };
});

const TIME_SLOTS = [
  { time: "9:00 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "12:00 PM", available: false },
  { time: "1:00 PM", available: true },
  { time: "2:00 PM", available: true },
  { time: "3:00 PM", available: false },
  { time: "4:00 PM", available: true },
  { time: "5:00 PM", available: true },
  { time: "6:00 PM", available: false },
];

type Step = 1 | 2 | 3;

export function AppointmentPage() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];

  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState(MONTH_DATES[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(searchParams.get("time") || null);
  const [consultType, setConsultType] = useState<"Online" | "Physical">("Online");
  const [conflictSlot, setConflictSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "Ali Khan", email: "ali.khan@email.com", phone: "+92 311 1234567", reason: "" });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const aiSuggestions = [
    { label: "⚡ Earliest Available", time: "10:00 AM", note: "Today" },
    { label: "🚀 Fastest Confirmed", time: "11:00 AM", note: "Tomorrow" },
    { label: "🌟 Most Popular", time: "4:00 PM", note: "Today" },
  ];

  const handleSlotSelect = (slot: string, available: boolean) => {
    if (!available) {
      setConflictSlot(slot);
      setTimeout(() => setConflictSlot(null), 2000);
      return;
    }
    setSelectedSlot(slot);
    setConflictSlot(null);
  };

  const handleBooking = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
      toast.success("Appointment confirmed! Email sent.");
    }, 1500);
  };

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl border border-[#E2ECF8] p-8">
          <div className="w-20 h-20 rounded-full bg-[#F0FDF4] border-4 border-green-200 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-[#0F2744] mb-2">Appointment Confirmed!</h2>
          <p className="text-[#64748B] text-sm mb-6">Your appointment has been successfully booked.</p>

          <div className="bg-[#F8FAFC] rounded-xl p-4 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Doctor</span>
              <span className="text-[#1E293B] font-medium">{doctor.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Specialization</span>
              <span className="text-[#1E293B]">{doctor.specialization}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Date & Time</span>
              <span className="text-[#1E293B] font-medium">{selectedDate.full} · {selectedSlot}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Consultation</span>
              <span className="text-[#1E293B]">{consultType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Fee</span>
              <span className="text-green-600 font-semibold">PKR {doctor.fee.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#EBF5FF] rounded-xl p-3 mb-6 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#1D6FA4]" />
            <p className="text-xs text-[#1D6FA4]">Confirmation sent to <strong>{form.email}</strong></p>
          </div>

          <div className="flex gap-3">
            <Link to="/patient/dashboard" className="flex-1">
              <Button variant="outline" className="w-full border-[#C5DEFF] text-[#1D6FA4] rounded-xl">
                My Appointments
              </Button>
            </Link>
            <Link to={`/chat/${doctor.id}`} className="flex-1">
              <Button className="w-full bg-[#1D6FA4] text-white rounded-xl">
                Chat with Doctor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <button onClick={() => step === 1 ? navigate(-1) : setStep((step - 1) as Step)} className="flex items-center gap-2 text-[#64748B] hover:text-[#1D6FA4] mb-4 text-sm">
        <ChevronLeft className="w-4 h-4" /> {step === 1 ? "Back to Profile" : "Previous Step"}
      </button>

      <h1 className="text-[#0F2744] mb-1">Book Appointment</h1>
      <p className="text-[#64748B] text-sm mb-6">with {doctor.name} · {doctor.specialization}</p>

      {/* Steps */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step > s ? "bg-green-500 text-white" : step === s ? "bg-[#1D6FA4] text-white" : "bg-[#E2ECF8] text-[#94A3B8]"
            }`}>
              {step > s ? "✓" : s}
            </div>
            <span className={`text-xs hidden sm:block ${step === s ? "text-[#1D6FA4] font-medium" : "text-[#94A3B8]"}`}>
              {s === 1 ? "Select Slot" : s === 2 ? "Your Info" : "Payment"}
            </span>
            {s < 3 && <div className={`flex-1 h-px ${step > s ? "bg-green-500" : "bg-[#E2ECF8]"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Select Slot */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Consultation Type */}
              <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
                <h3 className="text-[#1E293B] mb-3">Consultation Type</h3>
                <div className="flex gap-3">
                  {doctor.consultationType.map((t) => (
                    <button
                      key={t}
                      onClick={() => setConsultType(t as any)}
                      className={`flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                        consultType === t ? "bg-[#1D6FA4] text-white shadow-md" : "bg-[#F0F7FF] text-[#475569] hover:bg-[#C5DEFF]"
                      }`}
                    >
                      {t === "Online" ? "📱" : "🏥"} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-gradient-to-r from-[#EBF5FF] to-[#F0FDF4] border border-[#C5DEFF] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-[#1D6FA4]" />
                  <p className="text-sm font-semibold text-[#1D6FA4]">🧠 AI Recommended Slots</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {aiSuggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSelectedSlot(s.time)}
                      className={`text-xs px-3 py-2 rounded-xl transition-all ${
                        selectedSlot === s.time
                          ? "bg-[#1D6FA4] text-white"
                          : "bg-white text-[#1D6FA4] border border-[#C5DEFF] hover:bg-[#EBF5FF]"
                      }`}
                    >
                      {s.label} · {s.time} <span className="text-[10px] opacity-70">{s.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Picker */}
              <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
                <h3 className="text-[#1E293B] mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1D6FA4]" /> Select Date
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {MONTH_DATES.slice(0, 10).map((d) => (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d)}
                      className={`shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center text-xs transition-all ${
                        selectedDate.full === d.full
                          ? "bg-[#1D6FA4] text-white shadow-md"
                          : "bg-[#F0F7FF] text-[#475569] hover:bg-[#C5DEFF]"
                      }`}
                    >
                      <span className="opacity-70">{d.day}</span>
                      <span className="text-base font-bold">{d.date}</span>
                      <span className="opacity-70">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5">
                <h3 className="text-[#1E293B] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1D6FA4]" /> Available Time Slots
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleSlotSelect(slot.time, slot.available)}
                      className={`py-2.5 rounded-xl text-xs transition-all relative ${
                        conflictSlot === slot.time
                          ? "bg-red-50 border-2 border-red-300 text-red-500 animate-pulse"
                          : !slot.available
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

                {conflictSlot && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-red-600">Slot Just Booked!</p>
                      <p className="text-xs text-red-500">This slot is no longer available. Please select another time.</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-[#1D6FA4] text-white rounded-xl h-11"
                disabled={!selectedSlot}
                onClick={() => setStep(2)}
              >
                Continue to Patient Info →
              </Button>
            </div>
          )}

          {/* Step 2: Patient Info */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5 space-y-4">
              <h3 className="text-[#1E293B]">Patient Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Full Name</label>
                  <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                    <User className="w-4 h-4 text-[#94A3B8]" />
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Email Address</label>
                  <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                    <Mail className="w-4 h-4 text-[#94A3B8]" />
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Phone Number</label>
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
                <div>
                  <label className="text-xs text-[#64748B] mb-1.5 block">Age</label>
                  <div className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                    <User className="w-4 h-4 text-[#94A3B8]" />
                    <input
                      className="flex-1 py-2.5 bg-transparent outline-none text-sm"
                      placeholder="Your age"
                      defaultValue="28"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#64748B] mb-1.5 block">Reason for Visit / Symptoms</label>
                <div className="flex items-start gap-2 border border-[#E2ECF8] rounded-xl px-3 pt-2.5 bg-[#F8FAFC] focus-within:border-[#1D6FA4]">
                  <FileText className="w-4 h-4 text-[#94A3B8] mt-0.5" />
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    rows={3}
                    className="flex-1 pb-2 bg-transparent outline-none text-sm resize-none"
                    placeholder="Briefly describe your symptoms or reason for consultation..."
                  />
                </div>
              </div>
              <Button className="w-full bg-[#1D6FA4] text-white rounded-xl h-11" onClick={() => setStep(3)}>
                Continue to Payment →
              </Button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5 space-y-4">
              <h3 className="text-[#1E293B]">Payment Details</h3>
              <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Consultation Fee</span>
                  <span className="text-[#1E293B]">PKR {doctor.fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Service Charge</span>
                  <span className="text-[#1E293B]">PKR 200</span>
                </div>
                <div className="border-t border-[#E2ECF8] pt-2 flex justify-between font-semibold">
                  <span className="text-[#1E293B]">Total</span>
                  <span className="text-[#1D6FA4]">PKR {(doctor.fee + 200).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#1E293B] mb-3">Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  {["JazzCash", "EasyPaisa", "Bank Transfer", "Cash on Visit"].map((m) => (
                    <button key={m} className="flex items-center gap-2 border border-[#E2ECF8] rounded-xl px-3 py-2.5 text-sm text-[#475569] hover:border-[#1D6FA4] hover:bg-[#EBF5FF] transition-all text-left">
                      <CreditCard className="w-4 h-4 text-[#1D6FA4] shrink-0" />
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#F0FDF4] border border-green-200 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <p className="text-xs text-green-700">Free cancellation up to 2 hours before appointment</p>
              </div>

              <Button
                className="w-full bg-[#1D6FA4] text-white rounded-xl h-11 gap-2"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking ✅"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-4 sticky top-24">
            <h4 className="text-[#1E293B] text-sm mb-3">Booking Summary</h4>
            <div className="flex items-center gap-3 mb-3">
              <img src={doctor.image} className="w-12 h-12 rounded-xl object-cover" alt={doctor.name} />
              <div>
                <p className="text-sm font-medium text-[#1E293B]">{doctor.name}</p>
                <p className="text-xs text-[#1D6FA4]">{doctor.specialization}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#64748B]">
                <Calendar className="w-3.5 h-3.5 text-[#1D6FA4]" />
                <span>{selectedDate.full}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Clock className="w-3.5 h-3.5 text-[#1D6FA4]" />
                <span>{selectedSlot || "Not selected"}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <MapPin className="w-3.5 h-3.5 text-[#1D6FA4]" />
                <span>{consultType} · {doctor.city}</span>
              </div>
            </div>
            <div className="border-t border-[#E2ECF8] mt-3 pt-3 flex justify-between text-sm">
              <span className="text-[#64748B]">Fee</span>
              <span className="font-semibold text-[#1D6FA4]">PKR {doctor.fee.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
