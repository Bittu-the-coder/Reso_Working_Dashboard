// stores/taskStore.ts
import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../utils/api";
import type { Task, TaskStep, Message } from "../types";

interface TaskStoreState {
  tasks: Task[];
  teamTasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;

  // Task operations
  createTask: (
    teamId: string,
    taskData: CreateTaskData,
    files?: File[]
  ) => Promise<ApiResponse<Task>>;
  getTeamTasks: (teamId: string) => Promise<ApiResponse<Task[]>>;
  getUserTasks: () => Promise<ApiResponse<Task[]>>;
  getTaskById: (teamId: string, taskId: string) => Promise<ApiResponse<Task>>;
  updateTask: (
    teamId: string,
    taskId: string,
    taskData: UpdateTaskData,
    files?: File[],
    removedUploads?: string[]
  ) => Promise<ApiResponse<Task>>;
  updateTaskStatus: (
    teamId: string,
    taskId: string,
    status: string,
    steps?: TaskStep[]
  ) => Promise<ApiResponse<Task>>;
  deleteTask: (teamId: string, taskId: string) => Promise<ApiResponse<void>>;

  // Message operations
  getTaskMessages: (
    teamId: string,
    taskId: string
  ) => Promise<ApiResponse<Message[]>>;
  addTaskMessage: (
    teamId: string,
    taskId: string,
    message: string
  ) => Promise<ApiResponse<Message>>;
  updateTaskMessage: (
    teamId: string,
    taskId: string,
    messageId: string,
    message: string
  ) => Promise<ApiResponse<Message>>;
  deleteTaskMessage: (
    teamId: string,
    taskId: string,
    messageId: string
  ) => Promise<ApiResponse<void>>;

  // Utility
  clearCurrentTask: () => void;
}

interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  assignedTo?: string[];
  steps?: TaskStep[];
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  assignedTo?: string[];
  steps?: TaskStep[];
}

interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  teamTasks: [],
  currentTask: null,
  loading: false,
  error: null,

  // Helper function to get auth token
  getAuthToken: (): string => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");
    return token;
  },

  // Helper function to handle API errors
  handleError: (error: any): ApiResponse => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    set({ error: message, loading: false });
    return { success: false, error: message };
  },

  // Create a new task
  createTask: async (teamId, taskData, uploads) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const formData = new FormData();

      // Append all task data
      Object.entries(taskData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "steps") {
            // Stringify arrays that need to be parsed on backend
            formData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, value);
          }
        }
      });

      if (uploads && uploads.length > 0) {
        uploads.forEach((fileObj) => {
          if (fileObj.file instanceof File) {
            formData.append("uploads", fileObj.file);
          }
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
        loading: false,
      }));

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Failed to create task";
      set({ error: errorMsg, loading: false });
      console.error("Task creation error:", error.response?.data || error);
      return { success: false, error: errorMsg };
    }
  },

  // Get all tasks for a specific team
  getTeamTasks: async (teamId): Promise<ApiResponse<Task[]>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const response = await axios.get(
        `${API_URL}/tasks/teams/${teamId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({ teamTasks: response.data.data.tasks, loading: false });
      return { success: true, data: response.data.data.tasks };
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Get all tasks assigned to the current user across all teams
  getUserTasks: async (): Promise<ApiResponse<Task[]>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const response = await axios.get(`${API_URL}/tasks/teamstasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ tasks: response.data.data.tasks, loading: false });
      return { success: true, data: response.data.data.tasks };
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Get a single task by ID
  getTaskById: async (teamId, taskId): Promise<ApiResponse<Task>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const response = await axios.get(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({ currentTask: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Update an existing task

  updateTask: async (
    teamId: string,
    taskId: string,
    taskData: any,
    files?: File[],
    removedUploads?: string[]
  ): Promise<ApiResponse<Task>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const formData = new FormData();

      // Append all task data - use the same pattern as createTask
      Object.entries(taskData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "steps" || key === "assignedTo") {
            // Stringify arrays that need to be parsed on backend
            formData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, value);
          }
        }
      });

      // Append removed uploads if any
      if (removedUploads && removedUploads.length > 0) {
        formData.append("removedUploads", JSON.stringify(removedUploads));
      }

      // Append new files if any - extract the actual File objects
      if (files && files.length > 0) {
        files.forEach((fileObj) => {
          // Check if it's a file object with a 'file' property or a direct File
          if (fileObj && typeof fileObj === "object" && "file" in fileObj) {
            if (fileObj.file instanceof File) {
              formData.append("uploads", fileObj.file);
            }
          } else if (fileObj instanceof File) {
            formData.append("uploads", fileObj);
          }
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

      // Update state
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

      return { success: true, data: response.data.data };
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Update task status
  updateTaskStatus: async (
    teamId: string,
    taskId: string,
    status: string,
    stepId: string,
    completed: boolean
  ): Promise<ApiResponse<Task>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const response = await axios.post(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}`,
        { status, stepId, completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update Task Status Response:", response.data);

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

      return { success: true, data: response.data.data };
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Delete a task
  deleteTask: async (teamId, taskId): Promise<ApiResponse<void>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
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
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Get all messages for a task
  getTaskMessages: async (teamId, taskId): Promise<ApiResponse<Message[]>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const response = await axios.get(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("get message:", response);

      set((state) => {
        if (!state.currentTask) return { loading: false };

        return {
          currentTask: {
            ...state.currentTask,
            messages: response.data.data,
          },
          loading: false,
        };
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Add a message to a task
  addTaskMessage: async (
    teamId,
    taskId,
    message
  ): Promise<ApiResponse<Message>> => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      const response = await axios.post(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => {
        if (!state.currentTask) return { loading: false };

        return {
          currentTask: {
            ...state.currentTask,
            messages: [
              ...(state.currentTask.messages || []),
              response.data.data,
            ],
          },
          loading: false,
        };
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      return get().handleError(error);
    }
  },

  // Update a message in a task
  updateTaskMessage: async (
    teamId: string,
    taskId: string,
    messageId: string,
    message: string
  ): Promise<ApiResponse<Message>> => {
    try {
      set({ loading: true, error: null });

      const token = get().getAuthToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await axios.put<ApiResponse<Message>>(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages/${messageId}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("update message response:", response);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update message");
      }

      set((state) => ({
        ...state,
        currentTask:
          state.currentTask && state.currentTask.messages
            ? {
                ...state.currentTask,
                messages: state.currentTask.messages
                  .map((msg) =>
                    msg && msg._id === messageId ? response.data.data : msg
                  )
                  .filter((msg): msg is TaskMessage => msg !== undefined),
              }
            : state.currentTask,
        loading: false,
      }));

      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Update failed",
      });
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update message",
      };
    }
  },

  // Delete a message from a task
  deleteTaskMessage: async (
    teamId: string,
    taskId: string,
    messageId: string
  ): Promise<ApiResponse<void>> => {
    try {
      set({ loading: true, error: null });

      const token = get().getAuthToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const response = await axios.delete<ApiResponse<void>>(
        `${API_URL}/tasks/teams/${teamId}/tasks/${taskId}/messages/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to delete message");
      }

      set((state) => ({
        ...state,
        currentTask: state.currentTask
          ? {
              ...state.currentTask,
              messages: state.currentTask.messages.filter(
                (msg) => msg._id !== messageId
              ),
            }
          : null,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Deletion failed",
      });
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete message",
      };
    }
  },

  // Clear the current task from state
  clearCurrentTask: () => set({ currentTask: null }),
}));
