import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import { connectMongoDB, getMongoDBStatus } from './config/mongodb';
import authRoutes from './routes/auth.routes';
import newsRoutes from './routes/news.routes';
import eventsRoutes from './routes/events.routes';
import pagesRoutes from './routes/pages.routes';
import accaddRoutes from './routes/accadd.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_MAIN_URL || 'http://localhost:3000',
    process.env.FRONTEND_ADMIN_URL || 'http://localhost:3001',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/accadd', accaddRoutes);

// Health check with database status
app.get('/api/health', (req, res) => {
  const postgresStatus = AppDataSource.isInitialized
    ? { connected: true, error: null }
    : { connected: false, error: 'PostgreSQL not initialized' };
  
  const mongoStatus = getMongoDBStatus();
  
  const allHealthy = postgresStatus.connected && mongoStatus.connected;
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    message: 'ASCETA API is running',
    databases: {
      postgresql: postgresStatus,
      mongodb: {
        connected: mongoStatus.connected,
        error: mongoStatus.error,
        readyState: mongoStatus.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
      },
    },
  });
});

// Initialize databases independently
async function initializeDatabases() {
  const postgresPromise = AppDataSource.initialize()
    .then(() => {
      console.log('✅ PostgreSQL connected successfully');
      return { success: true, db: 'PostgreSQL' };
    })
    .catch((error) => {
      console.error('❌ PostgreSQL connection failed:', error.message);
      return { success: false, db: 'PostgreSQL', error: error.message };
    });

  const mongoPromise = connectMongoDB()
    .then(() => {
      const status = getMongoDBStatus();
      if (status.connected) {
        console.log('✅ MongoDB connected successfully');
        return { success: true, db: 'MongoDB' };
      } else {
        console.warn('⚠️  MongoDB connection failed:', status.error);
        return { success: false, db: 'MongoDB', error: status.error };
      }
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      return { success: false, db: 'MongoDB', error: error instanceof Error ? error.message : 'Unknown error' };
    });

  // Wait for both connections to attempt (don't fail if one fails)
  const [postgresResult, mongoResult] = await Promise.allSettled([
    postgresPromise,
    mongoPromise,
  ]);

  type DBResult = { success: boolean; db: string; error?: string };
  
  const results: DBResult[] = [
    postgresResult.status === 'fulfilled' ? postgresResult.value : { success: false, db: 'PostgreSQL', error: 'Promise rejected' },
    mongoResult.status === 'fulfilled' ? mongoResult.value : { success: false, db: 'MongoDB', error: 'Promise rejected' },
  ];

  // Log summary
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  if (successful.length > 0) {
    console.log(`\n✅ Successfully connected to: ${successful.map((r) => r.db).join(', ')}`);
  }
  if (failed.length > 0) {
    console.warn(`\n⚠️  Failed to connect to: ${failed.map((r) => `${r.db} (${r.error})`).join(', ')}`);
    console.warn('⚠️  Server will continue running, but features requiring these databases may not work.');
  }

  // Start server regardless of database connection status
  // This ensures the API can still serve requests even if one database fails
  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health\n`);
  });
}

// Start the server
initializeDatabases();

export default app;

