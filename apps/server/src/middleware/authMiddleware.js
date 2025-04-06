import { requireAuth } from '@clerk/express';

const authMiddleware = requireAuth({
  onError: (req, res) => {
    res.status(401).json({ error: 'Unauthenticated' });
  },
});

export default authMiddleware;