import { ObjectId } from 'mongodb';
import { getDb } from '../src/db/connect.js';

const COLLECTION = 'books';

// GET all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await getDb().collection(COLLECTION).find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single book
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const book = await getDb()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create
export const createBook = async (req, res) => {
  try {
    const { title, author, year, genre } = req.body;
    if (!title || !author || !year || !genre) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const result = await getDb().collection(COLLECTION).insertOne({
      title, author, year, genre,
    });
    res.status(201).json({ _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
    const { title, author, year, genre } = req.body;
    const result = await getDb()
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, author, year, genre } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
    const result = await getDb()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};