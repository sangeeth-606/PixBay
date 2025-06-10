# Two-Tier Caching in Pixbay

This document explains the two-tier caching strategy implemented to enhance performance and user experience.

## Server-Side Redis Caching

The first tier of caching is implemented on the server-side using Redis. This provides performance improvements for all clients interacting with the application.

### Implementation

- **Key Cache Strategies**:

  - `user-workspaces:${email}` - Caches a user's workspaces (1-hour TTL)
  - `workspace-detail:${name}` - Caches workspace details (1-hour TTL)
  - `workspace-members:${name}` - Caches workspace members (30-minute TTL)

- **Cache Invalidation**:

  - Automatically invalidated when workspaces are created
  - Automatically invalidated when users join workspaces
  - Automatically invalidated when workspaces are deleted
  - Automatically invalidated when members are removed

- **Benefits**:
  - Reduces database load
  - Faster API response times
  - Improves application performance during high traffic
  - Persists between page refreshes

## Client-Side React Query Caching

The second tier of caching is implemented on the client-side using React Query. This provides additional performance enhancements during a user's session.

### Implementation

- **API Hooks Setup**:

  - `useCheckUser()` - Checks if a user exists
  - `useUserWorkspaces()` - Fetches user workspaces with caching
  - `useCreateWorkspace()` - Creates a workspace and invalidates related queries
  - `useJoinWorkspace()` - Joins a workspace and invalidates related queries
  - `useCreateUser()` - Creates a new user and invalidates related queries

- **Caching Configuration**:

  - Stale time: 5 minutes (data considered fresh for this duration)
  - GC time: 30 minutes (unused data kept in cache for this duration)
  - Automatic background refetching for stale data

- **Benefits**:
  - Prevents redundant API requests within user session
  - Automatic loading, error, and success states
  - Background refetching without disrupting user experience
  - Consistent data across components

## Combined Benefits

This two-tier caching approach provides compounding performance benefits:

1. First API request → Server checks Redis → Database if cache miss → Store in Redis → Return data
2. Front-end stores in React Query cache
3. Subsequent requests within same session → Served from React Query cache without network request
4. Page refresh → React Query cache lost, but Redis cache remains → Fast API response without database query

This approach ensures that the application remains fast and responsive, even with many users accessing the same data simultaneously.

## Future Improvements

- Consider implementing Redis caching for more endpoints
- Add Redis monitoring and metrics collection
- Optimize cache TTL values based on usage patterns
- Implement cache compression for large objects
- Add resilience strategies for Redis connection failures
