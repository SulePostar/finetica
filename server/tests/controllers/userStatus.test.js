const {
    getAllUserStatuses,
    getUserStatusById,
    createUserStatus,
    deleteUserStatus,
} = require('../../controllers/userStatus');
const userStatusService = require('../../services/userStatus');
const AppError = require('../../utils/errorHandler');

jest.mock('../../services/userStatus');

const mockRequest = (params = {}, body = {}) => ({ params, body });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('User Status Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUserStatuses', () => {
        it('should return all statuses with a 200 status', async () => {
            const mockStatuses = [{ id: 1, status: 'approved' }];
            userStatusService.getAllUserStatuses.mockResolvedValue(mockStatuses);
            const res = mockResponse();
            await getAllUserStatuses(mockRequest(), res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockStatuses }));
        });
    });

    describe('getUserStatusById', () => {
        it('should return a single status with a 200 status', async () => {
            const mockStatus = { id: 1, status: 'approved' };
            userStatusService.getUserStatusById.mockResolvedValue(mockStatus);
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            await getUserStatusById(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockStatus }));
        });

        it('should return a 404 error if the status is not found', async () => {
            userStatusService.getUserStatusById.mockRejectedValue(new AppError('Status not found', 404));
            const req = mockRequest({ id: '999' });
            const res = mockResponse();
            await getUserStatusById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ details: 'Status not found' }));
        });
    });

    describe('createUserStatus', () => {
        it('should create a new status and return it with a 201 status', async () => {
            const newStatus = { id: 3, status: 'rejected' };
            userStatusService.createUserStatus.mockResolvedValue(newStatus);
            const req = mockRequest({}, { status: 'rejected' });
            const res = mockResponse();
            await createUserStatus(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: newStatus }));
        });
    });

    describe('deleteUserStatus', () => {
        it('should delete a status and return a success message', async () => {
            userStatusService.deleteUserStatus.mockResolvedValue();
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            await deleteUserStatus(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User status deleted successfully' });
        });
    });
});