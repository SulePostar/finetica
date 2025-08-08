const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const models = require('../models');

describe('Backend Setup Validation', () => {
    test('should mock Sequelize models with proper return values', async () => {
        expect(models.User.findAll).toBeDefined();

        const result = await models.User.findAll();
        expect(result).toEqual([]);
        expect(models.User.findAll).toHaveBeenCalled();

        // Test model creation
        const userData = { email: 'test@example.com', name: 'Test User' };
        const createdUser = await models.User.create(userData);
        expect(createdUser).toEqual({ id: 1, ...userData });
    });

    test('should mock Supabase client with proper async responses', async () => {
        expect(createClient).toBeDefined();
        expect(typeof createClient).toBe('function');

        const client = createClient();
        expect(client).toBeDefined();
        expect(client.storage).toBeDefined();
        expect(client.storage.from).toBeDefined();

        const bucket = client.storage.from('test-bucket');
        const uploadResult = await bucket.upload('test.txt', new Blob(['test']));
        expect(uploadResult).toEqual({
            data: { path: 'test-path' },
            error: null
        });

        const listResult = await bucket.list();
        expect(listResult).toEqual({
            data: [],
            error: null
        });
    });

    test('should mock Google Drive API with proper async responses', async () => {
        expect(google.drive).toBeDefined();
        expect(typeof google.drive).toBe('function');

        const drive = google.drive();
        expect(drive).toBeDefined();
        expect(drive.files).toBeDefined();
        expect(drive.files.list).toBeDefined();

        const listResult = await drive.files.list();
        expect(listResult).toEqual({
            data: { files: [] }
        });

        const createResult = await drive.files.create({
            name: 'test.txt',
            media: { body: 'test content' }
        });
        expect(createResult).toEqual({
            data: { id: 'test-file-id' }
        });
    });

    test('should provide test utilities', () => {
        expect(global.testUtils).toBeDefined();
        expect(global.testUtils.createMockUser).toBeDefined();
        expect(global.testUtils.createMockRequest).toBeDefined();
        expect(global.testUtils.createMockResponse).toBeDefined();

        const mockUser = global.testUtils.createMockUser();
        expect(mockUser).toHaveProperty('id');
        expect(mockUser).toHaveProperty('email');

        const mockReq = global.testUtils.createMockRequest();
        expect(mockReq).toHaveProperty('body');
        expect(mockReq).toHaveProperty('params');

        const mockRes = global.testUtils.createMockResponse();
        expect(mockRes.status).toBeDefined();
        expect(mockRes.json).toBeDefined();
    });

    test('should handle environment variables', () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(process.env.JWT_SECRET).toBe('test-secret');
        expect(process.env.SUPABASE_URL).toBe('https://test.supabase.co');
        expect(process.env.GOOGLE_CLIENT_ID).toBe('test-google-client-id');
    });
});
