import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

<<<<<<< HEAD
// =============================================================================
// ENVIRONMENT POLYFILLS
// =============================================================================

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// =============================================================================
// BROWSER API MOCKS
// =============================================================================

// Mock window.matchMedia for responsive design tests
=======
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

>>>>>>> 27262a2684405e79491c610fca588e4217075cb5
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

<<<<<<< HEAD
// Mock IntersectionObserver for component visibility tests
=======
>>>>>>> 27262a2684405e79491c610fca588e4217075cb5
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
};

<<<<<<< HEAD
// Mock ResizeObserver for component resize tests
global.ResizeObserver = class ResizeObserver {
    constructor(callback) { }
    disconnect() { }
    observe() { }
    unobserve() { }
};

// =============================================================================
// LIBRARY MOCKS
// =============================================================================

// Mock React Router
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(() => jest.fn()),
    useLocation: jest.fn(() => ({
        pathname: '/test',
        search: '',
        hash: '',
        state: null,
    })),
    useParams: jest.fn(() => ({})),
}));

// Mock Redux store with comprehensive state
const mockState = {
    auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    // Add other common state slices as needed
    ui: {
        theme: 'light',
        sidebarOpen: false
    }
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn((selector) => {
        try {
            return selector(mockState);
        } catch (error) {
            console.warn('Selector failed, returning fallback:', error.message);
            return mockState.auth;
        }
    }),
    useDispatch: jest.fn(() => jest.fn()),
    Provider: ({ children }) => children,
    connect: jest.fn(() => (component) => component),
}));

// Mock axios with comprehensive HTTP client
jest.mock('axios', () => {
    const mAxios = {
        get: jest.fn(() => Promise.resolve({ data: {} })),
        post: jest.fn(() => Promise.resolve({ data: {} })),
        put: jest.fn(() => Promise.resolve({ data: {} })),
        delete: jest.fn(() => Promise.resolve({ data: {} })),
        patch: jest.fn(() => Promise.resolve({ data: {} })),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        }
    };
    return {
        create: jest.fn(() => mAxios),
        ...mAxios,
    };
});

// Mock Supabase with auth and database operations
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: {
            signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
            signUp: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
            signOut: jest.fn(() => Promise.resolve({ error: null })),
            getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
        },
        from: jest.fn(() => ({
            select: jest.fn(() => Promise.resolve({ data: [], error: null })),
            insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
            update: jest.fn(() => Promise.resolve({ data: [], error: null })),
            delete: jest.fn(() => Promise.resolve({ data: [], error: null })),
        }))
    }))
}));

// =============================================================================
// TEST UTILITIES
// =============================================================================

// Export mock state for tests that need to manipulate it
export { mockState };
=======
jest.mock('../services/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(() => jest.fn()),
    useLocation: jest.fn(() => ({ pathname: '/test' })),
    useParams: jest.fn(() => ({})),
}));
>>>>>>> 27262a2684405e79491c610fca588e4217075cb5
