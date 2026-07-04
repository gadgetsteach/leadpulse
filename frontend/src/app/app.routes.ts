import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { FormBuilderComponent } from './pages/form-builder/form-builder';
import { PublicFormComponent } from './pages/public-form/public-form';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { StaticPageComponent } from './pages/static-page';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/builder/:id', component: FormBuilderComponent },
  { path: 'f/:slug', component: PublicFormComponent },
  { path: 'p/:page', component: StaticPageComponent },
  { path: '**', redirectTo: '' }
];
