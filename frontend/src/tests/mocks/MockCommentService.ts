export default class MockCommentService {
    getAllcomments = jasmine.createSpy('getAllcomments');
    deleteComment = jasmine.createSpy('deleteComment');
    updateComment = jasmine.createSpy('updateComment');
}