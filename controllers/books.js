import { getDb } from '../src/db/connect.js';

const COLLECTION = 'books';
const AUTHORS_COLLECTION = 'authors';

const requiredBookFields = (body, includeId = false) => {
  const { id, authorId, title, publicationDate } = body;
  return (!includeId || typeof id === 'string' && id.trim())
    && typeof authorId === 'string' && authorId.trim()
    && typeof title === 'string' && title.trim()
    && typeof publicationDate === 'string' && publicationDate.trim();
};

const sendServerError = (res) => res.status(500).json({ error: 'Internal server error' });

export const getAllBooks = async (req, res) => {
  try {
    const books = await getDb().collection(COLLECTION).find().toArray();
    res.status(200).json(books);
  } catch (err) {
    sendServerError(res);
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await getDb()
      .collection(COLLECTION)
      .findOne({ id: id });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    sendServerError(res);
  }
};

export const createBook = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;
    if (!requiredBookFields(req.body, true)) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const db = getDb();
    if (await db.collection(COLLECTION).findOne({ id })) {
      return res.status(400).json({ error: 'Book id already exists' });
    }
    if (!await db.collection(AUTHORS_COLLECTION).findOne({ id: authorId })) {
      return res.status(400).json({ error: 'Author does not exist' });
    }
    const book = { id, authorId, title, publicationDate };
    await db.collection(COLLECTION).insertOne(book);
    res.status(201).json(book);
  } catch (err) {
    sendServerError(res);
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body;
    if (!requiredBookFields(req.body)) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const db = getDb();
    if (!await db.collection(COLLECTION).findOne({ id })) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (!await db.collection(AUTHORS_COLLECTION).findOne({ id: authorId })) {
      return res.status(400).json({ error: 'Author does not exist' });
    }
    const updatedBook = { id, authorId, title, publicationDate };
    await db.collection(COLLECTION).updateOne({ id }, { $set: updatedBook });
    res.status(200).json(updatedBook);
  } catch (err) {
    sendServerError(res);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getDb()
      .collection(COLLECTION)
      .deleteOne({ id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    sendServerError(res);
  }
};