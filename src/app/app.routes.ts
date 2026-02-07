import { Routes } from '@angular/router';
import { Header } from './components/header/header';
import { Home } from './components/home/home';
import { Fichajes } from './components/fichajes/fichajes';
import { User } from './components/user/user';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { checkRoleGuardGuard } from './guards/check-role-guard-guard';

export const routes: Routes = [
  { path: 'header', component: Header },
  { path: 'home', component: Home },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'fichajes',
    component: Fichajes,
    canActivate: [checkRoleGuardGuard],
  },
  {
    path: 'user',
    component: User,
    canActivate: [checkRoleGuardGuard],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then((m) => m.Profile),
    canActivate: [checkRoleGuardGuard],
  },
];
