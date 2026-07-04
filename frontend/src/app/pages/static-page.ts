import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="static-container animate-fade-in-up">
      <!-- Top Nav -->
      <nav class="nav-bar glass-panel">
        <a routerLink="/" class="nav-brand">
          <span class="material-symbols-outlined logo-icon">insights</span>
          <span class="logo-text">LeadPulse</span>
        </a>
        <div class="nav-links">
          <a routerLink="/" class="btn-secondary">Home</a>
          <a routerLink="/login" class="btn-primary">Admin Login</a>
        </div>
      </nav>

      <!-- Main Layout -->
      <div class="layout-grid">
        <!-- Sidebar Navigation -->
        <aside class="sidebar-menu glass-panel">
          <h3>Information Desk</h3>
          <div class="menu-items">
            <button 
              (click)="selectPage('about')" 
              [class.active]="currentPage() === 'about'"
              class="menu-btn">
              <span class="material-symbols-outlined">info</span>
              About Us
            </button>
            <button 
              (click)="selectPage('privacy')" 
              [class.active]="currentPage() === 'privacy'"
              class="menu-btn">
              <span class="material-symbols-outlined">security</span>
              Privacy Policy
            </button>
            <button 
              (click)="selectPage('terms')" 
              [class.active]="currentPage() === 'terms'"
              class="menu-btn">
              <span class="material-symbols-outlined">gavel</span>
              Terms of Service
            </button>
            <button 
              (click)="selectPage('refund')" 
              [class.active]="currentPage() === 'refund'"
              class="menu-btn">
              <span class="material-symbols-outlined">payments</span>
              Return & Refund Policy
            </button>
            <button 
              (click)="selectPage('contact')" 
              [class.active]="currentPage() === 'contact'"
              class="menu-btn">
              <span class="material-symbols-outlined">contact_support</span>
              Contact Us
            </button>
          </div>
        </aside>

        <!-- Dynamic Content Area -->
        <main class="content-display glass-panel">
          <!-- About Us -->
          <div *ngIf="currentPage() === 'about'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">About LeadPulse</h1>
            <p class="lead-paragraph">LeadPulse is a next-generation lead capture and CRM pipeline platform designed for service professionals, agencies, and businesses looking to grow.</p>
            
            <div class="content-section">
              <h2>Our Mission</h2>
              <p>We believe that capturing business leads shouldn't feel like fishing in the dark. LeadPulse empowers businesses with intelligent, multi-step Q&A questionnaires that screen and qualify prospects before they even reach your inbox. This ensures that you only spend time on leads that convert.</p>
            </div>

            <div class="content-section card-deck">
              <div class="feature-small-card">
                <span class="material-symbols-outlined icon">rocket_launch</span>
                <h3>Instant Deployment</h3>
                <p>Build responsive, custom forms and launch them on a dedicated, SEO-optimized URL within 3 minutes.</p>
              </div>
              <div class="feature-small-card">
                <span class="material-symbols-outlined icon">filter_alt</span>
                <h3>Lead Qualification</h3>
                <p>Filter out low-intent users by requesting essential details through modular, interactive steps.</p>
              </div>
              <div class="feature-small-card">
                <span class="material-symbols-outlined icon">dashboard</span>
                <h3>Admin CRM</h3>
                <p>Manage, categorize, score, and track leads through a unified, real-time workspace dashboard.</p>
              </div>
            </div>

            <div class="content-section highlight-box">
              <h3>Why Choose LeadPulse?</h3>
              <p>Standard static forms convert at a meager 3% to 5%. LeadPulse's interactive, visual stepper flows boast conversion rates of over <strong>27.4%</strong> by engaging users through structured, single-focus question screens.</p>
            </div>
          </div>

          <!-- Privacy Policy -->
          <div *ngIf="currentPage() === 'privacy'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">Privacy Policy</h1>
            <p class="last-updated">Last Updated: July 4, 2026</p>

            <div class="content-section">
              <h2>1. Information We Collect</h2>
              <p>We collect information to provide better services to all our users. This includes:</p>
              <ul>
                <li><strong>Account Information:</strong> When you register a business, we collect your name, business name, and email address.</li>
                <li><strong>Lead Submissions:</strong> Data submitted by users on your public forms (such as names, emails, phone numbers, and answers to your custom questionnaire).</li>
                <li><strong>Usage Data:</strong> Technical logs, IP addresses, browser types, and interactions with our website.</li>
              </ul>
            </div>

            <div class="content-section">
              <h2>2. How We Use Information</h2>
              <p>We use the collected data to maintain, optimize, and secure your lead capture pipelines. LeadPulse will never sell your leads' data or your business details to third parties.</p>
            </div>

            <div class="content-section">
              <h2>3. Data Security & Retention</h2>
              <p>We employ enterprise-grade SSL/TLS encryption for all data in transit and rest. Leads are stored securely in our PostgreSQL databases and are accessible only to authenticated business owners.</p>
            </div>
          </div>

          <!-- Terms of Service -->
          <div *ngIf="currentPage() === 'terms'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">Terms of Service</h1>
            <p class="last-updated">Last Updated: July 4, 2026</p>

            <div class="content-section">
              <h2>1. Terms of Agreement</h2>
              <p>By accessing or using LeadPulse, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </div>

            <div class="content-section">
              <h2>2. Business Account Responsibilities</h2>
              <p>You are responsible for safeguarding your login credentials and for all activities that occur under your business account. You must notify us immediately of any unauthorized use or security breach.</p>
            </div>

            <div class="content-section">
              <h2>3. Acceptable Use Policy</h2>
              <p>You agree not to use LeadPulse to build forms that capture sensitive personal information such as credit card details, government identification, or passwords. Any account found violating this policy will be terminated immediately.</p>
            </div>

            <div class="content-section highlight-box warning">
              <h3>Important Notice</h3>
              <p>LeadPulse acts solely as a lead capture platform. We do not guarantee the conversion rates or financial viability of any lead captured using our templates.</p>
            </div>
          </div>

          <!-- Return & Refund Policy -->
          <div *ngIf="currentPage() === 'refund'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">Return & Refund Policy</h1>
            <p class="last-updated">Last Updated: July 4, 2026</p>

            <div class="content-section">
              <h2>1. Coin Purchases and Billing</h2>
              <p>LeadPulse operates on a credit-based system (Coins) for unlocking premium features, custom templates, or viewing advanced lead analytics. All coin packages purchased are non-transferable.</p>
            </div>

            <div class="content-section">
              <h2>2. Refund Eligibility</h2>
              <p>Since Coins are digital assets that are instantly credited to your business account upon payment, all sales are final. However, refunds may be considered under the following conditions:</p>
              <ul>
                <li>Double billing due to a technical error on our payment gateway.</li>
                <li>System-wide outages that prevented coin utilization for more than 48 consecutive hours.</li>
              </ul>
            </div>

            <div class="content-section">
              <h2>3. How to Request a Refund</h2>
              <p>If you believe you qualify for a refund, please contact us at <strong>support&#64;leadpulse.com</strong> with your Transaction ID and business details within 7 days of purchase. Approved refunds will be credited back to your original payment method within 5-7 business days.</p>
            </div>
          </div>

          <!-- Contact Us -->
          <div *ngIf="currentPage() === 'contact'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">Contact Support</h1>
            <p class="lead-paragraph">Have questions, feedback, or need help optimizing your lead funnel? Send us a message and our support team will get back to you shortly.</p>

            <!-- Success State -->
            <div *ngIf="contactSubmitted()" class="contact-success animate-fade-in-up">
              <span class="material-symbols-outlined success-icon">check_circle</span>
              <h2>Message Sent Successfully!</h2>
              <p>Thank you for reaching out, <strong>{{ contactName() }}</strong>. We have received your inquiry regarding <em>"{{ contactSubject() }}"</em>. A support specialist will contact you at <strong>{{ contactEmail() }}</strong> within 12-24 hours.</p>
              <button (click)="resetContactForm()" class="btn-primary">Send Another Message</button>
            </div>

            <!-- Form State -->
            <form *ngIf="!contactSubmitted()" (submit)="submitContact($event)" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Your Name</label>
                  <input type="text" id="name" [(ngModel)]="formName" name="name" required placeholder="e.g. Brijesh Kumar">
                </div>
                <div class="form-group">
                  <label for="email">Business Email</label>
                  <input type="email" id="email" [(ngModel)]="formEmail" name="email" required placeholder="e.g. admin&#64;business.com">
                </div>
              </div>

              <div class="form-group">
                <label for="subject">Inquiry Subject</label>
                <select id="subject" [(ngModel)]="formSubject" name="subject" required>
                  <option value="General Question">General Inquiry</option>
                  <option value="Billing & Coins">Billing & Coin Packages</option>
                  <option value="Feature Request">Custom Form Request</option>
                  <option value="Technical Bug">Technical Support</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Detailed Message</label>
                <textarea id="message" [(ngModel)]="formMessage" name="message" required rows="5" placeholder="Tell us how we can help your business..."></textarea>
              </div>

              <button type="submit" class="btn-primary submit-btn">
                Send Inquiry
                <span class="material-symbols-outlined">send</span>
              </button>
            </form>

            <div class="contact-cards">
              <div class="contact-info-card">
                <span class="material-symbols-outlined">mail</span>
                <div>
                  <h4>Email Support</h4>
                  <p>support&#64;leadpulse.com</p>
                </div>
              </div>
              <div class="contact-info-card">
                <span class="material-symbols-outlined">call</span>
                <div>
                  <h4>Phone Hotline</h4>
                  <p>+91 8065938728</p>
                </div>
              </div>
              <div class="contact-info-card">
                <span class="material-symbols-outlined">schedule</span>
                <div>
                  <h4>Support Time</h4>
                  <p>Mon-Fri, 10am to 5pm</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Copyright Ribbon -->
      <footer class="static-footer">
        <p>&copy; 2026 LeadPulse Technologies. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .static-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      gap: 30px;
      box-sizing: border-box;
    }

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      margin-bottom: 10px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .logo-icon {
      font-size: 28px;
      color: var(--accent-purple);
    }

    .logo-text {
      font-size: 1.4rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      gap: 15px;
    }

    .layout-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 25px;
      flex-grow: 1;
      align-items: start;
    }

    @media (max-width: 900px) {
      .layout-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Sidebar Navigation */
    .sidebar-menu {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sidebar-menu h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: white;
      margin: 0;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--dark-border);
    }

    .menu-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .menu-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: var(--transition-smooth);
    }

    .menu-btn:hover {
      background: rgba(255, 255, 255, 0.03);
      color: white;
    }

    .menu-btn.active {
      color: white;
      background: rgba(124, 58, 237, 0.12);
      border: 1px solid rgba(192, 132, 252, 0.15);
      box-shadow: 0 0 15px rgba(124, 58, 237, 0.05);
    }

    .menu-btn .material-symbols-outlined {
      font-size: 20px;
    }

    /* Content Area */
    .content-display {
      padding: 40px;
      min-height: 500px;
      box-sizing: border-box;
    }

    @media (max-width: 600px) {
      .content-display {
        padding: 20px;
      }
    }

    .page-content h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0 0 15px 0;
    }

    .lead-paragraph {
      font-size: 1.1rem;
      color: var(--text-primary);
      line-height: 1.6;
      margin: 0 0 35px 0;
    }

    .last-updated {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: -5px 0 30px 0;
    }

    .content-section {
      margin-bottom: 35px;
    }

    .content-section h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin: 0 0 15px 0;
    }

    .content-section p {
      color: var(--text-muted);
      line-height: 1.6;
      font-size: 0.95rem;
      margin: 0 0 15px 0;
    }

    .content-section ul {
      margin: 0 0 15px 0;
      padding-left: 20px;
      color: var(--text-muted);
    }

    .content-section li {
      margin-bottom: 10px;
      line-height: 1.5;
    }

    /* Cards */
    .card-deck {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .feature-small-card {
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      border-radius: 12px;
      padding: 24px;
      transition: var(--transition-smooth);
    }

    .feature-small-card:hover {
      border-color: rgba(192, 132, 252, 0.25);
      transform: translateY(-2px);
    }

    .feature-small-card .icon {
      font-size: 32px;
      color: var(--accent-purple);
      margin-bottom: 15px;
    }

    .feature-small-card h3 {
      margin: 0 0 10px 0;
      font-size: 1rem;
      font-weight: 600;
      color: white;
    }

    .feature-small-card p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Highlight box */
    .highlight-box {
      background: rgba(124, 58, 237, 0.05);
      border: 1px dashed rgba(192, 132, 252, 0.3);
      border-radius: 12px;
      padding: 24px;
    }

    .highlight-box.warning {
      background: rgba(245, 158, 11, 0.03);
      border-color: rgba(245, 158, 11, 0.25);
    }

    .highlight-box h3 {
      margin: 0 0 10px 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: white;
    }

    .highlight-box p {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* Contact Form */
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
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

    .form-group input, .form-group select, .form-group textarea {
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

    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: var(--accent-purple);
      box-shadow: 0 0 10px var(--primary-glow);
    }

    .submit-btn {
      align-self: flex-start;
      margin-top: 10px;
    }

    .contact-success {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      margin-bottom: 40px;
    }

    .contact-success .success-icon {
      font-size: 48px;
      color: #10b981;
    }

    .contact-success h2 {
      margin: 0;
      font-size: 1.4rem;
      color: white;
    }

    .contact-success p {
      color: var(--text-muted);
      line-height: 1.6;
      max-width: 500px;
      margin: 0 0 10px 0;
    }

    .contact-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      border-top: 1px solid var(--dark-border);
      padding-top: 40px;
    }

    .contact-info-card {
      display: flex;
      align-items: center;
      gap: 15px;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--dark-border);
      padding: 16px 20px;
      border-radius: 10px;
    }

    .contact-info-card .material-symbols-outlined {
      font-size: 28px;
      color: var(--accent-purple);
    }

    .contact-info-card h4 {
      margin: 0 0 4px 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
    }

    .contact-info-card p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Footer */
    .static-footer {
      text-align: center;
      padding: 20px 0;
      border-top: 1px solid var(--dark-border);
    }

    .static-footer p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  `]
})
export class StaticPageComponent implements OnInit {
  currentPage = signal('about');

  // Contact Form Fields
  formName = '';
  formEmail = '';
  formSubject = 'General Question';
  formMessage = '';

  // Contact Success States
  contactSubmitted = signal(false);
  contactName = signal('');
  contactEmail = signal('');
  contactSubject = signal('');

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const page = params.get('page');
      if (page) {
        this.currentPage.set(page);
      }
    });
  }

  selectPage(page: string): void {
    this.currentPage.set(page);
    // Push state without reloading so routing is clean
    window.history.pushState({}, '', `/p/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitContact(event: Event): void {
    event.preventDefault();
    if (!this.formName || !this.formEmail || !this.formMessage) {
      return;
    }
    this.contactName.set(this.formName);
    this.contactEmail.set(this.formEmail);
    this.contactSubject.set(this.formSubject);
    this.contactSubmitted.set(true);
  }

  resetContactForm(): void {
    this.formName = '';
    this.formEmail = '';
    this.formSubject = 'General Question';
    this.formMessage = '';
    this.contactSubmitted.set(false);
  }
}
