import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-review',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="review-page-backdrop"></div>
    <div class="review-form-container animate-fade-in-up">
      <!-- Nav Branding -->
      <nav class="nav-bar glass-panel">
        <div class="nav-brand">
          <span class="material-symbols-outlined logo-icon">insights</span>
          <span class="logo-text">LeadPulse Reviews</span>
        </div>
      </nav>

      <!-- Main Review Block -->
      <main class="review-main-card glass-panel" *ngIf="!submitted()">
        <header class="review-header">
          <span class="badge">Verified Customer Feedback</span>
          <h2>Review & Rate Us</h2>
          <p class="subtitle">Your direct, honest feedback helps us improve our customer experience and operations.</p>
        </header>

        <form (submit)="submitReview($event)" class="review-form">
          <!-- Star Rating Input -->
          <div class="form-group rating-stars-group">
            <label>How would you rate your overall experience?</label>
            <div class="star-rating-row">
              <button 
                type="button" 
                *ngFor="let s of [1,2,3,4,5]" 
                (click)="setRating(s)"
                (mouseenter)="hoverRating.set(s)"
                (mouseleave)="hoverRating.set(0)"
                [class.selected]="s <= rating()"
                [class.hovered]="s <= hoverRating()"
                class="star-btn">
                <span class="material-symbols-outlined">star</span>
              </button>
            </div>
            <span class="rating-label-hint" *ngIf="rating()">{{ getRatingHint() }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="revName">Full Name</label>
              <input 
                type="text" 
                id="revName" 
                [(ngModel)]="clientName" 
                name="revName" 
                required 
                placeholder="e.g. John Doe">
            </div>

            <div class="form-group">
              <label for="revEmail">Email Address</label>
              <input 
                type="email" 
                id="revEmail" 
                [(ngModel)]="clientEmail" 
                name="revEmail" 
                required 
                placeholder="e.g. john@example.com">
            </div>
          </div>

          <div class="form-group">
            <label for="revComment">Tell us more about your experience</label>
            <textarea 
              id="revComment" 
              [(ngModel)]="clientComment" 
              name="revComment" 
              required 
              rows="4" 
              placeholder="What did you like? What can we do better?"></textarea>
          </div>

          <button type="submit" [disabled]="!rating() || !clientName || !clientEmail || !clientComment" class="btn-primary submit-btn">
            Submit My Review
            <span class="material-symbols-outlined">send</span>
          </button>
        </form>
      </main>

      <!-- Submitted Success Screen -->
      <main class="review-main-card glass-panel success-card animate-fade-in-up" *ngIf="submitted()">
        <span class="material-symbols-outlined success-icon">check_circle</span>
        <h2>Thank You for Your Feedback!</h2>
        <p class="success-desc">Your rating and review has been submitted and captured successfully. Your rating is now counted automatically in the dashboard reputation metrics.</p>
        
        <div class="submitted-details">
          <div class="summary-item">
            <span>Rating given:</span>
            <div class="stars-preview">
              <span class="material-symbols-outlined filled" *ngFor="let s of [1,2,3,4,5]" [class.active]="s <= rating()">star</span>
            </div>
          </div>
          <div class="summary-item">
            <span>Reviewer name:</span>
            <strong>{{ clientName }}</strong>
          </div>
        </div>

        <a routerLink="/" class="btn-secondary">Go to Homepage</a>
      </main>
    </div>
  `,
  styles: [`
    .review-page-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      background: 
        radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 40%),
        radial-gradient(rgba(255, 255, 255, 0.008) 1.5px, transparent 1.5px);
      background-size: 100% 100%, 100% 100%, 32px 32px;
      pointer-events: none;
    }

    .review-form-container {
      max-width: 650px;
      margin: 0 auto;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      gap: 30px;
      min-height: 100vh;
      box-sizing: border-box;
      justify-content: center;
    }

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 28px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      font-size: 28px;
      color: var(--accent-purple);
    }

    .logo-text {
      font-size: 1.3rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .review-main-card {
      padding: 40px;
    }

    .review-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
      border-bottom: 1px solid var(--dark-border);
      padding-bottom: 25px;
    }

    .review-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: white;
      margin: 0;
    }

    .review-header .subtitle {
      margin: 0;
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .review-form {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .form-group input, .form-group textarea {
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

    .form-group input:focus, .form-group textarea:focus {
      border-color: var(--accent-purple);
      box-shadow: 0 0 10px var(--primary-glow);
    }

    .rating-stars-group {
      align-items: center;
      text-align: center;
    }

    .star-rating-row {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }

    .star-btn {
      background: transparent;
      border: none;
      color: #374151; /* Dark grey */
      cursor: pointer;
      padding: 0;
      transition: var(--transition-smooth);
    }

    .star-btn span {
      font-size: 38px;
      transition: var(--transition-smooth);
    }

    .star-btn.selected, .star-btn.hovered {
      color: #f59e0b; /* Yellow */
    }

    .star-btn.selected span {
      font-variation-settings: 'FILL' 1;
    }

    .star-btn:hover {
      transform: scale(1.15);
    }

    .rating-label-hint {
      font-size: 0.85rem;
      color: #f59e0b;
      font-weight: 600;
    }

    .submit-btn {
      align-self: center;
      margin-top: 15px;
      padding: 12px 30px;
    }

    .badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      background: #f5f3ff;
      color: #7c3aed;
      align-self: flex-start;
    }

    /* Success Card */
    .success-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 50px 40px;
      gap: 20px;
    }

    .success-icon {
      font-size: 64px;
      color: #10b981;
    }

    .success-card h2 {
      font-size: 1.6rem;
      font-weight: 800;
      color: white;
      margin: 0;
    }

    .success-desc {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0;
    }

    .submitted-details {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--dark-border);
      border-radius: 10px;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 380px;
      margin: 10px 0;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .summary-item span {
      color: var(--text-muted);
    }

    .stars-preview .material-symbols-outlined {
      color: #374151;
      font-size: 20px;
    }

    .stars-preview .material-symbols-outlined.filled {
      color: #f59e0b;
      font-variation-settings: 'FILL' 1;
    }
  `]
})
export class PublicReviewComponent implements OnInit {
  businessId = '';
  rating = signal(0);
  hoverRating = signal(0);
  clientName = '';
  clientEmail = '';
  clientComment = '';
  submitted = signal(false);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('businessId') || '';
  }

  setRating(val: number): void {
    this.rating.set(val);
  }

  getRatingHint(): string {
    const hints = ['Terrible', 'Bad', 'Average', 'Good', 'Excellent'];
    return hints[this.rating() - 1] || '';
  }

  submitReview(event: Event): void {
    event.preventDefault();
    if (!this.rating() || !this.clientName || !this.clientEmail || !this.clientComment) {
      return;
    }

    const key = `leadpulse_reviews_${this.businessId}`;
    const stored = localStorage.getItem(key);
    let list: any[] = [];
    if (stored) {
      list = JSON.parse(stored);
    } else {
      // Seed default reviews first
      list = [
        { name: 'John Doe', rating: 5, comment: 'Excellent work!' },
        { name: 'Jane Smith', rating: 5, comment: 'Highly recommended!' },
        { name: 'Bob Johnson', rating: 4, comment: 'Good service' },
        { name: 'Alice Williams', rating: 5, comment: 'Quick responses' },
        { name: 'David Brown', rating: 5, comment: 'Top quality lead filters' },
        { name: 'Emily Davis', rating: 5, comment: 'Saved us hours of manual screening' },
        { name: 'Michael Miller', rating: 5, comment: 'Excellent step forms' },
        { name: 'Sarah Wilson', rating: 5, comment: 'Very clean UI' },
        { name: 'James Taylor', rating: 5, comment: 'A+ support' },
        { name: 'Linda Anderson', rating: 5, comment: 'Best in the business' },
        { name: 'Robert Thomas', rating: 5, comment: 'Highly customizable templates' },
        { name: 'Patricia Jackson', rating: 5, comment: 'Our conversion rates doubled' }
      ];
    }

    list.push({
      name: this.clientName,
      rating: this.rating(),
      comment: this.clientComment
    });

    localStorage.setItem(key, JSON.stringify(list));
    this.submitted.set(true);
  }
}
