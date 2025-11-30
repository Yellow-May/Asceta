# ASCETA Website

A full-stack website for Abia State College of Education (Technical) Arochukwu built with React.js, Node.js, PostgreSQL, and TypeORM.

## Project Structure

This project consists of three separate codebases:

1. **Backend API** (`backend/`) - Shared REST API for both frontends
2. **Main Frontend** (`frontend-main/`) - Public website + Student portal
3. **Admin Frontend** (`frontend-admin/`) - Admin & Lecturer portal

## Tech Stack

- **Backend**: Node.js, Express.js, TypeORM, PostgreSQL
- **Main Frontend**: React.js, React Router, TailwindCSS, Vite
- **Admin Frontend**: React.js, React Router, TailwindCSS, Vite, React Quill
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=asceta_db
JWT_SECRET=your-secret-key
FRONTEND_MAIN_URL=http://localhost:3000
FRONTEND_ADMIN_URL=http://localhost:3001
```

5. Create the PostgreSQL database:
```sql
CREATE DATABASE asceta_db;
```

6. Start the backend server:
```bash
yarn dev
```

The API will be available at `http://localhost:5000`

### Main Frontend Setup

1. Navigate to the main frontend directory:
```bash
cd frontend-main
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Admin Frontend Setup

1. Navigate to the admin frontend directory:
```bash
cd frontend-admin
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3001`

## Features

### Public Website (Main Frontend)
- Homepage with hero section, quick access cards, latest news, and upcoming events
- About page
- Admission information
- Academics and colleges listing
- News listing and detail pages
- Events listing page
- Contact page

### Student Portal (Main Frontend)
- Student login and authentication
- Student dashboard with academic information
- Profile management
- Announcements feed

### Admin Portal (Admin Frontend)
- Admin/Lecturer login
- Dashboard with statistics
- News management (Create, Read, Update, Delete)
- Events management (Create, Read, Update, Delete)
- Role-based access control

## User Roles

- **Student**: Can access student portal in main frontend
- **Lecturer**: Can create/edit News and Events in admin frontend
- **Admin**: Full access to all features including Pages management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### News
- `GET /api/news` - Get all news (public: published only)
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create news (admin/lecturer)
- `PUT /api/news/:id` - Update news (admin/lecturer)
- `DELETE /api/news/:id` - Delete news (admin/lecturer)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin/lecturer)
- `PUT /api/events/:id` - Update event (admin/lecturer)
- `DELETE /api/events/:id` - Delete event (admin/lecturer)

### Pages
- `GET /api/pages` - Get all pages
- `GET /api/pages/:slug` - Get page by slug
- `POST /api/pages` - Create page (admin/lecturer)
- `PUT /api/pages/:id` - Update page (admin/lecturer)
- `DELETE /api/pages/:id` - Delete page (admin only)

## Development

Each codebase can be developed independently. Make sure the backend is running before starting the frontends.

## License

This project is for educational purposes.

