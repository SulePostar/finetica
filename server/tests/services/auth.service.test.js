const { registerUser, loginUser } = require('../../services/auth.service');

const { User, Role } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpException } = require('../../exceptions/HttpException');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Role: {
    findOne: jest.fn(),
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    const registerData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    User.findOne.mockResolvedValue(null);
    Role.findOne.mockResolvedValue({ id: 1, name: 'guest' });
    User.create.mockResolvedValue({ id: 1, ...registerData });

    const result = await registerUser(registerData);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: registerData.email } });
    expect(User.create).toHaveBeenCalledWith({
      name: registerData.name,
      email: registerData.email,
      passHash: registerData.password,
      roleId: 1,
    });
    expect(result).toBeDefined();
    expect(result.email).toBe(registerData.email);
  });

  it('should throw an HttpException if the user already exists', async () => {
    const registerData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    User.findOne.mockResolvedValue({ id: 1, ...registerData });

    await expect(registerUser(registerData)).rejects.toThrow(HttpException);
    await expect(registerUser(registerData)).rejects.toMatchObject({
      status: 400,
      message: 'User with this email already exists',
    });
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an access token for a successful login', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      passHash: 'hashedpassword',
      role: { name: 'guest' },
    };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake.jwt.token');

    const token = await loginUser(loginDto);

    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.passHash);
    expect(jwt.sign).toHaveBeenCalled();
    expect(token).toBe('fake.jwt.token');
  });

  it('should throw an HttpException for a non-existent user', async () => {
    const loginDto = { email: 'nouser@example.com', password: 'password123' };
    User.findOne.mockResolvedValue(null);

    await expect(loginUser(loginDto)).rejects.toThrow(new HttpException(401, 'Bad credentials'));
  });

  it('should throw an HttpException for an incorrect password', async () => {
    const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
    const mockUser = { id: 1, email: 'test@example.com', passHash: 'hashedpassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(loginUser(loginDto)).rejects.toThrow(new HttpException(401, 'Bad credentials'));
  });
});
