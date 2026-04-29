import { CalendarDays, Save, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { GlowingCard } from "../ui/aceternity";

interface EventData {
  title: string;
  date: string;
  description: string;
  location?: string;
  priority?: string;
}

interface EventFormProps {
  newEvent: EventData;
  setNewEvent: (event: EventData) => void;
  handleAddEvent: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

const EventForm = ({
  newEvent,
  setNewEvent,
  handleAddEvent,
  onCancel
}: EventFormProps) => {
  const { isDarkMode } = useTheme();

  return (
    <GlowingCard className={`${isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"} p-8`}>
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-slate-100 text-blue-600"}`}>
            <CalendarDays size={24} />
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Create New Event
          </h3>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleAddEvent} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
            Event Title
          </label>
          <input
            type="text"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
            }`}
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="e.g. Quarterly Team Sync"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              Date & Time
            </label>
            <input
              type="datetime-local"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              Location
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
              value={newEvent.location || ""}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              placeholder="e.g. Conference Room A or Zoom"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
            Description
          </label>
          <textarea
            rows={4}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
            }`}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="Provide a brief overview of the event..."
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save size={18} />
            Create Event
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-8 py-3 rounded-xl font-bold border transition-all ${
                isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200" : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
              }`}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </GlowingCard>
  );
};

export default EventForm;
