import { Link } from "react-router";
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F2744] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#1D6FA4] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-sm">Smart Doctor</span>
                <span className="text-[#0EA572] font-bold text-sm"> Connect</span>
              </div>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
              AI-powered healthcare platform connecting patients with verified doctors across Pakistan.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-[#1D3557] flex items-center justify-center hover:bg-[#1D6FA4] transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Find Doctors", to: "/search" },
                { label: "Book Appointment", to: "/search" },
                { label: "Patient Dashboard", to: "/patient/dashboard" },
                { label: "Doctor Dashboard", to: "/doctor/dashboard" },
                { label: "AI Assistant", to: "/" },
              ].map((l) => (
                <Link key={l.label} to={l.to} className="text-[#94A3B8] text-sm hover:text-[#60BAFF] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Specializations</h4>
            <div className="flex flex-col gap-2">
              {["Cardiologist", "Dermatologist", "Neurologist", "Orthopedic", "Pediatrician", "Psychiatrist"].map((s) => (
                <Link key={s} to={`/search?specialization=${s}`} className="text-[#94A3B8] text-sm hover:text-[#60BAFF] transition-colors">
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1D6FA4] mt-0.5 shrink-0" />
                <span className="text-[#94A3B8] text-sm">123 Medical Center, Blue Area, Islamabad</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1D6FA4] shrink-0" />
                <span className="text-[#94A3B8] text-sm">+92 311 1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#1D6FA4] shrink-0" />
                <span className="text-[#94A3B8] text-sm">support@smartdoctor.pk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1D3557] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#64748B] text-xs">© 2026 Smart Doctor Connect. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-[#64748B] text-xs hover:text-[#94A3B8] cursor-pointer">Privacy Policy</span>
            <span className="text-[#64748B] text-xs hover:text-[#94A3B8] cursor-pointer">Terms of Service</span>
            <span className="text-[#64748B] text-xs hover:text-[#94A3B8] cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
