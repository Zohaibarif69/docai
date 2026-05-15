import { useState } from "react";
import { Bell, Calendar, MessageCircle, Star, Settings, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { NOTIFICATIONS } from "../data/mockData";

type NotifType = "all" | "booking" | "reminder" | "inquiry" | "system";

export function NotificationsPage() {
  const [filter, setFilter] = useState<NotifType>("all");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const icons: Record<string, React.ReactNode> = {
    booking: <Calendar className="w-4 h-4 text-[#1D6FA4]" />,
    reminder: <Bell className="w-4 h-4 text-[#F59E0B]" />,
    inquiry: <MessageCircle className="w-4 h-4 text-[#0EA572]" />,
    review: <Star className="w-4 h-4 text-[#F59E0B]" />,
    system: <Settings className="w-4 h-4 text-[#64748B]" />,
  };

  const bgColors: Record<string, string> = {
    booking: "bg-[#EBF5FF]",
    reminder: "bg-[#FFF7ED]",
    inquiry: "bg-[#F0FDF4]",
    review: "bg-[#FFF7ED]",
    system: "bg-[#F1F5F9]",
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0F2744]">Notifications</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up! ✅"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllRead}
            variant="outline"
            size="sm"
            className="gap-1.5 border-[#C5DEFF] text-[#1D6FA4]"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#E2ECF8] p-1 mb-4 overflow-x-auto">
        {(["all", "booking", "reminder", "inquiry", "system"] as NotifType[]).map((f) => {
          const count = f === "all" ? notifications.filter(n => !n.read).length : notifications.filter(n => n.type === f && !n.read).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 flex-1 py-2 px-3 rounded-lg text-xs whitespace-nowrap transition-all justify-center capitalize ${
                filter === f ? "bg-[#1D6FA4] text-white shadow-sm" : "text-[#64748B] hover:bg-[#F0F7FF]"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              {count > 0 && (
                <span className={`text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                  filter === f ? "bg-white/30 text-white" : "bg-[#EBF5FF] text-[#1D6FA4]"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2ECF8] p-12 text-center">
            <Bell className="w-10 h-10 text-[#C5DEFF] mx-auto mb-3" />
            <p className="text-[#64748B] text-sm">No notifications in this category</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl border transition-all ${
                !n.read ? "border-[#C5DEFF] shadow-sm" : "border-[#E2ECF8]"
              } p-4 flex items-start gap-3 group`}
            >
              <div className={`w-9 h-9 rounded-xl ${bgColors[n.type]} flex items-center justify-center shrink-0`}>
                {icons[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!n.read ? "font-semibold text-[#1E293B]" : "text-[#1E293B]"}`}>
                    {n.title}
                    {!n.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[#1D6FA4] align-middle" />}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="w-6 h-6 rounded-lg bg-[#EBF5FF] hover:bg-[#C5DEFF] flex items-center justify-center transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-3 h-3 text-[#1D6FA4]" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(n.id)}
                      className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{n.description}</p>
                <p className="text-[11px] text-[#94A3B8] mt-1.5">{n.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      {notifications.length > 0 && (
        <div className="mt-6 bg-[#F8FAFC] rounded-xl border border-[#E2ECF8] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#64748B]">
            <Bell className="w-4 h-4 text-[#1D6FA4]" />
            <span>{notifications.length} total notifications · {unreadCount} unread</span>
          </div>
          <button
            onClick={() => setNotifications([])}
            className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
