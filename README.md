# PixBay Workspace

[Client](https://www.pixbay.space/)
[Server](https://kalpixbay.onrender.com)

PixBay Workspace is an all-in-one collaborative platform designed for teams to manage projects, collaborate in real-time, and access a suite of powerful tools. It combines video conferencing, interactive whiteboards, real-time chat, project management, and documentation into a single, unified workspace.

Inspired by tools like Notion, Jira, and Kanban, PixBay is tailored for small to medium-sized teams—especially remote or distributed ones—offering a seamless and engaging experience with unique features like a virtual office space and AI assistance.

## ✨ Features

- **Real-Time Collaboration**:
  - **Video Conferencing**: Host meetings for up to 10 users per room with one-click access using WebRTC.
  - **Interactive Whiteboard**: Collaborate on a shared canvas with real-time synchronization.
  - **Real-Time Chat**: Communicate instantly with team members within project rooms.
- **Project Management**:
  - **Kanban Boards**: Organize tasks with drag-and-drop functionality.
  - **Task Assignments & Deadlines**: Assign tasks and set due dates.
  - **Project Overview**: Monitor progress with stats and deadlines.
- **Additional Tools**:
  - **Calendar Integration**: Schedule meetings and track deadlines.
  - **Member Management**: Manage team roles and statuses.
  - **Notification Inbox**: Receive updates on tasks and messages.
  - **Customizable Dashboard**: Arrange widgets to fit your workflow.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Database**: PostgreSQL, Prisma
- **Authentication**: Clerk
- **Real-Time**: WebRTC (PeerJS), Socket.IO
- **Monorepo**: Turborepo

## 📦 Monorepo Structure

This project is a monorepo managed by Turborepo.

- `apps/client`: The React frontend application.
- `apps/server`: The Node.js backend server.
- `packages/ui`: Shared UI components.
- `packages/typescript-config`: Shared TypeScript configurations.
- `packages/eslint-config`: Shared ESLint configurations.

## 🏁 Getting Started

For detailed instructions on setting up and running the application using Docker, please refer to the [docker.md](docker.md) file.

## 🔧 Available Scripts

- `npm run dev`: Start the development servers for all apps.
- `npm run build`: Build all apps for production.
- `npm run lint`: Lint all apps.
- `npm run format`: Format the codebase with Prettier.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.


