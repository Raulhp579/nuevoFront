import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkRoleGuardGuard } from './check-role-guard-guard';

describe('checkRoleGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkRoleGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
