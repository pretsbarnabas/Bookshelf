import { TestBed } from '@angular/core/testing';
import { SummaryService } from '../../app/services/page/summary.service';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { SummaryModel, SummaryRoot } from '../../app/models/Summary';
import { of } from 'rxjs';

describe('SummaryService', () => {
    let service: SummaryService;
    let crudService: CrudService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        crudService = TestBed.inject(CrudService);
        service = TestBed.inject(SummaryService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
        expect(service['crudService']).toBeDefined();
    });

    it('Should call crudService.getAll', () => {
        const pageSize = 10;
        const pageIndex = 1;
        const response: SummaryRoot = { data: [], pages: 0 };
        spyOn(crudService, 'getAll').and.returnValue(of(response));

        service.getAllSummaries(pageSize, pageIndex).subscribe(response => {
            expect(crudService.getAll).toHaveBeenCalledWith(`summaries?limit=${pageSize}&page=${pageIndex}`);
            expect(response).toEqual(response);
        });
    });

    it('Should call crudService.delete', () => {
        const summaryId = 'testId';
        spyOn(crudService, 'delete').and.returnValue(of({}));

        service.deleteSummary(summaryId).subscribe(response => {
            expect(crudService.delete).toHaveBeenCalledWith('summaries', summaryId);
            expect(response).toEqual({});
        });
    });

    it('Should call crudService.update', () => {
        const modifiedSummary: SummaryModel = { _id: 'testId', content: 'testContent' } as SummaryModel;
        spyOn(crudService, 'update').and.returnValue(of({}));

        service.updateSummary(modifiedSummary._id, modifiedSummary).subscribe(response => {
            expect(crudService.update).toHaveBeenCalledWith('summaries', modifiedSummary._id, modifiedSummary);
            expect(response).toEqual({});
        });
    });
});
