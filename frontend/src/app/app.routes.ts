import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { FormBuilderComponent } from './pages/form-builder/form-builder';
import { PublicFormComponent } from './pages/public-form/public-form';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { StaticPageComponent } from './pages/static-page';
import { BenefitsComponent } from './pages/benefits/benefits';
import { ProfileComponent } from './pages/profile/profile';
import { ReviewsComponent } from './pages/reviews/reviews';
import { PublicReviewComponent } from './pages/public-review/public-review';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  
  // Guarded Dashboard Routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/builder/:id', component: FormBuilderComponent, canActivate: [authGuard] },
  { path: 'dashboard/benefits', component: BenefitsComponent, canActivate: [authGuard] },
  { path: 'dashboard/profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'dashboard/reviews', component: ReviewsComponent, canActivate: [authGuard] },
  
  { path: 'review/:businessId', component: PublicReviewComponent },
  { path: 'f/:slug', component: PublicFormComponent },
  { path: 'p/:page', component: StaticPageComponent },
  { path: '**', redirectTo: '' }
];
