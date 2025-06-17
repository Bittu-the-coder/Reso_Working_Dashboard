import React, { useState } from "react";
import { FiFileText, FiExternalLink, FiTrash2, FiEdit2 } from "react-icons/fi";

export interface GoogleDoc {
  id: string;
  title: string;
  url: string;
  addedOn: string;
}

interface GoogleDocsProps {
  docs: GoogleDoc[];
  newDoc: {
    title: string;
    url: string;
  };
  setNewDoc: React.Dispatch<
    React.SetStateAction<{ title: string; url: string }>
  >;
  handleAddDoc: (e: React.FormEvent) => Promise<void>;
  handleUpdateDoc: (
    id: string,
    updatedData: Partial<GoogleDoc>
  ) => Promise<void>;
  handleDeleteDoc: (id: string) => Promise<void>;
  loading: {
    addingDoc: boolean;
    updatingDoc: boolean;
    deletingDoc: boolean;
  };
}

const GoogleDocs: React.FC<GoogleDocsProps> = ({
  docs,
  newDoc,
  setNewDoc,
  handleAddDoc,
  handleUpdateDoc,
  handleDeleteDoc,
  loading,
}) => {
  const [editingDoc, setEditingDoc] = useState<GoogleDoc | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    url: "",
  });

  // Group documents by date

  const groupDocsByDate = () => {
    const grouped: { [key: string]: GoogleDoc[] } = {};
    // Sort docs by date (newest first)
    const sortedDocs = [...docs].sort(
      (a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime()
    );
    sortedDocs.forEach((doc) => {
      const date = doc.addedOn.split("T")[0]; // Extract just the date part
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(doc);
    });
    return grouped;
  };
  const groupedDocs = groupDocsByDate();

  const startEditing = (doc: GoogleDoc) => {
    setEditingDoc(doc);
    setEditFormData({
      title: doc.title,
      url: doc.url,
    });
  };

  const cancelEditing = () => {
    setEditingDoc(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    try {
      await handleUpdateDoc(editingDoc.id, {
        title: editFormData.title,
        url: editFormData.url,
      });
      setEditingDoc(null);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // Format date to be more readable (e.g., "June 17, 2023")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">
          {editingDoc ? "Edit Document" : "Add Google Document"}
        </h3>
        {editingDoc ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  disabled={loading.updatingDoc}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Google Docs URL
                </label>
                <input
                  type="url"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={editFormData.url}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, url: e.target.value })
                  }
                  required
                  disabled={loading.updatingDoc}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEditing}
                className="bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors py-3 px-6 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold shadow-md disabled:opacity-50"
                disabled={loading.updatingDoc}
              >
                {loading.updatingDoc ? "Updating..." : "Update Document"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddDoc} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Meeting Notes"
                  value={newDoc.title}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, title: e.target.value })
                  }
                  required
                  disabled={loading.addingDoc}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Google Docs URL
                </label>
                <input
                  type="url"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="https://docs.google.com/document/d/..."
                  value={newDoc.url}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, url: e.target.value })
                  }
                  required
                  disabled={loading.addingDoc}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold shadow-md disabled:opacity-50"
                disabled={loading.addingDoc}
              >
                {loading.addingDoc ? "Adding..." : "Add Document"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">
          Google Documents
        </h3>
        {docs.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedDocs).map(([date, docsForDate]) => (
              <div key={date} className="space-y-3">
                <h4 className="text-white/80 font-medium border-b border-white/20 pb-2">
                  {formatDate(date)}
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {docsForDate.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-white/20 text-white mr-3">
                          <FiFileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {doc.title}
                          </h4>
                          <p className="text-white/70 text-sm">
                            Added on {new Date(doc.addedOn).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => startEditing(doc)}
                          className="text-white hover:text-blue-300 transition-colors p-2 disabled:opacity-50"
                          disabled={loading.updatingDoc || loading.deletingDoc}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-white/80 transition-colors p-2"
                        >
                          <FiExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="text-white hover:text-red-300 transition-colors p-2 disabled:opacity-50"
                          disabled={loading.deletingDoc}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
