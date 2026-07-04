import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="reset-wrapper animate-fade-in-up">
      <div class="reset-container glass-panel">
        <div class="reset-header">
          <span class="material-symbols-outlined logo-icon">lock_open</span>
          <h2>Set New Password</h2>
          <p>Please enter your new password to regain access to your business account.</p>
        </div>

        <form (ngSubmit)="onSubmit()" #resetForm="ngForm" *ngIf="!successState() && token">
          <div class="error-alert" *ngIf="errorMsg()">
            <span class="material-symbols-outlined">error</span>
            {{ errorMsg() }}
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">lock</span>
              <input type="password" id="newPassword" name="newPassword" [(ngModel)]="newPassword" required minlength="6" placeholder="At least 6 characters">
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">lock</span>
              <input type="password" id="confirmPassword" name="confirmPassword" [(ngModel)]="confirmPassword" required placeholder="Re-enter password">
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-primary reset-submit-btn" [disabled]="isLoading() || !resetForm.valid">
            <span *ngIf="!isLoading()">Update Password</span>
            <span *ngIf="isLoading()" class="loading-spinner"></span>
          </button>
        </form>

        <!-- Error State if Token is missing -->
        <div class="error-state-box animate-fade-in-up" *ngIf="!token">
          <span class="material-symbols-outlined error-icon">warning</span>
          <h3>Invalid Reset Link</h3>
          <p>No token was provided in the URL. Please verify the link you clicked or request a new one.</p>
          <a routerLink="/forgot-password" class="btn-primary return-forgot-btn">
            Request New Link
          </a>
        </div>

        <!-- Success State -->
        <div class="success-state animate-fade-in-up" *ngIf="successState()">
          <div class="success-icon-wrapper">
            <span class="material-symbols-outlined success-icon">check_circle</span>
          </div>
          <h3>Password Updated!</h3>
          <p>Your password has been successfully reset. You can now sign in with your new password.</p>
          <a routerLink="/login" class="btn-primary return-login-btn">
            Sign In Now
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: radial-gradient(circle at 10% 20%, rgba(98, 0, 234, 0.08) 0%, transparent 45%);
    }

    .reset-container {
      width: 100%;
      max-width: 440px;
      padding: 40px;
    }

    .reset-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-icon {
      font-size: 40px;
      color: var(--accent-purple);
      margin-bottom: 12px;
    }

    .reset-header h2 {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .reset-header p {
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

    .reset-submit-btn {
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

    /* Error State Box */
    .error-state-box {
      text-align: center;
      padding: 20px 0;
    }

    .error-icon {
      font-size: 44px;
      color: #f87171;
      margin-bottom: 12px;
    }

    .error-state-box h3 {
      font-size: 1.3rem;
      margin: 0 0 8px 0;
    }

    .error-state-box p {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 25px;
    }

    .return-forgot-btn {
      width: 100%;
      justify-content: center;
      padding: 12px;
      text-decoration: none;
      display: inline-flex;
    }

    /* Success State styles */
    .success-state {
      text-align: center;
      padding: 10px 0;
    }

    .success-icon-wrapper {
      display: inline-flex;
      padding: 16px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 50%;
      color: #34d399;
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

    .return-login-btn {
      width: 100%;
      justify-content: center;
      padding: 12px;
      text-decoration: none;
      display: inline-flex;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword = '';
  confirmPassword = '';
  readonly isLoading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly successState = signal(false);

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    // Extract token query parameter from URL
    this.token = this.route.snapshot.queryParams['token'] || null;
  }

  onSubmit(): void {
    if (!this.token) {
      this.errorMsg.set('Reset token is missing.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg.set('Passwords do not match.');
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMsg.set('Password must be at least 6 characters.');
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.apiService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successState.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.error || 'Failed to reset password. The link may have expired.');
      }
    });
  }
}
