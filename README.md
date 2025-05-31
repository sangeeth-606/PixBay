# PixBay

## Project Name: PixBay

### What It Is

PixBay Workspace is an all-in-one collaborative platform designed for teams to manage projects, collaborate in real-time, and access a suite of powerful tools. It combines video conferencing, interactive whiteboards, real-time chat, project management, documentation, and more into a single, unified workspace.

Inspired by tools like Notion, Atlassian(jira), and Kanban boards, PixBay is tailored for small to medium-sized teams—especially remote or distributed ones—offering a seamless and engaging experience with unique features like a virtual office space, AI assistance, and gamification.

---

## Features

### Real-Time Collaboration Tools

- **Video Conferencing**: Host meetings for up to 10 users per room with one-click access using WebRTC.
- **Interactive Whiteboard**: Collaborate on a shared canvas with real-time synchronization, powered by Fabric.js.
- **Real-Time Chat**: Communicate instantly with team members within project rooms.
- **AI-Assisted Drawing (Optional)**: Get AI-powered suggestions to enhance whiteboard sketches.
- **PDF Export**: Export whiteboard sessions or other content as PDFs for easy sharing.

### Project Management

- **Kanban Boards**: Organize tasks with drag-and-drop functionality for streamlined workflows.
- **Task Assignments & Deadlines**: Assign tasks to team members and set due dates.
- **Project Overview**: Monitor progress with stats like task completion rates and upcoming deadlines.

### Documentation Hub

- **Notion-Like Editor**: Create, edit, and share notes, wikis, and meeting summaries with rich text support and real-time collaboration.

### Additional Tools

- **Calendar Integration**: Schedule meetings, track deadlines, and view team events.
- **Member Management**: Manage team roles, statuses, and contact details.
- **Inbox for Notifications**: Receive updates on tasks, messages, and project alerts.
- **Customizable Dashboard**: Arrange widgets (e.g., task lists, project stats, member activity) to fit your workflow.

---

## Unique Features

- **Virtual Office Space**: Navigate an immersive environment with project "rooms" for a connected remote experience.
- **AI Assistance**: Access AI-powered meeting summaries and task suggestions.
- **Gamification**: Earn rewards and badges for task completion and team engagement.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Fabric.js (for whiteboard)
- PeerJS (for WebRTC video calls)
- Socket.IO-client (for real-time communication)
- Clerk (for authentication)
- Tailwind CSS (for styling)

### Backend

- Node.js
- Express
- Socket.IO (for real-time features)
- Prisma (for database ORM)
- PostgreSQL (database)

### Deployment

- Vercel (frontend)
- Render (backend)

### Monorepo Management

- Turborepo

---

## Daily Plan with Timelines

Given the expanded scope, the original 2-3 week sprint has been revised to a 6-week timeline, assuming ~3-4 hours/day.

### **Weeks 1-2: Foundation & Core Features**

- Set up the monorepo with Turborepo, initialize frontend (React, TypeScript) and backend (Node.js, Express).
- Implement authentication using Clerk.
- Configure the database with PostgreSQL and Prisma.
- Develop the room system with unique codes for project spaces.
- Integrate basic video calls using WebRTC and PeerJS.
- Add the interactive whiteboard with Fabric.js and real-time sync via Socket.IO.
- Implement real-time chat within rooms.

### **Weeks 3-4: Expanded Features**

- Build project management tools: Kanban boards, task assignments, and deadlines.
- Develop the documentation system with a Notion-like editor supporting rich text and real-time collaboration.
- Add calendar integration for scheduling and deadline tracking.
- Implement member management and an inbox for notifications.
- Create a customizable dashboard with widgets for tasks, projects, and team activity.

---

## Why PixBay?

PixBay Workspace builds on the original idea of real-time collaboration (video, whiteboard, chat) and elevates it into a comprehensive platform. It draws inspiration from Notion’s documentation, Atlassian’s project management, and Kanban-style workflows, while adding unique elements like:

- A virtual office space for an immersive team experience.
- AI-powered tools to boost productivity.
- Gamification to keep teams engaged.

It’s designed for small to medium-sized teams who need an all-in-one solution for remote or distributed work, eliminating the need to juggle multiple tools.
