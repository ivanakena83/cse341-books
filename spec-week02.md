# Week 02 API Spec

## Feature 1: Book CRUD Operations and Author References

### Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Version 1

## Feature 2: Author CRUD Operations

### Goal
Add an `authors` collection to the API and provide complete CRUD operations for authors. Each author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Each book in the `books` collection will reference an author through the `authorId` field. The value of `authorId` must match an existing author `id` value.

Before deleting an author, the API must check whether any books reference that author. If the author still has books, the delete request should be rejected with a `409` Conflict status.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

```json
{
  "name": "Updated Author",
  "birthYear": 1981
}
```

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has books that reference them
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

## Evaluation of Version 1

### Questions to evaluate the spec

1. Are there any bugs or short-sighted decisions in this specification?
2. Are there any security considerations that are missing?
3. Are there any efficiency concerns with the current endpoint design?
4. Are any response examples or error behaviors unclear?

### Review

This spec is largely clear and realistic for the project, but there are a few improvements worth making before using it as an implementation checklist.

#### 1. Bug or design issues
- The author delete rule should explicitly forbid deleting an author who still has books referenced by `authorId`.
- The book update and create operations should reject invalid `authorId` values before writing to the database.
- For safety, the API should validate missing required fields and invalid types before making database calls.

#### 2. Security considerations
- No sensitive data should be stored in the repository; configuration values should come from environment variables.
- The API should not expose raw database or stack errors to the client.
- MongoDB Atlas credentials and connection strings should remain in `.env` and be ignored by Git.

#### 3. Efficiency concerns
- The API should check for an author match before creating or updating a book, which is efficient because it is a targeted lookup by custom `id`.
- The author delete check should use a targeted query to count or check for books referencing the author ID.
- The app should not fetch unnecessary data when using `findOne` or `countDocuments` for validation.

#### 4. Clarity improvements
- Response examples should be included for both success and failure cases where possible.
- Error messages should be consistent and client-friendly.
- The spec should clearly state that Swagger must include request bodies for create and update routes.

---

## Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects, each including `id`, `authorId`, `title`, and `publicationDate`

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route, including request body schemas for `POST /books` and `PUT /books/:id`.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal
Add an `authors` collection to the API and provide complete CRUD operations for authors. Each author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Each book in the `books` collection will reference an author through the `authorId` field. The value of `authorId` must match an existing author `id` value.

Before deleting an author, the API must check whether any books reference that author. If the author still has books, the delete request should be rejected with a `409` Conflict status.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

```json
{
  "name": "Updated Author",
  "birthYear": 1981
}
```

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has books that reference them
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route, including request body schemas for `POST /authors` and `PUT /authors/:id`.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

## Implementation Checklist for Version 2

### Book feature checklist
- Update existing book documents to include `authorId`
- Validate `authorId` on create and update
- Ensure each `authorId` references an existing author
- Implement and document `GET /books`
- Implement and document `GET /books/:id`
- Implement and document `POST /books`
- Implement and document `PUT /books/:id`
- Implement and document `DELETE /books/:id`
- Test all routes in Swagger locally
- Test all routes at deployed Render URL

### Author feature checklist
- Create the `authors` collection in MongoDB Atlas
- Insert at least three author documents with custom ids and required fields
- Implement and document `GET /authors`
- Implement and document `GET /authors/:id`
- Implement and document `POST /authors`
- Implement and document `PUT /authors/:id`
- Implement and document `DELETE /authors/:id`
- Reject author deletion when books still reference that author
- Test all routes in Swagger locally
- Test all routes at deployed Render URL

---

## GitHub Issue Template

```md
# Issue Title

## Description
-

## Spec
-

## Test Plan
-
```

## Example issue content for Week 02

### Issue 1: Update Book Collection to reference authors and finish Book API

```md
# Update Book Collection to reference authors and finish Book API

## Description
- Update the existing Week 01 book API so book documents include a reference to an author.
- Add the remaining CRUD operations for books.
- Validate book request bodies before writing to MongoDB.
- Validate that each submitted `authorId` matches an existing author document.
- Add Swagger documentation for all book routes.
- Test the book routes locally and in the deployed Render application.

## Spec
### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes
- GET /books
- GET /books/:id
- POST /books
- PUT /books/:id
- DELETE /books/:id

### Swagger Documentation
Swagger must document every book route.

## Test Plan
- Existing `GET /books` responses include `authorId`.
- Existing `GET /books/:id` responses include `authorId`.
- `POST /books` creates a book and returns status `201`.
- `POST /books` returns `400` when required fields are missing.
- `POST /books` returns `400` when `authorId` does not match an existing author.
- `PUT /books/:id` updates an existing book.
- `PUT /books/:id` returns `400` when `authorId` does not match an existing author.
- `PUT /books/:id` returns `404` when the book does not exist.
- `DELETE /books/:id` deletes an existing book.
- `DELETE /books/:id` returns `404` when the book does not exist.
- All book routes are documented in Swagger.
- All book routes can be tested locally from `/api-docs`.
- All book routes can be tested from the deployed Render `/api-docs` page.
```

### Issue 2: Implement Author Collection and API

```md
# Implement Author Collection and API

## Description
- Create an `authors` collection in MongoDB Atlas.
- Add full CRUD operations for authors.
- Validate required fields and duplicate ids before writing to MongoDB.
- Prevent deleting an author who still has books referencing them.
- Add Swagger documentation for all author routes.
- Test the author routes locally and in the deployed Render application.

## Spec
### Goal
Add an `authors` collection to the API and provide complete CRUD operations for authors. Each author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

### Relationship to Books
Each book in the `books` collection will reference an author through the `authorId` field. The value of `authorId` must match an existing author `id` value.

Before deleting an author, the API must check whether any books reference that author. If the author still has books, the delete request should be rejected with a `409` Conflict status.

### Routes
- GET /authors
- GET /authors/:id
- POST /authors
- PUT /authors/:id
- DELETE /authors/:id

### Swagger Documentation
Swagger must document every author route.

## Test Plan
- `GET /authors` returns an array of authors with status `200`.
- `GET /authors/:id` returns the matching author with status `200`.
- `GET /authors/:id` returns `404` when the author does not exist.
- `POST /authors` creates an author and returns status `201`.
- `POST /authors` returns `400` when required fields are missing.
- `POST /authors` returns `400` when the `id` already exists.
- `PUT /authors/:id` updates an existing author and returns `200`.
- `PUT /authors/:id` returns `404` when the author does not exist.
- `DELETE /authors/:id` deletes an existing author and returns `204`.
- `DELETE /authors/:id` returns `404` when the author does not exist.
- `DELETE /authors/:id` returns `409` when that author still has books.
- All author routes are documented in Swagger.
- All author routes can be tested locally from `/api-docs`.
- All author routes can be tested from the deployed Render `/api-docs` page.
```
