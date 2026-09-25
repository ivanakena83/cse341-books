import test from 'node:test';
import assert from 'node:assert/strict';
import swagger from '../swagger.js';

const bookPaths = ['/books', '/books/{id}'];

test('Swagger documents the complete book CRUD contract', () => {
  for (const path of bookPaths) {
    assert.ok(swagger.paths[path], `Missing Swagger path: ${path}`);
  }

  assert.ok(swagger.paths['/books'].get);
  assert.ok(swagger.paths['/books'].post.requestBody);
  assert.ok(swagger.paths['/books/{id}'].get);
  assert.ok(swagger.paths['/books/{id}'].put.requestBody);
  assert.ok(swagger.paths['/books/{id}'].delete);

  assert.deepEqual(swagger.components.schemas.Book.required, [
    'id',
    'authorId',
    'title',
    'publicationDate',
  ]);
  assert.deepEqual(swagger.components.schemas.BookUpdate.required, [
    'authorId',
    'title',
    'publicationDate',
  ]);
});
