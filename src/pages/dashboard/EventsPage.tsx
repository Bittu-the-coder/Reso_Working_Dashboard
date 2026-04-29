import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import EventForm, { type EventData } from "../../components/events/EventForm";
import EventList from "../../components/events/EventList";
import { useEventStore } from "../../store/useEventStore";
import { useTeamStore } from "../../store/useTeamStore";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus, Search, Filter } from "lucide-react";
import { TextGenerateEffect, GlowingCard } from "../../components/ui/aceternity";
import toast from "react-hot-toast";

const EventsPage = () => {
  const { isDarkMode } = useTheme();
  const { 
    events, 
    getUserEvents, 
    createEvent, 
    deleteEvent, 
    respondToEvent 
  } = useEventStore();

  const { teams, getMyTeams } = useTeamStore();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newEvent, setNewEvent] = useState<EventData>({
    title: "",
    date: "",
    description: "",
    location: "",
    priority: "medium"
  });

  useEffect(() => {
    getUserEvents();
    getMyTeams();
  }, [getUserEvents, getMyTeams]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location || "TBD",
        eventDate: newEvent.date,
        priority: newEvent.priority,
        isPublic: false,
      };

      const teamId = teams.length > 0 ? teams[0]._id : "general";
      
      if (teamId === "general") {
        toast.error("Please create a team first before scheduling an event");
        return;
      }

      const result = await createEvent(teamId, eventData as any);
      
      if (result.success) {
        toast.success("Event scheduled successfully!");
        setNewEvent({
          title: "",
          date: "",
          description: "",
          location: "",
          priority: "medium"
        });
        setShowForm(false);
        getUserEvents();
      } else {
        toast.error(result.error || "Failed to create event");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const result = await deleteEvent(id);
      if (result.success) {
        toast.success("Event deleted");
      } else {
        toast.error(result.error || "Failed to delete event");
      }
    }
  };

  const handleRespond = async (id: string, status: "accepted" | "declined") => {
    const result = await respondToEvent(id, status);
    if (result.success) {
      toast.success(`You have ${status} the invitation`);
    } else {
      toast.error(result.error || "Failed to respond");
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
              <CalendarDays size={24} />
            </div>
            <TextGenerateEffect 
              words="Events & Schedule" 
              className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`} 
            />
          </div>
          <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Stay updated with team meetings, deadlines, and project milestones.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus size={18} />
          Schedule Event
        </button>
      </div>

      {/* Toolbar */}
      <GlowingCard className={`${isDarkMode ? "!bg-slate-900/50 !border-slate-800" : "!bg-white !border-slate-200"} p-4`}>
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none transition-all ${
                isDarkMode 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>
          <div className="flex gap-2">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
              isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>
      </GlowingCard>

      {/* Events List */}
      <EventList 
        events={filteredEvents as any} 
        onDelete={handleDelete}
        onRespond={handleRespond}
      />

      {/* Create Event Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl relative z-10"
            >
              <EventForm
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                handleAddEvent={handleAddEvent}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
