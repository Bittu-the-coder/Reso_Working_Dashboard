import React from "react";
import { Routes, Route } from "react-router-dom";
import Overview from "../components/Overview";
import Events from "../components/Events";
import Projects from "../components/Projects";
import GoogleDocs from "../components/GoogleDocs";
import Settings from "../components/Settings";
import Teams from "../components/Teams";
import CollaborativeTasks from "../components/CollaborativeTasks";

interface DashboardRoutesProps {
  // State props
  events: {
    id: number;
    title: string;
    date: string;
    description: string;
  }[];
  newEvent: {
    title: string;
    date: string;
    description: string;
  };
  projects: {
    id: number;
    name: string;
    progress: number;
    members: number;
  }[];
  tasks: {
    id: number;
    title: string;
    assignee: string;
    deadline: string;
    status: string;
  }[];
  docs: {
    id: string;
    title: string;
    url: string;
    department: string;
    addedOn: string;
  }[];
  newDoc: {
    title: string;
    url: string;
    department: string;
  };
  loading: {
    addingDoc: boolean;
    updatingDoc: boolean;
    deletingDoc: boolean;
  };

  // Handler props
  setNewEvent: React.Dispatch<
    React.SetStateAction<{
      title: string;
      date: string;
      description: string;
    }>
  >;
  handleAddEvent: (e: React.FormEvent) => void;
  setNewDoc: React.Dispatch<
    React.SetStateAction<{
      title: string;
      url: string;
      department: string;
    }>
  >;
  handleAddDoc: (e: React.FormEvent) => Promise<void>;
  handleUpdateDoc: (
    id: string,
    updatedData: Partial<{
      id: string;
      title: string;
      url: string;
      department: string;
      addedOn: string;
    }>
  ) => Promise<void>;
  handleDeleteDoc: (id: string) => Promise<void>;
}

const DashboardRoutes: React.FC<DashboardRoutesProps> = ({
  events,
  newEvent,
  setNewEvent,
  projects,
  tasks,
  docs,
  newDoc,
  setNewDoc,
  loading,
  handleAddEvent,
  handleAddDoc,
  handleUpdateDoc,
  handleDeleteDoc,
}) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Overview events={events} projects={projects} tasks={tasks} />}
      />
      <Route path="/teams" element={<Teams />} />
      <Route
        path="/events"
        element={
          <Events
            events={events}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            handleAddEvent={handleAddEvent}
          />
        }
      />
      <Route path="/projects" element={<Projects projects={projects} />} />
      <Route path="/tasks" element={<CollaborativeTasks />} />
      <Route
        path="/documents"
        element={
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
        }
      />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default DashboardRoutes;
