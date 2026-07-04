import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { FormBuilderComponent } from './pages/form-builder/form-builder';
import { PublicFormComponent } from './pages/public-form/public-form';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/builder/:id', component: FormBuilderComponent },
  { path: 'f/:slug', component: PublicFormComponent },
  { path: '**', redirectTo: '' }
];
