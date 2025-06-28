// stores/eventStore.js
import { create } from "zustand";
import axios from "axios";
import type {
  EventState,
  Event,
  CreateEventData,
  UpdateEventData,
  EventResponseResult,
  ResponseResult,
  PaginatedResponseResult,
} from "../types";
import { API_URL } from "../utils/api";

interface EventStoreState extends EventState {
  auth: { token: string | null };
}

export const useEventStore = create<EventStoreState>((set, get) => ({
  events: [],
  teamEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
  auth: { token: null },

  // Create event
  createEvent: async (
    teamId: string,
    eventData: CreateEventData,
    files?: FileList
  ): Promise<EventResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("location", eventData.location);
      formData.append("eventDate", eventData.eventDate);
      if (eventData.endDate) formData.append("endDate", eventData.endDate);
      formData.append("priority", eventData.priority || "medium");
      if (eventData.attendees) {
        eventData.attendees.forEach((attendee) => {
          formData.append("attendees", attendee);
        });
      }
      formData.append("isPublic", String(eventData.isPublic || false));
      if (eventData.maxAttendees)
        formData.append("maxAttendees", String(eventData.maxAttendees));
      if (eventData.tags) {
        eventData.tags.forEach((tag) => {
          formData.append("tags", tag);
        });
      }
      if (eventData.reminders) {
        eventData.reminders.forEach((reminder) => {
          formData.append("reminders", JSON.stringify(reminder));
        });
      }
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await axios.post(
        `${API_URL}/events/teams/${teamId}/events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        events: [...state.events, response.data.data],
        teamEvents: [...state.teamEvents, response.data.data],
        loading: false,
      }));
      return { success: true, event: response.data.data };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create event";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get all events for a team
  getTeamEvents: async (
    teamId: string,
    filters: Record<string, any> = {}
  ): Promise<PaginatedResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/events/teams/${teamId}/events`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ teamEvents: response.data.data.events, loading: false });
      return { success: true, pagination: response.data.data.pagination };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch team events";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get all events for current user
  getUserEvents: async (
    filters: Record<string, any> = {}
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(`${API_URL}/events/events/my-events`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ events: response.data.data.events, loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch user events";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get single event
  getEventById: async (eventId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(`${API_URL}/events/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentEvent: response.data.data, loading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch event";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update event
  updateEvent: async (
    eventId: string,
    eventData: UpdateEventData,
    files?: FileList,
    removedUploads?: string[]
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      if (eventData.title) formData.append("title", eventData.title);
      if (eventData.description)
        formData.append("description", eventData.description);
      if (eventData.location) formData.append("location", eventData.location);
      if (eventData.eventDate)
        formData.append("eventDate", eventData.eventDate);
      if (eventData.endDate) formData.append("endDate", eventData.endDate);
      if (eventData.priority) formData.append("priority", eventData.priority);
      if (eventData.attendees) {
        eventData.attendees.forEach((attendee) => {
          formData.append("attendees", attendee);
        });
      }
      if (eventData.status) formData.append("status", eventData.status);
      if (eventData.isPublic !== undefined)
        formData.append("isPublic", String(eventData.isPublic));
      if (eventData.maxAttendees)
        formData.append("maxAttendees", String(eventData.maxAttendees));
      if (eventData.tags) {
        eventData.tags.forEach((tag) => {
          formData.append("tags", tag);
        });
      }
      if (removedUploads) {
        removedUploads.forEach((url) => {
          formData.append("removedUploads", url);
        });
      }
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await axios.put(
        `${API_URL}/events/events/${eventId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        events: state.events.map((event) =>
          event._id === eventId ? response.data.data : event
        ),
        teamEvents: state.teamEvents.map((event) =>
          event._id === eventId ? response.data.data : event
        ),
        currentEvent: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update event";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Delete event
  deleteEvent: async (eventId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`${API_URL}/events/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        events: state.events.filter((event) => event._id !== eventId),
        teamEvents: state.teamEvents.filter((event) => event._id !== eventId),
        currentEvent: null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete event";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Respond to event invitation
  respondToEvent: async (
    eventId: string,
    status: "accepted" | "declined"
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.patch(
        `${API_URL}/events/events/${eventId}/respond`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        events: state.events.map((event) =>
          event._id === eventId ? response.data.data : event
        ),
        teamEvents: state.teamEvents.map((event) =>
          event._id === eventId ? response.data.data : event
        ),
        currentEvent: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to respond to event";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Clear current event
  clearCurrentEvent: (): void => set({ currentEvent: null }),
}));
