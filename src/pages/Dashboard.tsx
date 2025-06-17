import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationTabs from "../components/NavigationTabs";
import Overview from "../components/Overview";
import Events from "../components/Events";
import Projects from "../components/Projects";
import Tasks from "../components/Tasks";
import GoogleDocs from "../components/GoogleDocs";
import Settings from "../components/Settings";
import { getAllDocs, addDoc, updateDoc, deleteDoc } from "../service/docs";
import { toast } from "react-hot-toast";

interface GoogleDoc {
  id: string;
  title: string;
  url: string;
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

interface UpdateDoc {
  url: string;
  title: string;
}

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

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

  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    deadline: "",
    status: "pending",
  });

  // Google Docs state
  const [docs, setDocs] = useState<GoogleDoc[]>([]);
  const [newDoc, setNewDoc] = useState({
    title: "",
    url: "",
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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

    setTasks([
      ...tasks,
      {
        ...newTask,
        id: newId,
      },
    ]);

    setNewTask({
      title: "",
      assignee: "",
      deadline: "",
      status: "pending",
    });
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, addingDoc: true }));
      const currentDate = new Date().toISOString().split("T")[0];
      const docToAdd = { ...newDoc, addedOn: currentDate };
      const addedDoc = await addDoc(docToAdd);

      setDocs([...docs, addedDoc]);
      setNewDoc({ title: "", url: "" });
      toast.success("Document added successfully");
    } catch (error: any) {
      console.error("Error adding doc:", error);
      if (error.message.includes("already exists")) {
        toast.error("Document with this URL already exists");
      } else {
        toast.error(error.message || "Failed to add document");
      }
    } finally {
      setLoading((prev) => ({ ...prev, addingDoc: false }));
    }
  };

  const handleUpdateDoc = async (
    id: string,
    updatedData: Partial<UpdateDoc>
  ) => {
    if (!id) {
      toast.error("Cannot update document: Missing document ID");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, updatingDoc: true }));
      await updateDoc(id, updatedData);
      setDocs(
        docs.map((doc) => (doc.id === id ? { ...doc, ...updatedData } : doc))
      );
      toast.success("Document updated successfully");
    } catch (error: any) {
      console.error("Error updating doc:", error);
      toast.error(error.response?.data?.message || "Failed to update document");
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
        return (
          <Tasks
            tasks={tasks}
            newTask={newTask}
            setNewTask={setNewTask}
            handleAddTask={handleAddTask}
          />
        );
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>

          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
