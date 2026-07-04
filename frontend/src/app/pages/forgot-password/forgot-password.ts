import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="forgot-wrapper animate-fade-in-up">
      <div class="forgot-container glass-panel">
        <div class="forgot-header">
          <span class="material-symbols-outlined logo-icon">lock_reset</span>
          <h2>Reset Password</h2>
          <p>Enter your business email and we'll send you a secure link to reset your password.</p>
        </div>

        <form (ngSubmit)="onSubmit()" #forgotForm="ngForm" *ngIf="!successMsg()">
          <div class="error-alert" *ngIf="errorMsg()">
            <span class="material-symbols-outlined">error</span>
            {{ errorMsg() }}
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">mail</span>
              <input type="email" id="email" name="email" [(ngModel)]="email" required placeholder="name@business.com">
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-primary forgot-submit-btn" [disabled]="isLoading() || !forgotForm.valid">
            <span *ngIf="!isLoading()">Send Reset Link</span>
            <span *ngIf="isLoading()" class="loading-spinner"></span>
          </button>
        </form>

        <!-- Success State -->
        <div class="success-state animate-fade-in-up" *ngIf="successMsg()">
          <div class="success-icon-wrapper">
            <span class="material-symbols-outlined success-icon">mail_lock</span>
          </div>
          <h3>Reset Email Sent!</h3>
          <p>{{ successMsg() }}</p>

          <!-- Mock Reset Link box for local development testing -->
          <div class="dev-mock-box" *ngIf="mockLink()">
            <p class="dev-label"><span class="material-symbols-outlined">bug_report</span> Testing Mode (Link Auto-Generated):</p>
            <a [href]="mockLink()" class="mock-link">
              <span class="material-symbols-outlined">open_in_new</span> Go to Reset Password Page
            </a>
          </div>

          <a routerLink="/login" class="btn-primary return-login-btn">
            Return to Sign In
          </a>
        </div>

        <div class="forgot-footer" *ngIf="!successMsg()">
          <a routerLink="/login" class="back-login-link">
            <span class="material-symbols-outlined">arrow_back</span> Back to Sign In
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: radial-gradient(circle at 10% 20%, rgba(98, 0, 234, 0.08) 0%, transparent 45%);
    }

    .forgot-container {
      width: 100%;
      max-width: 440px;
      padding: 40px;
    }

    .forgot-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-icon {
      font-size: 40px;
      color: var(--accent-purple);
      margin-bottom: 12px;
    }

    .forgot-header h2 {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .forgot-header p {
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

    input {
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

    input:focus {
      outline: none;
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.15);
      background: rgba(255, 255, 255, 0.02);
    }

    .forgot-submit-btn {
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

    .forgot-footer {
      text-align: center;
      margin-top: 25px;
    }

    .back-login-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: var(--text-muted) !important;
      font-size: 0.85rem;
      text-decoration: none;
      transition: var(--transition-smooth);
    }

    .back-login-link:hover {
      color: var(--text-primary) !important;
    }

    /* Success State styles */
    .success-state {
      text-align: center;
      padding: 10px 0;
    }

    .success-icon-wrapper {
      display: inline-flex;
      padding: 16px;
      background: rgba(124, 58, 237, 0.1);
      border-radius: 50%;
      color: var(--accent-purple);
      margin-bottom: 20px;
    }

    .success-icon {
      font-size: 40px;
    }

    .success-state h3 {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 10px 0;
    }

    .success-state p {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 25px;
    }

    .dev-mock-box {
      background: rgba(0, 0, 0, 0.2);
      border: 1px dashed var(--dark-border);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 25px;
      text-align: left;
    }

    .dev-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .dev-label .material-symbols-outlined {
      font-size: 16px;
      color: var(--accent-purple);
    }

    .mock-link {
      color: var(--accent-purple);
      font-weight: 600;
      text-decoration: none;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .mock-link:hover {
      text-decoration: underline;
    }

    .mock-link .material-symbols-outlined {
      font-size: 18px;
    }

    .return-login-btn {
      width: 100%;
      justify-content: center;
      padding: 12px;
      text-decoration: none;
      display: inline-flex;
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  readonly isLoading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);
  readonly mockLink = signal<string | null>(null);

  constructor(private apiService: ApiService) {}

  onSubmit(): void {
    if (!this.email) return;

    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.apiService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.successMsg.set(res.message || 'Reset password link sent.');
        if (res.resetLink) {
          this.mockLink.set(res.resetLink);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.error || 'Failed to submit request. Please try again.');
      }
    });
  }
}
