import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3030";

interface DocInput {
  title: string;
  url: string;
}

interface Doc {
  id: string;
  title: string;
  url: string;
  addedOn: string;
}

export const getAllDocs = async (): Promise<Doc[]> => {
  try {
    const response = await axios.get(`${baseUrl}/api/docs`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to fetch documents";
    throw new Error(errorMessage);
  }
};

export const addDoc = async (doc: DocInput): Promise<Doc> => {
  try {
    const response = await axios.post(`${baseUrl}/api/docs/add-docs`, doc);
    return response.data.data;
  } catch (error: any) {
    console.error("Error adding document:", error);
    // Check for specific error message about duplicate URL
    if (
      error.response?.status === 409 ||
      error.response?.data?.message?.includes("already exists")
    ) {
      throw new Error("Document with this URL already exists");
    }
    const errorMessage =
      error.response?.data?.message || "Failed to add document";
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
  } catch (error: any) {
    console.error("Error updating document:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to update document";
    throw new Error(errorMessage);
  }
};

export const deleteDoc = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("Document ID is required for deletion");
  }

  try {
    await axios.delete(`${baseUrl}/api/docs/delete-docs/${id}`);
  } catch (error: any) {
    console.error("Error deleting document:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to delete document";
    throw new Error(errorMessage);
  }
};
