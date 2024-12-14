import express from 'express';
import userRouter from './routes/userRoutes';

const app = express();
app.use(express.json());

// Define the routes
app.use('/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
