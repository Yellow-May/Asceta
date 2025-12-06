# Dual Database Setup

This backend now supports **two independent databases**:

1. **PostgreSQL** - Using TypeORM (existing setup)
2. **MongoDB** - Using Mongoose (new addition)

## Key Features

- ✅ **Independent Operation**: Both databases work independently
- ✅ **Fault Tolerance**: A failure in one database doesn't affect the other
- ✅ **Graceful Degradation**: The server continues running even if one database fails
- ✅ **Health Monitoring**: Check status of both databases via `/api/health` endpoint

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# PostgreSQL Configuration (existing)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=asceta_db

# MongoDB Configuration (new)
MONGODB_URI=mongodb://localhost:27017/asceta_mongodb
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asceta_mongodb
```

### MongoDB Connection String Formats

- **Local MongoDB**: `mongodb://localhost:27017/asceta_mongodb`
- **MongoDB with Authentication**: `mongodb://username:password@localhost:27017/asceta_mongodb`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/asceta_mongodb`
- **MongoDB with Options**: `mongodb://localhost:27017/asceta_mongodb?authSource=admin`

## Usage

### Using PostgreSQL (TypeORM)

Continue using your existing TypeORM entities and repositories:

```typescript
import { AppDataSource } from "./config/data-source";
import { User } from "./entities/User";

// In your controller/service
const userRepository = AppDataSource.getRepository(User);
const users = await userRepository.find();
```

### Using MongoDB (Mongoose)

1. **Check connection status before use**:

```typescript
import { getMongoDBStatus, getMongoDBConnection } from "./config/mongodb";

// Check if MongoDB is available
const mongoStatus = getMongoDBStatus();
if (!mongoStatus.connected) {
  // Handle gracefully - MongoDB is not available
  console.warn("MongoDB not available");
  return;
}
```

2. **Create a MongoDB Model**:

```typescript
import { Schema, model } from "mongoose";

interface IAnalytics {
  event: string;
  userId?: string;
  data: Record<string, any>;
  timestamp: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  event: { type: String, required: true },
  userId: { type: String, required: false },
  data: { type: Schema.Types.Mixed, required: false },
  timestamp: { type: Date, default: Date.now },
});

export const Analytics = model<IAnalytics>("Analytics", AnalyticsSchema);
```

3. **Use the model in your code**:

```typescript
import { Analytics } from "./models/Analytics";
import { getMongoDBStatus } from "./config/mongodb";

export async function logAnalytics(event: string, userId: string, data: any) {
  // Always check connection status
  if (!getMongoDBStatus().connected) {
    console.warn("MongoDB not available, skipping analytics");
    return;
  }

  try {
    const analytics = new Analytics({
      event,
      userId,
      data,
      timestamp: new Date(),
    });

    await analytics.save();
  } catch (error) {
    console.error("Failed to save analytics:", error);
    // Don't throw - analytics failures shouldn't break the app
  }
}
```

## Health Check

The `/api/health` endpoint now returns the status of both databases:

```json
{
  "status": "ok",
  "message": "ASCETA API is running",
  "databases": {
    "postgresql": {
      "connected": true,
      "error": null
    },
    "mongodb": {
      "connected": true,
      "error": null,
      "readyState": 1
    }
  }
}
```

**Status values**:

- `status: "ok"` - Both databases connected
- `status: "degraded"` - One or both databases disconnected (HTTP 503)

**MongoDB readyState values**:

- `0` - Disconnected
- `1` - Connected
- `2` - Connecting
- `3` - Disconnecting

## Best Practices

1. **Always check connection status** before using MongoDB
2. **Handle errors gracefully** - Don't let MongoDB failures break PostgreSQL operations
3. **Use appropriate database for the use case**:
   - **PostgreSQL**: Structured relational data (users, news, events, pages)
   - **MongoDB**: Unstructured data, logs, analytics, caching, real-time data

## Example Use Cases

### PostgreSQL (TypeORM)

- User authentication and profiles
- News articles
- Events
- Pages content
- Any structured relational data

### MongoDB (Mongoose)

- Application logs
- User analytics and tracking
- Session data
- Real-time notifications
- Caching layer
- Document storage

## Troubleshooting

### MongoDB Connection Fails

1. **Check MongoDB is running**:

   ```bash
   # Windows
   net start MongoDB

   # Linux/Mac
   sudo systemctl status mongod
   ```

2. **Verify connection string** in `.env` file

3. **Check MongoDB logs** for connection errors

4. **Server will still start** - PostgreSQL operations will continue to work

### PostgreSQL Connection Fails

1. **Check PostgreSQL is running**

2. **Verify credentials** in `.env` file

3. **Server will still start** - MongoDB operations will continue to work

### Both Databases Fail

The server will still start, but most features may not work. Check the `/api/health` endpoint to see which databases are available.
