import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="login-wrapper animate-fade-in-up">
      <div class="login-container glass-panel">
        <div class="login-header">
          <span class="material-symbols-outlined logo-icon">insights</span>
          <h2>{{ isLogin() ? 'Sign in to fintel' : 'Register your Business' }}</h2>
          <p>{{ isLogin() ? 'Access your lead dashboard & manage forms' : 'Get custom forms, SEO pages, and lead tracking' }}</p>
        </div>

        <form (ngSubmit)="onSubmit()" #authForm="ngForm">
          <div class="error-alert" *ngIf="errorMsg()">
            <span class="material-symbols-outlined">error</span>
            {{ errorMsg() }}
          </div>

          <!-- Business Name (Register Only) -->
          <div class="form-group" *ngIf="!isLogin()">
            <label for="name">Business Name</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">store</span>
              <input type="text" id="name" name="name" [(ngModel)]="name" required placeholder="e.g. Spotless Cleaners">
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">mail</span>
              <input type="email" id="email" name="email" [(ngModel)]="email" required placeholder="name@business.com">
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">lock</span>
              <input type="password" id="password" name="password" [(ngModel)]="password" required placeholder="••••••••">
            </div>
          </div>

          <!-- Business Description (Register Only) -->
          <div class="form-group" *ngIf="!isLogin()">
            <label for="description">Short Description (SEO & Branding)</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon font-icon">description</span>
              <textarea id="description" name="description" [(ngModel)]="description" placeholder="Describe the services your business offers..."></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-primary auth-submit-btn" [disabled]="isLoading() || !authForm.valid">
            <span *ngIf="!isLoading()">{{ isLogin() ? 'Sign In' : 'Create Account' }}</span>
            <span *ngIf="isLoading()" class="loading-spinner"></span>
          </button>
        </form>

        <div class="login-footer">
          <p>
            {{ isLogin() ? "Don't have an account?" : 'Already have a business account?' }}
            <a href="javascript:void(0)" (click)="toggleMode()">{{ isLogin() ? 'Sign Up' : 'Sign In' }}</a>
          </p>
          <a routerLink="/" class="back-home-link">
            <span class="material-symbols-outlined">arrow_back</span> Back to Home
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: radial-gradient(circle at 10% 20%, rgba(98, 0, 234, 0.08) 0%, transparent 45%);
    }

    .login-container {
      width: 100%;
      max-width: 440px;
      padding: 40px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-icon {
      font-size: 40px;
      color: var(--accent-purple);
      margin-bottom: 12px;
    }

    .login-header h2 {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .login-header p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.4;
    }

    .error-alert {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
      padding: 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-group {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      color: var(--text-muted);
      font-size: 20px;
    }
    
    .font-icon {
      top: 14px;
    }

    input, textarea {
      width: 100%;
      padding: 12px 14px 12px 42px;
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      border-radius: 8px;
      color: var(--text-primary);
      font-family: var(--font-family);
      font-size: 0.95rem;
      transition: var(--transition-smooth);
      box-sizing: border-box;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.15);
      background: rgba(255, 255, 255, 0.02);
    }

    .auth-submit-btn {
      width: 100%;
      justify-content: center;
      margin-top: 10px;
      padding: 12px;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-footer {
      text-align: center;
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .login-footer p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0;
    }

    .login-footer a {
      color: var(--accent-purple);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition-smooth);
    }

    .login-footer a:hover {
      color: white;
      text-shadow: 0 0 8px rgba(192, 132, 252, 0.6);
    }

    .back-home-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: var(--text-muted) !important;
      font-size: 0.85rem;
      font-weight: 400 !important;
      text-decoration: none;
      transition: var(--transition-smooth);
    }

    .back-home-link:hover {
      color: var(--text-primary) !important;
    }
  `]
})
export class LoginComponent {
  // Signals for local UI state
  readonly isLogin = signal(true);
  readonly isLoading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  // Model bindings
  name = '';
  email = '';
  password = '';
  description = '';

  constructor(private apiService: ApiService, private router: Router) {}

  toggleMode(): void {
    this.isLogin.update(val => !val);
    this.errorMsg.set(null);
  }

  onSubmit(): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);

    const payload = this.isLogin() 
      ? { email: this.email, password: this.password }
      : { name: this.name, email: this.email, password: this.password, description: this.description };

    const request$ = this.isLogin()
      ? this.apiService.login(payload)
      : this.apiService.register(payload);

    request$.subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.error || 'Authentication failed. Please check inputs.');
      }
    });
  }
}
