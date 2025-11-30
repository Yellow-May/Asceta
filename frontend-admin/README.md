# ASCETA Admin Frontend

Admin frontend application for ASCETA website (admin & lecturer portal).

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL.

4. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3001`

## Features

- Admin and Lecturer authentication
- News management (CRUD operations)
- Events management (CRUD operations)
- Role-based access control
- Rich text editor for news content

## User Roles

- **Admin**: Full access to all features including Pages management
- **Lecturer**: Can create/edit News and Events, but cannot manage Pages

