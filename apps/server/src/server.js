import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json()); 

app.use('/api/users', userRoutes); 
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/sprints', sprintRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
