import test from 'node:test';
import assert from 'node:assert/strict';
import swagger from '../swagger.js';

const authorPaths = ['/authors', '/authors/{id}'];

test('Swagger documents the complete author CRUD contract', () => {
  for (const path of authorPaths) {
    assert.ok(swagger.paths[path], `Missing Swagger path: ${path}`);
  }

  assert.ok(swagger.paths['/authors'].get);
  assert.ok(swagger.paths['/authors'].post.requestBody);
  assert.ok(swagger.paths['/authors/{id}'].get);
  assert.ok(swagger.paths['/authors/{id}'].put.requestBody);
  assert.ok(swagger.paths['/authors/{id}'].delete);

  assert.deepEqual(swagger.components.schemas.Author.required, ['id', 'name', 'birthYear']);
  assert.deepEqual(swagger.components.schemas.AuthorUpdate.required, ['name', 'birthYear']);
});
