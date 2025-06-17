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
  const response = await axios.get(`${baseUrl}/api/docs`);
  return response.data.data;
};

export const addDoc = async (doc: DocInput): Promise<Doc> => {
  const response = await axios.post(`${baseUrl}/api/docs/add-docs`, doc);
  return response.data.data;
};

export const updateDoc = async (id: string, doc: DocInput): Promise<Doc> => {
  if (!id) {
    throw new Error("Document ID is required for update");
  }
  console.log("Updating document with ID:", id, "and data:", doc);
  const response = await axios.put(
    `${baseUrl}/api/docs/update-docs/${id}`,
    doc
  );
  return response.data.data;
};

export const deleteDoc = async (id: string): Promise<void> => {
  await axios.delete(`${baseUrl}/api/docs/delete-docs/${id}`);
};
