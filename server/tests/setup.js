// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

// Mock Sequelize models
const mockUser = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn()
};

const mockRole = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
};

const mockUserStatus = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
};

const mockModels = {
    User: mockUser,
    Role: mockRole,
    UserStatus: mockUserStatus,
    BusinessPartner: mockUser,
    BusinessUnit: mockUser,
    BankTransaction: mockUser,
    SalesInvoice: mockUser,
    PurchaseInvoice: mockUser,
    TaxDeclaration: mockUser,
    UploadedFile: mockUser
};

// Mock the models module
jest.mock('../models', () => mockModels);

// Mock external services
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        storage: {
            from: jest.fn(() => ({
                upload: jest.fn(),
                download: jest.fn(),
                remove: jest.fn(),
                list: jest.fn()
            }))
        }
    }))
}));

jest.mock('googleapis', () => ({
    google: {
        auth: {
            OAuth2: jest.fn(() => ({
                setCredentials: jest.fn(),
                refreshAccessToken: jest.fn(),
                getAccessToken: jest.fn()
            }))
        },
        drive: jest.fn(() => ({
            files: {
                list: jest.fn(),
                create: jest.fn(),
                get: jest.fn(),
                delete: jest.fn()
            }
        }))
    }
}));

// Global test utilities
global.mockUser = mockUser;
global.mockRole = mockRole;
global.mockUserStatus = mockUserStatus;
global.mockModels = mockModels;

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});
