import { of } from "rxjs";

export default class MockCommentService {
    getAllcomments = jasmine.createSpy().and.returnValue(of({ data: [], pages: 1 }));
    getLikedBy = jasmine.createSpy().and.returnValue(of([]));
    getDislikedBy = jasmine.createSpy().and.returnValue(of([]));
    createComment = jasmine.createSpy().and.returnValue(of({}));
    deleteComment = jasmine.createSpy().and.returnValue(of({}));
    updateComment = jasmine.createSpy().and.returnValue(of({}));
}