// CommonJS version of userController.js for Jest testing
// Only includes functions needed for tests

// Import the mock directly
const db = require('../__tests__/mocks/db');

const checkUserExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const user = await db.default.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        name: true,
        email: true
      },
    });

    if (user) {
      res.status(200).json({ 
        exists: true, 
        id: user.id,
        name: user.name,
        hasName: !!user.name
      });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to check user existence',
      details: error.message 
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await db.default.user.create({
      data: {
        email,
        name,
        role: role || 'MEMBER',
      },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.default.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  checkUserExists,
  createUser,
  deleteUser
};
