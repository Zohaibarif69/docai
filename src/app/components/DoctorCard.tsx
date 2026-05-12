import { Link } from "react-router";
import { Star, MapPin, Clock, MessageCircle, Calendar, BadgeCheck, Zap, Brain } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Doctor } from "../data/mockData";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2ECF8] p-5 hover:shadow-lg hover:border-[#1D6FA4]/30 transition-all duration-200 flex flex-col gap-4">
      {/* AI Badge */}
      {doctor.aiMatch && (
        <div className="flex justify-end">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            doctor.aiMatch === "Best Match"
              ? "bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]"
              : doctor.aiMatch === "Recommended"
              ? "bg-[#EBF5FF] text-[#1D6FA4] border border-[#C5DEFF]"
              : "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
          }`}>
            {doctor.aiMatch === "Best Match" ? <Zap className="w-3 h-3" /> : <Brain className="w-3 h-3" />}
            {doctor.aiMatch}
          </span>
        </div>
      )}

      {/* Doctor Info */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          {doctor.isOnline && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-[#1E293B] text-sm">{doctor.name}</h3>
            {doctor.verified && <BadgeCheck className="w-4 h-4 text-[#1D6FA4] shrink-0" />}
          </div>
          <p className="text-[#1D6FA4] text-xs mt-0.5">{doctor.specialization}</p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-[#94A3B8]" />
            <span className="text-[#64748B] text-xs">{doctor.city}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-xs text-[#1E293B]">{doctor.rating}</span>
              <span className="text-xs text-[#94A3B8]">({doctor.reviewCount})</span>
            </div>
            <span className="text-xs text-[#64748B]">{doctor.experience} yrs exp</span>
          </div>
        </div>
      </div>

      {/* Status & Slot */}
      <div className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${doctor.isOnline ? "bg-green-500" : "bg-gray-400"}`} />
          <span className={`text-xs font-medium ${doctor.isOnline ? "text-green-700" : "text-[#64748B]"}`}>
            {doctor.isOnline ? "Online Now" : "Offline"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#475569]">
          <Clock className="w-3.5 h-3.5" />
          <span>Next: {doctor.nextSlot}</span>
        </div>
      </div>

      {/* Availability Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
          doctor.availability === "Available Now"
            ? "bg-[#F0FDF4] text-green-700 border-green-200"
            : "bg-[#FFF7ED] text-[#EA580C] border-orange-200"
        }`}>
          {doctor.availability}
        </Badge>
        {doctor.consultationType.map((t) => (
          <Badge key={t} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EBF5FF] text-[#1D6FA4] border border-[#C5DEFF]">
            {t}
          </Badge>
        ))}
      </div>

      {/* Fee */}
      <div className="text-xs text-[#64748B]">
        Consultation fee: <span className="text-[#1E293B] font-semibold">PKR {doctor.fee.toLocaleString()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <Link to={`/doctor/${doctor.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full border-[#C5DEFF] text-[#1D6FA4] hover:bg-[#EBF5FF] rounded-lg text-xs">
            View Profile
          </Button>
        </Link>
        <Link to={`/chat/${doctor.id}`}>
          <Button variant="outline" size="sm" className="border-[#C5DEFF] text-[#1D6FA4] hover:bg-[#EBF5FF] rounded-lg px-3">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </Link>
        <Link to={`/appointment/${doctor.id}`}>
          <Button size="sm" className="bg-[#1D6FA4] hover:bg-[#1557A0] text-white rounded-lg px-3">
            <Calendar className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
