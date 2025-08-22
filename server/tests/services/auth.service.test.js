const {
    getAllUsers,
    updateUser,
    getUserById,
    deleteUser,
    getMyProfile,
    editMyProfile,
} = require('../../controllers/user');
const userService = require('../../services/users');
const { UserResponseDTO } = require('../../dto/user/responses/UserResponseDTO');
jest.mock('../../services/users');
const mockRequest = (params = {}, body = {}, user = null) => ({ params, body, user });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllUsers', () => {
        test('should fetch all users and return them in DTO format', async () => {
            const mockUsers = [{ id: 1, firstName: 'Test', lastName: 'User', role: { get: () => 'user' }, status: { get: () => 'approved' } }];
            userService.getAllUsers.mockResolvedValue(mockUsers);
            const req = mockRequest();
            const res = mockResponse();
            await getAllUsers(req, res);
            expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith([new UserResponseDTO(mockUsers[0])]);
        });
    });
    describe('updateUser', () => {
        test('should update a user successfully', async () => {
            const updatedUser = { id: 1, firstName: 'Updated', lastName: 'User' };
            userService.updateUserByAdmin.mockResolvedValue(updatedUser);
            const req = mockRequest({ id: '1' }, { firstName: 'Updated' });
            const res = mockResponse();
            await updateUser(req, res);
            expect(userService.updateUserByAdmin).toHaveBeenCalledWith('1', { firstName: 'Updated' });
            expect(res.json).toHaveBeenCalledWith(new UserResponseDTO(updatedUser));
        });
    });
    describe('getUserById', () => {
        test('should fetch a single user by ID and return it in DTO format', async () => {
            const mockUser = { id: 1, firstName: 'Test', lastName: 'User' };
            userService.getUserById.mockResolvedValue(mockUser);
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            await getUserById(req, res);
            expect(userService.getUserById).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith(new UserResponseDTO(mockUser));
        });
        test('should return a 404 error if user is not found', async () => {
            userService.getUserById.mockResolvedValue(null);
            const req = mockRequest({ id: '999' });
            const res = mockResponse();
            await getUserById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });
    describe('deleteUser', () => {
        test('should delete a user and return a success message', async () => {
            userService.deleteUserByAdmin.mockResolvedValue();
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            await deleteUser(req, res);
            expect(userService.deleteUserByAdmin).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });
    });
    describe('getMyProfile', () => {
        test('should get the profile for the authenticated user', async () => {
            const mockProfile = { id: 123, firstName: 'Authenticated', lastName: 'User' };
            userService.getUserById.mockResolvedValue(mockProfile);
            const req = mockRequest({}, {}, { id: 123 });
            const res = mockResponse();
            const next = jest.fn();
            await getMyProfile(req, res, next);
            expect(userService.getUserById).toHaveBeenCalledWith(123);
            expect(res.json).toHaveBeenCalledWith(new UserResponseDTO(mockProfile));
            expect(next).not.toHaveBeenCalled();
        });
    });
    describe('editMyProfile', () => {
        test('should edit the profile for the authenticated user', async () => {
            const updateData = { id: 123, firstName: 'NewFirstName' };
            const updatedProfile = { id: 123, firstName: 'NewFirstName', lastName: 'User' };
            userService.updateProfile.mockResolvedValue(updatedProfile);
            const req = mockRequest({}, updateData);
            const res = mockResponse();
            const next = jest.fn();
            await editMyProfile(req, res, next);
            expect(userService.updateProfile).toHaveBeenCalledWith(123, { firstName: 'NewFirstName' });
            expect(res.json).toHaveBeenCalledWith(new UserResponseDTO(updatedProfile));
            expect(next).not.toHaveBeenCalled();
        });
        test('should return a 400 error if the user ID is missing from the body', async () => {
            const updateData = { firstName: 'NewFirstName' };
            const req = mockRequest({}, updateData);
            const res = mockResponse();
            const next = jest.fn();
            await editMyProfile(req, res, next);
            expect(userService.updateProfile).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required in request body' });
        });
    });
});