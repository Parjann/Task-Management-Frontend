# 🚀 Task Management System – Frontend

A production-ready Task Management System frontend built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit**, and **RTK Query**.

The application provides a responsive interface for managing projects, tasks, subtasks, comments, labels, team collaboration, authentication, notifications, and user preferences.

The frontend was implemented based on the provided Figma design with a focus on design fidelity, reusable components, responsive layouts, maintainable architecture, and API-driven state management.

---

# 🌐 Live Application

### Production Frontend

https://task-management-frontend-three-dusky.vercel.app

### Production Backend API

https://task-management-backend-d5pm.onrender.com

### Swagger API Documentation

https://task-management-backend-d5pm.onrender.com/api/docs

---

# 🔗 Related Repository

The backend is maintained in a separate repository.

### Frontend Repository

https://github.com/Parjann/Task-Management-Frontend

### Backend Repository

https://github.com/Parjann/Task-Management-Backend

---

# 🎨 Figma Design

The application UI was implemented based on the provided assessment Figma design.

The implementation focuses on:

- Layout fidelity
- Typography
- Spacing
- Colors
- Buttons and controls
- Responsive behavior
- Reusable UI components
- Theme support
- Interactive states
- Authentication screens
- Dashboard and task-management interfaces

---

# ✨ Features

## 🔐 Authentication

- Google Authentication using Firebase
- Guest Login
- JWT-based authentication
- Protected application routes
- Persistent authentication state
- Secure API authentication using Bearer tokens

---

## 📊 Dashboard

- Dashboard overview
- Project information
- Task information
- Activity information
- Quick actions
- Responsive dashboard layout

---

## 📁 Project Management

- Create projects
- View projects
- Update projects
- Delete projects
- Project members
- Project-specific task management

---

## ✅ Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Task status
- Task priority
- Assignees
- Due dates
- Search
- Filtering
- Kanban board
- List view
- Drag-and-drop task movement
- Task details

---

## 📝 Subtasks

- Create subtasks
- Update subtasks
- Delete subtasks
- Track subtasks within tasks

---

## 🏷️ Labels

- Task labels
- Label-based filtering
- Label management

---

## 💬 Comments

- Add comments
- View comments
- Delete comments
- Activity updates associated with comments

---

## 🔔 Notifications

- Notification center
- Notification state management
- Firebase integration for push notifications

---

## 👤 User Settings

- User profile
- Theme preferences
- Accent color preferences
- Account settings

---

## 🎨 Theme Support

The application supports theme preferences and persists the selected preference across page refreshes.

---

## 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The layouts and reusable components adapt to different screen sizes while maintaining the visual structure of the provided Figma design.

---

# ⚡ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React Framework |
| App Router | Application Routing |
| React 19 | UI Library |
| TypeScript | Programming Language |
| Tailwind CSS | Styling |
| Base UI / UI Components | Reusable Interface Components |
| Redux Toolkit | Client State Management |
| RTK Query | Server State & API Management |
| React Hook Form | Form Management |
| Zod | Schema Validation |
| Firebase | Google Authentication & Push Notifications |
| Socket.IO Client | Real-Time Communication |
| Framer Motion | Animations |
| Sonner | Toast Notifications |
| DnD Kit | Drag & Drop |
| Recharts | Data Visualization |

---

# 🧠 State Management

The application uses **Redux Toolkit** and **RTK Query** for state management.

## Redux Toolkit

Redux Toolkit is used for application-level client state such as:

- Authentication state
- UI state
- User preferences
- Application configuration
- Other shared client-side state

## RTK Query

RTK Query is used for server state and API communication.

It handles:

- API requests
- Loading states
- Error states
- Response caching
- Automatic refetching
- Cache invalidation
- Authentication headers

### API State Architecture

```text
React Components
       │
       ▼
RTK Query Hooks
       │
       ▼
API Endpoints
       │
       ▼
NestJS REST API
       │
       ▼
PostgreSQL

---

# 📂 Planned Project Structure

```text
src/

├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── common/
│   └── layout/
│
├── features/
│   ├── auth/
│   ├── projects/
│   ├── tasks/
│   ├── comments/
│   ├── labels/
│   ├── notifications/
│   ├── activity/
│   ├── attachments/
│   ├── invitations/
│   ├── settings/
│   └── search/
│
├── store/
│   ├── api/
│   ├── hooks.ts
│   └── store.ts
│
├── hooks/
├── providers/
├── lib/
├── constants/
├── types/
├── utils/
└── styles/
```

---

# 🏗 Planned Architecture

```text
Next.js App Router

        │

        ▼

Reusable Components

        │

        ▼

Feature Modules

        │

        ▼

Redux Toolkit

        │

        ▼

RTK Query

        │

        ▼

NestJS REST API

        │

        ▼

PostgreSQL
```

---

# 🔌 Backend API

Backend Repository

https://github.com/Parjann/task-management-backend

Production API

https://task-management-backend-d5pm.onrender.com

Swagger Documentation

https://task-management-backend-d5pm.onrender.com/api/docs

---

# ⚙️ Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001

NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/Parjann/task-management-frontend.git

cd task-management-frontend
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:3000
```

---

# 📦 Main Dependencies

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Redux Toolkit
- RTK Query
- Axios
- React Hook Form
- Zod
- Socket.IO Client
- Framer Motion
- Sonner
- DnD Kit
- Recharts
- Firebase

---

# 📱 Planned Pages

- Login
- Register
- Guest Login
- Dashboard
- Projects
- Project Details
- Kanban Board
- Task Details
- Notifications
- Activity
- Settings
- Profile

---

# 🎯 Planned Features

- [ ] Authentication
- [ ] Dashboard
- [ ] Project Management
- [ ] Task Management
- [ ] Kanban Board
- [ ] Comments
- [ ] Labels
- [ ] Attachments
- [ ] Notifications
- [ ] Real-Time Updates
- [ ] Push Notifications
- [ ] Theme Support
- [ ] Responsive Design
- [ ] Dark Mode
- [ ] Accessibility
- [ ] Performance Optimization
- [ ] Deployment

---

# 📸 Screenshots

Coming Soon

---

# 🏗 Architecture

Coming Soon

---

# 🗄 Database ER Diagram

Coming Soon

---

# 🎥 Demo

Coming Soon

---

# 👨‍💻 Author

**Parjan Hussain**

GitHub

https://github.com/Parjann

---

# 📄 License

This project is licensed under the MIT License.