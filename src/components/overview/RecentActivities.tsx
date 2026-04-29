import { useTheme } from "../../contexts/ThemeContext";
import { Calendar } from "lucide-react";
import { GlowingCard } from "../ui/aceternity";

import type { Event } from "../../types";

interface RecentActivitiesProps {
  events: Event[];
}

const RecentActivities = ({ events }: RecentActivitiesProps) => {
  const { isDarkMode } = useTheme();

  return (
    <GlowingCard
      className={`${
        isDarkMode
          ? "!bg-slate-900 !border-slate-800"
          : "!bg-white !border-slate-200"
      } p-6 h-full`}
    >
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div
          className={`p-2 ${
            isDarkMode ? "bg-indigo-900/40 text-indigo-400" : "bg-indigo-50 text-indigo-600"
          } rounded-lg`}
        >
          <Calendar size={20} />
        </div>
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Recent Activities
        </h3>
      </div>
      <div className="space-y-4 relative z-10">
        {events && events.length > 0 ? (
          events
            .sort(
              (a, b) => new Date(b.eventDate || 0).getTime() - new Date(a.eventDate || 0).getTime()
            )
            .slice(0, 3)
            .map((event) => (
              <div
                key={event._id}
                onClick={() => (window.location.href = "/dashboard/events")}
                className={`p-4 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-800/40 border-slate-700 hover:bg-slate-800"
                    : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                } transition-all hover:translate-x-1 cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h5
                    className={`font-semibold text-sm ${
                      isDarkMode ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    {event.title}
                  </h5>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {event.eventDate 
                      ? new Date(event.eventDate).toLocaleDateString()
                      : "No Date"}
                  </span>
                </div>
                <p
                  className={`text-xs line-clamp-2 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {event.description}
                </p>
              </div>
            ))
        ) : (
          <div className="py-8 text-center text-sm text-slate-500">
            No recent activities
          </div>
        )}
      </div>
    </GlowingCard>
  );
};

export default RecentActivities;
