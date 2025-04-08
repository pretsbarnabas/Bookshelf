import { of } from "rxjs";

export default class MockReviewService {
    getAllReviews = jasmine.createSpy('getAllReviews');
    deleteReview = jasmine.createSpy('deleteReview');
    updateReview = jasmine.createSpy('updateReview');
    getLikedBy = jasmine.createSpy().and.returnValue(of([]));
    getDislikedBy = jasmine.createSpy().and.returnValue(of([]));
    putLike = jasmine.createSpy().and.returnValue(of(null));
}