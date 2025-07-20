# Reso Working Dashboard

## Overview

Reso Working Dashboard is a comprehensive project management platform designed to help teams collaborate effectively. The application facilitates team creation, project management, task assignment, document sharing, and event planning in one centralized location.

## Features

### Team Management

- Create and manage teams with custom roles (admin, member)
- Invite team members via email
- Team profiles with avatars, department information, and descriptions

### Project Management

- Create detailed projects with descriptions, timelines, and priorities
- Assign team members to projects with specific roles
- Track project progress through milestones
- Monitor project budgets with allocated and spent amounts
- Tag projects and add repository links
- Upload and manage project files

### Task Management

- Create tasks with descriptions, due dates, and priority levels
- Assign tasks to team members
- Track task status (todo, in_progress, done)
- Break down tasks into steps/subtasks
- Discussion threads for each task
- File attachments for tasks

### Document Management

- Share important documents with team members
- Organize documents by department

### User Management

- User profiles with avatars
- In-app notifications
- Email notifications for important updates

## Tech Stack

### Frontend

- React with TypeScript
- Zustand for state management
- Framer Motion for animations
- Tailwind CSS for styling

### Backend

- Node.js with Express
- MongoDB with Mongoose for data modeling
- JWT for authentication
- Multer for file uploads
- ImageKit for image storage

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB database
- ImageKit account for image storage

### Environment Variables

#### Backend

Create a `.env` file in the backend directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# ImageKit configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Email configuration
SMTP_HOST=your_smtp_host
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@resodashboard.com
```

#### Frontend

Create a `.env` file in the project root with:

```
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/reso-working-dashboard.git
   cd reso-working-dashboard
   ```

2. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the backend server:

   ```
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:

   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

#### Production Mode

1. Build the frontend:

   ```
   npm run build
   ```

2. Start the production server:
   ```
   cd backend
   npm start
   ```

## API Documentation

The backend provides a RESTful API with the following endpoints:

### Authentication

- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Log in a user
- GET `/api/users/me` - Get current user profile
- POST `/api/users/logout` - Log out current user

### Teams

- POST `/api/teams` - Create a new team
- GET `/api/teams` - Get user's teams
- GET `/api/teams/:id` - Get a specific team
- PUT `/api/teams/:id` - Update a team
- DELETE `/api/teams/:id` - Delete a team

### Team Members

- GET `/api/teams/:id/members` - Get team members
- POST `/api/teams/:id/members` - Add a team member
- PUT `/api/teams/:id/members/:memberId` - Update a team member
- DELETE `/api/teams/:id/members/:memberId` - Remove a team member

### Projects

- POST `/api/projects/teams/:teamId/projects` - Create a new project
- GET `/api/projects/teams/:teamId/projects` - Get team projects
- GET `/api/projects/projects/my-projects` - Get user projects
- GET `/api/projects/projects/:projectId` - Get a specific project
- PUT `/api/projects/projects/:projectId` - Update a project
- DELETE `/api/projects/projects/:projectId` - Delete a project
- PATCH `/api/projects/projects/:projectId/milestones/:milestoneId` - Update milestone status
- PATCH `/api/projects/projects/:projectId/budget` - Update project budget

### Tasks

- POST `/api/tasks/teams/:teamId/tasks` - Create a new task
- GET `/api/tasks/teams/:teamId/tasks` - Get team tasks
- GET `/api/tasks/mytasks` - Get user's assigned tasks
- GET `/api/tasks/teams/:teamId/tasks/:taskId` - Get a specific task
- PUT `/api/tasks/teams/:teamId/tasks/:taskId` - Update a task
- DELETE `/api/tasks/teams/:teamId/tasks/:taskId` - Delete a task

### Documents

- POST `/api/documents/teams/:teamId/documents` - Upload a new document
- GET `/api/documents/teams/:teamId/documents` - Get team documents
- DELETE `/api/documents/:id` - Delete a document

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
