// stores/teamStore.ts
import { create } from "zustand";
import axios from "axios";
import type {
  TeamState,
  CreateTeamData,
  UpdateTeamData,
  AddTeamMemberData,
  UpdateTeamMemberData,
  TeamResponseResult,
  ResponseResult,
  MembersResponseResult,
} from "../types";
import { API_URL } from "../utils/api";

interface TeamStoreState extends TeamState {
  auth: { token: string | null };
}

export const useTeamStore = create<TeamStoreState>((set, get) => ({
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,
  auth: { token: null },

  // Create team
  createTeam: async (teamData: CreateTeamData): Promise<TeamResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.post(`${API_URL}/teams`, teamData, {
        headers: { Authorization: `Bearer ${token}` },
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

  // Get user's teams
  getMyTeams: async (): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      console.log(get());
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${API_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ teams: response.data.data.teams, loading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch teams";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get single team
  getTeam: async (teamId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(`${API_URL}/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Team details:", response.data.data);
      set({ currentTeam: response.data.data, loading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch team";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update team
  updateTeam: async (
    teamId: string,
    teamData: UpdateTeamData
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.put(`${API_URL}/teams/${teamId}`, teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Delete team
  deleteTeam: async (teamId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`${API_URL}/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Get team members
  getTeamMembers: async (teamId: string): Promise<MembersResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(`${API_URL}/teams/${teamId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        currentTeam: {
          ...state.currentTeam!,
          members: response.data.data.members,
        },
        loading: false,
      }));
      return { success: true, members: response.data.data.members };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch team members";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Add team member
  addTeamMember: async (
    teamId: string,
    memberData: AddTeamMemberData
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.post(
        `${API_URL}/teams/${teamId}/members`,
        memberData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        currentTeam: {
          ...state.currentTeam!,
          members: [...state.currentTeam!.members, ...response.data.data],
          invitations: [
            ...(state.currentTeam!.invitations || []),
            ...response.data.data,
          ],
        },
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to add team member";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Remove team member
  removeTeamMember: async (
    teamId: string,
    memberId: string
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`${API_URL}/teams/${teamId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        currentTeam: {
          ...state.currentTeam!,
          members: state.currentTeam!.members.filter((m) =>
            typeof m.userId === "string"
              ? m.userId !== memberId
              : m.userId._id !== memberId
          ),
          invitations:
            state.currentTeam!.invitations?.filter((i) =>
              typeof i.userId === "string"
                ? i.userId !== memberId
                : i.userId._id !== memberId
            ) || [],
        },
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to remove team member";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update team member
  updateTeamMember: async (
    teamId: string,
    memberId: string,
    memberData: UpdateTeamMemberData
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.put(
        `${API_URL}/teams/${teamId}/members/${memberId}`,
        memberData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        currentTeam: {
          ...state.currentTeam!,
          members: state.currentTeam!.members.map((m) =>
            (
              typeof m.userId === "string"
                ? m.userId === memberId
                : m.userId._id === memberId
            )
              ? { ...m, ...response.data.data }
              : m
          ),
        },
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update team member";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Accept team invitation
  acceptTeamInvitation: async (): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.get(`${API_URL}/users/acceptinvitation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to accept invitation";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Clear current team
  clearCurrentTeam: (): void => set({ currentTeam: null }),
}));
