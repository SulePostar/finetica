import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// matchMedia, IntersectionObserver, ResizeObserver mocks
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    })),
});

global.IntersectionObserver = class {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
};

global.ResizeObserver = class {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
};

// **import.meta.env mock**
if (!global.import) global.import = {};
if (!global.import.meta) global.import.meta = {};
if (!global.import.meta.env) global.import.meta.env = {};
global.import.meta.env.VITE_API_BASE_URL = 'http://localhost:4000/api';


// React Router
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(() => jest.fn()),
    useLocation: jest.fn(() => ({ pathname: '/test', search: '', hash: '', state: null })),
    useParams: jest.fn(() => ({})),
    BrowserRouter: ({ children }) => children,
    MemoryRouter: ({ children }) => children,
}));

// Redux
const mockState = {
    auth: { user: null, isAuthenticated: false, loading: false, error: null },
    user: { profile: null, loading: false, error: null },
    users: { users: [], loading: false, error: null, success: false },
    roles: { roles: [], loading: false, error: null, success: false },
    statuses: { statuses: [], loading: false, error: null, success: false },
    ui: { theme: 'light', sidebarOpen: false },
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(selector => selector(mockState)),
    useDispatch: jest.fn(() => jest.fn()),
    Provider: ({ children }) => children,
    connect: jest.fn(() => component => component),
}));

// Axios
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: {} })),
        post: jest.fn(() => Promise.resolve({ data: {} })),
        put: jest.fn(() => Promise.resolve({ data: {} })),
        delete: jest.fn(() => Promise.resolve({ data: {} })),
        patch: jest.fn(() => Promise.resolve({ data: {} })),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
    })),
    interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
}));

// Export mockState za testove koji ga trebaju
export { mockState };
