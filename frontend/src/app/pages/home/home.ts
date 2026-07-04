import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container animate-fade-in-up">
      <!-- Top Nav -->
      <nav class="nav-bar glass-panel">
        <div class="nav-brand">
          <span class="material-symbols-outlined logo-icon">insights</span>
          <span class="logo-text">LeadPulse</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" class="btn-secondary">Admin Login</a>
          <a routerLink="/login" class="btn-primary">Register Business</a>
        </div>
      </nav>

      <!-- Hero Section -->
      <header class="hero-section">
        <div class="hero-content">
          <span class="badge">Next-Gen Lead Generation</span>
          <h1 class="hero-title">
            Capture Leads with <br>
            <span class="gradient-text">Dynamic Questionnaires</span>
          </h1>
          <p class="hero-subtitle">
            Create custom forms and smart Q&A flows tailored for any business. Fully SEO-optimized, beautifully styled with Material 3, and integrated with powerful analytics.
          </p>
          <div class="hero-actions">
            <a routerLink="/login" class="btn-primary">
              Build Your First Form
              <span class="material-symbols-outlined">arrow_forward</span>
            </a>
            <a href="#features" class="btn-secondary">See How It Works</a>
          </div>
        </div>

        <!-- Hero Preview Card -->
        <div class="hero-preview glass-panel animate-delay-1">
          <div class="preview-header">
            <div class="preview-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="preview-url">leadpulse.app/f/home-cleaning</div>
          </div>
          <div class="preview-body">
            <h3 class="preview-title">Home Cleaning Service Form</h3>
            <div class="preview-field">
              <label>Select service type:</label>
              <div class="preview-select">Deep Cleaning</div>
            </div>
            <div class="preview-field">
              <label>How many bedrooms?</label>
              <div class="preview-radio-group">
                <span class="radio active">2 Beds</span>
                <span class="radio">3 Beds</span>
                <span class="radio">4+ Beds</span>
              </div>
            </div>
            <div class="preview-field">
              <label>When should we arrive?</label>
              <div class="preview-input">July 15, 2026</div>
            </div>
            <button class="preview-submit-btn" disabled>Submit Request</button>
          </div>
        </div>
      </header>

      <!-- Features Section -->
      <section id="features" class="features-section">
        <h2 class="section-title">Why Businesses Choose <span class="gradient-text">LeadPulse</span></h2>
        <div class="features-grid">
          <div class="dashboard-card">
            <div class="feature-icon-wrapper">
              <span class="material-symbols-outlined feature-icon">dynamic_form</span>
            </div>
            <h3>100% Dynamic Forms</h3>
            <p>Customize your questions, answer options, required states, and order for any industry—from home cleaning to web design.</p>
          </div>

          <div class="dashboard-card">
            <div class="feature-icon-wrapper">
              <span class="material-symbols-outlined feature-icon">search</span>
            </div>
            <h3>SEO-Friendly Pages</h3>
            <p>Server-side rendering (SSR) injects custom meta titles and descriptions automatically so your forms index highly on Google.</p>
          </div>

          <div class="dashboard-card">
            <div class="feature-icon-wrapper">
              <span class="material-symbols-outlined feature-icon">monitoring</span>
            </div>
            <h3>Selyst-style Analytics</h3>
            <p>Track views, submission count, conversion rates, and manage incoming lead stages in a consolidated admin dashboard.</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 LeadPulse Technologies. Built for premium business lead capture.</p>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 28px;
      margin-bottom: 60px;
      position: sticky;
      top: 20px;
      z-index: 100;
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
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      gap: 16px;
    }

    /* Hero Section */
    .hero-section {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 60px;
      align-items: center;
      margin-bottom: 100px;
      padding: 20px 0;
    }

    @media (max-width: 900px) {
      .hero-section {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(192, 132, 252, 0.25);
      color: var(--accent-purple);
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.15;
      margin: 0 0 20px 0;
      letter-spacing: -1.5px;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 35px;
      max-width: 580px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    /* Preview Card */
    .hero-preview {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      overflow: hidden;
    }

    .preview-header {
      background: rgba(0, 0, 0, 0.2);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--dark-border);
    }

    .preview-dots {
      display: flex;
      gap: 6px;
      margin-right: 20px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .dot.red { background-color: #ef4444; }
    .dot.yellow { background-color: #f59e0b; }
    .dot.green { background-color: #10b981; }

    .preview-url {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: monospace;
      background: rgba(255, 255, 255, 0.05);
      padding: 3px 12px;
      border-radius: 12px;
      flex: 1;
      text-align: center;
    }

    .preview-body {
      padding: 24px;
    }

    .preview-title {
      font-size: 1.1rem;
      margin: 0 0 20px 0;
      font-weight: 600;
    }

    .preview-field {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .preview-field label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .preview-select, .preview-input {
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .preview-radio-group {
      display: flex;
      gap: 10px;
    }

    .preview-radio-group .radio {
      padding: 8px 12px;
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .preview-radio-group .radio.active {
      border-color: var(--accent-purple);
      background: rgba(124, 58, 237, 0.1);
      color: var(--accent-purple);
    }

    .preview-submit-btn {
      width: 100%;
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 10px;
      opacity: 0.7;
    }

    /* Features Section */
    .features-section {
      padding: 60px 0 100px 0;
      border-top: 1px solid var(--dark-border);
    }

    .section-title {
      font-size: 2.25rem;
      text-align: center;
      margin-bottom: 50px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .feature-icon-wrapper {
      display: inline-flex;
      padding: 12px;
      background: rgba(124, 58, 237, 0.1);
      border-radius: 10px;
      color: var(--accent-purple);
      margin-bottom: 20px;
    }

    .feature-icon {
      font-size: 32px;
    }

    .features-section h3 {
      font-size: 1.25rem;
      margin: 0 0 10px 0;
      font-weight: 600;
    }

    .features-section p {
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
      font-size: 0.95rem;
    }

    /* Footer */
    .footer {
      margin-top: auto;
      text-align: center;
      padding: 40px 0 20px 0;
      border-top: 1px solid var(--dark-border);
      color: var(--text-muted);
      font-size: 0.85rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('LeadPulse | Business Leads Generator');
    this.meta.updateTag({
      name: 'description',
      content: 'LeadPulse allows businesses of any size to deploy dynamic lead-generation forms, configure custom SEO requirements, and manage incoming customer bids in an admin panel.'
    });
  }
}
