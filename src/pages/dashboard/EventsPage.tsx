import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import EventForm from "../../components/events/EventForm";
import EventList from "../../components/events/EventList";
import { useEventStore } from "../../store/useEventStore";
import { motion } from "framer-motion";

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   description: string;
//   location?: string;
//   isPublic?: boolean;
// }

interface NewEvent {
  title: string;
  date: string;
  description: string;
}

const EventsPage = () => {
  const { isDarkMode } = useTheme();
  const { events, getUserEvents, createEvent } = useEventStore();
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    getUserEvents();
  }, [getUserEvents]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date) {
      alert("Please fill in all required fields");
      return;
    }

    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      location: "Online",
      eventDate: newEvent.date,
      isPublic: false,
    };

    await createEvent("teamId", eventData);

    setNewEvent({
      title: "",
      date: "",
      description: "",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <EventForm
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            handleAddEvent={handleAddEvent}
          />
          <EventList events={events} />
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPage;
