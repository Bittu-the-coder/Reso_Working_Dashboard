export interface TaskUser {
  _id: string;
  name: string;
  email: string;
}

export interface TaskTeam {
  _id: string;
  name: string;
}

export interface TaskMessage {
  _id: string;
  content: string;
  createdAt: string;
  user: TaskUser;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdAt: string;
  createdBy: string;
  teamId: string;
  team?: TaskTeam;
  assignedTo?: string[];
  messages?: TaskMessage[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  assignedTo?: string[];
  steps?: TaskStep[];
  teamId: string;
}

export interface TaskStep {
  id: string;
  title: string;
  completed: boolean;
}
