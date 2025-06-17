import React from "react";
import { FiCode, FiCalendar, FiFileText } from "react-icons/fi";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
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

interface OverviewProps {
  events: Event[];
  projects: Project[];
  tasks: Task[];
}

const Overview: React.FC<OverviewProps> = ({ events, projects, tasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats Cards */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-white/20 text-white">
            <FiCode size={20} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/80">Active Projects</p>
            <p className="text-2xl font-semibold text-white">
              {projects.length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-white/20 text-white">
            <FiCalendar size={20} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/80">Upcoming Events</p>
            <p className="text-2xl font-semibold text-white">{events.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-white/20 text-white">
            <FiFileText size={20} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/80">Pending Tasks</p>
            <p className="text-2xl font-semibold text-white">
              {tasks.filter((t) => t.status === "pending").length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-white/20 text-white">
            <FiFileText size={20} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/80">Completed Tasks</p>
            <p className="text-2xl font-semibold text-white">
              {tasks.filter((t) => t.status === "completed").length}
            </p>
          </div>
        </div>
      </div>{" "}
      {/* Recent Activity */}
      <div className="md:col-span-2 lg:col-span-4 bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">
          Recent Activities
        </h3>
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Recent Events</h4>
          <div className="space-y-3">
            {events
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="flex items-start">
                  <div className="p-2 rounded-full bg-white/20 text-white">
                    <FiCalendar />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {event.title}
                    </p>
                    <p className="text-sm text-white/70">{event.description}</p>
                    <p className="text-xs text-white/50 mt-1">
                      Event on {event.date}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <h4 className="text-md font-medium text-white mt-6">Recent Tasks</h4>
          <div className="space-y-3">
            {tasks
              .sort(
                (a, b) =>
                  new Date(b.deadline).getTime() -
                  new Date(a.deadline).getTime()
              )
              .slice(0, 3)
              .map((task) => (
                <div key={task.id} className="flex items-start">
                  <div className="p-2 rounded-full bg-white/20 text-white">
                    <FiFileText />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {task.title}
                    </p>
                    <p className="text-sm text-white/70">
                      Assigned to: {task.assignee}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      Due on {task.deadline}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
