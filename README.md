# Learn Languages!

This is a web application designed to help users learn new languages with simple flash cards. Application allows users to create their own flash cards.


# Tech stack:
## Frontend:
- React with TypeScript

## Backend:
- Node.js with Express
- PostgreSQL for database
- Docker for containerization

## Testing:
- Not yet implemented.

# Features:

- Create, read, update and delete word pairs.

# How to run it:
Pre-requisites:
- Node.js version 20 or higher and npm installed
- Docker installed and running

1. Clone the repository
2. Install dependencies for both frontend and backend
```npm install```
3. Build and run the Docker containers
```docker-compose up -d```
4. Set up the database and run initialization scripts
```npm run db:init --workspace=backend && npm run db:insert --workspace=backend```
5. Start the backend and frontend servers
```npm run dev```
6. Open the application in your browser at [http://localhost:3000](http://localhost:3000) and start creating word pairs!

# Screenshots:

# API Documentation:

| Method | Endpoint | Description | Success Status Codes | Error Status Codes |
| --- | --- | --- | --- | --- |
| GET | /api/languages | Get all available languages | 200 OK | 500 Internal Server Error |
| GET | /api/words | Get all word pairs | 200 OK | 404 Not Found, 500 Internal Server Error |
| POST | /api/words | Create a new word pair | 201 Created | 400 Bad Request |
| PUT | /api/words/<id> | Update a specific word pair | 200 OK | 400 Bad Request, 404 Not Found, 500 Internal Server Error |
| DELETE | /api/words/<id> | Delete a specific word pair | 204 No Content | 404 Not Found, 500 Internal Server Error |
### GET /api/languages - Example response body
```json
[
    {
        "id": 1,
        "name": "English",
        "code": "en"
    },
    {
        "id": 2,
        "name": "Finnish",
        "code": "fi"
    }
]
```
### GET /api/words - Example response body
```json
[
    {
        "id": 1,
        "word1": "Dog",
        "language1": "English",
        "word2": "Koira",
        "language2": "Finnish"
    },
    {
        "id": 2,
        "word1": "Cat",
        "language1": "English",
        "word2": "Kissa",
        "language2": "Finnish"
    }
]
```
### POST /api/words - Example request body to create a new word pair

```json
{
  "word1": "Dog",
  "language1_id": 1,
  "word2": "Koira",
  "language2_id": 2
}
```

### POST /api/words - Example response body after creating a new word pair
```json
{
    "id": 1,
    "word1": "Dog",
    "language1": "English",
    "word2": "Koira",
    "language2": "Finnish"
}
```

### PUT /api/words/<id> - Example request body to update a word pair
```json
{
  "word1": "Cat",
  "word2": "Kissa"
}
```
### PUT /api/words/<id> - Example response body to update a word pair
```json
{
    "id": 1,
    "word1": "Cat",
    "language1": "English",
    "word2": "Kissa",
    "language2": "Finnish"
}
```


# Known Issues:
- Project is still in development phase, so there are features that may not work as expected and/or are not implemented yet.
