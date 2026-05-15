import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Filter, SlidersHorizontal, Brain, MapPin, X, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { DoctorCard } from "../components/DoctorCard";
import { Skeleton } from "../components/ui/skeleton";
import { SPECIALIZATIONS } from "../data/mockData";
import { doctorsAPI } from "../../services/api";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const cityParam = searchParams.get("city") || "All Cities";
  const specParam = searchParams.get("specialization") || "";

  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [city, setCity] = useState(cityParam);
  const [specialization, setSpecialization] = useState(specParam);
  const [availability, setAvailability] = useState<string[]>([]);
  const [consultType, setConsultType] = useState<string[]>([]);
  const [ratingMin, setRatingMin] = useState(0);
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [aiTip, setAiTip] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setAiTip("");
      try {
        const data = await doctorsAPI.getDoctors({
          specialization: specialization || undefined,
          city: city !== "All Cities" ? city : undefined,
          limit: 50,
          skip: 0,
        });
        setDoctors(data);
        
        if (query) {
          const tips: Record<string, string> = {
            back: "Based on 'back pain', our AI recommends seeing an Orthopedic Surgeon or Neurologist. Doctors are available today.",
            heart: "For heart-related concerns, we recommend a Cardiologist. Check available doctors below.",
            skin: "For skin issues, a Dermatologist is your best option.",
          };
          const tipKey = Object.keys(tips).find((k) => query.toLowerCase().includes(k));
          setAiTip(tipKey ? tips[tipKey] : `Found doctors matching "${query}"`);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setAiTip("Failed to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [query, city, specialization]);

  const toggleFilter = (arr: string[], val: string, setter: (a: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  let filtered = doctors.filter((d) => {
    if (city !== "All Cities" && d.city !== city) return false;
    if (specialization && d.specialization !== specialization) return false;
    if (availability.length > 0 && !availability.some((a) => {
      if (a === "Online") return d.is_online;
      return true;
    })) return false;
    if (ratingMin > 0 && d.rating < ratingMin) return false;
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) &&
        !d.specialization.toLowerCase().includes(query.toLowerCase()) &&
        !d.city.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  if (sortBy === "Rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortBy === "Experience") filtered = [...filtered].sort((a, b) => b.experience_years - a.experience_years);
  else if (sortBy === "Fee: Low to High") filtered = [...filtered].sort((a, b) => a.consultation_fee - b.consultation_fee);
  else if (sortBy === "Recommended") filtered = [...filtered].sort((a, b) => (b.is_online ? 1 : 0) - (a.is_online ? 1 : 0));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-[#0F2744]">
            {specialization || (query ? `Results for "${query}"` : "All Doctors")}
          </h1>
          <p className="text-[#64748B] text-sm mt-0.5">{filtered.length} doctors found</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-[#E2ECF8] rounded-xl px-3 py-2 bg-white text-[#1E293B] outline-none focus:border-[#1D6FA4]"
          >
            {["Recommended", "Rating", "Experience", "Fee: Low to High"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-[#C5DEFF] text-[#1D6FA4] lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* AI Tip */}
      {aiTip && (
        <div className="bg-[#EBF5FF] border border-[#C5DEFF] rounded-xl p-4 mb-4 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#1D6FA4] flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1D6FA4] mb-0.5">🧠 AI Insight</p>
            <p className="text-sm text-[#1E293B]">{aiTip}</p>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5 sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[#1E293B] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1D6FA4]" /> Filters
              </h3>
              <button
                onClick={() => { setCity("All Cities"); setSpecialization(""); setAvailability([]); setConsultType([]); setRatingMin(0); }}
                className="text-xs text-[#1D6FA4] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* City */}
            <div>
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">Location</p>
              <div className="flex flex-col gap-1.5">
                {["All Cities", "Karachi", "Lahore", "Islamabad"].map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="city"
                      checked={city === c}
                      onChange={() => setCity(c)}
                      className="accent-[#1D6FA4]"
                    />
                    <span className="text-sm text-[#475569]">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Specialization */}
            <div>
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">Specialization</p>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full text-sm border border-[#E2ECF8] rounded-xl px-3 py-2 bg-white text-[#1E293B] outline-none focus:border-[#1D6FA4]"
              >
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">Availability</p>
              <div className="flex flex-col gap-1.5">
                {["Available Now", "Today", "Online"].map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={availability.includes(a)}
                      onChange={() => toggleFilter(availability, a, setAvailability)}
                      className="accent-[#1D6FA4]"
                    />
                    <span className="text-sm text-[#475569] flex items-center gap-1.5">
                      {a === "Available Now" && <span className="w-2 h-2 rounded-full bg-green-500" />}
                      {a}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consultation Type */}
            <div>
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">Consultation</p>
              <div className="flex flex-col gap-1.5">
                {["Online", "Physical"].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consultType.includes(t)}
                      onChange={() => toggleFilter(consultType, t, setConsultType)}
                      className="accent-[#1D6FA4]"
                    />
                    <span className="text-sm text-[#475569]">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">
                Minimum Rating: ⭐ {ratingMin}+
              </p>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={ratingMin}
                onChange={(e) => setRatingMin(parseFloat(e.target.value))}
                className="w-full accent-[#1D6FA4]"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1">
                <span>Any</span><span>5.0</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 space-y-3 border border-[#E2ECF8]">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#EBF5FF] flex items-center justify-center mb-4">
                <MapPin className="w-10 h-10 text-[#1D6FA4]" />
              </div>
              <h3 className="text-[#1E293B] mb-2">No Doctors Found</h3>
              <p className="text-[#64748B] text-sm max-w-sm">
                No doctors match your current filters. Try adjusting your search criteria or location.
              </p>
              <Button
                className="mt-4 bg-[#1D6FA4] text-white rounded-xl"
                onClick={() => { setCity("All Cities"); setSpecialization(""); setAvailability([]); setConsultType([]); setRatingMin(0); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
