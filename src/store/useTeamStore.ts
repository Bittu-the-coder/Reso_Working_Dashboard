// stores/teamStore.ts
import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../utils/api";

interface TeamMember {
  userId: string | { _id: string };
  name: string;
  email: string;
  role: string;
  department?: string;
  isAcceptedInvite?: boolean;
}

interface Team {
  _id: string;
  name: string;
  description?: string;
  department?: string;
  ownerId: { _id: string; name?: string; email?: string };
  createdBy: string;
  members: TeamMember[];
  invitations?: Array<{
    userId: string | { _id: string };
    invitedBy: string;
    status: string;
  }>;
  avatar?: string;
}

interface TeamStoreState {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
  getAuthToken: () => string | null;
  apiCall: (
    method: "get" | "post" | "put" | "delete",
    endpoint: string,
    data?: any
  ) => Promise<any>;

  // Team CRUD operations
  createTeam: (teamData: {
    name: string;
    description?: string;
    department?: string;
  }) => Promise<{ success: boolean; team?: Team; error?: string }>;
  getMyTeams: () => Promise<{ success: boolean; error?: string }>;
  getTeam: (
    teamId: string
  ) => Promise<{ success: boolean; team?: Team; error?: string }>;
  updateTeam: (
    teamId: string,
    teamData: Partial<Team>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTeam: (teamId: string) => Promise<{ success: boolean; error?: string }>;

  // Member operations
  getTeamMembers: (
    teamId: string
  ) => Promise<{ success: boolean; members?: TeamMember[]; error?: string }>;
  addTeamMember: (
    teamId: string,
    memberData: {
      email: string;
      role: string;
      name: string;
      department?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  removeTeamMember: (
    teamId: string,
    memberId: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateTeamMember: (
    teamId: string,
    memberId: string,
    memberData: Partial<TeamMember>
  ) => Promise<{ success: boolean; error?: string }>;

  // Invitations
  acceptTeamInvitation: () => Promise<{ success: boolean; error?: string }>;

  // Utility
  clearCurrentTeam: () => void;
}

export const useTeamStore = create<TeamStoreState>((set, get) => ({
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,

  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },

  // Helper function for API calls
  apiCall: async (
    method: "get" | "post" | "put" | "delete",
    endpoint: string,
    data?: any
  ) => {
    const token = get().getAuthToken();
    if (!token) throw new Error("No authentication token found");

    return axios({
      method,
      url: `${API_URL}${endpoint}`,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  createTeam: async (teamData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(`${API_URL}/teams`, teamData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      set((state) => ({
        teams: [...state.teams, response.data.data],
        loading: false,
      }));
      return { success: true, team: response.data.data };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create team";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  getMyTeams: async () => {
    set({ loading: true, error: null });
    try {
      const response = await get().apiCall("get", "/teams");
      set({ teams: response.data.data.teams, loading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch teams";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  getTeam: async (teamId) => {
    set({ loading: true, error: null });
    try {
      const response = await get().apiCall("get", `/teams/${teamId}`);
      set({ currentTeam: response.data.data, loading: false });
      return { success: true, team: response.data.data };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch team";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateTeam: async (teamId, teamData) => {
    set({ loading: true, error: null });
    try {
      const response = await get().apiCall("put", `/teams/${teamId}`, teamData);
      set((state) => ({
        teams: state.teams.map((team) =>
          team._id === teamId ? response.data.data : team
        ),
        currentTeam: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update team";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  deleteTeam: async (teamId) => {
    set({ loading: true, error: null });
    try {
      await get().apiCall("delete", `/teams/${teamId}`);
      set((state) => ({
        teams: state.teams.filter((team) => team._id !== teamId),
        currentTeam: null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete team";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  getTeamMembers: async (teamId) => {
    set({ loading: true, error: null });
    try {
      const response = await get().apiCall("get", `/teams/${teamId}/members`);

      // Only update if we have a current team
      if (get().currentTeam) {
        set((state) => ({
          currentTeam: state.currentTeam
            ? {
                ...state.currentTeam,
                members: response.data.data.members,
              }
            : null,
          loading: false,
        }));
      } else {
        set({ loading: false });
      }

      return { success: true, members: response.data.data.members };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch members";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  addTeamMember: async (teamId, memberData) => {
    set({ loading: true, error: null });
    try {
      const response = await get().apiCall(
        "post",
        `/teams/${teamId}/members`,
        memberData
      );
      set((state) => ({
        currentTeam: state.currentTeam
          ? {
              ...state.currentTeam,
              members: [...state.currentTeam.members, ...response.data.data],
              invitations: [
                ...(state.currentTeam.invitations || []),
                ...response.data.data,
              ],
            }
          : null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add member";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  removeTeamMember: async (teamId, memberId) => {
    set({ loading: true, error: null });
    try {
      await get().apiCall("delete", `/teams/${teamId}/members/${memberId}`);
      set((state) => ({
        currentTeam: state.currentTeam
          ? {
              ...state.currentTeam,
              members: state.currentTeam.members.filter((m) =>
                typeof m.userId === "string"
                  ? m.userId !== memberId
                  : m.userId._id !== memberId
              ),
              invitations:
                state.currentTeam.invitations?.filter((i) =>
                  typeof i.userId === "string"
                    ? i.userId !== memberId
                    : i.userId._id !== memberId
                ) || [],
            }
          : null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to remove member";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateTeamMember: async (teamId, memberId, memberData) => {
    set({ loading: true, error: null });
    try {
      const response = await get().apiCall(
        "put",
        `/teams/${teamId}/members/${memberId}`,
        memberData
      );
      set((state) => ({
        currentTeam: state.currentTeam
          ? {
              ...state.currentTeam,
              members: state.currentTeam.members.map((m) =>
                (
                  typeof m.userId === "string"
                    ? m.userId === memberId
                    : m.userId._id === memberId
                )
                  ? { ...m, ...response.data.data }
                  : m
              ),
            }
          : null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update member";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  acceptTeamInvitation: async () => {
    set({ loading: true, error: null });
    try {
      await get().apiCall("get", "/users/acceptinvitation");
      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to accept invitation";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  clearCurrentTeam: () => set({ currentTeam: null }),
}));
