# Deploying to Render

## Configuration

### 1. Build Command
Set the build command to:
```bash
yarn install && yarn build
```

### 2. Start Command
Choose one of these options:

#### Option A: Auto-run migrations on startup (Recommended)
```bash
yarn start:prod
```
This will run migrations, seed data, then start the server.

#### Option B: Manual migrations
```bash
yarn start
```
Then run migrations manually using Render Shell (see below).

### 3. Environment Variables

Add these environment variables in Render Dashboard:

#### PostgreSQL (from Render PostgreSQL service)
```
DB_HOST=<your-render-postgres-hostname>
DB_PORT=5432
DB_USERNAME=<your-postgres-username>
DB_PASSWORD=<your-postgres-password>
DB_NAME=<your-database-name>
```

#### MongoDB
```
MONGODB_URI=<your-mongodb-connection-string>
```
Example for MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asceta_mongodb
```

#### Other Variables
```
NODE_ENV=production
PORT=5000
JWT_SECRET=<your-secure-jwt-secret>
FRONTEND_MAIN_URL=<your-frontend-main-url>
FRONTEND_ADMIN_URL=<your-frontend-admin-url>
```

## How to Get Database Connection Info

### PostgreSQL on Render
1. Go to your Render Dashboard
2. Click on your PostgreSQL database
3. Copy the **Internal Database URL** or individual connection details
4. Use these values for the `DB_*` environment variables

### MongoDB
- If using MongoDB Atlas:
  1. Go to MongoDB Atlas dashboard
  2. Click "Connect" on your cluster
  3. Choose "Connect your application"
  4. Copy the connection string
  5. Replace `<password>` with your actual password

- If using a different MongoDB provider, use their connection string

## Running Migrations Manually

If you chose Option B (manual migrations), after deployment:

1. Go to your Render service
2. Click on "Shell" tab
3. Run these commands:
```bash
yarn migration:run:prod
yarn seed:prod  # Optional: only if you want to seed initial data
```

## Troubleshooting

### Build fails with "Cannot find module"
- Make sure all dependencies are in `dependencies`, not `devDependencies`
- TypeORM and TypeScript types should be in `dependencies` for production builds

### Migration fails
- Check that all database environment variables are set correctly
- Verify database is accessible from Render
- Check Render logs for detailed error messages

### Server starts but crashes immediately
- Check environment variables are set
- Review logs in Render Dashboard
- Make sure MongoDB connection string is correct

## Important Notes

1. **Never commit `.env` files** - Always use Render's environment variables
2. **Use Internal Database URL** for PostgreSQL connections within Render services (faster and secure)
3. **Migrations run automatically** if using `start:prod` command
4. **Database connections are available only at runtime**, not during build


