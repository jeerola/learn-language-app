# Learn Languages! - Application for learning languages

This is a web application designed to help users learn new languages with simple flash cards. Application allows users to create their own flash cards, tags (groups) and manage them.

Live Demo: [https://learn-language-app.onrender.com](https://learn-language-app.onrender.com)

## Table of Contents

1. [Tech stack](#tech-stack)
2. [Features](#features)
3. [How to run it](#how-to-run-it)
4. [Known Issues](#known-issues)
5. [Future Improvements](#future-improvements)
6. [API Documentation](#api-documentation)

## Tech stack

### Frontend

- React with TypeScript
- Vite + SWC for build tooling
- Chakra UI for styling and components

### Backend

- Node.js with Express server framework
- PostgreSQL for database management
- Docker for containerization

### Testing

- Not yet implemented.

## Features

- Create, read, update and delete word pairs.
- Create, read and delete tags (groups).
- Admin users can manage all word pairs and tags, while regular users can only view them.
- Practice mode to test your knowledge of the word pairs.
- Score tracking to keep track of your points in practice mode.

## How to run it

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

## Known Issues

- Every user can currently manage all word pairs and tags, every user has admin privileges.

## Future Improvements

- Implement user authentication and authorization to allow users to have either admin or regular user roles, with different permissions for managing word pairs and tags.
- Implement testing for both frontend and backend to ensure code quality and reliability.
- Mobile responsiveness and design improvements for better user experience on different devices.

## API Documentation

| Method | Endpoint | Description | Success Status Codes | Error Status Codes |
| --- | --- | --- | --- | --- |
| GET | /api/languages | Get all available languages | 200 OK | 500 Internal Server Error |
| GET | /api/words | Get all word pairs | 200 OK | 404 Not Found, 500 Internal Server Error |
| POST | /api/words | Create a new word pair | 201 Created | 400 Bad Request |
| PUT | /api/words/:id | Update a specific word pair | 200 OK | 400 Bad Request, 404 Not Found, 500 Internal Server Error |
| DELETE | /api/words/:id | Delete a specific word pair | 204 No Content | 404 Not Found, 500 Internal Server Error |
| GET | /api/tags | Get all tags | 200 OK | 500 Internal Server Error |
| POST | /api/tags | Create a new tag | 201 Created | 400 Bad Request |
| DELETE | /api/tags/:id | Delete a specific tag | 204 No Content | 404 Not Found, 500 Internal Server Error |

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

### PUT /api/words/:id - Example request body to update a word pair

```json
{
  "word1": "Cat",
  "word2": "Kissa"
}
```

### PUT /api/words/:id - Example response body to update a word pair

```json
{
    "id": 1,
    "word1": "Cat",
    "language1": "English",
    "word2": "Kissa",
    "language2": "Finnish"
}
```

### GET /api/tags - Example response body

```json
[
    {
        "id": 1,
        "name": "Animals"
    },
    {
        "id": 2,
        "name": "Foods"
    }
]
```

### POST /api/tags - Example request body to create a new tag

```json
{
  "name": "Animals"
}
```

### POST /api/tags - Example response body after creating a new tag

```json
{
    "id": 1,
    "name": "Animals"
}
```
