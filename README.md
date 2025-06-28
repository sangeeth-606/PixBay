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

### Prerequisites

- Node.js (v18 or higher)
- npm (v9.2.0 or higher)
- Docker (for PostgreSQL)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pixbay.git
    cd pixbay
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in `apps/server` and add the necessary environment variables (e.g., database URL, Clerk keys).

4.  **Start the development servers:**
    ```bash
    npm run dev
    ```

This will start the frontend and backend applications in development mode.

## 🔧 Available Scripts

- `npm run dev`: Start the development servers for all apps.
- `npm run build`: Build all apps for production.
- `npm run lint`: Lint all apps.
- `npm run format`: Format the codebase with Prettier.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📝 License

This project is licensed under the MIT License.