
**PixBay**

**Idea Brief**  
**Project Name:** PixBay
**What It Is:** A web app for real-time team collaboration with video calls, an interactive whiteboard, real-time chat, and (ptional-AI-assisted drawing). It supports up to 10 users per room and exports whiteboard content as PDFs. It’s like Zoom meets Excalidraw with a chat twist—perfect for brainstorming or meetings.  


**Tech Stack:**  
- Frontend: React, TypeScript, Fabric.js, PeerJS, Socket.IO-client, Clerk, Tailwind CSS  
- Backend: Node.js, Express, Socket.IO, Prisma, PostgreSQL  
- Deployment: Vercel, Render  
- Monorepo: Turborepo  

**Daily Plan with Timelines**  
Assuming a 2-3 week sprint, ~3-4 hours/day. Basic plan below:  

**Days 1-5: Setup & Core Structure**  
- Set up monorepo, frontend, backend, auth (Clerk), and database (PostgreSQL).  
- Get basic video calls working with WebRTC.  

**Days 6-10: Collaboration Features**  
- Add whiteboard with Fabric.js and real-time sync via Socket.IO.  
- Plug in chat (got code ready) and room system.  

**Days 11-15: AI & Polish**  
- Add simple AI for whiteboard drawing help.  
- Build PDF export, style with Tailwind, and test with multiple users.  

**Days 16-20: Testing & Deployment**  
- Test video, chat, and whiteboard for 10 users.  
- Deploy to Vercel (frontend) and Render (backend), prep demo.  

