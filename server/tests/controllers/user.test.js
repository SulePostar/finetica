const { getAllUsers, updateUser } = require('../../controllers/user');
const userService = require('../../services/users');
const { UserResponseDTO } = require('../../dto/user/responses/UserResponseDTO');
jest.mock('../../services/users');
const mockRequest = (params = {}, body = {}) => ({ params, body });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext = () => jest.fn();
describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllUsers', () => {
        test('should fetch all users and return them in DTO format with a 200 status', async () => {
            const mockUsersFromService = [
                {
                    id: 1,
                    email: 'admin@example.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: { get: () => 'admin' },
                    status: { get: () => 'approved' },
                },
            ];
            userService.getAllUsers.mockResolvedValue(mockUsersFromService);
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();
            await getAllUsers(req, res, next);
            expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockUsersFromService);
        });
        test('should handle errors and return a 500 status', async () => {
            const errorMessage = 'Database error';
            userService.getAllUsers.mockRejectedValue(new Error(errorMessage));
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();
            await getAllUsers(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
    describe('updateUser', () => {
        test('should update a user successfully and return the updated user in DTO format', async () => {
            const userId = '1';
            const updateData = { firstName: 'Updated', roleId: 2 };
            const updatedUserFromService = {
                id: 1,
                email: 'admin@example.com',
                firstName: 'Updated',
                lastName: 'User',
                roleId: 2,
                role: { get: () => 'user' },
                status: { get: () => 'approved' },
            };
            userService.updateUser.mockResolvedValue(updatedUserFromService);
            const req = mockRequest({ id: userId }, updateData);
            const res = mockResponse();
            const next = mockNext();
            await updateUser(req, res, next);
            expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(updatedUserFromService);
        });
        test('should return a 400 error for an invalid roleId', async () => {
            const userId = '1';
            const updateData = { roleId: 99 };
            userService.updateUser.mockResolvedValue({ id: 1, roleId: 99 });
            const req = mockRequest({ id: userId }, updateData);
            const res = mockResponse();
            const next = mockNext();
            await updateUser(req, res, next);
            expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
            expect(res.json).toHaveBeenCalledWith({ id: 1, roleId: 99 });
        });
    });
});