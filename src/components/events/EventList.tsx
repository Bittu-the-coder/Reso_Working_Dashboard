import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, MapPin, Trash2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { GlowingCard } from "../ui/aceternity";

interface Event {
  _id: string;
  title: string;
  eventDate: string;
  description: string;
  location?: string;
  priority?: string;
}

interface EventListProps {
  events: Event[];
  onDelete: (id: string) => void;
  onRespond?: (id: string, status: "accepted" | "declined") => void;
}

const EventList = ({ events, onDelete, onRespond }: EventListProps) => {
  const { isDarkMode } = useTheme();

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "text-rose-500 bg-rose-500/10";
      case "medium": return "text-amber-500 bg-amber-500/10";
      default: return "text-blue-500 bg-blue-500/10";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-slate-100 text-blue-600"}`}>
          <CalendarDays size={20} />
        </div>
        <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Upcoming Events
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length > 0 ? (
          events
            .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
            .map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlowingCard className={`${isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"} p-6 group`}>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"} group-hover:text-blue-500 transition-colors`}>
                            {event.title}
                          </h4>
                          {event.priority && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPriorityColor(event.priority)}`}>
                              {event.priority}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm line-clamp-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {event.description}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(event._id)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? "hover:bg-rose-500/10 text-slate-500 hover:text-rose-500" : "hover:bg-rose-50 text-slate-400 hover:text-rose-500"}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-blue-500" />
                          <span className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-blue-500" />
                          <span className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            {new Date(event.eventDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-blue-500" />
                          <span className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            {event.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {onRespond && (
                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() => onRespond(event._id, "accepted")}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                        >
                          <CheckCircle2 size={14} />
                          Attend
                        </button>
                      </div>
                    )}
                  </div>
                </GlowingCard>
              </motion.div>
            ))
        ) : (
          <div className="col-span-full text-center py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <CalendarDays size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>No events found</p>
            <p className="text-sm text-slate-500 mt-1">Schedule your first event to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
