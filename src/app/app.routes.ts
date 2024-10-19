import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SystemComponent} from './components/system/system.component';
import {LoginGuard} from './shared/guards/login.guard';
import {SystemGuard} from './shared/guards/system.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'system', component: SystemComponent, canActivate: [SystemGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: '' }
];
