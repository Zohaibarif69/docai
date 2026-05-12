import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Bell, MessageCircle, User, Calendar, ChevronDown, Stethoscope, Menu, X, LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AI_SEARCH_SUGGESTIONS, NOTIFICATIONS } from "../data/mockData";

export function Navbar() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    if (query.length >= 2) {
      const key = Object.keys(AI_SEARCH_SUGGESTIONS).find((k) =>
        query.toLowerCase().includes(k)
      );
      if (key) {
        setSuggestions(AI_SEARCH_SUGGESTIONS[key]);
        setShowDropdown(true);
      } else {
        setSuggestions([
          `Doctors for "${query}"`,
          `${query} specialist`,
          `${query} treatment`,
          `Clinics near me`,
        ]);
        setShowDropdown(true);
      }
    } else {
      setShowDropdown(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (val?: string) => {
    const q = val || query;
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setShowDropdown(false);
      setQuery(val || query);
    }
  };

  return (
    <nav className="bg-white border-b border-[#E2ECF8] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#1D6FA4] flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-[#1D6FA4] font-bold text-sm">Smart Doctor</span>
            <span className="text-[#0EA572] font-bold text-sm"> Connect</span>
          </div>
        </Link>

        {/* AI Search */}
        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <div className="flex items-center bg-[#F0F7FF] border border-[#C5DEFF] rounded-xl px-3 gap-2 focus-within:border-[#1D6FA4] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-[#1D6FA4] shrink-0" />
            <input
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[#94A3B8]"
              placeholder='Search symptoms, doctors, specializations...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
            />
            {query && (
              <button onClick={() => { setQuery(""); setShowDropdown(false); }}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2ECF8] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-3 py-2 bg-[#EBF5FF] border-b border-[#E2ECF8]">
                <span className="text-xs text-[#1D6FA4] font-medium flex items-center gap-1">
                  🧠 AI Suggestions
                </span>
              </div>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0F7FF] text-left transition-colors"
                  onClick={() => handleSearch(s)}
                >
                  <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span className="text-sm text-[#1E293B]">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/search">
            <Button variant="ghost" size="sm" className="text-[#475569] hover:text-[#1D6FA4] gap-1.5">
              <User className="w-4 h-4" />
              Doctors
            </Button>
          </Link>
          <Link to="/patient/dashboard">
            <Button variant="ghost" size="sm" className="text-[#475569] hover:text-[#1D6FA4] gap-1.5">
              <Calendar className="w-4 h-4" />
              Appointments
            </Button>
          </Link>
          <Link to="/patient/dashboard?tab=messages">
            <Button variant="ghost" size="sm" className="text-[#475569] hover:text-[#1D6FA4] gap-1.5">
              <MessageCircle className="w-4 h-4" />
              Messages
              <Badge className="bg-[#1D6FA4] text-white text-[10px] h-4 min-w-[16px] px-1">3</Badge>
            </Button>
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0F7FF] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#475569]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-[#E2ECF8] rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2ECF8] flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#1E293B]">Notifications</span>
                  <Link to="/notifications" className="text-xs text-[#1D6FA4] hover:underline">View all</Link>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.slice(0, 4).map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer ${!n.read ? "bg-[#EBF5FF]" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-[#1D6FA4]" : "bg-transparent"}`} />
                        <div>
                          <p className="text-xs font-medium text-[#1E293B]">{n.title}</p>
                          <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{n.description}</p>
                          <p className="text-[10px] text-[#94A3B8] mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 w-9 h-9 rounded-xl bg-[#1D6FA4] text-white font-semibold text-sm hover:bg-[#1557A0] transition-colors justify-center"
            >
              AK
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E2ECF8] rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2ECF8]">
                  <p className="text-sm font-semibold text-[#1E293B]">Ali Khan</p>
                  <p className="text-xs text-[#64748B]">ali.khan@email.com</p>
                </div>
                <Link to="/patient/dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0F7FF] text-sm text-[#475569]">
                  <User className="w-4 h-4" /> Patient Dashboard
                </Link>
                <Link to="/doctor/dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0F7FF] text-sm text-[#475569]">
                  <Stethoscope className="w-4 h-4" /> Doctor Dashboard
                </Link>
                <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0F7FF] text-sm text-[#475569]">
                  <Settings className="w-4 h-4" /> Admin Panel
                </Link>
                <div className="border-t border-[#E2ECF8]">
                  <Link to="/auth" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FFF0F0] text-sm text-red-500">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0F7FF]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E2ECF8] px-4 py-3 flex flex-col gap-1">
          <Link to="/search" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F0F7FF] text-[#475569] text-sm">
            <User className="w-4 h-4" /> Find Doctors
          </Link>
          <Link to="/patient/dashboard" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F0F7FF] text-[#475569] text-sm">
            <Calendar className="w-4 h-4" /> My Appointments
          </Link>
          <Link to="/patient/dashboard?tab=messages" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F0F7FF] text-[#475569] text-sm">
            <MessageCircle className="w-4 h-4" /> Messages
          </Link>
          <Link to="/notifications" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F0F7FF] text-[#475569] text-sm">
            <Bell className="w-4 h-4" /> Notifications
          </Link>
        </div>
      )}
    </nav>
  );
}