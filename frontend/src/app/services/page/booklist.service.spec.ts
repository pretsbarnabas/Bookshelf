import { TestBed } from '@angular/core/testing';

import { BooklistService } from './booklist.service';

describe('BooklistService', () => {
  let service: BooklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
