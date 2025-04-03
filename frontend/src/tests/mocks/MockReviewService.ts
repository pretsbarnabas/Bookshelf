export default class MockReviewService {
    getAllReviews = jasmine.createSpy('getAllReviews');
    deleteReview = jasmine.createSpy('deleteReview');
    updateReview = jasmine.createSpy('updateReview');
}