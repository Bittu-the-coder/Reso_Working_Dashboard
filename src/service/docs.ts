import axios, { AxiosError } from "axios";
// Make sure baseUrl doesn't end with a trailing slash
const baseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3030"
).replace(/\/+$/, "");

export interface DocInput {
  title: string;
  url: string;
  department: string;
}

export interface Doc {
  id: string;
  title: string;
  url: string;
  department: string;
  addedOn: string;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export const getAllDocs = async (department?: string): Promise<Doc[]> => {
  try {
    const url = department
      ? `${baseUrl}/api/docs?department=${encodeURIComponent(department)}`
      : `${baseUrl}/api/docs`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error fetching documents:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch documents";
    throw new Error(errorMessage);
  }
};

export const addDoc = async (doc: DocInput): Promise<Doc> => {
  try {
    const response = await axios.post(`${baseUrl}/api/docs/add-docs`, doc);
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error adding document:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    // Check for specific error message about duplicate URL
    if (
      axiosError.response?.status === 409 ||
      axiosError.response?.data?.message?.includes("already exists")
    ) {
      throw new Error("Document with this URL already exists");
    }
    const errorMessage =
      axiosError.response?.data?.message || "Failed to add document";
    throw new Error(errorMessage);
  }
};

export const updateDoc = async (id: string, doc: DocInput): Promise<Doc> => {
  if (!id) {
    throw new Error("Document ID is required for update");
  }

  try {
    const response = await axios.put(
      `${baseUrl}/api/docs/update-docs/${id}`,
      doc
    );
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error updating document:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to update document";
    throw new Error(errorMessage);
  }
};

export const deleteDoc = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("Document ID is required for deletion");
  }

  try {
    await axios.delete(`${baseUrl}/api/docs/delete-docs/${id}`);
  } catch (error: unknown) {
    console.error("Error deleting document:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to delete document";
    throw new Error(errorMessage);
  }
};
