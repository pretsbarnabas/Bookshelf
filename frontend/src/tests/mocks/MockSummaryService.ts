import { of } from "rxjs";

export default class MockSummaryService {
    getAllSummaries = jasmine.createSpy('getAllSummaries');
    deleteSummary = jasmine.createSpy('deleteSummary');
    updateSummary = jasmine.createSpy('updateSummary');
    createSummary = jasmine.createSpy().and.returnValue(of({}));
}