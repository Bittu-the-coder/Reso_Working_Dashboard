import React from "react";
import { FiCalendar } from "react-icons/fi";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface EventsProps {
  events: Event[];
  newEvent: {
    title: string;
    date: string;
    description: string;
  };
  setNewEvent: React.Dispatch<
    React.SetStateAction<{
      title: string;
      date: string;
      description: string;
    }>
  >;
  handleAddEvent: (e: React.FormEvent) => void;
}

const Events: React.FC<EventsProps> = ({
  events,
  newEvent,
  setNewEvent,
  handleAddEvent,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">Add New Event</h3>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="event-title"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Event Title
              </label>
              <input
                type="text"
                id="event-title"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="event-date"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="event-date"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="event-description"
              className="block text-sm font-medium text-white/80 mb-2"
            >
              Description
            </label>
            <textarea
              id="event-description"
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  description: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold shadow-md"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">Upcoming Events</h3>
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-white/20 text-white mr-3">
                          <FiCalendar />
                        </div>
                        {event.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {event.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {event.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/70">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
