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





// import React, { useState } from "react";
// import { CalendarDays } from "lucide-react";
// import { motion } from "framer-motion"; // Add framer-motion import

// // Type definitions based on your schema
// type SprintStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
// type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";
// type TaskType = "TASK" | "BUG" | "STORY" | "EPIC";
// type Priority = "HIGH" | "MEDIUM" | "LOW";

// interface Task {
//   id: string;
//   key: string;
//   title: string;
//   type: TaskType;
//   status: TaskStatus;
//   priority: Priority;
//   storyPoints: number;
//   assignee?: {
//     id: string;
//     name: string;
//     initials: string;
//   };
// }

// interface Sprint {
//   id: string;
//   name: string;
//   goal?: string;
//   status: SprintStatus;
//   startDate: Date;
//   endDate: Date;
//   progress: number;
//   tasks: Task[];
//   totalStoryPoints: number;
//   completedStoryPoints: number;
// }

// interface SprintProps {
//   sprintId: string;
// }

// const Sprint: React.FC<SprintProps> = ({ sprintId }) => {
//   // This would come from your API in a real app
//   const [sprint, setSprint] = useState<Sprint>({
//     id: sprintId,
//     name: "Sprint 1 (Current)",
//     goal: "Complete the user authentication flow and dashboard UI",
//     status: "ACTIVE",
//     startDate: new Date("2025-04-01"),
//     endDate: new Date("2025-04-14"),
//     progress: 65,
//     tasks: [
//       {
//         id: "1",
//         key: "PIX-101",
//         title: "Implement login form validation",
//         type: "TASK",
//         status: "DONE",
//         priority: "HIGH",
//         storyPoints: 3,
//         assignee: {
//           id: "as1",
//           name: "Alice Smith",
//           initials: "AS",
//         },
//       },
//       {
//         id: "2",
//         key: "PIX-102",
//         title: "Create dashboard layout",
//         type: "TASK",
//         status: "IN_PROGRESS",
//         priority: "MEDIUM",
//         storyPoints: 5,
//         assignee: {
//           id: "bj1",
//           name: "Bob Johnson",
//           initials: "BJ",
//         },
//       },
//       {
//         id: "3",
//         key: "PIX-103",
//         title: "Implement password reset flow",
//         type: "TASK",
//         status: "TODO",
//         priority: "MEDIUM",
//         storyPoints: 3,
//         assignee: {
//           id: "cb1",
//           name: "Charlie Brown",
//           initials: "CB",
//         },
//       },
//     ],
//     totalStoryPoints: 11,
//     completedStoryPoints: 3,
//   });

//   // Calculate task counts by status
//   const taskCounts = {
//     todo: sprint.tasks.filter((task) => task.status === "TODO").length,
//     inProgress: sprint.tasks.filter((task) => task.status === "IN_PROGRESS")
//       .length,
//     done: sprint.tasks.filter((task) => task.status === "DONE").length,
//   };

//   const formatDate = (date: Date): string => {
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getStatusBadgeClass = (status: SprintStatus) => {
//     switch (status) {
//       case "ACTIVE":
//         return "bg-emerald-500 text-white";
//       case "PLANNING":
//         return "bg-blue-500 text-white";
//       case "COMPLETED":
//         return "bg-green-500 text-white";
//       case "CANCELLED":
//         return "bg-gray-500 text-white";
//       default:
//         return "bg-gray-500 text-white";
//     }
//   };

//   const getPriorityBadgeClass = (priority: Priority) => {
//     switch (priority) {
//       case "HIGH":
//         return "bg-red-500 text-white";
//       case "MEDIUM":
//         return "bg-yellow-500 text-white";
//       case "LOW":
//         return "bg-blue-500 text-white";
//       default:
//         return "bg-gray-500 text-white";
//     }
//   };

//   const getStatusClass = (status: TaskStatus) => {
//     switch (status) {
//       case "TODO":
//         return "bg-gray-200 text-gray-800";
//       case "IN_PROGRESS":
//         return "bg-blue-200 text-blue-800";
//       case "DONE":
//         return "bg-emerald-200 text-emerald-800";
//       case "ARCHIVED":
//         return "bg-gray-200 text-gray-800";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     initial: { opacity: 0 },
//     animate: { opacity: 1, transition: { duration: 0.5 } },
//   };

//   const itemVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
//   };

//   return (
//     <motion.div
//       className="bg-[#171717] text-white p-6 rounded-md w-full"
//       initial="initial"
//       animate="animate"
//       variants={containerVariants}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">{sprint.name}</h1>
//           <h1>{sprintId}</h1>
//           <div className="flex items-center mt-1">
//             <span
//               className={`text-xs px-2 py-1 rounded-md mr-2 ${getStatusBadgeClass(sprint.status)}`}
//             >
//               {sprint.status}
//             </span>
//             <span className="text-sm text-gray-400 flex items-center">
//               <CalendarDays className="h-4 w-4 mr-1" />
//               {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
//             </span>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <motion.button
//             className="px-4 py-2 rounded-md bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white transition-colors"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             Edit Sprint
//           </motion.button>
//           <motion.button
//             className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             Start Sprint
//           </motion.button>
//         </div>
//       </div>

//       <motion.div
//         className="bg-[#2C2C2C] p-6 rounded-md mb-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
//         variants={itemVariants}
//       >
//         <h2 className="text-lg font-semibold mb-2">Sprint Goal</h2>
//         <p className="text-gray-300">
//           {sprint.goal || "No goal set for this sprint"}
//         </p>
//       </motion.div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <motion.div
//           className="bg-[#2C2C2C] p-6 rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
//           variants={itemVariants}
//         >
//           <h3 className="text-sm font-medium text-gray-400 mb-2">Progress</h3>
//           <div className="w-full bg-[#171717] rounded-full h-2 mb-2">
//             <div
//               className="bg-emerald-500 h-2 rounded-full"
//               style={{ width: `${sprint.progress}%` }}
//             ></div>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span>{sprint.progress}% complete</span>
//             <span>120% time elapsed</span>
//           </div>
//         </motion.div>

//         <motion.div
//           className="bg-[#2C2C2C] p-6 rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
//           variants={itemVariants}
//         >
//           <h3 className="text-sm font-medium text-gray-400 mb-2">
//             Story Points
//           </h3>
//           <div className="flex items-baseline">
//             <span className="text-2xl font-bold mr-2">
//               {sprint.completedStoryPoints}
//             </span>
//             <span className="text-gray-400">/ {sprint.totalStoryPoints}</span>
//           </div>
//           <div className="text-sm text-gray-400 mt-1">
//             {Math.round(
//               (sprint.completedStoryPoints / sprint.totalStoryPoints) * 100
//             )}
//             % completed
//           </div>
//         </motion.div>

//         <motion.div
//           className="bg-[#2C2C2C] p-6 rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]"
//           variants={itemVariants}
//         >
//           <h3 className="text-sm font-medium text-gray-400 mb-2">Issues</h3>
//           <div className="flex justify-between">
//             <div className="text-center">
//               <div className="text-2xl font-bold">{taskCounts.todo}</div>
//               <div className="text-sm text-gray-400">To Do</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold">{taskCounts.inProgress}</div>
//               <div className="text-sm text-gray-400">In Progress</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold">{taskCounts.done}</div>
//               <div className="text-sm text-gray-400">Done</div>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <div className="mb-6">
//         <div className="flex space-x-2 border-b border-[#2C2C2C]">
//           <motion.button
//             className="px-4 py-2 border-b-2 border-emerald-500 font-medium"
//             whileHover={{ y: -2 }}
//             transition={{ duration: 0.2 }}
//           >
//             Issues
//           </motion.button>
//           <motion.button
//             className="px-4 py-2 text-gray-400 hover:text-white"
//             whileHover={{ y: -2 }}
//             transition={{ duration: 0.2 }}
//           >
//             Burndown Chart
//           </motion.button>
//           <motion.button
//             className="px-4 py-2 text-gray-400 hover:text-white"
//             whileHover={{ y: -2 }}
//             transition={{ duration: 0.2 }}
//           >
//             Board
//           </motion.button>
//         </div>
//       </div>

//       <motion.div className="overflow-x-auto" variants={itemVariants}>
//         <table className="min-w-full bg-[#2C2C2C] rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_1px_0_rgba(255,255,255,0.05)]">
//           <thead>
//             <tr className="text-left text-gray-400 text-sm">
//               <th className="py-3 px-4">Key</th>
//               <th className="py-3 px-4">Summary</th>
//               <th className="py-3 px-4">Type</th>
//               <th className="py-3 px-4">Priority</th>
//               <th className="py-3 px-4">Status</th>
//               <th className="py-3 px-4">Assignee</th>
//               <th className="py-3 px-4">Story Points</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#3C3C3C]">
//             {sprint.tasks.map((task) => (
//               <motion.tr
//                 key={task.id}
//                 className="hover:bg-[#3C3C3C] transition-colors"
//                 whileHover={{ backgroundColor: "#3C3C3C" }}
//               >
//                 <td className="py-3 px-4 font-medium">{task.key}</td>
//                 <td className="py-3 px-4">{task.title}</td>
//                 <td className="py-3 px-4">
//                   <span className="flex items-center text-gray-400">
//                     <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
//                     {task.type}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4">
//                   <span
//                     className={`text-xs px-2 py-1 rounded-md ${getPriorityBadgeClass(task.priority)}`}
//                   >
//                     {task.priority}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4">
//                   <span
//                     className={`text-xs px-2 py-1 rounded-md ${getStatusClass(task.status)}`}
//                   >
//                     {task.status === "IN_PROGRESS"
//                       ? "IN_PROGRESS"
//                       : task.status}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4">
//                   {task.assignee && (
//                     <div className="flex items-center">
//                       <span className="w-6 h-6 bg-[#3C3C3C] rounded-full flex items-center justify-center text-xs mr-2">
//                         {task.assignee.initials}
//                       </span>
//                       <span>{task.assignee.name}</span>
//                     </div>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">{task.storyPoints}</td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Sprint;