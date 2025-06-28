// stores/taskStore.js
import { create } from "zustand";
import axios from "axios";
import type {
  TaskState,
  TaskStep,
  CreateTaskData,
  UpdateTaskData,
  TaskResponseResult,
  ResponseResult,
  MessagesResponseResult,
  MessageResponseResult,
} from "../types";
import { API_URL } from "../utils/api";

interface TaskStoreState extends TaskState {
  auth: { token: string | null };
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  teamTasks: [],
  currentTask: null,
  loading: false,
  error: null,
  auth: { token: null },

  // Create task
  createTask: async (
    teamId: string,
    taskData: CreateTaskData,
    files?: FileList
  ): Promise<TaskResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      formData.append("title", taskData.title);
      formData.append("description", taskData.description || "");
      if (taskData.dueDate) formData.append("dueDate", taskData.dueDate);
      formData.append("priority", taskData.priority || "low");
      if (taskData.assignedTo) {
        taskData.assignedTo.forEach((userId) => {
          formData.append("assignedTo", userId);
        });
      }
      if (taskData.steps) {
        taskData.steps.forEach((step) => {
          formData.append("steps", JSON.stringify(step));
        });
      }
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("uploads", file);
        });
      }

      const response = await axios.post(
        `${API_URL}/tasks/teams/${teamId}/tasks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        tasks: [...state.tasks, response.data.data],
        teamTasks: [...state.teamTasks, response.data.data],
        loading: false,
      }));
      return { success: true, task: response.data.data };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create task";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get all tasks for a team
  getTeamTasks: async (teamId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/tasks/teams/${teamId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ teamTasks: response.data.data, loading: false });
      console.log("Fetched team tasks:", response);
      console.log("Team tasks data:", get());
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch team tasks";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get all tasks assigned to current user across all teams
  getUserTasks: async (): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(`${API_URL}/tasks/teamstasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ tasks: response.data.data.tasks, loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch user tasks";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get single task
  getTaskById: async (
    teamId: string,
    taskId: string
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ currentTask: response.data.data, loading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch task";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update task
  updateTask: async (
    teamId: string,
    taskId: string,
    taskData: UpdateTaskData,
    files?: FileList,
    removedUploads?: string[]
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      if (taskData.title) formData.append("title", taskData.title);
      if (taskData.description)
        formData.append("description", taskData.description);
      if (taskData.dueDate) formData.append("dueDate", taskData.dueDate);
      if (taskData.priority) formData.append("priority", taskData.priority);
      if (taskData.assignedTo) {
        taskData.assignedTo.forEach((userId) => {
          formData.append("assignedTo", userId);
        });
      }
      if (taskData.steps) {
        taskData.steps.forEach((step) => {
          formData.append("steps", JSON.stringify(step));
        });
      }
      if (removedUploads) {
        removedUploads.forEach((url) => {
          formData.append("removedUploads", url);
        });
      }
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("uploads", file);
        });
      }

      const response = await axios.put(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? response.data.data : task
        ),
        teamTasks: state.teamTasks.map((task) =>
          task._id === taskId ? response.data.data : task
        ),
        currentTask: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update task";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update task status
  updateTaskStatus: async (
    teamId: string,
    taskId: string,
    status: string,
    steps?: TaskStep[]
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.post(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}`,
        { status, steps },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? response.data.data : task
        ),
        teamTasks: state.teamTasks.map((task) =>
          task._id === taskId ? response.data.data : task
        ),
        currentTask: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update task status";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Delete task
  deleteTask: async (
    teamId: string,
    taskId: string
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`${API_URL}/tasks/teams/${teamId}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
        teamTasks: state.teamTasks.filter((task) => task._id !== taskId),
        currentTask: null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete task";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Task messages
  getTaskMessages: async (
    teamId: string,
    taskId: string
  ): Promise<MessagesResponseResult> => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages`,
        {
          headers: { Authorization: `Bearer ${get().auth.token}` },
        }
      );
      set((state) => ({
        currentTask: {
          ...state.currentTask!,
          messages: response.data.data,
        },
        loading: false,
      }));
      return { success: true, messages: response.data.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch task messages";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  addTaskMessage: async (
    teamId: string,
    taskId: string,
    message: string
  ): Promise<MessageResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.post(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        currentTask: {
          ...state.currentTask!,
          messages: [
            ...(state.currentTask!.messages || []),
            response.data.data,
          ],
        },
        loading: false,
      }));
      return { success: true, message: response.data.data };
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add message";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateTaskMessage: async (
    teamId: string,
    taskId: string,
    messageId: string,
    message: string
  ): Promise<MessageResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.put(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages/${messageId}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        currentTask: {
          ...state.currentTask!,
          messages: state.currentTask!.messages!.map((msg) =>
            msg._id === messageId ? response.data.data : msg
          ),
        },
        loading: false,
      }));
      return { success: true, message: response.data.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update message";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  deleteTaskMessage: async (
    teamId: string,
    taskId: string,
    messageId: string
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        currentTask: {
          ...state.currentTask!,
          messages: state.currentTask!.messages!.filter(
            (msg) => msg._id !== messageId
          ),
        },
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete message";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Clear current task
  clearCurrentTask: (): void => set({ currentTask: null }),
}));
