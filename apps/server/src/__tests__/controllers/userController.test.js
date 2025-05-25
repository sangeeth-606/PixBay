const userController = require('../../controllers/userController.cjs');
const mockDB = require('../mocks/db.js');

describe('User Controller', () => {
  // Mock Express request and response objects
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: checkUserExists returns 400 if email not provided
  test('checkUserExists returns 400 if email not provided', async () => {
    const req = { query: {} };
    const res = mockResponse();
    
    await userController.checkUserExists(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email parameter is required' });
  });

  // Test 2: checkUserExists returns exists: false if user doesn't exist
  test('checkUserExists returns exists: false if user doesn\'t exist', async () => {
    const req = { query: { email: 'nonexistent@example.com' } };
    const res = mockResponse();
    
    mockDB.user.findUnique.mockResolvedValue(null);
    
    await userController.checkUserExists(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ exists: false });
  });

  // Test 3: createUser returns 400 if email is missing
  test('createUser returns 400 if email is missing', async () => {
    const req = { body: { name: 'Test User' } };
    const res = mockResponse();
    
    await userController.createUser(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email is required' });
  });

  // Test 4: createUser creates a user successfully
  test('createUser creates a user successfully', async () => {
    const userData = { 
      email: 'test@example.com', 
      name: 'Test User', 
      role: 'MEMBER' 
    };
    
    const req = { body: userData };
    const res = mockResponse();
    
    const createdUser = { id: '1', ...userData };
    mockDB.user.create.mockResolvedValue(createdUser);
    
    await userController.createUser(req, res);
    
    expect(mockDB.user.create).toHaveBeenCalledWith({
      data: userData
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'User created successfully', 
      user: createdUser 
    });
  });

  // Test 5: deleteUser returns 404 if user doesn't exist
  test('deleteUser returns 404 if user doesn\'t exist', async () => {
    const req = { params: { id: 'nonexistent-id' } };
    const res = mockResponse();
    
    const prismaError = new Error('User not found');
    prismaError.code = 'P2025';
    mockDB.user.delete.mockRejectedValue(prismaError);
    
    await userController.deleteUser(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });
});
