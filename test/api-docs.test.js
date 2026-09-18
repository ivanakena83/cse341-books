import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';
import swagger from '../swagger.js';

test('Swagger documents all book and author routes', async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());
  const port = server.address().port;
  const response = await fetch(`http://127.0.0.1:${port}/api-docs/`);

  assert.equal(response.status, 200);
  for (const path of ['/books', '/books/{id}', '/authors', '/authors/{id}']) {
    assert.ok(swagger.paths[path], `Missing Swagger path: ${path}`);
  }
  assert.ok(swagger.paths['/books'].post.requestBody);
  assert.ok(swagger.paths['/books/{id}'].put.requestBody);
  assert.ok(swagger.paths['/authors'].post.requestBody);
  assert.ok(swagger.paths['/authors/{id}'].put.requestBody);
});
