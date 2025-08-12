const {
    getAllUserRoles,
    getUserRoleById,
    createUserRole,
    deleteUserRole,
} = require('../../controllers/userRoles');
const userRoleService = require('../../services/userRoles');
const AppError = require('../../utils/errorHandler');

jest.mock('../../services/userRoles');

const mockRequest = (params = {}, body = {}) => ({ params, body });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('User Roles Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUserRoles', () => {
        it('should return all roles with a 200 status', async () => {
            const mockRoles = [{ id: 1, role: 'admin' }];
            userRoleService.getAllUserRoles.mockResolvedValue(mockRoles);
            const res = mockResponse();
            await getAllUserRoles(mockRequest(), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockRoles }));
        });
    });

    describe('getUserRoleById', () => {
        it('should return a single role with a 200 status', async () => {
            const mockRole = { id: 1, role: 'admin' };
            userRoleService.getUserRoleById.mockResolvedValue(mockRole);
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            await getUserRoleById(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockRole }));
        });

        it('should return a 404 error if the role is not found', async () => {
            userRoleService.getUserRoleById.mockRejectedValue(new AppError('Role not found', 404));
            const req = mockRequest({ id: '999' });
            const res = mockResponse();
            await getUserRoleById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ details: 'Role not found' }));
        });
    });

    describe('createUserRole', () => {
        it('should create a new role and return it with a 201 status', async () => {
            const newRole = { id: 3, role: 'guest' };
            userRoleService.createUserRole.mockResolvedValue(newRole);
            const req = mockRequest({}, { role: 'guest' });
            const res = mockResponse();
            await createUserRole(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: newRole }));
        });
    });

    describe('deleteUserRole', () => {
        it('should delete a role and return a success message', async () => {
            userRoleService.deleteUserRole.mockResolvedValue();
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            await deleteUserRole(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User role deleted successfully' });
        });
    });
});