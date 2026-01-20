import { TestBed } from '@angular/core/testing';

import { TimeEntrieService } from './time-entrie-service';

describe('TimeEntrieService', () => {
  let service: TimeEntrieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeEntrieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
