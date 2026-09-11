import express from 'express';
import { getDb } from './src/db/connect.js';

const app = express();

app.use(express.json());

// ...your existing routes go here...

// TEMPORARY practice route - remove after verifying DB connection
app.get('/trails', async (req, res) => {
  try {
    const db = getDb();
    const trails = await db.collection('trails').find().toArray();
    res.json(trails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;