// User related types
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
}

export interface Message {
  _id: string;
  message: string;
  sender?: string;
  user?: string | User;
  timestamp?: string;
  createdAt: string;
  updatedAt?: string;
}

// Auth store types
export interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  loading: boolean;
  users?: User[];
  notifications: Notification[];
  register: (userData: RegisterUserData) => Promise<ResponseResult>;
  login: (credentials: LoginCredentials) => Promise<ResponseResult>;
  logout: () => void;
  getMe: () => Promise<ResponseResult>;
  updateUser: (userData: UpdateUserData) => Promise<ResponseResult>;
  updatePassword: (passwords: PasswordUpdateData) => Promise<ResponseResult>;
  checkNotifications: (
    notificationId: string
  ) => Promise<NotificationResponseResult>;
  deleteNotification: (notificationId: string) => Promise<ResponseResult>;
  getAllNotifications: () => Promise<NotificationResponseResult>;
  getAllUsers: () => Promise<UsersResponseResult>;
}

// Team related types
interface userId {
  _id: string;
}
export interface Team {
  _id: string;
  name: string;
  description?: string;
  avatar: string;
  ownerId: userId;
  createdBy: string | User;
  members: TeamMember[];
  invitations?: TeamInvitation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  department: string;
  userId: userId;
  role: string;
  joinedAt?: string;
  isAcceptedInvite?: boolean;
}

export interface TeamInvitation {
  userId: string | User;
  status: string;
  createdAt?: string;
}

export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
  createTeam: (teamData: CreateTeamData) => Promise<TeamResponseResult>;
  getMyTeams: () => Promise<ResponseResult>;
  getTeam: (teamId: string) => Promise<ResponseResult>;
  updateTeam: (
    teamId: string,
    teamData: UpdateTeamData
  ) => Promise<ResponseResult>;
  deleteTeam: (teamId: string) => Promise<ResponseResult>;
  getTeamMembers: (teamId: string) => Promise<MembersResponseResult>;
  addTeamMember: (
    teamId: string,
    memberData: AddTeamMemberData
  ) => Promise<ResponseResult>;
  removeTeamMember: (
    teamId: string,
    memberId: string
  ) => Promise<ResponseResult>;
  updateTeamMember: (
    teamId: string,
    memberId: string,
    memberData: UpdateTeamMemberData
  ) => Promise<ResponseResult>;
  acceptTeamInvitation: () => Promise<ResponseResult>;
  clearCurrentTeam: () => void;
}

// Task related types

export interface TaskTeam {
  _id: string;
  name: string;
}

export interface TaskUser {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdAt: string;
  createdBy: string | User;
  teamId:
    | {
        _id: string;
        name: string;
      }
    | string;
  team?: TaskTeam;
  assignedTo?: User[] | string[];
  messages?: Message[];
  steps?: TaskStep[];
  uploads?: Array<{
    fileId: string;
    url: string;
    name: string;
    size?: string;
    fileType?: string;
  }>;
}

export interface TaskStep {
  title: string;
  isCompleted: boolean;
  _id?: string;
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TaskStoreState {
  tasks: Task[];
  teamTasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;

  // Helper methods
  getAuthToken: () => string;
  handleError: <T>(error: any) => ApiResponse<T>;

  // Task operations
  createTask: (
    teamId: string,
    taskData: CreateTaskData,
    files?: File[]
  ) => Promise<ApiResponse<Task>>;
  getTeamTasks: (teamId: string) => Promise<ApiResponse<Task[]>>;
  getUserTasks: () => Promise<ApiResponse<Task[]>>;
  getTaskById: (teamId: string, taskId: string) => Promise<ApiResponse<Task>>;
  updateTask: (
    teamId: string,
    taskId: string,
    taskData: UpdateTaskData,
    files?: File[],
    removedUploads?: string[]
  ) => Promise<ApiResponse<Task>>;
  updateTaskStatus: (
    teamId: string,
    taskId: string,
    status: string,
    stepId?: string,
    completed?: boolean
  ) => Promise<ApiResponse<Task>>;
  deleteTask: (
    teamId: { _id: string } | string,
    taskId: string
  ) => Promise<ApiResponse<void>>;

  // Message operations
  getTaskMessages: (
    teamId: string,
    taskId: string
  ) => Promise<ApiResponse<Message[]>>;
  addTaskMessage: (
    teamId: string,
    taskId: string,
    message: string
  ) => Promise<ApiResponse<Message>>;
  updateTaskMessage: (
    teamId: string,
    taskId: string,
    messageId: string,
    message: string
  ) => Promise<ApiResponse<Message>>;
  deleteTaskMessage: (
    teamId: string,
    taskId: string,
    messageId: string
  ) => Promise<ApiResponse<void>>;

  // Utility
  clearCurrentTask: () => void;
}

export interface Message {
  _id: string;
  message: string;
  sender?: string;
  user?: string | User;
  timestamp?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskState {
  tasks: Task[];
  teamTasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;

  // Helper methods
  getAuthToken: () => string;
  handleError: <T>(error: any) => ApiResponse<T>;

  createTask: (
    teamId: string,
    taskData: CreateTaskData,
    files?: File[]
  ) => Promise<ApiResponse<Task>>;
  getTeamTasks: (teamId: string) => Promise<ApiResponse<Task[]>>;
  getUserTasks: () => Promise<ApiResponse<Task[]>>;
  getTaskById: (teamId: string, taskId: string) => Promise<ApiResponse<Task>>;
  updateTask: (
    teamId: string,
    taskId: string,
    taskData: UpdateTaskData,
    files?: File[],
    removedUploads?: string[]
  ) => Promise<ApiResponse<Task>>;
  updateTaskStatus: (
    teamId: string,
    taskId: string,
    status: string,
    stepId?: string,
    completed?: boolean
  ) => Promise<ApiResponse<Task>>;
  deleteTask: (
    teamId: { _id: string } | string,
    taskId: string
  ) => Promise<ApiResponse<void>>;
  getTaskMessages: (
    teamId: string,
    taskId: string
  ) => Promise<ApiResponse<Message[]>>;
  addTaskMessage: (
    teamId: string,
    taskId: string,
    message: string
  ) => Promise<ApiResponse<Message>>;
  updateTaskMessage: (
    teamId: string,
    taskId: string,
    messageId: string,
    message: string
  ) => Promise<ApiResponse<Message>>;
  deleteTaskMessage: (
    teamId: string,
    taskId: string,
    messageId: string
  ) => Promise<ApiResponse<void>>;
  clearCurrentTask: () => void;
}

// Document related types
export interface Document {
  accessLevel: any;
  department: any;
  link: string;
  _id: string;
  title: string;
  content: string;
  teamId: string | Team;
  createdBy: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  loading: boolean;
  error: string | null;
  createDocument: (
    teamId: string,
    documentData: CreateDocumentData
  ) => Promise<DocumentResponseResult>;
  getTeamDocuments: (teamId: string) => Promise<ResponseResult>;
  getDocumentById: (
    teamId: string,
    documentId: string
  ) => Promise<ResponseResult>;
  updateDocument: (
    teamId: string,
    documentId: string,
    documentData: UpdateDocumentData
  ) => Promise<ResponseResult>;
  deleteDocument: (
    teamId: string,
    documentId: string
  ) => Promise<ResponseResult>;
  clearCurrentDocument: () => void;
}

// Project related types
export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  status: string;
  members: ProjectMember[];
  milestones?: ProjectMilestone[];
  budget?: ProjectBudget;
  progress?: number;
  tags?: string[];
  repository?: string;
  technologies?: string[];
  files?: string[];
  isPrivate: boolean;
  teamId: string | Team;
  createdBy: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMember {
  userId: string | User;
  role: string;
}

export interface ProjectMilestone {
  _id?: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface ProjectBudget {
  total: number;
  spent: number;
  currency: string;
  items?: BudgetItem[];
}

export interface BudgetItem {
  description: string;
  amount: number;
  date: string;
}

export interface ProjectState {
  projects: Project[];
  teamProjects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  createProject: (
    teamId: string,
    projectData: CreateProjectData,
    files?: FileList
  ) => Promise<ProjectResponseResult>;
  getTeamProjects: (
    teamId: string,
    filters?: Record<string, any>
  ) => Promise<PaginatedResponseResult>;
  getUserProjects: (filters?: Record<string, any>) => Promise<ResponseResult>;
  getProjectById: (projectId: string) => Promise<ResponseResult>;
  updateProject: (
    projectId: string,
    projectData: UpdateProjectData,
    files?: FileList,
    removedUploads?: string[]
  ) => Promise<ResponseResult>;
  deleteProject: (projectId: string) => Promise<ResponseResult>;
  updateMilestoneStatus: (
    projectId: string,
    milestoneId: string,
    isCompleted: boolean
  ) => Promise<ResponseResult>;
  updateProjectBudget: (
    projectId: string,
    budgetData: UpdateBudgetData
  ) => Promise<ResponseResult>;
  clearCurrentProject: () => void;
}

// Event related types
export interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  endDate?: string;
  priority: "low" | "medium" | "high";
  attendees: EventAttendee[];
  status: string;
  isPublic: boolean;
  maxAttendees?: number;
  tags?: string[];
  files?: string[];
  reminders?: EventReminder[];
  teamId: string | Team;
  createdBy: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventAttendee {
  userId: string | User;
  status: "pending" | "accepted" | "declined";
}

export interface EventReminder {
  time: string;
  sent: boolean;
}

export interface EventState {
  events: Event[];
  teamEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  createEvent: (
    teamId: string,
    eventData: CreateEventData,
    files?: FileList
  ) => Promise<EventResponseResult>;
  getTeamEvents: (
    teamId: string,
    filters?: Record<string, any>
  ) => Promise<PaginatedResponseResult>;
  getUserEvents: (filters?: Record<string, any>) => Promise<ResponseResult>;
  getEventById: (eventId: string) => Promise<ResponseResult>;
  updateEvent: (
    eventId: string,
    eventData: UpdateEventData,
    files?: FileList,
    removedUploads?: string[]
  ) => Promise<ResponseResult>;
  deleteEvent: (eventId: string) => Promise<ResponseResult>;
  respondToEvent: (
    eventId: string,
    status: "accepted" | "declined"
  ) => Promise<ResponseResult>;
  clearCurrentEvent: () => void;
}

// Notification related types
export interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  userId: string;
  relatedTo?: string;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  clearNotifications: () => void;
}

// Common input data types
export interface RegisterUserData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  avatar?: File | string | null;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface CreateTeamData {
  name: string;
  department?: string;
  description?: string;
  avatar?: File;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  department?: string;
}

export interface AddTeamMemberData {
  name: string;
  department?: string;
  email: string;
  role?: string;
}

export interface UpdateTeamMemberData {
  name?: string;
  email?: string;
  department?: string;
  role: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  assignedTo?: string[];
  steps?: Omit<TaskStep, "_id">[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  assignedTo?: string[];
  steps?: TaskStep[];
}

export interface CreateDocumentData {
  title: string;
  link: string;
  department: string;
  team: string;
  contentType: string;
  accessLevel: string;
}

export interface UpdateDocumentData {
  title?: string;
  link?: string;
  department?: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority?: "low" | "medium" | "high";
  members?: ProjectMember[];
  milestones?: Omit<ProjectMilestone, "_id">[];
  budget?: ProjectBudget;
  tags?: string[];
  repository?: string;
  technologies?: string[];
  isPrivate?: boolean;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: "low" | "medium" | "high";
  status?: string;
  members?: ProjectMember[];
  milestones?: ProjectMilestone[];
  budget?: ProjectBudget;
  progress?: number;
  tags?: string[];
  repository?: string;
  technologies?: string[];
  isPrivate?: boolean;
}

export interface UpdateBudgetData {
  total?: number;
  spent?: number;
  currency?: string;
  items?: BudgetItem[];
}

export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  eventDate: string;
  endDate?: string;
  priority?: "low" | "medium" | "high";
  attendees?: string[];
  isPublic?: boolean;
  maxAttendees?: number;
  tags?: string[];
  reminders?: Omit<EventReminder, "sent">[];
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
  endDate?: string;
  priority?: "low" | "medium" | "high";
  attendees?: string[];
  status?: string;
  isPublic?: boolean;
  maxAttendees?: number;
  tags?: string[];
}

// Response types
export interface ResponseResult {
  success: boolean;
  error?: string;
}

export interface TeamResponseResult extends ResponseResult {
  team?: Team;
}

export interface TaskResponseResult extends ResponseResult {
  task?: Task;
}

export interface DocumentResponseResult extends ResponseResult {
  document?: Document;
}

export interface ProjectResponseResult extends ResponseResult {
  project?: Project;
}

export interface EventResponseResult extends ResponseResult {
  event?: Event;
}

export interface MessageResponseResult extends ResponseResult {
  message?: Message;
}

export interface MessagesResponseResult extends ResponseResult {
  messages?: Message[];
}

export interface MembersResponseResult extends ResponseResult {
  members?: TeamMember[];
}

export interface NotificationResponseResult extends ResponseResult {
  notifications?: Notification[];
}

export interface UsersResponseResult extends ResponseResult {
  users?: User[];
}

export interface PaginatedResponseResult extends ResponseResult {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Main store type that combines all stores
export interface StoreState {
  auth: AuthState;
  team: TeamState;
  notification: NotificationState;
  document: DocumentState;
  task: TaskState;
  event: EventState;
  project: ProjectState;
}
