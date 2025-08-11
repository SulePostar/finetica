# Backend Testing Guide

## Overview

This project uses Jest for backend testing with comprehensive mocking of external dependencies including Sequelize models, Supabase, and Google Drive API.

## Quick Start

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

## Test File Structure

```
server/tests/
├── setup.js              # Global test configuration and mocks
├── setupCheck.test.js     # Validation tests for setup
├── controllers/           # Controller test files
├── services/             # Service test files
├── middleware/           # Middleware test files
└── utils/                # Utility test files
```

## Pre-configured Mocks

### Sequelize Models

All database models are automatically mocked with realistic return values:

```javascript
// All models return proper async responses
const users = await models.User.findAll(); // Returns []
const user = await models.User.create(userData); // Returns { id: 1, ...userData }
const found = await models.User.findByPk(1); // Returns null
```

### Supabase

Complete Supabase client with storage and auth operations:

```javascript
const client = createClient();

// Storage operations
const uploadResult = await client.storage.from('bucket').upload('file.txt', fileData);
// Returns: { data: { path: 'test-path' }, error: null }

// Auth operations
const authResult = await client.auth.signInWithPassword({ email, password });
// Returns: { data: { user: null }, error: null }
```

### Google Drive API

Full Google Drive API with file operations:

```javascript
const drive = google.drive();

// File operations
const listResult = await drive.files.list();
// Returns: { data: { files: [] } }

const createResult = await drive.files.create({ name: 'test.txt' });
// Returns: { data: { id: 'test-file-id' } }
```

### Environment Variables

All necessary environment variables are pre-configured:

- `NODE_ENV=test`
- Database credentials (mocked)
- API keys and secrets (test values)
- Service URLs (test endpoints)

## Writing Tests

### Controller Tests

Test API endpoints with proper request/response handling:

```javascript
const request = require('supertest');
const app = require('../../app');

describe('User Controller', () => {
  test('GET /api/users should return users list', async () => {
    // Mock the service layer
    const mockUsers = [{ id: 1, email: 'test@example.com' }];
    models.User.findAll.mockResolvedValue(mockUsers);

    const response = await request(app).get('/api/users').expect(200);

    expect(response.body.users).toEqual(mockUsers);
    expect(models.User.findAll).toHaveBeenCalled();
  });

  test('POST /api/users should create new user', async () => {
    const userData = { email: 'new@example.com', name: 'New User' };
    const createdUser = { id: 1, ...userData };

    models.User.create.mockResolvedValue(createdUser);

    const response = await request(app).post('/api/users').send(userData).expect(201);

    expect(response.body.user).toEqual(createdUser);
    expect(models.User.create).toHaveBeenCalledWith(userData);
  });
});
```

### Service Tests

Test business logic with mocked dependencies:

```javascript
const userService = require('../../services/users');
const { User } = require('../../models');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create user with valid data', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    const expectedUser = { id: 1, ...userData };

    User.create.mockResolvedValue(expectedUser);

    const result = await userService.createUser(userData);

    expect(User.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(expectedUser);
  });

  test('should handle validation errors', async () => {
    const invalidData = { email: 'invalid-email' };

    User.create.mockRejectedValue(new Error('Validation error'));

    await expect(userService.createUser(invalidData)).rejects.toThrow('Validation error');
  });
});
```

### Middleware Tests

Test authentication, validation, and other middleware:

```javascript
const authMiddleware = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = global.testUtils.createMockRequest();
    res = global.testUtils.createMockResponse();
    next = jest.fn();
  });

  test('should authenticate valid token', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    req.headers.authorization = 'Bearer valid-token';

    jwt.verify.mockReturnValue({ userId: 1 });
    models.User.findByPk.mockResolvedValue(mockUser);

    await authMiddleware(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  test('should reject invalid token', async () => {
    req.headers.authorization = 'Bearer invalid-token';

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});
```

### Utility Tests

Test helper functions and utilities:

```javascript
const { validateEmail, hashPassword } = require('../../utils/helpers');

describe('Helper Utilities', () => {
  describe('validateEmail', () => {
    test('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('hashPassword', () => {
    test('should hash password securely', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });
  });
});
```

## Available Test Utilities

### Global Test Utils

Access pre-configured utilities via `global.testUtils`:

```javascript
// Create mock user data
const mockUser = global.testUtils.createMockUser({
  email: 'custom@example.com',
  role: 'admin',
});

// Create mock request objects
const mockReq = global.testUtils.createMockRequest({
  body: { name: 'Test' },
  params: { id: '1' },
  user: mockUser,
});

// Create mock response objects
const mockRes = global.testUtils.createMockResponse();
mockRes.status(200).json({ success: true });
```

### Custom Assertions

```javascript
// Check if mock functions were called correctly
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
expect(mockFunction).toHaveBeenCalledTimes(1);

// Check async operations
await expect(asyncFunction()).resolves.toEqual(expectedResult);
await expect(asyncFunction()).rejects.toThrow('Expected error');
```

## Testing External Services

### Supabase Integration

```javascript
const supabaseService = require('../../services/supabaseService');

test('should upload file to Supabase storage', async () => {
  const fileName = 'test.txt';
  const fileData = Buffer.from('test content');

  const result = await supabaseService.uploadFile(fileName, fileData);

  expect(result.data.path).toBe('test-path');
  expect(result.error).toBeNull();
});
```

### Google Drive Integration

```javascript
const googleDriveService = require('../../services/googleDriveService');

test('should create file in Google Drive', async () => {
  const fileMetadata = { name: 'test.txt' };
  const fileContent = 'test content';

  const result = await googleDriveService.createFile(fileMetadata, fileContent);

  expect(result.data.id).toBe('test-file-id');
});
```

## Best Practices

### Test Organization

```javascript
describe('UserController', () => {
  describe('GET /api/users', () => {
    test('should return users when authenticated', async () => {
      // Test implementation
    });

    test('should return 401 when not authenticated', async () => {
      // Test implementation
    });
  });

  describe('POST /api/users', () => {
    test('should create user with valid data', async () => {
      // Test implementation
    });

    test('should return validation error with invalid data', async () => {
      // Test implementation
    });
  });
});
```

### Error Handling

```javascript
test('should handle database connection errors', async () => {
  // Mock database error
  models.User.findAll.mockRejectedValue(new Error('Database connection failed'));

  const response = await request(app).get('/api/users').expect(500);

  expect(response.body.error).toBe('Internal server error');
});
```

### Async Testing

```javascript
test('handles async operations correctly', async () => {
  // For promises
  const result = await asyncFunction();
  expect(result).toBeDefined();

  // For callbacks with promisify
  const util = require('util');
  const asyncCallback = util.promisify(callbackFunction);
  const callbackResult = await asyncCallback();
  expect(callbackResult).toBeDefined();
});
```

## Coverage Reports

Generate and view test coverage:

```bash
npm run test:coverage
```

Coverage files:

- `coverage/lcov-report/index.html` - Interactive HTML report
- `coverage/lcov.info` - CI/CD integration format
- `coverage/text-summary` - Terminal summary

## Debugging Tests

### Console Debugging

```javascript
test('debug test data', () => {
  console.log('Mock calls:', mockFunction.mock.calls);
  console.log('Mock results:', mockFunction.mock.results);
  console.log('Request body:', req.body);
});
```

### Selective Test Running

```bash
# Run tests matching pattern
npm test -- --testNamePattern="user"

# Run specific test file
npm test -- setupCheck.test.js

# Run tests with debug output
npm test -- --verbose --no-coverage
```

### Mock Inspection

```javascript
// Check if mock was called
expect(mockFunction).toHaveBeenCalled();

// Check call arguments
expect(mockFunction).toHaveBeenCalledWith(expectedArg1, expectedArg2);

// Check number of calls
expect(mockFunction).toHaveBeenCalledTimes(2);

// Get call details
const calls = mockFunction.mock.calls;
const firstCallArgs = calls[0];
```

## Environment Configuration

### Test Environment Variables

All environment variables are automatically configured in `setup.js`:

```javascript
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DB_HOST = 'localhost';
// ... other test-specific variables
```

### Database Configuration

Database operations are completely mocked - no real database connection needed:

```javascript
// Sequelize models return mock data
const user = await User.findByPk(1); // Returns null
const users = await User.findAll(); // Returns []
```

## CI/CD Integration

For continuous integration, run tests with:

```bash
npm test -- --ci --coverage --watchAll=false
```

Jest configuration automatically handles:

- Parallel test execution
- Coverage reporting
- Exit codes for CI systems
- Silent mode for automated runs

## Troubleshooting

### Common Issues

**"Module not found" errors**

- Check file paths in require/import statements
- Ensure all dependencies are installed
- Verify mock paths match actual file locations

**Mock not working**

- Ensure mock is defined before importing the module
- Check mock implementation returns correct data types
- Verify mock is cleared between tests if needed

**Async test failures**

- Always use `await` with async operations
- Ensure promises are properly resolved/rejected
- Check for unhandled promise rejections

**Environment issues**

- Verify Node.js version compatibility
- Check that test environment variables are set
- Ensure Jest configuration is correct

### Getting Help

1. Check existing test files for patterns
2. Review Jest documentation for advanced features
3. Use `--verbose` flag for detailed test output
4. Contact the development team for project-specific questions

## Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Mock external dependencies** appropriately
3. **Test error scenarios** and edge cases
4. **Maintain high coverage** for critical paths
5. **Document new patterns** in this guide

This testing setup provides a robust foundation for maintaining code quality and preventing regressions in the backend codebase.
