import express from 'express';
import userRoutes from './routes/userRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js'
import projectRoutes from './routes/projectRoutes.js';

const app = express();

app.use(express.json()); 



app.use('/api/users', userRoutes); 
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes); 
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// // Graceful shutdown for Prisma
// process.on('SIGTERM', async () => {
//   await prisma.$disconnect();
//   process.exit(0);
// });