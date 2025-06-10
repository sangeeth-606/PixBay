import { isRedisCacheAvailable } from './redis.js';

/**
 * Execute a database operation and cache invalidation in a transaction-like manner
 * 
 * @param {Function} dbOperation - Async function containing the database operation
 * @param {Function} cacheOperation - Async function containing the cache invalidation operation
 * @param {Object} options - Options for error handling and retry
 * @returns {Promise<{success: boolean, data: any, error: Error|null}>}
 */
export const executeTransactionWithCache = async (
  dbOperation,
  cacheOperation,
  options = { retryCache: false, maxRetries: 3 }
) => {
  let dbResult = null;
  let cacheSuccess = false;
  let dbError = null;
  let cacheError = null;
  let retryCount = 0;

  try {
    // First execute the database operation
    dbResult = await dbOperation();
    
    // If database operation succeeded, try to invalidate cache
    if (isRedisCacheAvailable()) {
      do {
        try {
          await cacheOperation();
          cacheSuccess = true;
          break; // Exit the retry loop if successful
        } catch (error) {
          cacheError = error;
          console.error(`Cache operation failed (attempt ${retryCount + 1}):`, error);
          retryCount++;
          
          if (options.retryCache && retryCount < options.maxRetries) {
            // Wait with exponential backoff before retrying
            const delay = Math.min(Math.pow(2, retryCount) * 500, 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            break; // Exit retry loop if we're not retrying or max retries reached
          }
        }
      } while (options.retryCache && retryCount < options.maxRetries);
    } else {
      console.warn('Redis cache not available, skipping cache invalidation');
    }

    return {
      success: true,
      data: dbResult,
      cacheSuccess: cacheSuccess,
      error: null
    };
  } catch (error) {
    dbError = error;
    console.error('Database operation failed:', error);
    
    return {
      success: false,
      data: null,
      cacheSuccess: false,
      error: dbError
    };
  }
};

/**
 * Simple wrapper for transaction with cache with better error reporting
 * 
 * @param {Function} dbOperation - Async function containing the database operation
 * @param {Function} cacheOperation - Async function containing the cache invalidation
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise<Object>} - The database operation result
 * @throws {Error} - Rethrows the database operation error
 */
export const withCacheInvalidation = async (dbOperation, cacheOperation, operationName = 'Database operation') => {
  const result = await executeTransactionWithCache(dbOperation, cacheOperation, { retryCache: true });
  
  if (!result.success) {
    console.error(`${operationName} failed:`, result.error);
    throw result.error;
  }
  
  if (!result.cacheSuccess) {
    console.warn(`${operationName} succeeded, but cache invalidation failed. Users may see stale data.`);
    // Here you could add the failed cache operation to a queue for later processing
  }
  
  return result.data;
};
