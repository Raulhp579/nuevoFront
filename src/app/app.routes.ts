import { Routes } from '@angular/router';
import { Header } from './components/header/header';
import { Home } from './components/home/home';
import { Fichajes } from './components/fichajes/fichajes';
import { User } from './components/user/user';

export const routes: Routes = [
    {path:'header', component:Header},
    {path:'home', component:Home},
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'fichajes',component:Fichajes},
    {path:'user', component:User}
];
