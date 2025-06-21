import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "./api";

const API_BASE_URL = baseUrl;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/api/login";
    }
    return Promise.reject(error);
  }
);

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  teams: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: User;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  ownerId: User;
  members: TeamMember[];
  avatar?: string;
  isActive: boolean;
  settings: {
    allowMemberInvites: boolean;
    visibility: "private" | "public";
  };
  createdAt: string;
  updatedAt: string;
}

export interface Invite {
  _id: string;
  teamId: Team;
  invitedBy: User;
  invitedUserEmail: string;
  invitedUserId?: User;
  status: "pending" | "accepted" | "rejected" | "expired";
  role: "admin" | "member";
  message?: string;
  expiresAt: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  projectId?: string;
  teamId?: Team;
  createdBy: User;
  assignedTo: User[];
  tags: string[];
  estimatedHours?: number;
  actualHours: number;
  addedOn: string;
  createdAt: string;
  updatedAt: string;
}

// Team API functions
export const teamAPI = {
  // Get all teams for user
  getTeams: () =>
    apiClient.get<{ success: boolean; count: number; data: Team[] }>(
      "/api/teams"
    ),

  // Get single team
  getTeam: (id: string) =>
    apiClient.get<{ success: boolean; data: Team }>(`/api/teams/${id}`),

  // Create team
  createTeam: (data: { name: string; description?: string; settings?: any }) =>
    apiClient.post<{ success: boolean; data: Team }>("/api/teams", data),

  // Update team
  updateTeam: (
    id: string,
    data: { name?: string; description?: string; settings?: any }
  ) =>
    apiClient.put<{ success: boolean; data: Team }>(`/api/teams/${id}`, data),

  // Delete team
  deleteTeam: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/api/teams/${id}`),

  // Invite user to team
  inviteUser: (
    teamId: string,
    data: { email: string; role?: "admin" | "member"; message?: string }
  ) =>
    apiClient.post<{ success: boolean; data: Invite }>(
      `/api/teams/${teamId}/invite`,
      data
    ),

  // Remove member from team
  removeMember: (teamId: string, userId: string) =>
    apiClient.delete<{ success: boolean; message: string }>(
      `/api/teams/${teamId}/members/${userId}`
    ),

  // Update member role
  updateMemberRole: (
    teamId: string,
    userId: string,
    role: "admin" | "member"
  ) =>
    apiClient.put<{ success: boolean; message: string }>(
      `/api/teams/${teamId}/members/${userId}/role`,
      { role }
    ),

  // Get team tasks
  getTeamTasks: (
    teamId: string,
    params?: { status?: string; assignedTo?: string; priority?: string }
  ) =>
    apiClient.get<{ success: boolean; count: number; data: Task[] }>(
      `/api/teams/${teamId}/tasks`,
      { params }
    ),

  // Create team task
  createTeamTask: (
    teamId: string,
    data: {
      title: string;
      description?: string;
      dueDate?: string;
      priority?: "Low" | "Medium" | "High";
      projectId?: string;
      assignedTo?: string[];
      tags?: string[];
      estimatedHours?: number;
    }
  ) =>
    apiClient.post<{ success: boolean; data: Task }>(
      `/api/teams/${teamId}/tasks`,
      data
    ),

  // Get team invites
  getTeamInvites: (teamId: string, status?: string) =>
    apiClient.get<{ success: boolean; count: number; data: Invite[] }>(
      `/api/teams/${teamId}/invites`,
      {
        params: status ? { status } : {},
      }
    ),
};

// Invite API functions
export const inviteAPI = {
  // Get user invites
  getUserInvites: (status = "pending") =>
    apiClient.get<{ success: boolean; count: number; data: Invite[] }>(
      `/api/invites`,
      {
        params: { status },
      }
    ),

  // Get single invite
  getInvite: (id: string) =>
    apiClient.get<{ success: boolean; data: Invite }>(`/api/invites/${id}`),

  // Accept invite
  acceptInvite: (id: string) =>
    apiClient.post<{
      success: boolean;
      message: string;
      data: { invite: Invite; team: Team };
    }>(`/api/invites/${id}/accept`),

  // Reject invite
  rejectInvite: (id: string) =>
    apiClient.post<{ success: boolean; message: string; data: Invite }>(
      `/api/invites/${id}/reject`
    ),

  // Cancel invite
  cancelInvite: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(
      `/api/invites/${id}`
    ),
};

// User API functions
export const userAPI = {
  // Search users
  getUsers: (params?: { search?: string; limit?: number }) =>
    apiClient.get<{ success: boolean; count: number; data: User[] }>(
      "/api/users",
      {
        params,
      }
    ),

  // Search users by email
  searchUsersByEmail: (email: string) =>
    apiClient.get<{ success: boolean; count: number; data: User[] }>(
      "/api/users/search",
      {
        params: { email },
      }
    ),

  // Get user by ID
  getUser: (id: string) =>
    apiClient.get<{ success: boolean; data: User }>(`/api/users/${id}`),
};

// Auth API functions
export const authAPI = {
  // Register
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<{ success: boolean; token: string; user: User }>(
      "/api/auth/register",
      data
    ),

  // Login
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ success: boolean; token: string; user: User }>(
      "/api/auth/login",
      data
    ),

  // Logout
  logout: () =>
    apiClient.get<{ success: boolean; data: string }>("/api/auth/logout"),

  // Get current user
  getMe: () => apiClient.get<{ success: boolean; data: User }>("/api/auth/me"),

  // Update user details
  updateDetails: (data: { name?: string; email?: string }) =>
    apiClient.put<{ success: boolean; data: User }>(
      "/api/auth/updatedetails",
      data
    ),

  // Update password
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put<{ success: boolean; token: string; user: User }>(
      "/api/auth/updatepassword",
      data
    ),
};

// Task API functions (enhanced)
export const taskAPI = {
  // Get all tasks
  getTasks: (params?: {
    teamId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
  }) =>
    apiClient.get<{ success: boolean; count: number; data: Task[] }>(
      "/api/tasks",
      {
        params,
      }
    ),

  // Get single task
  getTask: (id: string) =>
    apiClient.get<{ success: boolean; data: Task }>(`/api/tasks/${id}`),

  // Create task
  createTask: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: "Low" | "Medium" | "High";
    projectId?: string;
    teamId?: string;
    assignedTo?: string[];
    tags?: string[];
    estimatedHours?: number;
  }) => apiClient.post<{ success: boolean; data: Task }>("/api/tasks", data),

  // Update task
  updateTask: (id: string, data: Partial<Task>) =>
    apiClient.put<{ success: boolean; data: Task }>(`/api/tasks/${id}`, data),

  // Delete task
  deleteTask: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/api/tasks/${id}`),
};

export default apiClient;
