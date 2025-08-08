# Jest Testing Setup Guide for Finetica

## Overview

This project now has Jest testing configured for both frontend (React) and backend (Node.js/Express). The setup uses mock data and services, so no test database is required.

## Project Structure

```
finetica/
├── server/                 # Backend tests
│   ├── jest.config.js     # Backend Jest configuration
│   └── tests/
│       ├── setup.js       # Test setup and mocks
│       ├── controllers/   # Controller tests
│       ├── services/      # Service tests
│       └── utils/         # Utility tests
└── client/                # Frontend tests
    ├── jest.config.js     # Frontend Jest configuration
    ├── .babelrc          # Babel configuration for JSX
    └── src/tests/
        ├── setup.js       # React testing setup
        ├── __mocks__/     # File mocks
        ├── components/    # Component tests
        └── utils/         # Utility tests
```

## Running Tests

### Backend Tests

```bash
cd server
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:verbose       # Run tests with detailed output
```

### Frontend Tests

```bash
cd client
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:verbose       # Run tests with detailed output
```

## Writing Tests

### Backend Testing

#### Controller Tests

Controllers should be tested by mocking the service layer:

```javascript
// tests/controllers/example.test.js
const request = require('supertest');
const express = require('express');
const exampleController = require('../../controllers/example');
const exampleService = require('../../services/example');

// Mock the service
jest.mock('../../services/example');

const app = express();
app.use(express.json());
app.post('/api/example', exampleController.create);

describe('Example Controller', () => {
  it('should create resource successfully', async () => {
    const mockData = { name: 'Test', value: 123 };
    const mockResponse = { id: 1, ...mockData };

    exampleService.create.mockResolvedValue(mockResponse);

    const response = await request(app).post('/api/example').send(mockData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
    expect(exampleService.create).toHaveBeenCalledWith(mockData);
  });
});
```

#### Service Tests

Services should be tested by mocking the model layer:

```javascript
// tests/services/example.test.js
const exampleService = require('../../services/example');
const { ExampleModel } = require('../../models');

describe('Example Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create new resource', async () => {
    const inputData = { name: 'Test' };
    const mockResult = { id: 1, ...inputData };

    ExampleModel.create.mockResolvedValue(mockResult);

    const result = await exampleService.create(inputData);

    expect(ExampleModel.create).toHaveBeenCalledWith(inputData);
    expect(result).toEqual(mockResult);
  });
});
```

#### Utility Tests

Test pure functions and utilities:

```javascript
// tests/utils/validators.test.js
const { validateEmail, validatePassword } = require('../../utils/validators');

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });
});
```

### Frontend Testing

#### Component Tests

Test React components using React Testing Library:

```javascript
// src/tests/components/Example.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ExampleComponent from '../../components/Example';
import { createMockStore } from '../utils/testUtils';

const renderWithProviders = (component, { initialState = {} } = {}) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('ExampleComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<ExampleComponent />);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExampleComponent />);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Clicked!')).toBeInTheDocument();
    });
  });
});
```

#### Utility Tests

Test frontend utilities and helpers:

```javascript
// src/tests/utils/formatters.test.js
import { formatCurrency, formatDate } from '../../utils/formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    });
  });
});
```

## Mocking Guidelines

### Backend Mocks

- **Database Models**: Automatically mocked in `tests/setup.js`
- **External APIs**: Mock Supabase, Google Drive API, etc.
- **Environment Variables**: Set in setup file for consistent testing

### Frontend Mocks

- **API Calls**: Mock axios requests
- **Router**: Mock React Router hooks
- **Redux**: Mock store and selectors
- **Assets**: Mock images, CSS files

## Best Practices

### General Testing Principles

1. **Test behavior, not implementation details**
2. **Use descriptive test names**
3. **Arrange-Act-Assert pattern**
4. **Mock external dependencies**
5. **Test edge cases and error scenarios**

### Backend Testing

- Mock the database layer (models)
- Test controller endpoints with supertest
- Test service logic with mocked models
- Test utilities in isolation

### Frontend Testing

- Use React Testing Library for component testing
- Test user interactions, not internal state
- Mock external dependencies (APIs, router)
- Test accessibility and user experience

### Code Coverage

Aim for high code coverage but focus on testing critical paths:

- Controllers: Test all endpoints and error handling
- Services: Test business logic and edge cases
- Components: Test user interactions and rendering
- Utilities: Test all branches and edge cases

## File Naming Conventions

- Test files: `*.test.js` or `*.test.jsx`
- Test directories: `tests/` or `__tests__/`
- Mock files: `__mocks__/` directory

## Common Test Patterns

### Async Testing

```javascript
// Using async/await
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// Using waitFor for UI updates
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

### Error Testing

```javascript
it('should handle errors gracefully', async () => {
  mockService.method.mockRejectedValue(new Error('Service error'));

  await expect(functionUnderTest()).rejects.toThrow('Service error');
});
```

### Mock Functions

```javascript
const mockFn = jest.fn();
mockFn.mockReturnValue('mocked value');
mockFn.mockResolvedValue(Promise.resolve('async value'));
mockFn.mockRejectedValue(new Error('error'));

expect(mockFn).toHaveBeenCalledWith(expectedArg);
expect(mockFn).toHaveBeenCalledTimes(1);
```

## Troubleshooting

### Common Issues

1. **Module not found**: Check file paths and imports
2. **Async issues**: Use proper async/await or waitFor
3. **Mock issues**: Ensure mocks are properly configured
4. **Environment**: Check Node.js and npm versions

### Debug Tips

- Use `screen.debug()` to see rendered DOM
- Use `console.log()` for debugging (remove before commit)
- Run tests in watch mode for faster feedback
- Use `--verbose` flag for detailed output

## Next Steps

1. Add more test cases for your specific business logic
2. Set up CI/CD to run tests automatically
3. Add integration tests for critical workflows
4. Monitor code coverage and improve as needed

Happy testing! 🧪
