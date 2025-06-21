import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationTabs from "../components/NavigationTabs";
import Overview from "../components/Overview";
import Events from "../components/Events";
import Projects from "../components/Projects";
import GoogleDocs from "../components/GoogleDocs";
import Settings from "../components/Settings";
import Teams from "../components/Teams";
import CollaborativeTasks from "../components/CollaborativeTasks";
import { getAllDocs, addDoc, updateDoc, deleteDoc } from "../service/docs";
import { toast } from "react-hot-toast";
import { useTheme } from "../contexts/useTheme";

interface GoogleDoc {
  id: string;
  title: string;
  url: string;
  department: string;
  addedOn: string;
}

interface Project {
  id: number;
  name: string;
  progress: number;
  members: number;
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  deadline: string;
  status: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

//Removed unused UpdateDoc interface

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const { isDarkMode } = useTheme();

  // Event state
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Monthly Team Meeting",
      date: "2023-11-15",
      description:
        "Regular team sync-up to discuss ongoing projects and roadmap.",
    },
    {
      id: 2,
      title: "Tech Conference",
      date: "2023-12-10",
      description:
        "Annual technology conference with workshops and networking opportunities.",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
  });

  // Project state
  const projects: Project[] = [
    {
      id: 1,
      name: "RESO Website Redesign",
      progress: 75,
      members: 4,
    },
    {
      id: 2,
      name: "Community Outreach Portal",
      progress: 30,
      members: 3,
    },
    {
      id: 3,
      name: "Research Paper Database",
      progress: 60,
      members: 5,
    },
  ];

  // Task state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Design homepage mockup",
      assignee: "Aditya Singh",
      deadline: "2023-11-20",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Set up API endpoints",
      assignee: "Ravi Kumar",
      deadline: "2023-11-25",
      status: "pending",
    },
    {
      id: 3,
      title: "Write documentation",
      assignee: "Priya Sharma",
      deadline: "2023-11-15",
      status: "completed",
    },
  ]);

  // const [newTask, setNewTask] = useState({
  //   title: "",
  //   assignee: "",
  //   deadline: "",
  //   status: "pending",
  // });
  // Google Docs state
  const [docs, setDocs] = useState<GoogleDoc[]>([]);
  const [newDoc, setNewDoc] = useState({
    title: "",
    url: "",
    department: "",
  });
  const [loading, setLoading] = useState({
    docs: false,
    addingDoc: false,
    updatingDoc: false,
    deletingDoc: false,
  });

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading((prev) => ({ ...prev, docs: true }));
        const docsData = await getAllDocs();
        setDocs(docsData);
      } catch (error) {
        console.error("Error fetching docs:", error);
        toast.error("Failed to load documents");
      } finally {
        setLoading((prev) => ({ ...prev, docs: false }));
      }
    };

    fetchDocs();
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId =
      events.length > 0 ? Math.max(...events.map((event) => event.id)) + 1 : 1;

    setEvents([
      ...events,
      {
        ...newEvent,
        id: newId,
      },
    ]);

    setNewEvent({
      title: "",
      date: "",
      description: "",
    });
  };
  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, addingDoc: true }));
      const currentDate = new Date().toISOString().split("T")[0];
      const docToAdd = {
        title: newDoc.title,
        url: newDoc.url,
        department: newDoc.department, // Make sure this is included
        addedOn: currentDate,
      };
      const addedDoc = await addDoc(docToAdd);

      setDocs([...docs, addedDoc]);
      setNewDoc({ title: "", url: "", department: "" });
      toast.success("Document added successfully");
    } catch (error: unknown) {
      console.error("Error adding doc:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("already exists")) {
        toast.error("Document with this URL already exists");
      } else {
        toast.error(errorMessage || "Failed to add document");
      }
    } finally {
      setLoading((prev) => ({ ...prev, addingDoc: false }));
    }
  };
  const handleUpdateDoc = async (
    id: string,
    updatedData: Partial<GoogleDoc>
  ) => {
    if (!id) {
      toast.error("Cannot update document: Missing document ID");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, updatingDoc: true }));
      await updateDoc(id, {
        title: updatedData.title || "",
        url: updatedData.url || "",
        department: updatedData.department || "",
        addedOn: updatedData.addedOn || new Date().toISOString().split("T")[0],
      });
      setDocs(
        docs.map((doc) => (doc.id === id ? { ...doc, ...updatedData } : doc))
      );
      toast.success("Document updated successfully");
    } catch (error: unknown) {
      console.error("Error updating doc:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to update document";
      toast.error(errorMsg);
    } finally {
      setLoading((prev) => ({ ...prev, updatingDoc: false }));
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      setLoading((prev) => ({ ...prev, deletingDoc: true }));
      await deleteDoc(id);
      setDocs(docs.filter((doc) => doc.id !== id));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting doc:", error);
      toast.error("Failed to delete document");
    } finally {
      setLoading((prev) => ({ ...prev, deletingDoc: false }));
    }
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview events={events} projects={projects} tasks={tasks} />;
      case "teams":
        return <Teams />;
      case "events":
        return (
          <Events
            events={events}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            handleAddEvent={handleAddEvent}
          />
        );
      case "projects":
        return <Projects projects={projects} />;
      case "tasks":
        return <CollaborativeTasks />;
      case "docs":
        return (
          <GoogleDocs
            docs={docs}
            newDoc={newDoc}
            setNewDoc={setNewDoc}
            handleAddDoc={handleAddDoc}
            handleDeleteDoc={handleDeleteDoc}
            handleUpdateDoc={handleUpdateDoc}
            loading={{
              addingDoc: loading.addingDoc,
              updatingDoc: loading.updatingDoc,
              deletingDoc: loading.deletingDoc,
            }}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return <Overview events={events} projects={projects} tasks={tasks} />;
    }
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } flex flex-col relative overflow-hidden`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-pink-300/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10" />

      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        <div
          className={`${
            isDarkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-blue-100"
          } backdrop-blur-lg p-6 rounded-2xl border shadow-lg relative`}
        >
          {/* Decorative corner elements */}{" "}
          <div
            className={`absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 ${
              isDarkMode ? "border-blue-600" : "border-blue-200"
            } rounded-tl-lg`}
          />
          <div
            className={`absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 ${
              isDarkMode ? "border-blue-600" : "border-blue-200"
            } rounded-tr-lg`}
          />
          <div
            className={`absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 ${
              isDarkMode ? "border-blue-600" : "border-blue-200"
            } rounded-bl-lg`}
          />
          <div
            className={`absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 ${
              isDarkMode ? "border-blue-600" : "border-blue-200"
            } rounded-br-lg`}
          />
          <div className="flex items-center gap-3 mb-6">
            {" "}
            <div
              className={`p-2 ${
                isDarkMode
                  ? "bg-gradient-to-r from-blue-900 to-indigo-900"
                  : "bg-gradient-to-r from-blue-100 to-indigo-200"
              } rounded-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-6 h-6 ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Dashboard
            </h2>
          </div>
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
