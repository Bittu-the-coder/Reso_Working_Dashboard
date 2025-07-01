import { create } from "zustand";
import axios from "axios";
import type {
  ProjectState,
  CreateProjectData,
  UpdateProjectData,
  UpdateBudgetData,
  ProjectResponseResult,
  ResponseResult,
  PaginatedResponseResult,
} from "../types";
import { API_URL } from "../utils/api";

interface ProjectStoreState extends ProjectState {
  auth: { token: string | null };
  projects: any[]; // Replace 'any' with your Project type
  teamProjects: any[]; // Replace 'any' with your Project type
  currentProject: any | null; // Replace 'any' with your Project type
  loading: boolean;
  error: string | null;

  // Methods
  createProject: (
    teamId: string,
    projectData: CreateProjectData,
    files?: FileList
  ) => Promise<ProjectResponseResult>;
  getTeamProjects: (
    teamId: string,
    filters?: Record<string, any>
  ) => Promise<PaginatedResponseResult>;
  getUserProjects: (filters?: Record<string, any>) => Promise<ResponseResult>;
  getProjectById: (projectId: string) => Promise<ResponseResult>;
  updateProject: (
    projectId: string,
    projectData: UpdateProjectData,
    files?: FileList,
    removedUploads?: string[]
  ) => Promise<ResponseResult>;
  deleteProject: (projectId: string) => Promise<ResponseResult>;
  updateMilestoneStatus: (
    projectId: string,
    milestoneId: string,
    isCompleted: boolean
  ) => Promise<ResponseResult>;
  updateProjectBudget: (
    projectId: string,
    budgetData: UpdateBudgetData
  ) => Promise<ResponseResult>;
  clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  projects: [],
  teamProjects: [],
  currentProject: null,
  loading: false,
  error: null,
  auth: { token: null },

  // Create project
  createProject: async (
    teamId: string,
    projectData: CreateProjectData,
    files?: FileList
  ): Promise<ProjectResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("startDate", projectData.startDate);
      formData.append("endDate", projectData.endDate);
      formData.append("priority", projectData.priority || "medium");
      if (projectData.members) {
        projectData.members.forEach((member) => {
          formData.append("members", JSON.stringify(member));
        });
      }
      if (projectData.milestones) {
        projectData.milestones.forEach((milestone) => {
          formData.append("milestones", JSON.stringify(milestone));
        });
      }
      if (projectData.budget) {
        formData.append("budget", JSON.stringify(projectData.budget));
      }
      if (projectData.tags) {
        projectData.tags.forEach((tag) => {
          formData.append("tags", tag);
        });
      }
      if (projectData.repository)
        formData.append("repository", projectData.repository);
      if (projectData.technologies) {
        projectData.technologies.forEach((tech) => {
          formData.append("technologies", tech);
        });
      }
      formData.append(
        "isPrivate",
        String(
          projectData.isPrivate !== undefined ? projectData.isPrivate : true
        )
      );
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await axios.post(
        `${API_URL}/projects/teams/${teamId}/projects`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        projects: [...state.projects, response.data.data],
        teamProjects: [...state.teamProjects, response.data.data],
        loading: false,
      }));
      return { success: true, project: response.data.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create project";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get all projects for a team
  getTeamProjects: async (
    teamId: string,
    filters: Record<string, any> = {}
  ): Promise<PaginatedResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/projects/teams/${teamId}/projects`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ teamProjects: response.data.data.projects, loading: false });
      return { success: true, pagination: response.data.data.pagination };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch team projects";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get all projects for current user
  getUserProjects: async (
    filters: Record<string, any> = {}
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/projects/projects/my-projects`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ projects: response.data.data.projects, loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch user projects";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get single project
  getProjectById: async (projectId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/projects/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ currentProject: response.data.data, loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch project";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update project
  updateProject: async (
    projectId: string,
    projectData: UpdateProjectData,
    files?: FileList,
    removedUploads?: string[]
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const formData = new FormData();
      if (projectData.name) formData.append("name", projectData.name);
      if (projectData.description)
        formData.append("description", projectData.description);
      if (projectData.startDate)
        formData.append("startDate", projectData.startDate);
      if (projectData.endDate) formData.append("endDate", projectData.endDate);
      if (projectData.priority)
        formData.append("priority", projectData.priority);
      if (projectData.status) formData.append("status", projectData.status);
      if (projectData.members) {
        projectData.members.forEach((member) => {
          formData.append("members", JSON.stringify(member));
        });
      }
      if (projectData.milestones) {
        projectData.milestones.forEach((milestone) => {
          formData.append("milestones", JSON.stringify(milestone));
        });
      }
      if (projectData.budget)
        formData.append("budget", JSON.stringify(projectData.budget));
      if (projectData.progress)
        formData.append("progress", String(projectData.progress));
      if (projectData.tags) {
        projectData.tags.forEach((tag) => {
          formData.append("tags", tag);
        });
      }
      if (projectData.repository)
        formData.append("repository", projectData.repository);
      if (projectData.technologies) {
        projectData.technologies.forEach((tech) => {
          formData.append("technologies", tech);
        });
      }
      if (projectData.isPrivate !== undefined)
        formData.append("isPrivate", String(projectData.isPrivate));
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
        `${API_URL}/projects/projects/${projectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === projectId ? response.data.data : project
        ),
        teamProjects: state.teamProjects.map((project) =>
          project._id === projectId ? response.data.data : project
        ),
        currentProject: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update project";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(`${API_URL}/projects/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== projectId),
        teamProjects: state.teamProjects.filter(
          (project) => project._id !== projectId
        ),
        currentProject: null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete project";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update milestone status
  updateMilestoneStatus: async (
    projectId: string,
    milestoneId: string,
    isCompleted: boolean
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.patch(
        `${API_URL}/projects/projects/${projectId}/milestones/${milestoneId}`,
        { isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        currentProject: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update milestone";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update project budget
  updateProjectBudget: async (
    projectId: string,
    budgetData: UpdateBudgetData
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.patch(
        `${API_URL}/projects/projects/${projectId}/budget`,
        budgetData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        currentProject: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update project budget";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Clear current project
  clearCurrentProject: (): void => set({ currentProject: null }),
}));

// import { create } from "zustand";
// import axios from "axios";
// import type {
//   ProjectState,
//   CreateProjectData,
//   UpdateProjectData,
//   UpdateBudgetData,
//   ProjectResponseResult,
//   ResponseResult,
//   PaginatedResponseResult,
// } from "../types";
// import { API_URL } from "../utils/api";

// interface ProjectStoreState extends ProjectState {
//   auth: { token: string | null };
// }

// export const useProjectStore = create<ProjectStoreState>((set, get) => ({
//   projects: [],
//   teamProjects: [],
//   currentProject: null,
//   loading: false,
//   error: null,
//   auth: { token: null },

//   // Create project
//   createProject: async (
//     teamId: string,
//     projectData: CreateProjectData,
//     files?: FileList
//   ): Promise<ProjectResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       const formData = new FormData();
//       formData.append("name", projectData.name);
//       formData.append("description", projectData.description);
//       formData.append("startDate", projectData.startDate);
//       formData.append("endDate", projectData.endDate);
//       formData.append("priority", projectData.priority || "medium");
//       if (projectData.members) {
//         projectData.members.forEach((member) => {
//           formData.append("members", JSON.stringify(member));
//         });
//       }
//       if (projectData.milestones) {
//         projectData.milestones.forEach((milestone) => {
//           formData.append("milestones", JSON.stringify(milestone));
//         });
//       }
//       if (projectData.budget) {
//         formData.append("budget", JSON.stringify(projectData.budget));
//       }
//       if (projectData.tags) {
//         projectData.tags.forEach((tag) => {
//           formData.append("tags", tag);
//         });
//       }
//       if (projectData.repository)
//         formData.append("repository", projectData.repository);
//       if (projectData.technologies) {
//         projectData.technologies.forEach((tech) => {
//           formData.append("technologies", tech);
//         });
//       }
//       formData.append(
//         "isPrivate",
//         String(
//           projectData.isPrivate !== undefined ? projectData.isPrivate : true
//         )
//       );
//       if (files) {
//         Array.from(files).forEach((file) => {
//           formData.append("files", file);
//         });
//       }

//       const response = await axios.post(
//         `${API_URL}/projects/teams/${teamId}/projects`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       set((state) => ({
//         projects: [...state.projects, response.data.data],
//         teamProjects: [...state.teamProjects, response.data.data],
//         loading: false,
//       }));
//       return { success: true, project: response.data.data };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to create project";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Get all projects for a team
//   getTeamProjects: async (
//     teamId: string,
//     filters: Record<string, any> = {}
//   ): Promise<PaginatedResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       const response = await axios.get(
//         `${API_URL}/projects/teams/${teamId}/projects`,
//         {
//           params: filters,
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       set({ teamProjects: response.data.data.projects, loading: false });
//       return { success: true, pagination: response.data.data.pagination };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to fetch team projects";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Get all projects for current user
//   getUserProjects: async (
//     filters: Record<string, any> = {}
//   ): Promise<ResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       const response = await axios.get(
//         `${API_URL}/projects/projects/my-projects`,
//         {
//           params: filters,
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       set({ projects: response.data.data.projects, loading: false });
//       return { success: true };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to fetch user projects";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Get single project
//   getProjectById: async (projectId: string): Promise<ResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       const response = await axios.get(
//         `${API_URL}/projects/projects/${projectId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       set({ currentProject: response.data.data, loading: false });
//       return { success: true };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to fetch project";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Update project
//   updateProject: async (
//     projectId: string,
//     projectData: UpdateProjectData,
//     files?: FileList,
//     removedUploads?: string[]
//   ): Promise<ResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       const formData = new FormData();
//       if (projectData.name) formData.append("name", projectData.name);
//       if (projectData.description)
//         formData.append("description", projectData.description);
//       if (projectData.startDate)
//         formData.append("startDate", projectData.startDate);
//       if (projectData.endDate) formData.append("endDate", projectData.endDate);
//       if (projectData.priority)
//         formData.append("priority", projectData.priority);
//       if (projectData.status) formData.append("status", projectData.status);
//       if (projectData.members) {
//         projectData.members.forEach((member) => {
//           formData.append("members", JSON.stringify(member));
//         });
//       }
//       if (projectData.milestones) {
//         projectData.milestones.forEach((milestone) => {
//           formData.append("milestones", JSON.stringify(milestone));
//         });
//       }
//       if (projectData.budget)
//         formData.append("budget", JSON.stringify(projectData.budget));
//       if (projectData.progress)
//         formData.append("progress", String(projectData.progress));
//       if (projectData.tags) {
//         projectData.tags.forEach((tag) => {
//           formData.append("tags", tag);
//         });
//       }
//       if (projectData.repository)
//         formData.append("repository", projectData.repository);
//       if (projectData.technologies) {
//         projectData.technologies.forEach((tech) => {
//           formData.append("technologies", tech);
//         });
//       }
//       if (projectData.isPrivate !== undefined)
//         formData.append("isPrivate", String(projectData.isPrivate));
//       if (removedUploads) {
//         removedUploads.forEach((url) => {
//           formData.append("removedUploads", url);
//         });
//       }
//       if (files) {
//         Array.from(files).forEach((file) => {
//           formData.append("files", file);
//         });
//       }

//       const response = await axios.put(
//         `${API_URL}/projects/projects/${projectId}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       set((state) => ({
//         projects: state.projects.map((project) =>
//           project._id === projectId ? response.data.data : project
//         ),
//         teamProjects: state.teamProjects.map((project) =>
//           project._id === projectId ? response.data.data : project
//         ),
//         currentProject: response.data.data,
//         loading: false,
//       }));
//       return { success: true };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to update project";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Delete project
//   deleteProject: async (projectId: string): Promise<ResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       await axios.delete(`${API_URL}/projects/projects/${projectId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       set((state) => ({
//         projects: state.projects.filter((project) => project._id !== projectId),
//         teamProjects: state.teamProjects.filter(
//           (project) => project._id !== projectId
//         ),
//         currentProject: null,
//         loading: false,
//       }));
//       return { success: true };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to delete project";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Update milestone status
//   updateMilestoneStatus: async (
//     projectId: string,
//     milestoneId: string,
//     isCompleted: boolean
//   ): Promise<ResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       const response = await axios.patch(
//         `${API_URL}/projects/projects/${projectId}/milestones/${milestoneId}`,
//         { isCompleted },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       set((state) => ({
//         currentProject: response.data.data,
//         loading: false,
//       }));
//       return { success: true };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to update milestone";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Update project budget
//   updateProjectBudget: async (
//     projectId: string,
//     budgetData: UpdateBudgetData
//   ): Promise<ResponseResult> => {
//     set({ loading: true, error: null });
//     try {
//       const token = get().auth.token || localStorage.getItem("authToken");
//       if (!token) throw new Error("No authentication token found");
//       const response = await axios.patch(
//         `${API_URL}/projects/projects/${projectId}/budget`,
//         budgetData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       set((state) => ({
//         currentProject: response.data.data,
//         loading: false,
//       }));
//       return { success: true };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message || "Failed to update project budget";
//       set({ error: message, loading: false });
//       return { success: false, error: message };
//     }
//   },

//   // Clear current project
//   clearCurrentProject: (): void => set({ currentProject: null }),
// }));
