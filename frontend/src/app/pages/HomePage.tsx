import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Brain, ArrowRight, Star, Shield, Clock, Users, ChevronRight, Stethoscope } from "lucide-react";
import { Button } from "../components/ui/button";
import { DoctorCard } from "../components/DoctorCard";
import { SPECIALIZATIONS, AI_SEARCH_SUGGESTIONS } from "../data/mockData";
import { Skeleton } from "../components/ui/skeleton";
import { doctorsAPI } from "../../services/api";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAIResponse] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [city, setCity] = useState("All Cities");
  const [mode, setMode] = useState("All");
  const navigate = useNavigate();

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorsAPI.getDoctors({
          limit: 10,
          skip: 0,
        });
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
      setLoaded(true);
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const key = Object.keys(AI_SEARCH_SUGGESTIONS).find((k) =>
        query.toLowerCase().includes(k)
      );
      if (key) {
        setSuggestions(AI_SEARCH_SUGGESTIONS[key]);
        setShowSuggest(true);
      } else {
        setSuggestions([`Doctors for "${query}"`, `${query} specialist`, `${query} treatment`]);
        setShowSuggest(true);
      }
    } else {
      setShowSuggest(false);
    }
  }, [query]);

  const handleSearch = (q?: string) => {
    const searchQ = q || query;
    if (!searchQ.trim()) return;
    setLoading(true);
    setShowSuggest(false);
    setTimeout(() => {
      setLoading(false);
      navigate(`/search?q=${encodeURIComponent(searchQ)}`);
    }, 500);
  };

  const handleAIAssistant = () => {
    setShowAI(true);
    setAIResponse("");
    const responses = [
      "Based on your symptoms, you may need an **Orthopedic Specialist**. Common causes include muscle strain, disc problems, or nerve compression.",
      "I recommend seeing a **Cardiologist** if you're experiencing chest pain or shortness of breath.",
      "For skin-related issues, a **Dermatologist** would be the best choice for accurate diagnosis and treatment.",
    ];
    const resp = query
      ? query.toLowerCase().includes("back")
        ? responses[0]
        : query.toLowerCase().includes("heart") || query.toLowerCase().includes("chest")
        ? responses[1]
        : query.toLowerCase().includes("skin")
        ? responses[2]
        : responses[0]
      : responses[0];

    let i = 0;
    const interval = setInterval(() => {
      setAIResponse(resp.slice(0, i));
      i += 3;
      if (i > resp.length) clearInterval(interval);
    }, 30);
  };

  const onlineCount = doctors.filter((d) => d.is_online).length;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#0F2744] via-[#1D3F6E] to-[#1D6FA4] overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#1D6FA4]/20 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#0EA572]/15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-xs mb-6">
                <Brain className="w-3.5 h-3.5 text-[#60BAFF]" />
                AI-Powered Healthcare Platform
              </div>

              <h1 className="text-white mb-4" style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: "1.2" }}>
                Find the Right Doctor{" "}
                <span className="text-[#60BAFF]">Instantly</span>
              </h1>
              <p className="text-[#94A3B8] mb-8 leading-relaxed">
                Smart Doctor Connect uses AI to match you with verified doctors based on your symptoms,
                location, and availability — in seconds.
              </p>

              {/* Stats */}
              <div className="flex gap-6 mb-8">
                <div>
                  <div className="text-white text-2xl font-bold">248+</div>
                  <div className="text-[#94A3B8] text-xs">Verified Doctors</div>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <div className="text-white text-2xl font-bold">18K+</div>
                  <div className="text-[#94A3B8] text-xs">Patients Served</div>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <div className="text-[#0EA572] text-2xl font-bold">{onlineCount}</div>
                  <div className="text-[#94A3B8] text-xs">Online Now</div>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3">
                    <Search className="w-4 h-4 text-[#94A3B8]" />
                    <input
                      className="flex-1 py-2 outline-none text-sm text-[#1E293B] placeholder:text-[#94A3B8]"
                      placeholder="Search symptoms, doctors, specialization..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button
                    onClick={() => handleSearch()}
                    className="bg-[#1D6FA4] hover:bg-[#1557A0] text-white rounded-xl px-5 shrink-0"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    onClick={handleAIAssistant}
                    className="bg-gradient-to-r from-[#0EA572] to-[#059669] text-white rounded-xl px-4 shrink-0 gap-1.5"
                  >
                    <Brain className="w-4 h-4" />
                    <span className="hidden sm:inline">AI Assistant</span>
                  </Button>
                </div>

                {/* Autocomplete */}
                {showSuggest && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#E2ECF8] z-10 overflow-hidden">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setQuery(s); setShowSuggest(false); handleSearch(s); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#1E293B] hover:bg-[#F0F7FF] flex items-center gap-2"
                      >
                        <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Response Panel */}
            <div className="hidden lg:block">
              {showAI ? (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#0EA572] flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-semibold">AI Medical Assistant</span>
                    <div className="w-2 h-2 rounded-full bg-[#0EA572] animate-pulse ml-auto" />
                  </div>
                  <p className="text-[#CBD5E1] text-sm leading-relaxed mb-4">
                    {aiResponse}
                    <span className="animate-pulse">|</span>
                  </p>
                  {aiResponse.length > 30 && (
                    <div>
                      <p className="text-[#94A3B8] text-xs mb-3">Top Doctors Available Now:</p>
                      {doctors.filter((d) => d.is_online).slice(0, 2).map((d) => (
                        <div key={d.id} className="flex items-center gap-3 bg-white/10 rounded-xl p-3 mb-2">
                          <img src={d.image} className="w-10 h-10 rounded-lg object-cover" alt={d.name} />
                          <div className="flex-1">
                            <p className="text-white text-xs font-medium">{d.name}</p>
                            <p className="text-[#94A3B8] text-[11px]">{d.specialization}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-[11px] text-green-400">Online</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center">
                  <Brain className="w-12 h-12 text-[#60BAFF] mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">Smart AI Matching</p>
                  <p className="text-[#94A3B8] text-sm">
                    Describe your symptoms and our AI will find the perfect doctor for you instantly.
                  </p>
                  <Button
                    onClick={handleAIAssistant}
                    className="mt-4 bg-[#0EA572] hover:bg-[#059669] text-white rounded-xl gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    Try AI Assistant
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="bg-white border-b border-[#E2ECF8] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <span className="text-xs text-[#64748B] shrink-0 font-medium">Cities:</span>
          {["All Cities", "Karachi", "Lahore", "Islamabad"].map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); navigate(`/search?city=${c}`); }}
              className={`text-xs px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                city === c
                  ? "bg-[#1D6FA4] text-white"
                  : "bg-[#F0F7FF] text-[#475569] hover:bg-[#C5DEFF]"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="w-px h-4 bg-[#E2ECF8] shrink-0" />
          <span className="text-xs text-[#64748B] shrink-0 font-medium">Mode:</span>
          {["All", "Online", "Physical"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); navigate(`/search?mode=${m}`); }}
              className={`text-xs px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                mode === m
                  ? "bg-[#0EA572] text-white"
                  : "bg-[#F0FDF4] text-[#475569] hover:bg-[#BBF7D0]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-[#F0F7FF]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🧠", title: "AI Powered", desc: "Smart symptom-to-doctor matching", color: "bg-[#EBF5FF]" },
              { icon: "✅", title: "Verified Doctors", desc: "All doctors are PMDC verified", color: "bg-[#F0FDF4]" },
              { icon: "⚡", title: "Instant Booking", desc: "Book in less than 60 seconds", color: "bg-[#FFF7ED]" },
              { icon: "💬", title: "Live Chat", desc: "Chat directly with your doctor", color: "bg-[#FDF4FF]" },
            ].map((f) => (
              <div key={f.title} className={`${f.color} rounded-2xl p-5 text-center`}>
                <div className="text-3xl mb-2">{f.icon}</div>
                <p className="font-semibold text-[#1E293B] text-sm">{f.title}</p>
                <p className="text-xs text-[#64748B] mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#0F2744]">Browse by Specialization</h2>
              <p className="text-[#64748B] text-sm mt-1">Find the right specialist for your health needs</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-[#C5DEFF] text-[#1D6FA4] hidden sm:flex"
              onClick={() => navigate("/search")}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SPECIALIZATIONS.map((s) => (
              <button
                key={s.name}
                onClick={() => navigate(`/search?specialization=${s.name}`)}
                className="bg-[#F8FAFC] border border-[#E2ECF8] rounded-2xl p-4 text-center hover:border-[#1D6FA4] hover:bg-[#EBF5FF] transition-all group"
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-xs font-medium text-[#1E293B] group-hover:text-[#1D6FA4]">{s.name}</p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.count} doctors</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors */}
      <section className="py-12 bg-[#F0F7FF]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#0F2744]">Top Doctors Available Now</h2>
              <p className="text-[#64748B] text-sm mt-1">AI-ranked by rating, experience & availability</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-[#C5DEFF] text-[#1D6FA4] hidden sm:flex"
              onClick={() => navigate("/search")}
            >
              See All Doctors <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {!loaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 space-y-3">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {doctors.filter((d) => d.is_online).slice(0, 4).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-[#0F2744] mb-2">Why Patients Trust Us</h2>
            <p className="text-[#64748B] text-sm">Trusted by thousands of patients across Pakistan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-[#1D6FA4]" />, title: "PMDC Verified", desc: "Every doctor is verified by Pakistan Medical & Dental Council for your safety." },
              { icon: <Star className="w-6 h-6 text-[#F59E0B]" />, title: "4.8/5 Average Rating", desc: "Patients rate their experience across 18,000+ consultations and counting." },
              { icon: <Clock className="w-6 h-6 text-[#0EA572]" />, title: "< 2 Min Booking", desc: "Our AI streamlines the entire booking process from search to confirmation." },
            ].map((t) => (
              <div key={t.title} className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2ECF8]">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2ECF8] flex items-center justify-center mb-4 shadow-sm">
                  {t.icon}
                </div>
                <h3 className="text-[#1E293B] mb-2">{t.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-[#1D6FA4] to-[#0F2744]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-white mb-3">Ready to Find Your Doctor?</h2>
          <p className="text-[#94A3B8] mb-6 text-sm">
            Join 18,000+ patients who've already found their perfect doctor match using AI.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-white text-[#1D6FA4] hover:bg-[#EBF5FF] rounded-xl gap-2 font-semibold"
            >
              <Users className="w-4 h-4" />
              Join as Patient
            </Button>
            <Button
              onClick={() => navigate("/auth?role=doctor")}
              className="bg-[#0EA572] hover:bg-[#059669] text-white rounded-xl gap-2 font-semibold"
            >
              <Stethoscope className="w-4 h-4" />
              Join as Doctor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}