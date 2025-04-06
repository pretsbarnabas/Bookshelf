import { pipe } from "rxjs";
import { TruncatePipe } from "../../app/pipes/truncate.pipe";
import { TestBed } from "@angular/core/testing";


describe('TruncatePipe', () => {
    let pipe: TruncatePipe;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                TruncatePipe
            ]
        });
        pipe = TestBed.inject(TruncatePipe);
    })

    it('Create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should truncate text of 8 characters or longer', () => {
        expect(pipe.transform('longtextfortesting')).toBe('longtext...');
    })

    it('Should not truncate text less than 8 characters', () => {
        expect(pipe.transform('short')).toBe('short');
    })
});
