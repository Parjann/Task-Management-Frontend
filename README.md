# 🚀 Task Management System – Frontend

A modern, production-ready Task Management frontend built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit**, and **RTK Query**.

The application provides a clean and responsive interface for managing projects, tasks, team collaboration, notifications, and real-time updates while following modern React and Next.js best practices.

---

# 🌐 Live Demo

Coming Soon

---

# 🎨 Figma Design

The frontend is being developed by following the provided **Figma design** as closely as possible with pixel-perfect implementation.

---

# ✨ Planned Features

## Authentication

- JWT Authentication
- Login
- Register
- Guest Login
- Protected Routes

---

## Dashboard

- Dashboard Overview
- Statistics
- Recent Activity
- Quick Actions

---

## Project Management

- Project List
- Create Project
- Update Project
- Delete Project
- Project Members
- Invitations

---

## Task Management

- Kanban Board
- Drag & Drop
- Task Details
- Labels
- Due Dates
- Priorities
- Attachments
- Comments

---

## Notifications

- Real-Time Notifications
- Push Notifications
- Notification Center

---

## User Settings

- Profile
- Theme Preferences
- Accent Color
- Account Settings

---

# ⚡ Tech Stack

| Technology | Purpose |
|------------|----------|
| Next.js 15 | React Framework |
| React 19 | UI Library |
| TypeScript | Language |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Redux Toolkit | State Management |
| RTK Query | API Layer |
| React Hook Form | Forms |
| Zod | Validation |
| Socket.IO Client | Real-Time Communication |
| Framer Motion | Animations |
| Sonner | Toast Notifications |
| DnD Kit | Drag & Drop |
| Recharts | Charts |
| Firebase | Push Notifications |

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