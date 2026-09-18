import { getDb } from '../src/db/connect.js';

const COLLECTION = 'authors';

const validAuthor = ({ id, name, birthYear }, includeId = false) =>
  (!includeId || typeof id === 'string' && id.trim())
  && typeof name === 'string' && name.trim()
  && typeof birthYear === 'number' && Number.isFinite(birthYear);

const sendServerError = (res) => res.status(500).json({ error: 'Internal server error' });

export const getAllAuthors = async (req, res) => {
  try {
    res.status(200).json(await getDb().collection(COLLECTION).find().toArray());
  } catch (err) {
    sendServerError(res);
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await getDb().collection(COLLECTION).findOne({ id: req.params.id });
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json(author);
  } catch (err) {
    sendServerError(res);
  }
};

export const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;
    if (!validAuthor(req.body, true)) return res.status(400).json({ error: 'All fields are required' });
    const db = getDb();
    if (await db.collection(COLLECTION).findOne({ id })) {
      return res.status(400).json({ error: 'Author id already exists' });
    }
    const author = { id, name, birthYear };
    await db.collection(COLLECTION).insertOne(author);
    res.status(201).json(author);
  } catch (err) {
    sendServerError(res);
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { name, birthYear } = req.body;
    if (!validAuthor({ name, birthYear })) return res.status(400).json({ error: 'All fields are required' });
    const db = getDb();
    if (!await db.collection(COLLECTION).findOne({ id: req.params.id })) {
      return res.status(404).json({ error: 'Author not found' });
    }
    const author = { id: req.params.id, name, birthYear };
    await db.collection(COLLECTION).updateOne({ id: req.params.id }, { $set: { name, birthYear } });
    res.status(200).json(author);
  } catch (err) {
    sendServerError(res);
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const db = getDb();
    if (!await db.collection(COLLECTION).findOne({ id: req.params.id })) {
      return res.status(404).json({ error: 'Author not found' });
    }
    if (await db.collection('books').findOne({ authorId: req.params.id })) {
      return res.status(409).json({ error: 'Author still has books' });
    }
    await db.collection(COLLECTION).deleteOne({ id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    sendServerError(res);
  }
};