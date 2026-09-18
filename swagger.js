const bookSchema = {
  type: 'object',
  required: ['id', 'authorId', 'title', 'publicationDate'],
  properties: {
    id: { type: 'string', example: 'b1' },
    authorId: { type: 'string', example: 'a1' },
    title: { type: 'string', example: 'Example Book Title' },
    publicationDate: { type: 'string', example: '2026-01-15' },
  },
};

const authorSchema = {
  type: 'object',
  required: ['id', 'name', 'birthYear'],
  properties: {
    id: { type: 'string', example: 'a1' },
    name: { type: 'string', example: 'Example Author' },
    birthYear: { type: 'number', example: 1980 },
  },
};

const bookUpdateSchema = {
  type: 'object',
  required: ['authorId', 'title', 'publicationDate'],
  properties: {
    authorId: { type: 'string', example: 'a2' },
    title: { type: 'string', example: 'Updated Book Title' },
    publicationDate: { type: 'string', example: '2026-02-20' },
  },
};

const authorUpdateSchema = {
  type: 'object',
  required: ['name', 'birthYear'],
  properties: {
    name: { type: 'string', example: 'Updated Author' },
    birthYear: { type: 'number', example: 1981 },
  },
};

const errorSchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
};

const jsonResponse = (description, schema) => ({
  description,
  content: { 'application/json': { schema } },
});

const errorResponse = (description) => jsonResponse(description, { $ref: '#/components/schemas/Error' });

const bookRequest = {
  required: true,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
};

const authorRequest = {
  required: true,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Author' } } },
};

export default {
  openapi: '3.0.3',
  info: {
    title: 'CSE 341 Books API',
    version: '2.0.0',
    description: 'Book and author CRUD API for Week 02.',
  },
  servers: [{ url: '/' }],
  paths: {
    '/books': {
      get: {
        summary: 'List books',
        responses: {
          200: jsonResponse('Books', { type: 'array', items: { $ref: '#/components/schemas/Book' } }),
          500: errorResponse('Server error'),
        },
      },
      post: {
        summary: 'Create a book',
        requestBody: bookRequest,
        responses: {
          201: jsonResponse('Created book', { $ref: '#/components/schemas/Book' }),
          400: errorResponse('Invalid request'),
          500: errorResponse('Server error'),
        },
      },
    },
    '/books/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        summary: 'Get a book',
        responses: {
          200: jsonResponse('Book', { $ref: '#/components/schemas/Book' }),
          404: errorResponse('Book not found'),
          500: errorResponse('Server error'),
        },
      },
      put: {
        summary: 'Update a book',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BookUpdate' } } },
        },
        responses: {
          200: jsonResponse('Updated book', { $ref: '#/components/schemas/Book' }),
          400: errorResponse('Invalid request'),
          404: errorResponse('Book not found'),
          500: errorResponse('Server error'),
        },
      },
      delete: {
        summary: 'Delete a book',
        responses: {
          204: { description: 'Book deleted' },
          404: errorResponse('Book not found'),
          500: errorResponse('Server error'),
        },
      },
    },
    '/authors': {
      get: {
        summary: 'List authors',
        responses: {
          200: jsonResponse('Authors', { type: 'array', items: { $ref: '#/components/schemas/Author' } }),
          500: errorResponse('Server error'),
        },
      },
      post: {
        summary: 'Create an author',
        requestBody: authorRequest,
        responses: {
          201: jsonResponse('Created author', { $ref: '#/components/schemas/Author' }),
          400: errorResponse('Invalid request'),
          500: errorResponse('Server error'),
        },
      },
    },
    '/authors/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        summary: 'Get an author',
        responses: {
          200: jsonResponse('Author', { $ref: '#/components/schemas/Author' }),
          404: errorResponse('Author not found'),
          500: errorResponse('Server error'),
        },
      },
      put: {
        summary: 'Update an author',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthorUpdate' } } },
        },
        responses: {
          200: jsonResponse('Updated author', { $ref: '#/components/schemas/Author' }),
          400: errorResponse('Invalid request'),
          404: errorResponse('Author not found'),
          500: errorResponse('Server error'),
        },
      },
      delete: {
        summary: 'Delete an author',
        responses: {
          204: { description: 'Author deleted' },
          404: errorResponse('Author not found'),
          409: errorResponse('Author still has books'),
          500: errorResponse('Server error'),
        },
      },
    },
  },
  components: {
    schemas: {
      Book: bookSchema,
      BookUpdate: bookUpdateSchema,
      Author: authorSchema,
      AuthorUpdate: authorUpdateSchema,
      Error: errorSchema,
    },
  },
};
