import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="reviews-page-container animate-fade-in-up">
      <!-- Header -->
      <header class="page-header glass-panel">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </a>
          <h1 class="gradient-text">Customer Reviews Portal</h1>
          <p class="subtitle">Build customer confidence, copy your review link, and email review invites to past clients</p>
        </div>
      </header>

      <!-- Main Layout Workspace -->
      <div class="reviews-workspace">
        <!-- Left Side: Ratings & Copy Link -->
        <div class="reviews-main glass-panel">
          <h2>Your Public Reviews Link</h2>
          <p class="section-desc">Share this direct link with your customers after completing projects. Collecting positive reviews increases your lead scores on the platform.</p>

          <div class="review-link-card">
            <label>Share Link</label>
            <div class="link-copy-row">
              <input type="text" readonly [value]="getReviewLink()" class="readonly-input">
              <button type="button" class="btn-primary copy-btn" (click)="copyReviewLink()">
                <span class="material-symbols-outlined">content_copy</span> Copy Link
              </button>
            </div>
          </div>

          <div class="email-invite-section">
            <h3>Email Review Invitation</h3>
            <p class="section-desc font-small">Send a custom email invitation containing your review link directly to your client's inbox.</p>
            
            <form *ngIf="!reviewInviteSent()" (submit)="sendReviewInvite($event)" class="invite-form">
              <div class="form-group">
                <label for="revEmail">Client Email Address</label>
                <input 
                  type="email" 
                  id="revEmail" 
                  [(ngModel)]="reviewEmail" 
                  name="revEmail" 
                  required 
                  placeholder="e.g. client&#64;example.com">
              </div>
              <button type="submit" class="btn-primary">
                Send Invitation Email
              </button>
            </form>

            <div class="invite-success animate-fade-in-up" *ngIf="reviewInviteSent()">
              <span class="material-symbols-outlined">mark_email_read</span>
              <h4>Invitation Sent Successfully!</h4>
              <p>We've sent a review invite to <strong>{{ reviewEmail }}</strong> containing your verified feedback link.</p>
              <button class="btn-secondary" (click)="reviewInviteSent.set(false)">Send Another Invite</button>
            </div>
          </div>
        </div>

        <!-- Right Side: Reputation Stats -->
        <aside class="reviews-sidebar glass-panel">
          <h3>Reputation Metrics</h3>
          
          <div class="rating-badge-card">
            <div class="stars-row">
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
            </div>
            <div class="score-row">
              <strong>4.9</strong>
              <span>Out of 5.0</span>
            </div>
            <p class="total-reviews">Based on 12 client reviews</p>
          </div>

          <div class="breakdown-list">
            <div class="breakdown-row">
              <span>5 Stars</span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: 91%;"></div>
              </div>
              <span>11</span>
            </div>
            <div class="breakdown-row">
              <span>4 Stars</span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: 9%;"></div>
              </div>
              <span>1</span>
            </div>
            <div class="breakdown-row muted">
              <span>3 Stars</span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: 0%;"></div>
              </div>
              <span>0</span>
            </div>
            <div class="breakdown-row muted">
              <span>2 Stars</span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: 0%;"></div>
              </div>
              <span>0</span>
            </div>
            <div class="breakdown-row muted">
              <span>1 Star</span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: 0%;"></div>
              </div>
              <span>0</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .reviews-page-container {
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

    /* Workspace */
    .reviews-workspace {
      display: grid;
      grid-template-columns: 1.3fr 0.7fr;
      gap: 25px;
      align-items: start;
    }

    @media (max-width: 900px) {
      .reviews-workspace {
        grid-template-columns: 1fr;
      }
    }

    .reviews-main, .reviews-sidebar {
      padding: 35px;
    }

    .reviews-main h2, .reviews-main h3, .reviews-sidebar h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin: 0 0 15px 0;
      border-bottom: 1px solid var(--dark-border);
      padding-bottom: 12px;
    }

    .section-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 25px 0;
    }

    .font-small {
      margin-bottom: 15px;
    }

    /* Review Link Card */
    .review-link-card {
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--dark-border);
      padding: 20px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 35px;
    }

    .review-link-card label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .link-copy-row {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .readonly-input {
      flex-grow: 1;
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px solid var(--dark-border) !important;
      color: var(--text-muted) !important;
      border-radius: 8px;
      padding: 12px;
      font-family: var(--font-family);
      font-size: 0.95rem;
      cursor: not-allowed;
      outline: none;
    }

    .copy-btn {
      flex-shrink: 0;
    }

    /* Invite email form */
    .email-invite-section {
      border-top: 1px solid var(--dark-border);
      padding-top: 30px;
    }

    .invite-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 480px;
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

    .invite-success {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      max-width: 480px;
    }

    .invite-success .material-symbols-outlined {
      font-size: 36px;
      color: #10b981;
    }

    .invite-success h4 {
      margin: 0;
      font-size: 1.1rem;
      color: white;
    }

    .invite-success p {
      margin: 0 0 10px 0;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Sidebar reputation */
    .rating-badge-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--dark-border);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 25px;
    }

    .stars-row {
      display: flex;
      gap: 4px;
    }

    .stars-row .material-symbols-outlined.filled {
      color: #f59e0b;
      font-variation-settings: 'FILL' 1;
      font-size: 28px;
    }

    .score-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .score-row strong {
      font-size: 2.2rem;
      font-weight: 800;
      color: white;
    }

    .score-row span {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .total-reviews {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0;
    }

    /* breakdown progress */
    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .breakdown-row {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.8rem;
      color: var(--text-primary);
    }

    .breakdown-row.muted {
      color: var(--text-muted);
    }

    .breakdown-row span:first-child {
      width: 50px;
    }

    .breakdown-row span:last-child {
      width: 15px;
      text-align: right;
    }

    .progress-bar-container {
      flex-grow: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: #f59e0b;
      border-radius: 3px;
    }
  `]
})
export class ReviewsComponent implements OnInit {
  readonly business = signal<any | null>(null);

  reviewEmail = '';
  readonly reviewInviteSent = signal(false);

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.business.set(this.apiService.businessSignal());
  }

  getReviewLink(): string {
    return `http://localhost:4200/review/${this.business()?.id || 'business-id'}`;
  }

  copyReviewLink(): void {
    navigator.clipboard.writeText(this.getReviewLink()).then(() => {
      alert('Reviews invitation link copied to clipboard!');
    });
  }

  sendReviewInvite(event: Event): void {
    event.preventDefault();
    if (!this.reviewEmail) return;
    this.reviewInviteSent.set(true);
  }
}
