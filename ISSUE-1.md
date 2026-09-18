# Update Book Collection to Reference Authors and Finish Book API

## Description
- Update the Week 01 book API so each book references an existing author through `authorId`.
- Use the required book fields: `id`, `authorId`, `title`, and `publicationDate`.
- Complete GET, POST, PUT, and DELETE operations for books with the required status codes and response bodies.
- Validate required fields, duplicate book ids, and author references before database writes.
- Add Swagger documentation for every book route, including POST and PUT request bodies.
- Verify the routes locally through `/api-docs` and again on the deployed Render application.

## Spec
### Data Model
Book documents are stored in the `books` collection. The custom string `id` is used in route parameters. `authorId` must match an existing author document's custom `id`.

### Routes
- `GET /books` returns all books with status `200`.
- `GET /books/:id` returns one book with status `200`, or `404` when it does not exist.
- `POST /books` creates a book with status `201`; missing fields, duplicate ids, and invalid author references return `400`.
- `PUT /books/:id` updates a book with status `200`; missing fields or invalid author references return `400`, and an unknown book returns `404`.
- `DELETE /books/:id` returns `204` when deleted, or `404` when the book does not exist.
- Unexpected database errors return `500` without exposing raw database details.

## Test Plan
- Confirm `GET /books` returns an array whose book objects contain `id`, `authorId`, `title`, and `publicationDate`.
- Confirm `GET /books/:id` returns an existing book and returns `404` for an unknown id.
- Confirm `POST /books` returns `201` and the created book object.
- Confirm `POST /books` returns `400` for missing fields, a duplicate id, or an unknown `authorId`.
- Confirm `PUT /books/:id` returns `200` and the updated book object.
- Confirm `PUT /books/:id` returns `400` for missing fields or an unknown `authorId`.
- Confirm `PUT /books/:id` returns `404` for an unknown book id.
- Confirm `DELETE /books/:id` returns `204` with no response body.
- Confirm `DELETE /books/:id` returns `404` for an unknown book id.
- Confirm all five book routes appear in the local `/api-docs` Swagger UI with request schemas for POST and PUT.
- Repeat the same checks against the deployed Render `/api-docs` page.
