import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  ExternalLink,
  Trash2,
  Edit,
  Plus,
  Calendar,
  FileEdit,
  PlusCircle,
  List,
} from "lucide-react";

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

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
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 z-10 relative">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            {editingDoc ? (
              <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            ) : (
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-indigo-900 truncate">
            {editingDoc ? "Edit Document" : "Add Google Document"}
          </h3>
        </div>

        {editingDoc ? (
          <form onSubmit={handleEditSubmit} className="space-y-4 z-10 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  disabled={loading.updatingDoc}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Google Docs URL
                </label>
                <input
                  type="url"
                  className="w-full bg-white border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  value={editFormData.url}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, url: e.target.value })
                  }
                  required
                  disabled={loading.updatingDoc}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <motion.button
                type="button"
                onClick={cancelEditing}
                className="bg-gray-100 border border-blue-200 text-blue-800 hover:bg-gray-200 transition-colors py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-colors py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold shadow-md disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
                disabled={loading.updatingDoc}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {loading.updatingDoc ? "Updating..." : "Update Document"}
              </motion.button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddDoc} className="space-y-4 z-10 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Google Docs URL
                </label>
                <input
                  type="url"
                  className="w-full bg-white border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-colors py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold shadow-md disabled:opacity-50 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                disabled={loading.addingDoc}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                {loading.addingDoc ? "Adding..." : "Add Document"}
              </motion.button>
            </div>
          </form>
        )}

        {/* Decorative corner elements */}
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
        <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-blue-200 rounded-br-lg" />

        {/* Decorative Elements */}
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full opacity-50" />
      </motion.div>{" "}
      <motion.div
        className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 z-10 relative">
          <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
            <List className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-indigo-900">
            Google Documents
          </h3>
        </div>

        {docs.length > 0 ? (
          <motion.div
            className="space-y-6 z-10 relative"
            variants={containerVariants}
          >
            {Object.entries(groupedDocs).map(([date, docsForDate]) => (
              <div key={date} className="space-y-3">
                <h4 className="text-blue-900 font-medium border-b border-blue-100 pb-2 flex items-center gap-2 flex-wrap text-sm sm:text-base">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="truncate">{formatDate(date)}</span>
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {docsForDate.map((doc) => (
                    <motion.div
                      key={doc.id}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.01,
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
                      }}
                    >
                      <div className="flex items-start sm:items-center w-full">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-blue-900 font-medium truncate">
                            {doc.title}
                          </h4>
                          <p className="text-blue-700 text-sm flex items-center gap-1 flex-wrap">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              Added on {new Date(doc.addedOn).toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3 self-end sm:self-center mt-2 sm:mt-0">
                        <motion.button
                          onClick={() => startEditing(doc)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2 disabled:opacity-50 bg-blue-50 rounded-lg"
                          disabled={loading.updatingDoc || loading.deletingDoc}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit"
                          aria-label="Edit document"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 bg-indigo-50 rounded-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Open in new tab"
                          aria-label="Open document in new tab"
                        >
                          <ExternalLink size={18} />
                        </motion.a>
                        <motion.button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 disabled:opacity-50 bg-red-50 rounded-lg"
                          disabled={loading.deletingDoc}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete"
                          aria-label="Delete document"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-blue-50/50 rounded-xl p-4 sm:p-8 text-center border border-blue-100">
            <div className="flex justify-center mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </div>
            <p className="text-blue-700 mb-2 text-sm sm:text-base">
              No documents added yet.
            </p>
            <p className="text-blue-600 text-xs sm:text-sm">
              Add your first Google document above.
            </p>
          </div>
        )}

        {/* Decorative corner elements */}
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-200 rounded-tl-lg" />
        <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-200 rounded-tr-lg" />
        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-200 rounded-bl-lg" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-200 rounded-br-lg" />

        {/* Decorative Elements */}
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-full opacity-50" />
      </motion.div>
    </motion.div>
  );
};

export default GoogleDocs;
