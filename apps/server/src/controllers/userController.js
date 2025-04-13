import prisma from '../db.js'

export const createUser = async (req, res) => {
    try {
      const { email, name, role } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role: role || 'MEMBER', 
        },
      });
  
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  };

export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          projects: true, 
          workspaces: true, 
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  };

export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { email, name, role } = req.body;
  
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
          role: role || undefined,
        },
      });
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      if (error.code === 'P2025') { // Prisma error for record not found
        return res.status(404).json({ error: 'User not found' });
      }
      console.error(error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  };

export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      await prisma.user.delete({
        where: { id },
      });
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      console.error(error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };

export const checkUserExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check user existence' });
  }
};