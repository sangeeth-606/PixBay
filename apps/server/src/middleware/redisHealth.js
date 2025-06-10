import { isRedisCacheAvailable, checkRedisHealthAndReconnect } from '../utils/redis.js';

// Track the last time we checked Redis health to avoid checking too frequently
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute

/**
 * Middleware to check Redis health periodically
 * This helps ensure our caching layer is resilient to intermittent Redis failures
 */
export const redisHealthMiddleware = async (req, res, next) => {
  const now = Date.now();
  
  // Only check health if enough time has passed since the last check
  if (now - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
    lastHealthCheck = now;
    
    // If Redis is not connected, try to reconnect
    if (!isRedisCacheAvailable()) {
      try {
        await checkRedisHealthAndReconnect();
      } catch (error) {
        console.error('Redis health check failed in middleware:', error);
        // We continue processing the request even if Redis is down
      }
    }
  }
  
  // Always continue to the next middleware
  next();
};
