import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CheckRole } from '../services/check-role';

export const checkRoleGuardGuard: CanActivateFn = (route, state) => {
  const checkRole = inject(CheckRole)
  const router = inject(Router)

  if (checkRole.isAdmin()) {
    return true
  }else{
    router.navigate(["/home"])
    return false
  }
};
