import express from 'express';
import booksRoutes from './routes/books.js';
import authorsRoutes from './routes/authors.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';

const app = express();
app.use(express.json());

app.use('/books', booksRoutes);
app.use('/authors', authorsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Books API is running' });
});

export default app;