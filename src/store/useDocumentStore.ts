// stores/documentStore.js
import { create } from "zustand";
import axios from "axios";
import type {
  DocumentState,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentResponseResult,
  ResponseResult,
} from "../types";
import { API_URL } from "../utils/api";

interface DocumentStoreState extends DocumentState {
  auth: { token: string | null };
}

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,
  auth: { token: null },

  // Create document
  createDocument: async (
    teamId: string,
    documentData: CreateDocumentData
  ): Promise<DocumentResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.post(
        `${API_URL}/documents/teams/${teamId}/documents`,
        documentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        documents: [...state.documents, response.data.data],
        loading: false,
      }));
      return { success: true, document: response.data.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create document";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // get all documents irrespective of team
  getAllDocuments: async (): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(`${API_URL}/documents/teams/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ documents: response.data.data, loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch documents";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get all documents for a team
  getTeamDocuments: async (teamId: string): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/documents/teams/${teamId}/documents`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ documents: response.data.data.documents, loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch documents";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Get single document
  getDocumentById: async (
    teamId: string,
    documentId: string
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(
        `${API_URL}/documents/teams/${teamId}/documents/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ currentDocument: response.data.data.document, loading: false });
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch document";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update document
  updateDocument: async (
    teamId: string,
    documentId: string,
    documentData: UpdateDocumentData
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.put(
        `${API_URL}/documents/teams/${teamId}/documents/${documentId}`,
        documentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc._id === documentId ? response.data.data : doc
        ),
        currentDocument: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update document";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Delete document
  deleteDocument: async (
    teamId: string,
    documentId: string
  ): Promise<ResponseResult> => {
    set({ loading: true, error: null });
    try {
      const token = get().auth.token || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(
        `${API_URL}/documents/teams/${teamId}/documents/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        documents: state.documents.filter((doc) => doc._id !== documentId),
        currentDocument: null,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete document";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Clear current document
  clearCurrentDocument: (): void => set({ currentDocument: null }),
}));
