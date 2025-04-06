import { requireAuth, clerkClient } from '@clerk/express';

const authMiddleware = async (req, res, next) => {
  // Use requireAuth to ensure the user is authenticated and attach req.auth
  requireAuth({
    onError: (req, res) => {
      res.status(401).json({ error: 'Unauthenticated' });
    },
  })(req, res, async (err) => {
    if (err) return next(err);

    try {
      // Fetch the user’s details from Clerk using userId
      const user = await clerkClient.users.getUser(req.auth.userId);

      // Attach emailAddresses to req.auth
      req.auth.emailAddresses = user.emailAddresses;

      next();
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

export default authMiddleware;