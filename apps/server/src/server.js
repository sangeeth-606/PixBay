import express from 'express';
import userRoute from './routes/userRoutes.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users', userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});