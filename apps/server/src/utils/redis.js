import { createClient } from 'redis';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// Cache helpers
export const setCache = async (key, data, expireTime = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: expireTime // Expire in seconds (default: 1 hour)
    });
    return true;
  } catch (error) {
    console.error('Redis cache set error:', error);
    return false;
  }
};

export const getCache = async (key) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis cache delete error:', error);
    return false;
  }
};

export const clearUserWorkspacesCache = async (email) => {
  try {
    await redisClient.del(`user-workspaces:${email}`);
    return true;
  } catch (error) {
    console.error('Redis cache clear error:', error);
    return false;
  }
};

export default redisClient;
