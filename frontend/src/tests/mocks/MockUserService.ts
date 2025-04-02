export default class MockUserService {
    getAllUser = jasmine.createSpy('getAllUser');
    deleteUser = jasmine.createSpy('deleteUser');
    updateUser = jasmine.createSpy('updateUser');
}