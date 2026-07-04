import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="profile-container animate-fade-in-up">
      <!-- Header -->
      <header class="page-header glass-panel">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </a>
          <h1 class="gradient-text">Complete Business Profile</h1>
          <p class="subtitle">Update contact details, logos, and verify your credentials to reach 100% profile health</p>
        </div>
      </header>

      <!-- Profile Workspace Grid -->
      <div class="profile-workspace">
        <!-- Main Form Panel -->
        <main class="profile-main glass-panel">
          <h2>Business Details</h2>
          <form (submit)="saveProfile($event)" class="profile-form">
            <div class="form-group">
              <label>Business Name</label>
              <input type="text" [value]="business()?.name" readonly class="readonly-input">
              <p class="input-desc">Contact support to change your registered legal entity name.</p>
            </div>

            <div class="form-group">
              <label for="profPhone">Mobile / Phone Number</label>
              <div class="input-row">
                <input 
                  type="text" 
                  id="profPhone" 
                  [(ngModel)]="tempPhone" 
                  name="profPhone" 
                  required 
                  placeholder="e.g. +91 7753058069"
                  (ngModelChange)="onPhoneChange()">
                <button 
                  type="button" 
                  class="btn-primary verify-btn" 
                  *ngIf="!profilePhoneVerified() && tempPhone" 
                  (click)="verifyPhone()">
                  Verify Number
                </button>
                <span class="verified-label" *ngIf="profilePhoneVerified()">
                  <span class="material-symbols-outlined">check_circle</span> Verified
                </span>
              </div>
              <p class="input-desc">Enter your primary business mobile number. Click Verify to receive simulation codes.</p>
            </div>

            <div class="form-group">
              <label for="profLogo">Business Logo URL</label>
              <input type="text" id="profLogo" [(ngModel)]="tempLogo" name="profLogo" placeholder="e.g. https://domain.com/logo.png">
              <p class="input-desc">Provide a public URL to your business logo. This renders on your qualification sheets.</p>
            </div>

            <button type="submit" class="btn-primary save-btn">
              Save Business Profile
            </button>
          </form>
        </main>

        <!-- Sidebar Progress -->
        <aside class="profile-sidebar glass-panel">
          <h3>Profile Health</h3>
          <p class="sidebar-desc">Complete profile credentials to optimize user trust and acquire better prospects.</p>

          <div class="completion-meter">
            <div class="meter-labels">
              <span>Overall Completeness</span>
              <strong>{{ profileCompletion() }}%</strong>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" [style.width.%]="profileCompletion()"></div>
            </div>
          </div>

          <ul class="checklist">
            <li class="checked">
              <span class="material-symbols-outlined check-icon">check_circle</span>
              <span>Account Setup</span>
            </li>
            <li class="checked">
              <span class="material-symbols-outlined check-icon">check_circle</span>
              <span>Email Verified</span>
            </li>
            <li [class.checked]="profilePhoneVerified()" [class.unchecked]="!profilePhoneVerified()">
              <span class="material-symbols-outlined check-icon" *ngIf="profilePhoneVerified()">check_circle</span>
              <span class="material-symbols-outlined warning-icon" *ngIf="!profilePhoneVerified()">error</span>
              <span>Phone Verified</span>
            </li>
          </ul>

          <div class="info-alert-box" *ngIf="!profilePhoneVerified()">
            <span class="material-symbols-outlined alert-icon">info</span>
            <p>Your phone is currently unverified. Add a phone number and click **Verify Number** to secure your account health rating.</p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      gap: 30px;
      min-height: 100vh;
      box-sizing: border-box;
    }

    .page-header {
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--accent-purple);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: var(--transition-smooth);
    }

    .btn-back:hover {
      color: white;
      transform: translateX(-3px);
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .page-header .subtitle {
      margin: 0;
      font-size: 0.95rem;
      color: var(--text-muted);
    }

    /* Workspace Grid */
    .profile-workspace {
      display: grid;
      grid-template-columns: 1.4fr 0.6fr;
      gap: 25px;
      align-items: start;
    }

    @media (max-width: 900px) {
      .profile-workspace {
        grid-template-columns: 1fr;
      }
    }

    .profile-main, .profile-sidebar {
      padding: 35px;
    }

    .profile-main h2, .profile-sidebar h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin: 0 0 20px 0;
      border-bottom: 1px solid var(--dark-border);
      padding-bottom: 12px;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .form-group input {
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      border-radius: 8px;
      padding: 12px;
      color: white;
      font-family: var(--font-family);
      font-size: 0.95rem;
      outline: none;
      transition: var(--transition-smooth);
    }

    .form-group input:focus {
      border-color: var(--accent-purple);
      box-shadow: 0 0 10px var(--primary-glow);
    }

    .readonly-input {
      background: rgba(255, 255, 255, 0.02) !important;
      border-color: var(--dark-border) !important;
      color: var(--text-muted) !important;
      cursor: not-allowed;
    }

    .input-row {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .input-row input {
      flex-grow: 1;
    }

    .input-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 2px 0 0 0;
    }

    .verify-btn {
      padding: 10px 20px;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .verified-label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #10b981;
      font-weight: 600;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .verified-label .material-symbols-outlined {
      font-size: 18px;
    }

    .save-btn {
      align-self: flex-start;
      margin-top: 10px;
    }

    /* Sidebar styles */
    .sidebar-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 24px 0;
    }

    .completion-meter {
      margin-bottom: 25px;
    }

    .meter-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid var(--dark-border);
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent-purple) 100%);
      border-radius: 4px;
      transition: var(--transition-smooth);
    }

    .checklist {
      list-style: none;
      padding: 0;
      margin: 0 0 25px 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .checklist li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
    }

    .checklist li .material-symbols-outlined {
      font-size: 20px;
    }

    .checklist li.checked {
      color: white;
    }

    .checklist li.checked .check-icon {
      color: #10b981;
    }

    .checklist li.unchecked {
      color: var(--text-muted);
    }

    .checklist li.unchecked .warning-icon {
      color: #f59e0b;
    }

    .info-alert-box {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      background: rgba(245, 158, 11, 0.03);
      border: 1px solid rgba(245, 158, 11, 0.15);
      border-radius: 8px;
      padding: 12px;
    }

    .info-alert-box .alert-icon {
      font-size: 18px;
      color: #f59e0b;
      margin-top: 2px;
    }

    .info-alert-box p {
      margin: 0;
      font-size: 0.75rem;
      color: #fbbf24;
      line-height: 1.4;
    }
  `]
})
export class ProfileComponent implements OnInit {
  readonly business = signal<any | null>(null);

  tempPhone = '';
  tempLogo = '';
  readonly profilePhoneVerified = signal(false);
  readonly profileCompletion = signal(75);

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.business.set(this.apiService.businessSignal());
    
    // Check if phone was previously simulated/saved
    const savedPhone = localStorage.getItem('leadpulse_phone');
    const savedVerified = localStorage.getItem('leadpulse_phone_verified');
    const savedLogo = localStorage.getItem('leadpulse_logo');

    this.tempPhone = savedPhone || this.business()?.phone || '';
    this.tempLogo = savedLogo || this.business()?.logoUrl || '';

    if (savedVerified === 'true') {
      this.profilePhoneVerified.set(true);
      this.profileCompletion.set(100);
    }
  }

  onPhoneChange(): void {
    // If phone changes, reset verification status
    this.profilePhoneVerified.set(false);
    this.profileCompletion.set(75);
    localStorage.removeItem('leadpulse_phone_verified');
  }

  verifyPhone(): void {
    if (!this.tempPhone) {
      alert('Please enter a phone number first!');
      return;
    }
    this.profilePhoneVerified.set(true);
    this.profileCompletion.set(100);
    localStorage.setItem('leadpulse_phone_verified', 'true');
    localStorage.setItem('leadpulse_phone', this.tempPhone);
    alert('Phone number verified successfully! Profile health rating updated to 100%.');
  }

  saveProfile(event: Event): void {
    event.preventDefault();
    localStorage.setItem('leadpulse_phone', this.tempPhone);
    localStorage.setItem('leadpulse_logo', this.tempLogo);
    alert('Business profile updated and saved successfully!');
  }
}
