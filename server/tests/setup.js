// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';

// =============================================================================
// SEQUELIZE MODEL MOCKS
// =============================================================================

const createModelMock = () => ({
    findByPk: jest.fn(() => Promise.resolve(null)),
    findOne: jest.fn(() => Promise.resolve(null)),
    create: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
    update: jest.fn(() => Promise.resolve([1])),
    destroy: jest.fn(() => Promise.resolve(1)),
    findAll: jest.fn(() => Promise.resolve([])),
    count: jest.fn(() => Promise.resolve(0)),
    findAndCountAll: jest.fn(() => Promise.resolve({ count: 0, rows: [] })),
    // Sequelize associations
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn(),
});

const mockModels = {
    User: createModelMock(),
    Role: createModelMock(),
    UserStatus: createModelMock(),
    BusinessPartner: createModelMock(),
    BusinessUnit: createModelMock(),
    BankTransaction: createModelMock(),
    SalesInvoice: createModelMock(),
    PurchaseInvoice: createModelMock(),
    TaxDeclaration: createModelMock(),
    UploadedFile: createModelMock(),
    // Add Sequelize instance methods
    sequelize: {
        authenticate: jest.fn(() => Promise.resolve()),
        sync: jest.fn(() => Promise.resolve()),
        transaction: jest.fn((callback) => callback({})),
        close: jest.fn(() => Promise.resolve()),
    }
};

jest.mock('../models', () => mockModels);

// =============================================================================
// EXTERNAL SERVICE MOCKS
// =============================================================================

jest.mock('@supabase/supabase-js', () => {
    const mockStorageBucket = {
        upload: jest.fn(() => Promise.resolve({ data: { path: 'test-path' }, error: null })),
        download: jest.fn(() => Promise.resolve({ data: new Blob(), error: null })),
        remove: jest.fn(() => Promise.resolve({ data: [], error: null })),
        list: jest.fn(() => Promise.resolve({ data: [], error: null })),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://test-url.com' } })),
    };

    const mockClient = {
        storage: {
            from: jest.fn(() => mockStorageBucket),
        },
        auth: {
            signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
            signUp: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
            signOut: jest.fn(() => Promise.resolve({ error: null })),
        },
    };

    return {
        createClient: jest.fn(() => mockClient),
    };
});

jest.mock('googleapis', () => {
    const mockFiles = {
        list: jest.fn(() => Promise.resolve({ data: { files: [] } })),
        create: jest.fn(() => Promise.resolve({ data: { id: 'test-file-id' } })),
        get: jest.fn(() => Promise.resolve({ data: {} })),
        delete: jest.fn(() => Promise.resolve({})),
        export: jest.fn(() => Promise.resolve({ data: {} })),
    };

    const mockDrive = {
        files: mockFiles,
    };

    const mockAuth = {
        OAuth2: jest.fn(() => ({
            setCredentials: jest.fn(),
            refreshAccessToken: jest.fn(() => Promise.resolve({ credentials: {} })),
            getAccessToken: jest.fn(() => Promise.resolve({ token: 'test-token' })),
        })),
    };

    return {
        google: {
            auth: mockAuth,
            drive: jest.fn(() => mockDrive),
        },
    };
});

// =============================================================================
// GLOBAL UTILITIES
// =============================================================================

global.mockModels = mockModels;

// Test utilities
global.testUtils = {
    createMockUser: (overrides = {}) => ({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        ...overrides
    }),
    createMockRequest: (overrides = {}) => ({
        body: {},
        params: {},
        query: {},
        headers: {},
        user: null,
        ...overrides
    }),
    createMockResponse: () => {
        const res = {};
        res.status = jest.fn(() => res);
        res.json = jest.fn(() => res);
        res.send = jest.fn(() => res);
        res.setHeader = jest.fn(() => res);
        return res;
    }
};

// =============================================================================
// TEST LIFECYCLE
// =============================================================================

beforeEach(() => {
    // Only clear call history, preserve implementations
    Object.values(mockModels).forEach(model => {
        if (typeof model === 'object' && model !== null) {
            Object.values(model).forEach(method => {
                if (jest.isMockFunction(method)) {
                    method.mockClear();
                }
            });
        }
    });
});
