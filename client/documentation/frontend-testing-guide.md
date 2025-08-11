# Frontend Testing Guide

## Overview

This project uses Jest and React Testing Library for frontend testing with comprehensive mocking of React Router, Redux, Axios, and Supabase.

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
client/src/tests/
├── setup.js              # Global test configuration and mocks
├── testUtils.js           # Testing utilities and helpers
├── setupCheck.test.js     # Validation tests for setup
├── components/            # Component test files
├── pages/                # Page test files
├── hooks/                # Custom hook test files
├── services/             # Service test files
└── utils/                # Utility test files
```

## Pre-configured Mocks

### React Router

Complete navigation system with history manipulation:

```javascript
import { useNavigate, useLocation } from 'react-router-dom';

// Navigate to different routes
const navigate = useNavigate();
navigate('/dashboard'); // Available in tests

// Access current location
const location = useLocation();
console.log(location.pathname); // Returns current path
```

### Redux Store

Full Redux integration with state management:

```javascript
import { useSelector, useDispatch } from 'react-redux';

// Access state
const user = useSelector((state) => state.auth.user);
const isLoading = useSelector((state) => state.app.isLoading);

// Dispatch actions
const dispatch = useDispatch();
dispatch({ type: 'SET_USER', payload: userData });
```

### Axios HTTP Client

Complete HTTP operations with Promise-based responses:

```javascript
import axios from 'axios';

// GET requests
const response = await axios.get('/api/users');
// Returns: { data: [], status: 200, statusText: 'OK', headers: {} }

// POST requests
const result = await axios.post('/api/users', userData);
// Returns: { data: { id: 1, ...userData }, status: 201, ... }
```

### Supabase Client

Full Supabase operations including auth and storage:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient();

// Auth operations
const authResult = await supabase.auth.signInWithPassword({ email, password });
// Returns: { data: { user: null }, error: null }

// Storage operations
const uploadResult = await supabase.storage.from('bucket').upload('file.txt', fileData);
// Returns: { data: { path: 'test-path' }, error: null }
```

## Testing Utilities

### Custom Render Function

Use `renderWithProviders` for components that need Redux or Router context:

```javascript
import { renderWithProviders } from '../tests/testUtils';

test('renders component with Redux state', () => {
  const customState = {
    auth: {
      user: { id: 1, email: 'test@example.com' },
      isAuthenticated: true,
    },
  };

  const { getByText } = renderWithProviders(<UserProfile />, { initialState: customState });

  expect(getByText('test@example.com')).toBeInTheDocument();
});
```

### Mock Data Factories

Generate consistent test data:

```javascript
import { mockUserFactory, mockAuthStateFactory } from '../tests/testUtils';

test('displays user information', () => {
  const mockUser = mockUserFactory({
    email: 'custom@example.com',
    role: 'admin',
  });

  const authState = mockAuthStateFactory({
    user: mockUser,
    isAuthenticated: true,
  });

  // Use in tests...
});
```

## Writing Tests

### Component Tests

Test React components with user interactions:

```javascript
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../tests/testUtils';
import UserForm from '../components/UserForm';

describe('UserForm', () => {
  test('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn();

    const { getByLabelText, getByRole } = render(<UserForm onSubmit={mockOnSubmit} />);

    // Fill form fields
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });

    // Submit form
    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });

  test('displays validation errors', async () => {
    const { getByLabelText, getByRole, getByText } = render(<UserForm onSubmit={jest.fn()} />);

    // Submit empty form
    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(getByText(/email is required/i)).toBeInTheDocument();
    });
  });
});
```

### Page Tests

Test full page components with routing:

```javascript
import { renderWithProviders } from '../tests/testUtils';
import Dashboard from '../pages/Dashboard';

describe('Dashboard Page', () => {
  test('renders user dashboard when authenticated', () => {
    const authState = {
      auth: {
        user: { id: 1, email: 'test@example.com' },
        isAuthenticated: true,
      },
    };

    const { getByText } = renderWithProviders(<Dashboard />, { initialState: authState });

    expect(getByText(/welcome/i)).toBeInTheDocument();
    expect(getByText('test@example.com')).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    const mockNavigate = jest.fn();
    jest.mocked(useNavigate).mockReturnValue(mockNavigate);

    const authState = {
      auth: {
        user: null,
        isAuthenticated: false,
      },
    };

    renderWithProviders(<Dashboard />, { initialState: authState });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
```

### Hook Tests

Test custom React hooks:

```javascript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    expect(result.current[0]).toBe('default-value');
  });

  test('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated-value');
    });

    expect(result.current[0]).toBe('updated-value');
    expect(localStorage.getItem('test-key')).toBe('"updated-value"');
  });
});
```

### Service Tests

Test API service functions:

```javascript
import axios from 'axios';
import userService from '../services/userService';

// axios is already mocked globally

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch users list', async () => {
    const mockUsers = [
      { id: 1, email: 'user1@example.com' },
      { id: 2, email: 'user2@example.com' },
    ];

    axios.get.mockResolvedValue({ data: mockUsers });

    const result = await userService.getUsers();

    expect(axios.get).toHaveBeenCalledWith('/api/users');
    expect(result).toEqual(mockUsers);
  });

  test('should handle API errors', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(userService.getUsers()).rejects.toThrow(errorMessage);
  });
});
```

### Redux Integration Tests

Test components with Redux state changes:

```javascript
import { renderWithProviders } from '../tests/testUtils';
import { fireEvent } from '@testing-library/react';
import UserList from '../components/UserList';

describe('UserList with Redux', () => {
  test('displays loading state', () => {
    const loadingState = {
      users: {
        items: [],
        isLoading: true,
      },
    };

    const { getByText } = renderWithProviders(<UserList />, { initialState: loadingState });

    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  test('dispatches action on button click', () => {
    const { getByRole, store } = renderWithProviders(<UserList />);

    fireEvent.click(getByRole('button', { name: /refresh/i }));

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'FETCH_USERS_REQUEST' });
  });
});
```

## Testing Patterns

### Async Operations

```javascript
test('handles async data loading', async () => {
  const { getByText, queryByText } = renderWithProviders(<DataComponent />);

  // Initially shows loading
  expect(getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
  });

  // Data is displayed
  expect(getByText(/data loaded/i)).toBeInTheDocument();
});
```

### User Interactions

```javascript
test('responds to user input', async () => {
  const { getByRole, getByDisplayValue } = render(<SearchForm />);

  const searchInput = getByRole('textbox');

  fireEvent.change(searchInput, { target: { value: 'search term' } });

  expect(getByDisplayValue('search term')).toBeInTheDocument();
});
```

### Form Validation

```javascript
test('validates form fields', async () => {
  const { getByLabelText, getByRole, getByText } = render(<ContactForm />);

  // Submit without filling required fields
  fireEvent.click(getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(getByText(/email is required/i)).toBeInTheDocument();
    expect(getByText(/message is required/i)).toBeInTheDocument();
  });
});
```

### Navigation Testing

```javascript
test('navigates to correct routes', () => {
  const mockNavigate = jest.fn();
  jest.mocked(useNavigate).mockReturnValue(mockNavigate);

  const { getByRole } = render(<NavigationMenu />);

  fireEvent.click(getByRole('link', { name: /dashboard/i }));

  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
```

## Mocking External Dependencies

### API Calls

```javascript
// Mock specific API endpoints
axios.get.mockImplementation((url) => {
  if (url === '/api/users') {
    return Promise.resolve({ data: mockUsers });
  }
  if (url === '/api/profile') {
    return Promise.resolve({ data: mockProfile });
  }
  return Promise.reject(new Error('Unknown endpoint'));
});
```

### File Uploads

```javascript
test('handles file upload', async () => {
  const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

  const { getByLabelText } = render(<FileUpload />);

  const fileInput = getByLabelText(/choose file/i);
  fireEvent.change(fileInput, { target: { files: [mockFile] } });

  // Verify file is processed
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('/api/upload', expect.any(FormData));
  });
});
```

### Environment Variables

```javascript
test('uses correct API URL', () => {
  const originalEnv = process.env.REACT_APP_API_URL;
  process.env.REACT_APP_API_URL = 'https://test-api.com';

  // Test component that uses the environment variable
  render(<ApiComponent />);

  // Restore original value
  process.env.REACT_APP_API_URL = originalEnv;
});
```

## Accessibility Testing

### Screen Reader Testing

```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Keyboard Navigation

```javascript
test('supports keyboard navigation', () => {
  const { getByRole } = render(<Menu />);

  const firstItem = getByRole('menuitem', { name: /home/i });
  firstItem.focus();

  fireEvent.keyDown(firstItem, { key: 'ArrowDown' });

  const secondItem = getByRole('menuitem', { name: /about/i });
  expect(secondItem).toHaveFocus();
});
```

## Performance Testing

### Component Rendering

```javascript
test('renders efficiently with large datasets', () => {
  const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  const startTime = performance.now();
  render(<VirtualList items={largeDataset} />);
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
});
```

## Coverage and Quality

### Generate Coverage Reports

```bash
npm run test:coverage
```

Coverage files are generated in:

- `coverage/lcov-report/index.html` - Interactive HTML report
- `coverage/lcov.info` - CI/CD integration format

### Quality Thresholds

Jest is configured with coverage thresholds:

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## Debugging Tests

### Visual Debugging

```javascript
import { render, screen } from '@testing-library/react';

test('debug test output', () => {
  render(<MyComponent />);

  // Print current DOM structure
  screen.debug();

  // Print specific element
  const button = screen.getByRole('button');
  screen.debug(button);
});
```

### Query Debugging

```javascript
test('find elements with various queries', () => {
  render(<Form />);

  // When getByText fails, try:
  screen.getByText('Submit'); // Exact match
  screen.getByText(/submit/i); // Regex, case-insensitive
  screen.getByText((content, element) => {
    return element.tagName.toLowerCase() === 'button' && content.includes('Submit');
  });
});
```

### Test Environment

```javascript
// Check if running in test environment
if (process.env.NODE_ENV === 'test') {
  console.log('Running in test mode');
}

// Access test-specific utilities
console.log('Available mocks:', {
  navigate: typeof useNavigate,
  dispatch: typeof useDispatch,
  axios: typeof axios.get,
});
```

## Best Practices

### Test Organization

```javascript
describe('UserComponent', () => {
  describe('when user is authenticated', () => {
    beforeEach(() => {
      // Setup authenticated state
    });

    test('displays user information', () => {
      // Test implementation
    });

    test('allows profile editing', () => {
      // Test implementation
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      // Setup unauthenticated state
    });

    test('redirects to login', () => {
      // Test implementation
    });
  });
});
```

### Cleanup and Setup

```javascript
describe('Component Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Reset local storage
    localStorage.clear();

    // Reset any global state
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // Cleanup after each test
    cleanup();
  });
});
```

### Error Boundaries

```javascript
test('handles component errors gracefully', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  const { getByText } = render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(getByText(/something went wrong/i)).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

**"Not wrapped in act()" warnings**

```javascript
// Wrap state updates in act()
await act(async () => {
  fireEvent.click(button);
});
```

**"Can't perform React state update on unmounted component"**

```javascript
// Use cleanup function in useEffect
useEffect(() => {
  let mounted = true;

  fetchData().then((data) => {
    if (mounted) {
      setState(data);
    }
  });

  return () => {
    mounted = false;
  };
}, []);
```

**Mock not working as expected**

```javascript
// Ensure mock is called before import
jest.mock('../services/api');

// Or use dynamic import
test('async test', async () => {
  const { default: apiService } = await import('../services/api');
  apiService.getData.mockResolvedValue(mockData);
});
```

### Getting Help

1. Check existing test files for patterns
2. Use React Testing Library queries effectively
3. Leverage the comprehensive mock setup
4. Review Jest and RTL documentation
5. Contact the development team for project-specific questions

## Contributing

When adding new components or features:

1. **Write tests alongside components** (TDD approach)
2. **Test user interactions**, not implementation details
3. **Use semantic queries** (byRole, byLabelText, byText)
4. **Test error states** and edge cases
5. **Maintain accessibility** in tests
6. **Update this guide** with new patterns

This testing setup provides a robust foundation for maintaining high-quality, accessible React components with comprehensive coverage.
