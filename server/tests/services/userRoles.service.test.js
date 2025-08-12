const userRoleService = require('../../services/userRoles');
const { Role } = require('../../models');
const AppError = require('../../utils/errorHandler');

jest.mock('../../models', () => ({
    Role: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

describe('User Role Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUserRoles', () => {
        it('should return all roles found by the model', async () => {
            const mockRoles = [{ id: 1, role: 'admin' }];
            Role.findAll.mockResolvedValue(mockRoles);

            const roles = await userRoleService.getAllUserRoles();

            expect(Role.findAll).toHaveBeenCalledTimes(1);
            expect(roles).toEqual(mockRoles);
        });
    });

    describe('getUserRoleById', () => {
        it('should return a single role if found', async () => {
            const mockRole = { id: 1, role: 'admin' };
            Role.findByPk.mockResolvedValue(mockRole);

            const role = await userRoleService.getUserRoleById(1);

            expect(Role.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(role).toEqual(mockRole);
        });

        it('should throw an AppError if role is not found', async () => {
            Role.findByPk.mockResolvedValue(null);

            await expect(userRoleService.getUserRoleById(999)).rejects.toThrow(
                new AppError('Role not found', 404)
            );
        });
    });

    describe('createUserRole', () => {
        it('should create and return a new role if it does not exist', async () => {
            const newRole = { id: 3, role: 'guest' };
            Role.findOne.mockResolvedValue(null);
            Role.create.mockResolvedValue(newRole);

            const result = await userRoleService.createUserRole('guest');

            expect(Role.findOne).toHaveBeenCalledWith({ where: { role: 'guest' } });
            expect(Role.create).toHaveBeenCalledWith({ role: 'guest' });
            expect(result).toEqual(newRole);
        });

        it('should throw an AppError if the role already exists', async () => {
            Role.findOne.mockResolvedValue({ id: 1, role: 'admin' });

            await expect(userRoleService.createUserRole('admin')).rejects.toThrow(
                new AppError('Role already exists', 400)
            );
        });
    });

    describe('deleteUserRole', () => {
        it('should delete a role if it exists', async () => {
            const mockRole = { id: 1, role: 'admin', destroy: jest.fn().mockResolvedValue() };
            Role.findByPk.mockResolvedValue(mockRole);

            await userRoleService.deleteUserRole(1);

            expect(Role.findByPk).toHaveBeenCalledWith(1);
            expect(mockRole.destroy).toHaveBeenCalledTimes(1);
        });

        it('should throw an AppError if the role to delete is not found', async () => {
            Role.findByPk.mockResolvedValue(null);

            await expect(userRoleService.deleteUserRole(999)).rejects.toThrow(
                new AppError('Role not found', 404)
            );
        });
    });
});