import { TestBed } from '@angular/core/testing';

import { CheckRole } from './check-role';

describe('CheckRole', () => {
  let service: CheckRole;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckRole);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
