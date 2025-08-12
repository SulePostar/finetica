const userStatusService = require('../../services/userStatus');
const { UserStatus } = require('../../models');
const AppError = require('../../utils/errorHandler');

jest.mock('../../models', () => ({
    UserStatus: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

describe('User Status Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUserStatuses', () => {
        it('should return all statuses found by the model', async () => {
            const mockStatuses = [{ id: 1, status: 'approved' }];
            UserStatus.findAll.mockResolvedValue(mockStatuses);

            const statuses = await userStatusService.getAllUserStatuses();

            expect(UserStatus.findAll).toHaveBeenCalledTimes(1);
            expect(statuses).toEqual(mockStatuses);
        });
    });

    describe('getUserStatusById', () => {
        it('should return a single status if found', async () => {
            const mockStatus = { id: 1, status: 'approved' };
            UserStatus.findByPk.mockResolvedValue(mockStatus);

            const status = await userStatusService.getUserStatusById(1);

            expect(UserStatus.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(status).toEqual(mockStatus);
        });

        it('should throw an AppError if status is not found', async () => {
            UserStatus.findByPk.mockResolvedValue(null);

            await expect(userStatusService.getUserStatusById(999)).rejects.toThrow(
                new AppError('Status not found', 404)
            );
        });
    });

    describe('createUserStatus', () => {
        it('should create and return a new status if it does not exist', async () => {
            const newStatus = { id: 3, status: 'rejected' };
            UserStatus.findOne.mockResolvedValue(null);
            UserStatus.create.mockResolvedValue(newStatus);

            const result = await userStatusService.createUserStatus('rejected');

            expect(UserStatus.findOne).toHaveBeenCalledWith({ where: { status: 'rejected' } });
            expect(UserStatus.create).toHaveBeenCalledWith({ status: 'rejected' });
            expect(result).toEqual(newStatus);
        });

        it('should throw an AppError if the status already exists', async () => {
            UserStatus.findOne.mockResolvedValue({ id: 1, status: 'approved' });

            await expect(userStatusService.createUserStatus('approved')).rejects.toThrow(
                new AppError('Status already exists', 400)
            );
        });
    });

    describe('deleteUserStatus', () => {
        it('should delete a status if it exists', async () => {
            const mockStatus = { id: 1, status: 'approved', destroy: jest.fn().mockResolvedValue() };
            UserStatus.findByPk.mockResolvedValue(mockStatus);

            await userStatusService.deleteUserStatus(1);

            expect(UserStatus.findByPk).toHaveBeenCalledWith(1);
            expect(mockStatus.destroy).toHaveBeenCalledTimes(1);
        });

        it('should throw an AppError if the status to delete is not found', async () => {
            UserStatus.findByPk.mockResolvedValue(null);

            await expect(userStatusService.deleteUserStatus(999)).rejects.toThrow(
                new AppError('Status not found', 404)
            );
        });
    });
});