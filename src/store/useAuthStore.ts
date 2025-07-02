import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";
import type {
  AuthState,
  RegisterUserData,
  LoginCredentials,
  UpdateUserData,
  PasswordUpdateData,
  ResponseResult,
  NotificationResponseResult,
  UsersResponseResult,
} from "../types";
import { API_URL } from "../utils/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      error: null,
      loading: false,
      notifications: [],
      users: [],

      // Register user
      register: async (userData: RegisterUserData): Promise<ResponseResult> => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${API_URL}/users/register`,
            userData
          );
          set({
            token: response.data.token,
            user: response.data.data,
            loading: false,
          });
          localStorage.setItem("authToken", response.data.token);
          return { success: true };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Registration failed";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // Login user
      login: async ({
        email,
        password,
      }: LoginCredentials): Promise<ResponseResult> => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/users/login`, {
            email,
            password,
          });
          // console.log("login response", response);
          set({
            token: response.data.token,
            user: response.data.data,
            loading: false,
          });
          localStorage.setItem("authToken", response.data.token);
          return { success: true };
        } catch (error: any) {
          const message = error.response?.data?.message || "Login failed";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // Logout user
      logout: (): void => {
        const token = get().token || localStorage.getItem("authToken");

        // Clear state and localStorage first
        set({ user: null, token: null });
        localStorage.removeItem("authToken");

        // Only attempt to call logout endpoint if we have a valid token
        if (token && token !== "null") {
          axios
            .get(`${API_URL}/users/logout`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch((error) => {
              // console.log(
              //   "Logout API call failed, but user was still logged out locally:",
              //   error.message
              // );
            });
        }
      },

      // Get current user
      getMe: async (): Promise<ResponseResult> => {
        set({ loading: true, error: null });
        try {
          const token = get().token || localStorage.getItem("authToken");
          if (!token) throw new Error("No authentication token found");
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: response.data.data, loading: false });
          return { success: true };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to fetch user data";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // Update user
      updateUser: async (userData: UpdateUserData): Promise<ResponseResult> => {
        set({ loading: true, error: null });
        // console.log("Updating user with data:", userData);
        try {
          const token = get().token || localStorage.getItem("authToken");
          if (!token) throw new Error("No authentication token found");
          const formData = new FormData();
          if (userData.name) formData.append("name", userData.name);
          if (userData.username) formData.append("username", userData.username);
          if (userData.email) formData.append("email", userData.email);
          if (userData.avatar) {
            formData.append("avatar", userData.avatar);
          }

          // Debug: Log FormData contents
          // for (const [key, value] of formData.entries()) {
          //   console.log(key, value);
          // }

          const response = await axios.put(
            `${API_URL}/users/update`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          set({ user: response.data.data, loading: false });
          return { success: true };
        } catch (error: any) {
          const message = error.response?.data?.message || "Update failed";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // Update password
      updatePassword: async (
        passwords: PasswordUpdateData
      ): Promise<ResponseResult> => {
        set({ loading: true, error: null });
        try {
          const token = get().token || localStorage.getItem("authToken");
          if (!token) throw new Error("No authentication token found");
          await axios.put(`${API_URL}/users/updatepassword`, passwords, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ loading: false });
          return { success: true };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Password update failed";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      //get all notification
      getAllNotifications: async (): Promise<NotificationResponseResult> => {
        try {
          const token = get().token || localStorage.getItem("authToken");
          if (!token) throw new Error("No authentication token found");

          const response = await axios.get(`${API_URL}/users/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // console.log("get notifications", response);
          return {
            success: true,
            notifications: response.data.data,
          };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to fetch notifications";
          return { success: false, error: message };
        }
      },

      // Check notifications
      checkNotifications: async (
        notificationId: string
      ): Promise<NotificationResponseResult> => {
        set({ loading: true, error: null });
        try {
          const token = get().token || localStorage.getItem("authToken");
          // console.log("token", token);
          if (!token) throw new Error("No authentication token found");
          const response = await axios.get(
            `${API_URL}/users/checknotification/${notificationId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // console.log("check notifications", response);
          set({ loading: false });
          return { success: true, notifications: response.data.data };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to check notifications";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // Delete notification
      deleteNotification: async (
        notificationId: string
      ): Promise<ResponseResult> => {
        set({ loading: true, error: null });
        try {
          const token = get().token || localStorage.getItem("authToken");
          if (!token) throw new Error("No authentication token found");
          await axios.delete(
            `${API_URL}/users/checknotification/${notificationId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          set({ loading: false });
          return { success: true };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to delete notification";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // Get all users (admin)
      getAllUsers: async (): Promise<UsersResponseResult> => {
        // Skip if already loading
        if (get().loading) return { success: false, error: "Already loading" };

        set({ loading: true, error: null });
        try {
          const token = get().token || localStorage.getItem("authToken");
          if (!token) throw new Error("No authentication token found");
          const response = await axios.get(`${API_URL}/users/getallusers`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ loading: false, users: response.data.data });
          return { success: true, users: response.data.data };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to fetch users";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

// import { create } from "zustand";
// import axios from "axios";
// import { persist } from "zustand/middleware";
// import type {
//   AuthState,
//   RegisterUserData,
//   LoginCredentials,
//   UpdateUserData,
//   PasswordUpdateData,
//   ResponseResult,
//   NotificationResponseResult,
//   UsersResponseResult,
// } from "../types";
// import { API_URL } from "../utils/api";

// interface AuthStoreState extends AuthState {}

// export const useAuthStore = create<AuthStoreState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       error: null,
//       loading: false,
//       notifications: [],

//       // Register user
//       register: async (userData: RegisterUserData): Promise<ResponseResult> => {
//         set({ loading: true, error: null });
//         try {
//           const response = await axios.post(
//             `${API_URL}/users/register`,
//             userData
//           );
//           set({
//             token: response.data.token,
//             user: response.data.data,
//             loading: false,
//           });
//           localStorage.setItem("authToken", response.data.token);
//           return { success: true };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Registration failed";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },

//       // Login user
//       login: async ({
//         email,
//         password,
//       }: LoginCredentials): Promise<ResponseResult> => {
//         set({ loading: true, error: null });
//         try {
//           const response = await axios.post(`${API_URL}/users/login`, {
//             email,
//             password,
//           });
//           console.log("login response", response);
//           set({
//             token: response.data.token,
//             user: response.data.data,
//             loading: false,
//           });
//           localStorage.setItem("authToken", response.data.token);
//         } catch (error: any) {
//           const message = error.response?.data?.message || "Login failed";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },

//       // Logout user
//       logout: (): void => {
//         set({ user: null, token: null });
//         localStorage.removeItem("authToken");
//         axios
//           .get(`${API_URL}/users/logout`, {
//             headers: { Authorization: `Bearer ${get().token}` },
//           })
//           .catch(console.error);
//       },

//       // Get current user
//       getMe: async (): Promise<ResponseResult> => {
//         set({ loading: true, error: null });
//         try {
//           const token = get().token || localStorage.getItem("authToken");
//           if (!token) throw new Error("No authentication token found");
//           const response = await axios.get(`${API_URL}/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           set({ user: response.data.data, loading: false });
//           return { success: true };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Failed to fetch user data";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },

//       // Update user
//       updateUser: async (userData: UpdateUserData): Promise<ResponseResult> => {
//         set({ loading: true, error: null });
//         try {
//           const token = get().token || localStorage.getItem("authToken");
//           if (!token) throw new Error("No authentication token found");
//           const formData = new FormData();
//           formData.append("name", userData.name);
//           formData.append("username", userData.username);
//           formData.append("email", userData.email);
//           if (userData.avatar) {
//             formData.append("avatar", userData.avatar);
//           }

//           // Debug: Log FormData contents
//           for (const [key, value] of formData.entries()) {
//             console.log(key, value);
//           }

//           const response = await axios.put(
//             `${API_URL}/users/update`,
//             formData,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           set({ user: response.data.data, loading: false });
//           return { success: true };
//         } catch (error: any) {
//           const message = error.response?.data?.message || "Update failed";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },

//       // Update password
//       updatePassword: async (
//         passwords: PasswordUpdateData
//       ): Promise<ResponseResult> => {
//         set({ loading: true, error: null });
//         try {
//           const token = get().token || localStorage.getItem("authToken");
//           if (!token) throw new Error("No authentication token found");
//           await axios.put(`${API_URL}/users/updatepassword`, passwords, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           set({ loading: false });
//           return { success: true };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Password update failed";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },
//       //get all notification
//       getAllNotifications: async (): Promise<NotificationResponseResult> => {
//         try {
//           const token = get().token || localStorage.getItem("authToken");
//           if (!token) throw new Error("No authentication token found");

//           const response = await axios.get(`${API_URL}/users/notifications`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           console.log("get notifications", response);
//           return { success: true, notifications: response.data.data };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Failed to fetch notifications";
//           return { success: false, error: message };
//         }
//       },

//       // Check notifications
//       checkNotifications: async (
//         notificationId: string
//       ): Promise<NotificationResponseResult> => {
//         set({ loading: true, error: null });
//         try {
//           const token = get().token || localStorage.getItem("authToken");
//           console.log("token", token);
//           if (!token) throw new Error("No authentication token found");
//           const response = await axios.get(
//             `${API_URL}/users/checknotification/${notificationId}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           console.log("check notifications", response);
//           set({ loading: false });
//           return { success: true, notifications: response.data.data };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Failed to check notifications";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },

//       // Delete notification
//       deleteNotification: async (
//         notificationId: string
//       ): Promise<ResponseResult> => {
//         set({ loading: true, error: null });
//         try {
//           const token = get().token || localStorage.getItem("authToken");
//           if (!token) throw new Error("No authentication token found");
//           await axios.delete(
//             `${API_URL}/users/checknotification/${notificationId}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           set({ loading: false });
//           return { success: true };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Failed to delete notification";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },

//       // Get all users (admin)
//       getAllUsers: async (): Promise<UsersResponseResult> => {
//         // Skip if already loading
//         if (get().loading) return { success: false, error: "Already loading" };

//         set({ loading: true, error: null });
//         try {
//           const token = get().token || localStorage.getItem("authToken");
//           if (!token) throw new Error("No authentication token found");
//           const response = await axios.get(`${API_URL}/users/getallusers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           set({ loading: false, users: response.data.data });
//           return { success: true, users: response.data.data };
//         } catch (error: any) {
//           const message =
//             error.response?.data?.message || "Failed to fetch users";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       partialize: (state) => ({ token: state.token, user: state.user }),
//     }
//   )
// );
//             error.response?.data?.message || "Failed to fetch users";
//           set({ error: message, loading: false });
//           return { success: false, error: message };
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       partialize: (state) => ({ token: state.token, user: state.user }),
//     }
//   )
// );
