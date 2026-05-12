import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Send, Phone, Video, ChevronLeft, Bot, User, Paperclip,
  Smile, MoreVertical, CheckCheck, Clock, Calendar
} from "lucide-react";
import { Button } from "../components/ui/button";
import { DOCTORS, CHAT_MESSAGES } from "../data/mockData";

type Message = {
  id: number;
  sender: "doctor" | "patient" | "ai";
  text: string;
  time: string;
};

export function ChatPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  const [messages, setMessages] = useState<Message[]>(
    CHAT_MESSAGES.map((m) => ({ ...m, sender: m.sender as "doctor" | "patient" }))
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState(!doctor.isOnline);
  const [submitted, setSubmitted] = useState(false);
  const [offlineForm, setOfflineForm] = useState({ name: "", contact: "", problem: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: Date.now(), sender: "patient", text: input, time: now };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    if (aiMode) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiReplies = [
          "Thank you for sharing that. Can you tell me more about when the symptoms started?",
          "I understand. Based on what you've described, I recommend consulting with a specialist. Would you like me to find available doctors?",
          "I've noted your concern. Please describe the severity on a scale of 1-10.",
          "That's important information. I'll make sure Dr. " + doctor.name.split(" ")[1] + " reviews this when they're back online.",
        ];
        const reply = aiReplies[messages.length % aiReplies.length];
        setMessages((prev) => [...prev, { id: Date.now(), sender: "ai", text: reply, time: now }]);
      }, 1500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const doctorReplies = [
          "Thank you for the information. I'll review your case shortly.",
          "Please take the prescribed dosage twice daily with meals.",
          "I'd like to see you for a follow-up in 2 weeks. Please book an appointment.",
          "The test results look normal. Continue with the current treatment plan.",
        ];
        const reply = doctorReplies[messages.length % doctorReplies.length];
        setMessages((prev) => [...prev, { id: Date.now(), sender: "doctor", text: reply, time: now }]);
      }, 2000);
    }
  };

  const handleOfflineSubmit = () => {
    if (!offlineForm.name || !offlineForm.contact || !offlineForm.problem) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-[#E2ECF8] overflow-hidden flex flex-col" style={{ height: "calc(100vh - 140px)", minHeight: 500 }}>
        {/* Header */}
        <div className="bg-white border-b border-[#E2ECF8] px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#64748B] hover:text-[#1D6FA4]">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <img src={doctor.image} className="w-10 h-10 rounded-xl object-cover" alt={doctor.name} />
            {doctor.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#1E293B] text-sm">{doctor.name}</p>
            <p className="text-xs flex items-center gap-1">
              {doctor.isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600">Online · Doctor is active</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span className="text-[#64748B]">Last seen 2 min ago · AI Mode Active</span>
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {doctor.isOnline && (
              <>
                <button className="w-9 h-9 rounded-xl bg-[#F0F7FF] hover:bg-[#C5DEFF] flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4 text-[#1D6FA4]" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-[#F0F7FF] hover:bg-[#C5DEFF] flex items-center justify-center transition-colors">
                  <Video className="w-4 h-4 text-[#1D6FA4]" />
                </button>
              </>
            )}
            <Link to={`/appointment/${doctor.id}`}>
              <button className="w-9 h-9 rounded-xl bg-[#F0F7FF] hover:bg-[#C5DEFF] flex items-center justify-center transition-colors">
                <Calendar className="w-4 h-4 text-[#1D6FA4]" />
              </button>
            </Link>
            <button className="w-9 h-9 rounded-xl bg-[#F0F7FF] hover:bg-[#C5DEFF] flex items-center justify-center transition-colors">
              <MoreVertical className="w-4 h-4 text-[#1D6FA4]" />
            </button>
          </div>
        </div>

        {/* AI Mode Banner */}
        {!doctor.isOnline && !submitted && (
          <div className="bg-gradient-to-r from-[#EBF5FF] to-[#F0FDF4] border-b border-[#C5DEFF] px-4 py-2.5 flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#1D6FA4]" />
            <span className="text-xs text-[#1D6FA4]">
              <strong>AI Assistant Active</strong> — Dr. {doctor.name.split(" ")[1]} is currently offline. I'll collect your info and notify them.
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8FAFC] space-y-3">
          {/* Date label */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-[#E2ECF8]" />
            <span className="text-[11px] text-[#94A3B8] px-2">Today</span>
            <div className="flex-1 h-px bg-[#E2ECF8]" />
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === "patient" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.sender !== "patient" && (
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === "ai" ? "bg-[#0EA572]" : "bg-[#1D6FA4]"
                }`}>
                  {msg.sender === "ai" ? <Bot className="w-4 h-4 text-white" /> : (
                    <img src={doctor.image} className="w-7 h-7 rounded-xl object-cover" alt="" />
                  )}
                </div>
              )}
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender === "patient"
                    ? "bg-[#1D6FA4] text-white rounded-br-sm"
                    : msg.sender === "ai"
                    ? "bg-[#EBF5FF] text-[#1E293B] border border-[#C5DEFF] rounded-bl-sm"
                    : "bg-white text-[#1E293B] border border-[#E2ECF8] rounded-bl-sm"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Bot className="w-3 h-3 text-[#0EA572]" />
                    <span className="text-[10px] text-[#0EA572] font-semibold">AI Assistant</span>
                  </div>
                )}
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.sender === "patient" ? "justify-end" : ""}`}>
                  <span className={`text-[10px] ${msg.sender === "patient" ? "text-white/70" : "text-[#94A3B8]"}`}>
                    {msg.time}
                  </span>
                  {msg.sender === "patient" && <CheckCheck className="w-3 h-3 text-white/70" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${aiMode ? "bg-[#0EA572]" : "bg-[#1D6FA4]"}`}>
                {aiMode ? <Bot className="w-4 h-4 text-white" /> : <img src={doctor.image} className="w-7 h-7 rounded-xl object-cover" alt="" />}
              </div>
              <div className="bg-white border border-[#E2ECF8] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[11px] text-[#94A3B8]">{aiMode ? "AI is typing..." : "Doctor is typing..."}</span>
            </div>
          )}

          {/* Offline Form */}
          {!doctor.isOnline && !submitted && (
            <div className="bg-white border border-[#E2ECF8] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-[#0EA572]" />
                <p className="text-sm font-semibold text-[#1E293B]">Leave a message for Dr. {doctor.name.split(" ")[1]}</p>
              </div>
              <input
                placeholder="Your name"
                value={offlineForm.name}
                onChange={(e) => setOfflineForm({ ...offlineForm, name: e.target.value })}
                className="w-full border border-[#E2ECF8] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1D6FA4] bg-[#F8FAFC]"
              />
              <input
                placeholder="Your phone / email"
                value={offlineForm.contact}
                onChange={(e) => setOfflineForm({ ...offlineForm, contact: e.target.value })}
                className="w-full border border-[#E2ECF8] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1D6FA4] bg-[#F8FAFC]"
              />
              <textarea
                placeholder="Describe your problem..."
                value={offlineForm.problem}
                onChange={(e) => setOfflineForm({ ...offlineForm, problem: e.target.value })}
                rows={3}
                className="w-full border border-[#E2ECF8] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1D6FA4] bg-[#F8FAFC] resize-none"
              />
              <Button
                onClick={handleOfflineSubmit}
                className="w-full bg-[#1D6FA4] text-white rounded-xl"
              >
                Submit Request
              </Button>
            </div>
          )}

          {submitted && (
            <div className="bg-[#F0FDF4] border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-semibold text-green-700 text-sm">Request Submitted!</p>
              <p className="text-xs text-green-600 mt-1">📧 Doctor notified · ⏰ Expect response within 2-4 hours</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#E2ECF8] px-4 py-3 bg-white">
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-[#F0F7FF] hover:bg-[#C5DEFF] flex items-center justify-center transition-colors">
              <Paperclip className="w-4 h-4 text-[#64748B]" />
            </button>
            <div className="flex-1 flex items-center bg-[#F0F7FF] rounded-xl px-3 gap-2">
              <input
                className="flex-1 py-2 bg-transparent outline-none text-sm placeholder:text-[#94A3B8]"
                placeholder={aiMode ? "Type your symptoms or question..." : "Type a message..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="text-[#94A3B8] hover:text-[#64748B]">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 p-0 rounded-xl bg-[#1D6FA4] hover:bg-[#1557A0] text-white shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {aiMode && (
            <p className="text-[10px] text-[#94A3B8] text-center mt-2">
              🤖 AI assistant is active · Your data is secure & private
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
