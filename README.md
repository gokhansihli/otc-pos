# Pharmacy OTC POS - Backend API

Node.js and Express backend built for a desktop Pharmacy OTC Point of Sale (POS) system. It manages inventory, atomic checkout transactions, customer records, and custom error handling backed by a local PostgreSQL database.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Architecture:** Modular MVC (Model-View-Controller)

---

## Project Structure

```text
backend/
├── config/             # Database connection & environment configuration
├── controllers/        # Business logic for products, sales, customers, etc.
├── errors/             # Custom error handling middleware & PSQL error translation
├── models/             # Database queries & CRUD operations
├── routes/             # API endpoint definitions
├── middleware/         # Auth, validation, or request-logging middleware
├── server.js           # App entry point
└── package.json
```

## Getting Started

### 1. Prerequisites

- Node.js installed on your machine.
- PostgreSQL installed and running locally.

### 2. Installation

- Clone the repository and install dependencies:
- Bash
- npm install

### 3. Environment Variables

- Create a .env file in the root of the backend directory and configure your local database connection:
- Code snippet
- PORT=5000
- DB_HOST=localhost
- DB_USER=your_postgres_user
- DB_PASSWORD=your_postgres_password
- DB_NAME=pharmacy_pos
- DB_PORT=5432

### 4. Running the Server

- Development Mode (with auto-restart):
- Bash
- npm run dev
- Production Mode:
- Bash
- pm start
