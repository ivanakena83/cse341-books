import express from 'express';
import booksRoutes from './routes/books.js';

const app = express();
app.use(express.json());

app.use('/books', booksRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Books API is running' });
});

export default app;