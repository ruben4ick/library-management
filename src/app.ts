import express from 'express';
import bookRoutes from './routes/book.routes';
import userRoutes from './routes/user.routes';
import loanRoutes from './routes/loan.routes';

const app = express();

app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

export default app;
