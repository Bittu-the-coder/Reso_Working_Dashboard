import React, { useState } from "react";
import {
  FiFileText,
  FiExternalLink,
  FiTrash2,
  FiEdit,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { addDoc, deleteDoc, updateDoc } from "../service/docs";
import { toast } from "react-hot-toast";

interface GoogleDoc {
  id: string; // Changed from number to string to match MongoDB _id
  title: string;
  url: string;
  addedOn: string;
}

interface GoogleDocsProps {
  docs: GoogleDoc[];
  setDocs: React.Dispatch<React.SetStateAction<GoogleDoc[]>>;
}

const GoogleDocs: React.FC<GoogleDocsProps> = ({ docs, setDocs }) => {
  const [newDoc, setNewDoc] = useState({
    title: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingDoc, setEditingDoc] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const addedDoc = await addDoc(newDoc);

      setDocs([...docs, addedDoc]);
      setNewDoc({
        title: "",
        url: "",
      });
      toast.success("Document added successfully");
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("Failed to add document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteDoc(id);
      setDocs(docs.filter((doc) => doc.id !== id));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDoc = (doc: GoogleDoc) => {
    setEditingDoc({
      id: doc.id,
      title: doc.title,
      url: doc.url,
    });
  };

  const handleCancelEdit = () => {
    setEditingDoc(null);
  };

  const handleUpdateDoc = async (
    id: string,
    updatedData: Partial<GoogleDoc>
  ) => {
    try {
      setIsLoading(true);
      const updatedDoc = await updateDoc(id, updatedData);

      // Update the docs array with the updated document
      setDocs(docs.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)));

      setEditingDoc(null);
      toast.success("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">
          Add Google Document
        </h3>
        <form onSubmit={handleAddDoc} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="doc-title"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Document Title
              </label>
              <input
                type="text"
                id="doc-title"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Meeting Notes"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="doc-url"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Google Docs URL
              </label>
              <input
                type="url"
                id="doc-url"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="https://docs.google.com/document/d/..."
                value={newDoc.url}
                onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold shadow-md"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">
          Google Documents
        </h3>
        {docs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center"
              >
                {editingDoc && editingDoc.id === doc.id ? (
                  // Edit mode
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      value={editingDoc.title}
                      onChange={(e) =>
                        setEditingDoc({ ...editingDoc, title: e.target.value })
                      }
                      placeholder="Document Title"
                    />
                    <input
                      type="url"
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      value={editingDoc.url}
                      onChange={(e) =>
                        setEditingDoc({ ...editingDoc, url: e.target.value })
                      }
                      placeholder="Document URL"
                    />
                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="text-white hover:text-red-300 transition-colors p-2"
                        disabled={isLoading}
                      >
                        <FiX size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateDoc(doc.id, {
                            title: editingDoc.title,
                            url: editingDoc.url,
                          })
                        }
                        className="text-white hover:text-green-300 transition-colors p-2"
                        disabled={isLoading}
                      >
                        <FiCheck size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-white/20 text-white mr-3">
                        <FiFileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{doc.title}</h4>
                        <p className="text-white/70 text-sm">
                          Added on {doc.addedOn}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-white/80 transition-colors p-2"
                      >
                        <FiExternalLink size={18} />
                      </a>
                      <button
                        onClick={() => handleEditDoc(doc)}
                        className="text-white hover:text-blue-300 transition-colors p-2"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="text-white hover:text-red-300 transition-colors p-2"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/70">
            No documents added yet. Add your first Google document above.
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleDocs;
