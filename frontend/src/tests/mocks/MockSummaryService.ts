export default class MockSummaryService {
    getAllSummaries = jasmine.createSpy('getAllSummaries');
    deleteSummary = jasmine.createSpy('deleteSummary');
    updateSummary = jasmine.createSpy('updateSummary');
}