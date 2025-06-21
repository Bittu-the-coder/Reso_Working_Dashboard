import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  ExternalLink,
  Trash2,
  Edit,
  Plus,
  Calendar,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface GoogleDoc {
  id: string;
  title: string;
  url: string;
  department: string;
  addedOn: string;
}

interface GoogleDocsProps {
  docs: GoogleDoc[];
  newDoc: {
    title: string;
    url: string;
    department: string;
  };
  setNewDoc: React.Dispatch<
    React.SetStateAction<{ title: string; url: string; department: string }>
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
  const { isDarkMode } = useTheme();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Filter docs by selected department
  const filteredDocs =
    selectedDepartment === "all"
      ? docs
      : docs.filter((doc) => doc.department === selectedDepartment);

  // Group documents by date (using filteredDocs instead of docs)
  const groupDocsByDate = () => {
    const grouped: { [key: string]: GoogleDoc[] } = {};
    const sortedDocs = [...filteredDocs].sort(
      (a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime()
    );
    sortedDocs.forEach((doc) => {
      const date = doc.addedOn.split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(doc);
    });
    return grouped;
  };
  const groupedDocs = groupDocsByDate();

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
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {" "}
      {/* Header and Filter Section */}
      <motion.div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 border-indigo-900/30"
            : "bg-white/80 border-blue-100"
        } backdrop-blur-lg rounded-2xl p-6 border shadow-lg relative overflow-hidden`}
        variants={itemVariants}
        whileHover={{
          boxShadow: isDarkMode
            ? "0 8px 30px rgba(30, 58, 138, 0.2)"
            : "0 8px 30px rgba(59, 130, 246, 0.15)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 ${
                isDarkMode ? "bg-indigo-900/50" : "bg-indigo-100"
              } rounded-lg`}
            >
              <FileText
                className={`w-5 h-5 ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </div>
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Team Documents
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              } border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm`}
            >
              <option value="all">All Departments</option>
              <option value="dev">Development</option>
              <option value="marketing">Marketing</option>
              <option value="outreach">Outreach</option>
              <option value="social media">Social Media</option>
              <option value="other">Other</option>
            </select>

            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`${
                isDarkMode ? "bg-indigo-700" : "bg-indigo-600"
              } text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 justify-center`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? "Cancel" : "Add Document"}
            </motion.button>
          </div>
        </div>

        {/* Department Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["all", "dev", "marketing", "outreach", "social media", "other"].map(
            (dept) => (
              <motion.button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedDepartment === dept
                    ? isDarkMode
                      ? "bg-indigo-700 text-white"
                      : "bg-indigo-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {dept === "all"
                  ? "All"
                  : dept.charAt(0).toUpperCase() + dept.slice(1)}
              </motion.button>
            )
          )}
        </div>
      </motion.div>{" "}
      {/* Add Document Form */}
      {showAddForm && (
        <motion.div
          className={`${
            isDarkMode
              ? "bg-gray-800/80 border-indigo-900/30"
              : "bg-white/80 border-blue-100"
          } backdrop-blur-lg rounded-xl shadow-sm border p-6 relative overflow-hidden`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Decorative corner elements */}
          <div
            className={`absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 ${
              isDarkMode ? "border-indigo-900/50" : "border-blue-200"
            } rounded-tl-lg`}
          />
          <div
            className={`absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 ${
              isDarkMode ? "border-indigo-900/50" : "border-blue-200"
            } rounded-br-lg`}
          />
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            Add New Document
          </h2>
          <form onSubmit={handleAddDoc} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Title
                </label>
                <input
                  type="text"
                  className={`w-full ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Document title"
                  value={newDoc.title}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  URL
                </label>
                <input
                  type="url"
                  className={`w-full ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="https://docs.google.com/document/d/..."
                  value={newDoc.url}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, url: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}
                >
                  Department
                </label>
                <select
                  className={`w-full ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  value={newDoc.department}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, department: e.target.value })
                  }
                  required
                >
                  <option value="dev">Development</option>
                  <option value="marketing">Marketing</option>
                  <option value="outreach">Outreach</option>
                  <option value="social media">Social Media</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>{" "}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <motion.button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`px-4 py-2 border ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                } rounded-lg font-medium text-sm`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={`px-4 py-2 ${
                  isDarkMode ? "bg-indigo-700" : "bg-indigo-600"
                } text-white rounded-lg font-medium text-sm flex items-center gap-2`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading.addingDoc}
              >
                {loading.addingDoc ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Document
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
      {/* Documents List */}
      <motion.div
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } rounded-xl shadow-sm border overflow-hidden`}
        variants={itemVariants}
      >
        {filteredDocs.length > 0 ? (
          <div
            className={`divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {Object.entries(groupedDocs).map(([date, docsForDate]) => (
              <div key={date} className="p-4 sm:p-6">
                {" "}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                  <Calendar
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {formatDate(date)}
                  </h3>
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } ml-auto`}
                  >
                    {docsForDate.length} document
                    {docsForDate.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {docsForDate.map((doc) => (
                    <motion.div
                      key={doc.id}
                      className={`p-3 sm:p-4 border ${
                        isDarkMode
                          ? "border-gray-700 hover:shadow-md hover:shadow-black/30"
                          : "border-gray-200 hover:shadow-md"
                      } rounded-lg transition-shadow`}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <div
                              className={`p-1.5 rounded-md ${
                                doc.department === "dev"
                                  ? isDarkMode
                                    ? "bg-blue-900/50 text-blue-300"
                                    : "bg-blue-100 text-blue-800"
                                  : doc.department === "marketing"
                                  ? isDarkMode
                                    ? "bg-purple-900/50 text-purple-300"
                                    : "bg-purple-100 text-purple-800"
                                  : doc.department === "outreach"
                                  ? isDarkMode
                                    ? "bg-green-900/50 text-green-300"
                                    : "bg-green-100 text-green-800"
                                  : doc.department === "social media"
                                  ? isDarkMode
                                    ? "bg-pink-900/50 text-pink-300"
                                    : "bg-pink-100 text-pink-800"
                                  : isDarkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <span className="text-xs font-medium">
                                {doc.department.charAt(0).toUpperCase() +
                                  doc.department.slice(1)}
                              </span>
                            </div>
                            <h4
                              className={`text-base font-medium ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } truncate max-w-full sm:max-w-xs md:max-w-sm`}
                            >
                              {doc.title}
                            </h4>
                          </div>{" "}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                            <span className={isDarkMode ? "text-gray-400" : ""}>
                              Added on{" "}
                              {new Date(doc.addedOn).toLocaleDateString()}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${
                                isDarkMode
                                  ? "text-indigo-400"
                                  : "text-indigo-600"
                              } hover:underline flex items-center gap-1`}
                              aria-label={`Open document: ${doc.title}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open document
                            </a>
                          </div>
                        </div>

                        <div className="flex gap-2 sm:ml-auto">
                          {" "}
                          <motion.button
                            onClick={() =>
                              handleUpdateDoc(doc.id, { title: doc.title })
                            }
                            className={`p-2 ${
                              isDarkMode
                                ? "text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30"
                                : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                            } rounded-lg`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className={`p-2 ${
                              isDarkMode
                                ? "text-gray-400 hover:text-red-400 hover:bg-red-900/30"
                                : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                            } rounded-lg`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete"
                            disabled={loading.deletingDoc}
                          >
                            {loading.deletingDoc ? (
                              <svg
                                className={`animate-spin h-4 w-4 ${
                                  isDarkMode ? "text-red-400" : "text-red-600"
                                }`}
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              } mb-4`}
            >
              <FileText
                className={`h-5 w-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
            <h3
              className={`text-lg font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-1`}
            >
              No documents found
            </h3>
            <p
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } mb-6`}
            >
              {selectedDepartment === "all"
                ? "You haven't added any documents yet."
                : `No documents found for ${selectedDepartment} department.`}
            </p>
            <motion.button
              onClick={() => setShowAddForm(true)}
              className={`inline-flex items-center rounded-md ${
                isDarkMode
                  ? "bg-indigo-700 hover:bg-indigo-600"
                  : "bg-indigo-600 hover:bg-indigo-500"
              } px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
              Add Document
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GoogleDocs;
