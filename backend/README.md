# ASCETA Backend API

Backend API for ASCETA website built with Node.js, Express, TypeORM, and PostgreSQL.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials and other configuration.

4. Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE asceta_db;
```

5. Run migrations (if using migrations):
```bash
yarn migration:run
```

6. Start the development server:
```bash
yarn dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires auth)

### News
- `GET /api/news` - Get all news (public: published only, authenticated: all)
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create news (admin/lecturer only)
- `PUT /api/news/:id` - Update news (admin/lecturer only)
- `DELETE /api/news/:id` - Delete news (admin/lecturer only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin/lecturer only)
- `PUT /api/events/:id` - Update event (admin/lecturer only)
- `DELETE /api/events/:id` - Delete event (admin/lecturer only)

### Pages
- `GET /api/pages` - Get all pages
- `GET /api/pages/:slug` - Get page by slug
- `POST /api/pages` - Create page (admin/lecturer only)
- `PUT /api/pages/:id` - Update page (admin/lecturer only)
- `DELETE /api/pages/:id` - Delete page (admin only)

## User Roles

- `student` - Can access student portal
- `lecturer` - Can create/edit news, events, and pages
- `admin` - Full access to all resources

