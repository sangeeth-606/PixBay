import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js";
import { roomSockets } from './sockets/roomSockets.js';
import { Server } from 'socket.io';
import http from 'http';
import { ExpressPeerServer } from 'peer';

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json()); 

const io = new Server(server, {
  cors: {
    origin:  'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
  path: '/socket.io',
  // transports: ['websocket', 'polling'], // Polling works, WebSocket supported
});

console.log('Socket.IO server initialized');
io.on('connection', (socket) => {
  console.log('Socket.IO connection:', socket.id, 'Transport:', socket.conn.transport.name);
});

roomSockets(io);

app.use('/api/users', userRoutes); 
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/sprints', sprintRoutes);
app.use('/api/roadmap',roadmapRoutes)
app.use("/api/notifications", notificationRoutes);

const peerServer = ExpressPeerServer(server, { path: '/', debug: true });
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
