import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
          <span class="badge">Next-Gen Lead Capture & Analytics</span>
          <h1 class="hero-title">
            Capture Leads with <br>
            <span class="gradient-text">Smart Stepper Flows</span>
          </h1>
          <p class="hero-subtitle">
            Create custom forms and smart Q&A flows tailored for any business. Fully SEO-optimized, beautifully styled, and integrated with a powerful CRM dashboard.
          </p>
          <div class="hero-actions">
            <a routerLink="/login" class="btn-primary">
              Build Your First Form
              <span class="material-symbols-outlined">arrow_forward</span>
            </a>
            <a href="#features" class="btn-secondary">See Features</a>
            <a href="#pricing" class="btn-secondary">View Pricing</a>
          </div>
        </div>

        <!-- Interactive Hero Preview Widget -->
        <div class="hero-preview glass-panel animate-delay-1">
          <div class="preview-header">
            <div class="preview-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="preview-url">{{ currentTemplate.url }}</div>
          </div>
          
          <!-- Presets Selector Tabs -->
          <div class="preset-selector-tabs">
            <button 
              *ngFor="let t of demoTemplates"
              (click)="selectTemplate(t.id)"
              [class.active]="selectedTemplateId === t.id"
              class="preset-tab">
              <span class="material-symbols-outlined tab-icon">{{ t.icon }}</span>
              <span class="tab-label">{{ t.name }}</span>
            </button>
          </div>

          <div class="preview-body" *ngIf="!formSubmitted">
            <div class="preview-stepper-header">
              <span class="stepper-title">{{ currentTemplate.title }}</span>
              <span class="stepper-step">Step {{ currentStepIndex + 1 }} of {{ currentTemplate.steps.length }}</span>
            </div>

            <!-- Progress bar -->
            <div class="progress-bar-container">
              <div class="progress-bar-fill" [style.width.%]="((currentStepIndex + 1) / currentTemplate.steps.length) * 100"></div>
            </div>

            <!-- Dynamic Question Content -->
            <div class="stepper-question-container">
              <h4 class="stepper-question-title">{{ currentStep.question }}</h4>
              
              <!-- Radio Options -->
              <div *ngIf="currentStep.type === 'radio'" class="radio-options-grid">
                <button 
                  *ngFor="let option of currentStep.options"
                  (click)="selectOption(currentStep.question, option)"
                  [class.selected]="answers[currentStep.question] === option"
                  class="radio-option-btn">
                  <span class="radio-circle"></span>
                  <span class="option-label">{{ option }}</span>
                </button>
              </div>

              <!-- Select Options -->
              <div *ngIf="currentStep.type === 'select'" class="select-wrapper">
                <div class="select-options-list">
                  <button 
                    *ngFor="let option of currentStep.options"
                    (click)="selectOption(currentStep.question, option)"
                    [class.selected]="answers[currentStep.question] === option"
                    class="select-item-btn">
                    <span class="option-label">{{ option }}</span>
                    <span class="material-symbols-outlined check-icon" *ngIf="answers[currentStep.question] === option">check</span>
                  </button>
                </div>
              </div>

              <!-- Text/Email input -->
              <div *ngIf="currentStep.type === 'text'" class="text-input-wrapper">
                <input 
                  type="email" 
                  [(ngModel)]="emailInput"
                  [placeholder]="currentStep.placeholder"
                  class="stepper-text-input"
                  (keyup.enter)="nextStep()">
                <p class="input-helper">We only use this to send the demo response.</p>
              </div>
            </div>

            <!-- Stepper Actions -->
            <div class="stepper-actions-row">
              <button 
                [disabled]="currentStepIndex === 0" 
                (click)="prevStep()" 
                class="btn-stepper-back">
                <span class="material-symbols-outlined">chevron_left</span>
                Back
              </button>
              <button 
                (click)="nextStep()" 
                class="btn-stepper-next">
                {{ currentStepIndex === currentTemplate.steps.length - 1 ? 'Submit & Qualify' : 'Next Step' }}
                <span class="material-symbols-outlined" *ngIf="currentStepIndex !== currentTemplate.steps.length - 1">chevron_right</span>
                <span class="material-symbols-outlined" *ngIf="currentStepIndex === currentTemplate.steps.length - 1">done</span>
              </button>
            </div>
          </div>

          <!-- Submitted Success State -->
          <div class="preview-body success-state animate-fade-in-up" *ngIf="formSubmitted">
            <span class="material-symbols-outlined success-icon">check_circle</span>
            <h3 class="success-title">Lead Captured & Qualified!</h3>
            <p class="success-message">
              The submission was analyzed and processed by LeadPulse logic:
            </p>
            <div class="qualification-summary">
              <div class="summary-row">
                <span class="label">Identified Client:</span>
                <span class="value">{{ emailInput }}</span>
              </div>
              <div class="summary-row">
                <span class="label">Category:</span>
                <span class="value font-highlight">{{ currentTemplate.name }}</span>
              </div>
              <div class="summary-row" *ngFor="let item of currentTemplate.steps | slice:0:2">
                <span class="label">{{ item.label }}:</span>
                <span class="value">{{ answers[item.question] }}</span>
              </div>
              <div class="summary-row border-top">
                <span class="label">Lead Intent Score:</span>
                <span class="value badge-success">98/100 (High)</span>
              </div>
            </div>
            <button (click)="resetForm()" class="btn-primary reset-btn">
              Try Another Template
              <span class="material-symbols-outlined">restart_alt</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Live Metrics Ribbon -->
      <section class="metrics-ribbon">
        <div class="metric-card">
          <span class="metric-value">4.8M+</span>
          <span class="metric-label">Leads Qualified</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">27.4%</span>
          <span class="metric-label">Avg. Conversion Rate</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">12,500+</span>
          <span class="metric-label">Active Forms</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">&lt; 3 mins</span>
          <span class="metric-label">Time to Setup</span>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features-section">
        <h2 class="section-title">Core Engine <span class="gradient-text">Features</span></h2>
        <div class="features-grid">
          <div class="dashboard-card">
            <div class="feature-icon-wrapper">
              <span class="material-symbols-outlined feature-icon">dynamic_form</span>
            </div>
            <h3>100% Dynamic Forms</h3>
            <p>Customize your questions, answer options, logic paths, and validation rules for any industry. No database setup required.</p>
          </div>

          <div class="dashboard-card">
            <div class="feature-icon-wrapper">
              <span class="material-symbols-outlined feature-icon">search</span>
            </div>
            <h3>SEO-Friendly Pages</h3>
            <p>Built with Angular Server-Side Rendering (SSR). Metatags and schema content inject automatically for search indexing.</p>
          </div>

          <div class="dashboard-card">
            <div class="feature-icon-wrapper">
              <span class="material-symbols-outlined feature-icon">monitoring</span>
            </div>
            <h3>Sleek Analytics & CRM</h3>
            <p>Track response rates, view graphs of form submissions, and transition leads through stages on a visual Kanban board.</p>
          </div>
        </div>
      </section>

      <!-- Interactive Workflow Section -->
      <section class="workflow-section">
        <h2 class="section-title">End-to-End <span class="gradient-text">Lead Pipeline</span></h2>
        <p class="section-subtitle">How LeadPulse automates lead generation from build to deal closing.</p>

        <div class="workflow-container">
          <!-- Step Navigation List (Left) -->
          <div class="workflow-tabs">
            <button 
              *ngFor="let step of workflowSteps; let idx = index"
              (click)="setWorkflowStep(idx)"
              [class.active]="activeWorkflowStep === idx"
              class="workflow-tab-btn">
              <div class="workflow-tab-num">{{ idx + 1 }}</div>
              <div class="workflow-tab-info">
                <span class="workflow-tab-title">{{ step.title }}</span>
                <span class="workflow-tab-desc-short">Click to view details</span>
              </div>
              <span class="material-symbols-outlined workflow-arrow" *ngIf="activeWorkflowStep === idx">chevron_right</span>
            </button>
          </div>

          <!-- Step Graphic Detail Display (Right) -->
          <div class="workflow-display-panel glass-panel animate-fade-in-up">
            <div class="panel-header">
              <span class="material-symbols-outlined panel-header-icon">{{ workflowSteps[activeWorkflowStep].icon }}</span>
              <h3>{{ workflowSteps[activeWorkflowStep].title }}</h3>
            </div>
            
            <p class="panel-description">
              {{ workflowSteps[activeWorkflowStep].desc }}
            </p>

            <div class="panel-details-list">
              <h4>Key Capabilities:</h4>
              <ul>
                <li *ngFor="let detail of workflowSteps[activeWorkflowStep].details">
                  <span class="material-symbols-outlined check-bullet">verified</span>
                  {{ detail }}
                </li>
              </ul>
            </div>

            <!-- Simulated UI Graphic depending on step -->
            <div class="simulated-preview-box">
              <!-- Step 1 Build Simulated Graphic -->
              <div class="sim-graphic-1" *ngIf="activeWorkflowStep === 0">
                <div class="sim-builder-field">
                  <div class="field-top">
                    <span>Question 1: Service Type</span>
                    <span class="badge-blue">Radio Field</span>
                  </div>
                  <div class="field-pill">Deep Cleaning</div>
                  <div class="field-pill">Move-Out Clean</div>
                  <div class="field-pill-add">+ Add Option</div>
                </div>
              </div>

              <!-- Step 2 SEO Simulated Graphic -->
              <div class="sim-graphic-2" *ngIf="activeWorkflowStep === 1">
                <div class="sim-google-result">
                  <div class="google-top">https://leadpulse.app › f › sparkle-cleaners</div>
                  <div class="google-title">Sparkle Cleaners - Get an Instant Cleaning Quote</div>
                  <div class="google-desc">Calculate your cleaning service price instantly. Select bedrooms, date, and schedule a deep cleaning in seconds online...</div>
                </div>
              </div>

              <!-- Step 3 Deploy Simulated Graphic -->
              <div class="sim-graphic-3" *ngIf="activeWorkflowStep === 2">
                <div class="cdn-globe-visualization">
                  <div class="cdn-pulse"></div>
                  <span class="material-symbols-outlined globe-icon">public</span>
                  <span class="cdn-speed-tag">CDN Latency: 14ms</span>
                </div>
              </div>

              <!-- Step 4 CRM Simulated Graphic -->
              <div class="sim-graphic-4" *ngIf="activeWorkflowStep === 3">
                <div class="sim-kanban-board">
                  <div class="kanban-col">
                    <span class="col-title">Qualified Leads</span>
                    <div class="kanban-card">
                      <div class="card-head">
                        <strong>Clara Vance</strong>
                        <span class="card-value">$220</span>
                      </div>
                      <span class="card-time">Home Cleaning • 98 Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Live Simulator / Inbox Tracker Showcase -->
      <section class="simulator-section">
        <div class="simulator-layout">
          <div class="simulator-info-content">
            <span class="badge">Real-Time Sync</span>
            <h2 class="section-title-left">Consolidated <span class="gradient-text">Lead Inbox</span></h2>
            <p class="simulator-desc">
              Watch as potential business clients fill out forms on their mobile devices or desktop websites. Leads are instantly scored, grouped, and displayed in your centralized admin control panel.
            </p>
            <div class="sim-features-bullets">
              <div class="bullet-item">
                <span class="material-symbols-outlined bullet-icon">bolt</span>
                <div>
                  <strong>Instant Push Notification</strong>
                  <p>Zero delay between submission and dashboard appearance.</p>
                </div>
              </div>
              <div class="bullet-item">
                <span class="material-symbols-outlined bullet-icon">shield_check</span>
                <div>
                  <strong>Intent Score System</strong>
                  <p>Analyzes completeness and selection profiles to score high-intent leads.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Active CRM Feed Card (Right) -->
          <div class="simulator-feed-card glass-panel">
            <div class="feed-header">
              <div class="feed-title-block">
                <span class="pulse-indicator"></span>
                <h3>Live Lead Feed</h3>
              </div>
              <span class="feed-subtitle-badge">Simulating Live Traffic</span>
            </div>
            
            <div class="leads-list">
              <div 
                *ngFor="let lead of recentLeads"
                class="lead-item-card animate-fade-in-up">
                <div class="lead-item-left">
                  <div class="lead-avatar-icon">
                    <span class="material-symbols-outlined">person</span>
                  </div>
                  <div class="lead-info">
                    <span class="lead-name">{{ lead.name }}</span>
                    <span class="lead-category">{{ lead.type }}</span>
                  </div>
                </div>
                <div class="lead-item-right">
                  <span class="lead-val">{{ lead.value }}</span>
                  <span class="lead-status" [ngClass]="leadStatusStyles[lead.status] || 'status-badge-new'">
                    {{ lead.status }}
                  </span>
                  <span class="lead-time">{{ lead.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Plans Calculator Section -->
      <section id="pricing" class="pricing-section">
        <h2 class="section-title">Fair, Transparent <span class="gradient-text">Pricing</span></h2>
        <p class="section-subtitle">Choose the perfect tier to match your lead acquisition needs.</p>

        <!-- Billing Switch -->
        <div class="billing-switch-wrapper">
          <span [class.active-text]="!isAnnual" class="switch-label">Monthly</span>
          <button (click)="togglePricing(!isAnnual)" class="billing-switch-btn" [class.annual-active]="isAnnual">
            <span class="switch-ball"></span>
          </button>
          <span [class.active-text]="isAnnual" class="switch-label">
            Annually <span class="discount-badge">Save 20%</span>
          </span>
        </div>

        <!-- Pricing Grid -->
        <div class="pricing-grid">
          <!-- Starter Tier -->
          <div class="pricing-card glass-panel">
            <div class="card-tier-name">Starter</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">{{ isAnnual ? '12' : '15' }}</span>
              <span class="period">/mo</span>
            </div>
            <p class="card-tier-desc">Great for freelancers and local professionals just getting started.</p>
            <div class="card-features">
              <ul>
                <li><span class="material-symbols-outlined check-icon">check</span> 1 Deployed Active Form</li>
                <li><span class="material-symbols-outlined check-icon">check</span> 100 Lead Submissions / mo</li>
                <li><span class="material-symbols-outlined check-icon">check</span> Standard Styling System</li>
                <li><span class="material-symbols-outlined check-icon">check</span> 30-Day CRM Analytics History</li>
                <li class="disabled-feature"><span class="material-symbols-outlined close-icon">close</span> Webhook Integrations</li>
                <li class="disabled-feature"><span class="material-symbols-outlined close-icon">close</span> Custom Domains</li>
              </ul>
            </div>
            <a routerLink="/login" class="btn-secondary w-full">Start Free Trial</a>
          </div>

          <!-- Growth Pro Tier (Popular) -->
          <div class="pricing-card glass-panel recommended-card">
            <div class="recommended-badge">Most Popular</div>
            <div class="card-tier-name text-accent">Growth Pro</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">{{ isAnnual ? '47' : '59' }}</span>
              <span class="period">/mo</span>
            </div>
            <p class="card-tier-desc">Perfect for scaling agencies, services, and growing teams.</p>
            <div class="card-features">
              <ul>
                <li><span class="material-symbols-outlined check-icon accent-tick">check</span> <strong>Unlimited</strong> Deployed Forms</li>
                <li><span class="material-symbols-outlined check-icon accent-tick">check</span> 2,500 Lead Submissions / mo</li>
                <li><span class="material-symbols-outlined check-icon accent-tick">check</span> Premium CSS custom branding</li>
                <li><span class="material-symbols-outlined check-icon accent-tick">check</span> Live Webhook & Email Alerts</li>
                <li><span class="material-symbols-outlined check-icon accent-tick">check</span> Custom Domains & SSR SEO Setup</li>
                <li><span class="material-symbols-outlined check-icon accent-tick">check</span> Unlimited CRM Analytics History</li>
              </ul>
            </div>
            <a routerLink="/login" class="btn-primary w-full">Deploy Growth Pro</a>
          </div>

          <!-- Enterprise Tier -->
          <div class="pricing-card glass-panel">
            <div class="card-tier-name">Enterprise</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">{{ isAnnual ? '149' : '189' }}</span>
              <span class="period">/mo</span>
            </div>
            <p class="card-tier-desc">Custom database deployments and priority channels for heavy volumes.</p>
            <div class="card-features">
              <ul>
                <li><span class="material-symbols-outlined check-icon">check</span> <strong>Unlimited</strong> Forms & Submissions</li>
                <li><span class="material-symbols-outlined check-icon">check</span> Direct Database Access (PostgreSQL/Prisma)</li>
                <li><span class="material-symbols-outlined check-icon">check</span> White-labeled forms (No LeadPulse logo)</li>
                <li><span class="material-symbols-outlined check-icon">check</span> Dedicated Server Instance</li>
                <li><span class="material-symbols-outlined check-icon">check</span> API Access & Advanced Branching Logic</li>
                <li><span class="material-symbols-outlined check-icon">check</span> 24/7 SLA Priority Phone Support</li>
              </ul>
            </div>
            <a routerLink="/login" class="btn-secondary w-full">Contact Sales</a>
          </div>
        </div>
      </section>

      <!-- Testimonial Slider Carousel Section -->
      <section class="testimonial-section">
        <h2 class="section-title">Loved by <span class="gradient-text">Fast-Growing Brands</span></h2>
        <div class="testimonial-carousel-wrapper">
          
          <button (click)="prevTestimonial()" class="carousel-nav-btn prev-btn">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>

          <div class="testimonial-active-slide glass-panel animate-fade-in-up">
            <div class="testimonial-header-row">
              <!-- Rating Stars -->
              <div class="stars-row">
                <span class="material-symbols-outlined star-icon" *ngFor="let star of [1,2,3,4,5]">star</span>
              </div>
              <div class="testimonial-metric-badge">{{ testimonials[currentTestimonialIndex].metric }}</div>
            </div>

            <p class="testimonial-quote">
              "{{ testimonials[currentTestimonialIndex].quote }}"
            </p>

            <div class="testimonial-author-block">
              <div class="author-avatar">
                <span class="material-symbols-outlined">account_circle</span>
              </div>
              <div class="author-meta">
                <span class="author-name">{{ testimonials[currentTestimonialIndex].author }}</span>
                <span class="author-role">{{ testimonials[currentTestimonialIndex].role }}, <strong>{{ testimonials[currentTestimonialIndex].company }}</strong></span>
              </div>
            </div>
          </div>

          <button (click)="nextTestimonial()" class="carousel-nav-btn next-btn">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <!-- Carousel Dots Indicator -->
        <div class="carousel-dots-row">
          <span 
            *ngFor="let t of testimonials; let idx = index"
            (click)="currentTestimonialIndex = idx"
            [class.active]="currentTestimonialIndex === idx"
            class="carousel-dot">
          </span>
        </div>
      </section>

      <!-- FAQ Accordion Section -->
      <section class="faq-section">
        <h2 class="section-title">Frequently Asked <span class="gradient-text">Questions</span></h2>
        <div class="faq-accordion-container">
          <div 
            *ngFor="let faq of faqs; let idx = index"
            class="faq-item-card glass-panel"
            [class.open]="openFaqIndex === idx">
            
            <button (click)="toggleFaq(idx)" class="faq-header-btn">
              <span>{{ faq.q }}</span>
              <span class="material-symbols-outlined expand-icon">
                {{ openFaqIndex === idx ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
              </span>
            </button>

            <div class="faq-body-content" *ngIf="openFaqIndex === idx">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTAs -->
      <section class="bottom-cta-section glass-panel">
        <div class="cta-glow-effect"></div>
        <div class="cta-inner-content">
          <h2 class="cta-title">Ready to Capture <span class="gradient-text">Highly-Intentional Leads?</span></h2>
          <p class="cta-subtitle">Deploy your first dynamic custom form in under three minutes. Start scaling your client bookings today.</p>
          <div class="cta-actions">
            <a routerLink="/login" class="btn-primary btn-cta-large">
              Get Started for Free
              <span class="material-symbols-outlined">arrow_forward</span>
            </a>
            <a href="#pricing" class="btn-secondary btn-cta-large">Compare Plans</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-grid">
          <!-- Col 1: Brand -->
          <div class="footer-col brand-col">
            <a routerLink="/" class="footer-brand">
              <span class="material-symbols-outlined logo-icon">insights</span>
              LeadPulse
            </a>
            <p class="brand-desc">Next-Gen lead capture & CRM analytics platform. Connect with high-converting clients through structured stepper questionnaire flows. Simple, fast, and secure.</p>
            <div class="quick-links-group">
              <a routerLink="/p/about">About Us</a>
              <a routerLink="/p/contact">Careers</a>
            </div>
          </div>

          <!-- Col 2: For Businesses -->
          <div class="footer-col">
            <h4>For Businesses</h4>
            <ul class="footer-list">
              <li><a href="#features">How It Works</a></li>
              <li><a routerLink="/login">Admin CRM Portal</a></li>
              <li><a routerLink="/p/about">Features Showcase</a></li>
              <li><a routerLink="/p/contact">Help Centre</a></li>
            </ul>
          </div>

          <!-- Col 3: Legal & Resources -->
          <div class="footer-col">
            <h4>Resources & Legal</h4>
            <ul class="footer-list">
              <li><a routerLink="/p/privacy">Privacy Policy</a></li>
              <li><a routerLink="/p/terms">Terms of Service</a></li>
              <li><a routerLink="/p/refund">Return & Refund Policy</a></li>
              <li><a routerLink="/p/contact">API Reference</a></li>
            </ul>
          </div>

          <!-- Col 4: Contact & Support -->
          <div class="footer-col">
            <h4>Connect with Us</h4>
            <ul class="footer-list contact-list">
              <li>
                <span class="material-symbols-outlined">mail</span>
                <a href="mailto:support@leadpulse.com">support&#64;leadpulse.com</a>
              </li>
              <li>
                <span class="material-symbols-outlined">call</span>
                <a href="tel:+918065938728">+91 8065938728</a>
              </li>
              <li>
                <span class="material-symbols-outlined">schedule</span>
                <span>Mon-Fri, 10am to 5pm</span>
              </li>
            </ul>
            <div class="social-icons">
              <a href="#" target="_blank" class="social-btn">
                <span class="material-symbols-outlined">public</span>
              </a>
              <a href="#" target="_blank" class="social-btn">
                <span class="material-symbols-outlined">share</span>
              </a>
              <a href="#" target="_blank" class="social-btn">
                <span class="material-symbols-outlined">groups</span>
              </a>
            </div>
          </div>
        </div>
        <p class="copy-text">&copy; 2026 LeadPulse Technologies. Built for premium business lead capture.</p>
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
      gap: 120px;
    }

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 28px;
      margin-bottom: -40px;
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
      grid-template-columns: 1.15fr 0.85fr;
      gap: 60px;
      align-items: center;
      padding: 40px 0;
    }

    @media (max-width: 950px) {
      .hero-section {
        grid-template-columns: 1fr;
        gap: 50px;
        text-align: center;
      }
      .hero-subtitle {
        margin: 0 auto 35px auto;
      }
      .hero-actions {
        justify-content: center;
      }
    }

    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(124, 58, 237, 0.12);
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
      gap: 14px;
      flex-wrap: wrap;
    }

    /* Interactive Preview Card */
    .hero-preview {
      width: 100%;
      max-width: 440px;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(192, 132, 252, 0.15);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(124, 58, 237, 0.08);
      transition: var(--transition-smooth);
    }

    .hero-preview:hover {
      border-color: rgba(192, 132, 252, 0.35);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(124, 58, 237, 0.15);
    }

    .preview-header {
      background: rgba(0, 0, 0, 0.25);
      padding: 12px 18px;
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Preset Tab Selector */
    .preset-selector-tabs {
      display: flex;
      background: rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid var(--dark-border);
      padding: 4px;
      gap: 4px;
    }

    .preset-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 4px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-family: var(--font-family);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      border-radius: 8px;
      transition: var(--transition-smooth);
    }

    .preset-tab:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.03);
    }

    .preset-tab.active {
      color: var(--accent-purple);
      background: rgba(124, 58, 237, 0.15);
    }

    .tab-icon {
      font-size: 16px;
    }

    .preview-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 280px;
    }

    .preview-stepper-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stepper-title {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    .stepper-step {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent-purple);
    }

    /* Stepper Progress Bar */
    .progress-bar-container {
      width: 100%;
      height: 4px;
      background: var(--dark-border);
      border-radius: 2px;
      overflow: hidden;
      margin-top: -8px;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #7c3aed 0%, #c084fc 100%);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stepper-question-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .stepper-question-title {
      font-size: 1.15rem;
      margin: 0;
      font-weight: 600;
      line-height: 1.4;
    }

    /* Radio Options Grid */
    .radio-options-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .radio-option-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--dark-border);
      border-radius: 10px;
      color: var(--text-primary);
      text-align: left;
      cursor: pointer;
      font-family: var(--font-family);
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }

    .radio-option-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(192, 132, 252, 0.2);
    }

    .radio-option-btn.selected {
      border-color: var(--accent-purple);
      background: rgba(124, 58, 237, 0.08);
    }

    .radio-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid var(--text-muted);
      position: relative;
      transition: var(--transition-smooth);
    }

    .radio-option-btn.selected .radio-circle {
      border-color: var(--accent-purple);
    }

    .radio-option-btn.selected .radio-circle::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--accent-purple);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /* Select List */
    .select-options-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .select-item-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 11px 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--dark-border);
      border-radius: 10px;
      color: var(--text-primary);
      text-align: left;
      cursor: pointer;
      font-family: var(--font-family);
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }

    .select-item-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(192, 132, 252, 0.2);
    }

    .select-item-btn.selected {
      border-color: var(--accent-purple);
      background: rgba(124, 58, 237, 0.08);
    }

    .check-icon {
      color: var(--accent-purple);
      font-size: 18px;
    }

    /* Text Input */
    .text-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .stepper-text-input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--dark-border);
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.95rem;
      color: var(--text-primary);
      font-family: var(--font-family);
      outline: none;
      transition: var(--transition-smooth);
    }

    .stepper-text-input:focus {
      border-color: var(--accent-purple);
      box-shadow: 0 0 10px rgba(124, 58, 237, 0.2);
    }

    .input-helper {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 2px 0 0 4px;
    }

    /* Stepper Actions Row */
    .stepper-actions-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      border-top: 1px solid var(--dark-border);
      padding-top: 18px;
    }

    .btn-stepper-back {
      display: flex;
      align-items: center;
      gap: 4px;
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--dark-border);
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 600;
      font-family: var(--font-family);
      font-size: 0.85rem;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-stepper-back:hover:not(:disabled) {
      color: var(--text-primary);
      border-color: var(--text-muted);
    }

    .btn-stepper-back:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .btn-stepper-next {
      display: flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 9px 18px;
      font-weight: 600;
      font-family: var(--font-family);
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
      transition: var(--transition-smooth);
    }

    .btn-stepper-next:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
    }

    /* Submitted Success State */
    .success-state {
      align-items: center;
      text-align: center;
      justify-content: center;
      min-height: 300px;
      gap: 16px;
    }

    .success-icon {
      font-size: 60px;
      color: #10b981;
      filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.25));
    }

    .success-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0;
    }

    .success-message {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
      max-width: 320px;
    }

    .qualification-summary {
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--dark-border);
      border-radius: 10px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }

    .summary-row .label {
      color: var(--text-muted);
    }

    .summary-row .value {
      font-weight: 600;
    }

    .summary-row .value.font-highlight {
      color: var(--accent-purple);
    }

    .summary-row.border-top {
      border-top: 1px solid var(--dark-border);
      padding-top: 8px;
      margin-top: 2px;
    }

    .badge-success {
      color: #10b981;
      font-weight: 700 !important;
    }

    .reset-btn {
      width: 100%;
      justify-content: center;
      margin-top: 10px;
    }

    /* Live Metrics Ribbon */
    .metrics-ribbon {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      background: rgba(19, 19, 26, 0.4);
      border: 1px solid var(--dark-border);
      border-radius: 16px;
      padding: 30px;
      text-align: center;
    }

    .metric-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
    }

    .metric-card:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -10px;
      top: 10%;
      height: 80%;
      width: 1px;
      background: var(--dark-border);
    }

    @media (max-width: 600px) {
      .metric-card:not(:last-child)::after {
        display: none;
      }
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--accent-purple);
      background: linear-gradient(135deg, #c084fc 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .metric-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Features Section */
    .features-section {
      display: flex;
      flex-direction: column;
    }

    .section-title {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 50px;
      font-weight: 800;
      letter-spacing: -1px;
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

    .dashboard-card h3 {
      font-size: 1.25rem;
      margin: 0 0 10px 0;
      font-weight: 600;
    }

    .dashboard-card p {
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
      font-size: 0.95rem;
    }

    /* Interactive Workflow Section */
    .workflow-section {
      display: flex;
      flex-direction: column;
    }

    .section-subtitle {
      text-align: center;
      color: var(--text-muted);
      font-size: 1.1rem;
      margin-top: -35px;
      margin-bottom: 60px;
    }

    .workflow-container {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: 50px;
      align-items: stretch;
    }

    @media (max-width: 900px) {
      .workflow-container {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    .workflow-tabs {
      display: flex;
      flex-direction: column;
      gap: 16px;
      justify-content: center;
    }

    .workflow-tab-btn {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 18px 24px;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--dark-border);
      border-radius: 14px;
      color: var(--text-primary);
      text-align: left;
      cursor: pointer;
      font-family: var(--font-family);
      transition: var(--transition-smooth);
      position: relative;
    }

    .workflow-tab-btn:hover {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(192, 132, 252, 0.15);
    }

    .workflow-tab-btn.active {
      background: rgba(124, 58, 237, 0.06);
      border-color: rgba(192, 132, 252, 0.35);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .workflow-tab-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--dark-border);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }

    .workflow-tab-btn.active .workflow-tab-num {
      background: var(--accent-purple);
      color: var(--dark-bg);
    }

    .workflow-tab-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .workflow-tab-title {
      font-size: 1.05rem;
      font-weight: 600;
    }

    .workflow-tab-desc-short {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .workflow-tab-btn.active .workflow-tab-desc-short {
      color: var(--accent-purple);
    }

    .workflow-arrow {
      color: var(--accent-purple);
      font-size: 20px;
    }

    .workflow-display-panel {
      padding: 35px;
      border: 1px solid rgba(192, 132, 252, 0.15);
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: rgba(19, 19, 26, 0.8);
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--accent-purple);
    }

    .panel-header-icon {
      font-size: 32px;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .panel-description {
      color: var(--text-muted);
      font-size: 1.05rem;
      line-height: 1.6;
      margin: 0;
    }

    .panel-details-list h4 {
      font-size: 0.9rem;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    .panel-details-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .panel-details-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
    }

    .check-bullet {
      color: var(--accent-purple);
      font-size: 18px;
    }

    /* Simulated Graphic Previews */
    .simulated-preview-box {
      margin-top: 10px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--dark-border);
      border-radius: 12px;
      padding: 20px;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .sim-graphic-1 {
      width: 100%;
    }

    .sim-builder-field {
      background: var(--dark-surface);
      border: 1px solid rgba(192, 132, 252, 0.2);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-top {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge-blue {
      background: rgba(129, 140, 248, 0.2);
      color: #818cf8;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
    }

    .field-pill {
      background: var(--dark-bg);
      border: 1px solid var(--dark-border);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .field-pill-add {
      background: transparent;
      border: 1px dashed var(--dark-border);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--accent-purple);
      text-align: center;
      cursor: pointer;
    }

    .sim-google-result {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: left;
    }

    .google-top {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .google-title {
      font-size: 1.1rem;
      color: #818cf8;
      font-weight: 500;
      text-decoration: underline;
    }

    .google-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .cdn-globe-visualization {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .globe-icon {
      font-size: 48px;
      color: var(--accent-purple);
      z-index: 2;
    }

    .cdn-pulse {
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(192, 132, 252, 0.3);
      animation: pulseGlobe 2s infinite ease-out;
      z-index: 1;
      top: 0;
    }

    @keyframes pulseGlobe {
      0% {
        transform: scale(0.9);
        opacity: 0.8;
      }
      100% {
        transform: scale(2.2);
        opacity: 0;
      }
    }

    .cdn-speed-tag {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 12px;
      font-weight: 700;
    }

    .sim-kanban-board {
      width: 100%;
    }

    .kanban-col {
      background: var(--dark-bg);
      border: 1px solid var(--dark-border);
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .col-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .kanban-card {
      background: var(--dark-surface);
      border: 1px solid rgba(192, 132, 252, 0.2);
      border-radius: 6px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }

    .card-value {
      color: #10b981;
      font-weight: 700;
    }

    .card-time {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    /* Live CRM Feed Simulator Section */
    .simulator-section {
      background: radial-gradient(circle at 80% 50%, rgba(124, 58, 237, 0.05) 0%, transparent 60%);
      padding: 40px 0;
    }

    .simulator-layout {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 60px;
      align-items: center;
    }

    @media (max-width: 900px) {
      .simulator-layout {
        grid-template-columns: 1fr;
        gap: 50px;
      }
    }

    .section-title-left {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.15;
      margin: 10px 0 20px 0;
      letter-spacing: -1px;
    }

    .simulator-desc {
      font-size: 1.1rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 35px;
    }

    .sim-features-bullets {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .bullet-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .bullet-icon {
      padding: 8px;
      background: rgba(192, 132, 252, 0.15);
      border-radius: 8px;
      color: var(--accent-purple);
      font-size: 24px;
    }

    .bullet-item strong {
      font-size: 1.05rem;
      font-weight: 600;
      display: block;
      margin-bottom: 4px;
    }

    .bullet-item p {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    /* CRM Feed Card */
    .simulator-feed-card {
      width: 100%;
      border: 1px solid rgba(192, 132, 252, 0.15);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
      padding: 0;
      overflow: hidden;
    }

    .feed-header {
      background: rgba(0, 0, 0, 0.2);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--dark-border);
    }

    .feed-title-block {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pulse-indicator {
      width: 8px;
      height: 8px;
      background-color: #ef4444;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 8px #ef4444;
      animation: pulseRed 1.8s infinite;
    }

    @keyframes pulseRed {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }

    .feed-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .feed-subtitle-badge {
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--dark-border);
      padding: 4px 10px;
      border-radius: 12px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .leads-list {
      display: flex;
      flex-direction: column;
      padding: 14px;
      gap: 10px;
      max-height: 380px;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.1);
    }

    .lead-item-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .lead-item-card:hover {
      border-color: rgba(192, 132, 252, 0.2);
      background: var(--dark-surface-hover);
    }

    .lead-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .lead-avatar-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(124, 58, 237, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-purple);
    }

    .lead-avatar-icon .material-symbols-outlined {
      font-size: 18px;
    }

    .lead-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .lead-name {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .lead-category {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .lead-item-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .lead-val {
      font-size: 0.9rem;
      font-weight: 700;
      color: #10b981;
    }

    .lead-status {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge-new {
      background: rgba(129, 140, 248, 0.15);
      color: #818cf8;
      border: 1px solid rgba(129, 140, 248, 0.3);
    }

    .status-badge-contacted {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-badge-qualified {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-badge-converted {
      background: rgba(192, 132, 252, 0.15);
      color: var(--accent-purple);
      border: 1px solid rgba(192, 132, 252, 0.3);
    }

    .lead-time {
      font-size: 0.7rem;
      color: var(--text-muted);
      width: 60px;
      text-align: right;
    }

    /* Pricing Section */
    .pricing-section {
      display: flex;
      flex-direction: column;
    }

    .billing-switch-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      margin-bottom: 50px;
      margin-top: -20px;
    }

    .switch-label {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-muted);
      transition: var(--transition-smooth);
    }

    .switch-label.active-text {
      color: var(--text-primary);
    }

    .discount-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      font-weight: 700;
      margin-left: 4px;
    }

    .billing-switch-btn {
      width: 50px;
      height: 28px;
      border-radius: 14px;
      background: var(--dark-border);
      border: 1px solid rgba(192, 132, 252, 0.15);
      position: relative;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .switch-ball {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      top: 3px;
      left: 3px;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .billing-switch-btn.annual-active {
      background: var(--primary-color);
    }

    .billing-switch-btn.annual-active .switch-ball {
      transform: translateX(22px);
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      align-items: stretch;
    }

    .pricing-card {
      border: 1px solid var(--dark-border);
      padding: 35px 30px;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: var(--transition-smooth);
    }

    .pricing-card:hover {
      border-color: rgba(192, 132, 252, 0.2);
      transform: translateY(-5px);
    }

    .recommended-card {
      border-color: rgba(192, 132, 252, 0.4);
      background: linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, rgba(19, 19, 26, 0.8) 100%);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(124, 58, 237, 0.08);
    }

    .recommended-card:hover {
      border-color: rgba(192, 132, 252, 0.6);
      box-shadow: 0 25px 55px rgba(0, 0, 0, 0.7), 0 0 40px rgba(124, 58, 237, 0.15);
    }

    .recommended-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #c084fc 0%, #7c3aed 100%);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);
    }

    .card-tier-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .card-tier-name.text-accent {
      color: var(--accent-purple);
    }

    .card-price {
      margin-bottom: 16px;
      display: flex;
      align-items: baseline;
    }

    .card-price .currency {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .card-price .amount {
      font-size: 3.2rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
      letter-spacing: -1px;
    }

    .card-price .period {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-left: 4px;
    }

    .card-tier-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 25px 0;
      min-height: 42px;
    }

    .card-features {
      flex: 1;
      border-top: 1px solid var(--dark-border);
      padding-top: 22px;
      margin-bottom: 30px;
    }

    .card-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card-features li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .card-features li.disabled-feature {
      color: var(--text-muted);
      opacity: 0.4;
    }

    .card-features .check-icon {
      color: var(--text-muted);
      font-size: 18px;
    }

    .card-features .check-icon.accent-tick {
      color: var(--accent-purple);
    }

    .card-features .close-icon {
      color: #ef4444;
      font-size: 18px;
    }

    .w-full {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }

    /* Testimonials Section */
    .testimonial-section {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .testimonial-carousel-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 25px;
      max-width: 850px;
      margin: 0 auto;
      width: 100%;
    }

    @media (max-width: 600px) {
      .testimonial-carousel-wrapper {
        gap: 10px;
      }
      .carousel-nav-btn {
        display: none !important;
      }
    }

    .carousel-nav-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--dark-border);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .carousel-nav-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--accent-purple);
      color: var(--accent-purple);
    }

    .testimonial-active-slide {
      flex: 1;
      padding: 35px 40px;
      background: rgba(19, 19, 26, 0.5);
      border: 1px solid rgba(192, 132, 252, 0.15);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .testimonial-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stars-row {
      display: flex;
      gap: 2px;
    }

    .star-icon {
      color: #f59e0b;
      font-size: 20px;
    }

    .testimonial-metric-badge {
      font-size: 0.8rem;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 12px;
      border-radius: 12px;
    }

    .testimonial-quote {
      font-size: 1.15rem;
      line-height: 1.6;
      font-style: italic;
      color: var(--text-primary);
      margin: 0;
    }

    .testimonial-author-block {
      display: flex;
      align-items: center;
      gap: 12px;
      border-top: 1px solid var(--dark-border);
      padding-top: 18px;
    }

    .author-avatar {
      color: var(--accent-purple);
    }

    .author-avatar .material-symbols-outlined {
      font-size: 36px;
    }

    .author-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .author-name {
      font-size: 0.95rem;
      font-weight: 700;
    }

    .author-role {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .carousel-dots-row {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 25px;
    }

    .carousel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dark-border);
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .carousel-dot:hover {
      background: var(--text-muted);
    }

    .carousel-dot.active {
      background: var(--accent-purple);
      transform: scale(1.2);
    }

    /* FAQ Section */
    .faq-section {
      display: flex;
      flex-direction: column;
    }

    .faq-accordion-container {
      max-width: 750px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .faq-item-card {
      border: 1px solid var(--dark-border);
      padding: 0;
      overflow: hidden;
      transition: var(--transition-smooth);
      background: rgba(19, 19, 26, 0.4);
    }

    .faq-item-card.open {
      border-color: rgba(192, 132, 252, 0.25);
      background: rgba(19, 19, 26, 0.8);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }

    .faq-header-btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-family: var(--font-family);
      font-size: 1.05rem;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .faq-header-btn:hover {
      color: var(--accent-purple);
    }

    .expand-icon {
      color: var(--text-muted);
      font-size: 24px;
      transition: var(--transition-smooth);
    }

    .faq-item-card.open .expand-icon {
      color: var(--accent-purple);
    }

    .faq-body-content {
      padding: 0 24px 20px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.02);
      animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .faq-body-content p {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* Bottom CTAs */
    .bottom-cta-section {
      text-align: center;
      padding: 60px 40px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(192, 132, 252, 0.25);
      background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, rgba(19, 19, 26, 0.9) 100%);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(124, 58, 237, 0.1);
    }

    .cta-inner-content {
      position: relative;
      z-index: 2;
      max-width: 650px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }

    .cta-title {
      font-size: 2.8rem;
      font-weight: 800;
      margin: 0;
      line-height: 1.15;
      letter-spacing: -1.5px;
    }

    .cta-subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      margin-top: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-cta-large {
      padding: 14px 28px;
      font-size: 1rem;
      border-radius: 10px;
    }

    /* Footer */
    .footer {
      display: flex;
      flex-direction: column;
      gap: 50px;
      border-top: 1px solid var(--dark-border);
      padding: 80px 0 40px 0;
      margin-top: 60px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      gap: 40px;
    }

    @media (max-width: 900px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .footer-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .footer-brand {
        justify-content: center;
      }
      .quick-links-group {
        justify-content: center;
      }
      .contact-list li {
        justify-content: center;
      }
      .social-icons {
        justify-content: center;
      }
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-size: 1.4rem;
      font-weight: 800;
      color: white;
      margin-bottom: 15px;
    }

    .brand-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0 0 20px 0;
    }

    .quick-links-group {
      display: flex;
      gap: 20px;
    }

    .quick-links-group a {
      color: var(--accent-purple);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: var(--transition-smooth);
    }

    .quick-links-group a:hover {
      color: white;
    }

    .footer-col h4 {
      font-size: 1rem;
      font-weight: 700;
      color: white;
      margin: 0 0 20px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .footer-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .footer-list a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition-smooth);
    }

    .footer-list a:hover {
      color: var(--accent-purple);
    }

    .contact-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .contact-list li a {
      color: var(--text-muted);
    }

    .contact-list .material-symbols-outlined {
      font-size: 18px;
      color: var(--accent-purple);
    }

    .social-icons {
      display: flex;
      gap: 15px;
      margin-top: 25px;
    }

    .social-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      text-decoration: none;
      transition: var(--transition-smooth);
    }

    .social-btn:hover {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }

    .social-btn .material-symbols-outlined {
      font-size: 18px;
    }

    .copy-text {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.02);
      padding-top: 24px;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  // Demo Templates & Steps
  demoTemplates = [
    {
      id: 'cleaning',
      name: 'Cleaning Service',
      url: 'leadpulse.app/f/home-cleaning',
      icon: 'cleaning_services',
      title: 'Cleaning Quote Request',
      steps: [
        {
          label: 'Service Type',
          question: 'What type of cleaning service do you require?',
          type: 'radio',
          options: ['Deep Clean', 'Regular Clean', 'Move-out Clean']
        },
        {
          label: 'Bedrooms',
          question: 'How many bedrooms need cleaning?',
          type: 'select',
          options: ['1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms']
        },
        {
          label: 'Contact Info',
          question: 'Where should we send your custom cleaning quote?',
          type: 'text',
          placeholder: 'your-email@example.com'
        }
      ]
    },
    {
      id: 'webdev',
      name: 'Web Dev Request',
      url: 'leadpulse.app/f/pixelcraft',
      icon: 'code',
      title: 'Project Estimate Builder',
      steps: [
        {
          label: 'Project Type',
          question: 'What type of platform are you building?',
          type: 'radio',
          options: ['E-Commerce Store', 'SaaS App', 'Landing Page']
        },
        {
          label: 'Budget Range',
          question: 'What is your estimated project budget?',
          type: 'select',
          options: ['Under $5,000', '$5,000 - $15,000', '$15,000 - $35,000', '$35,000+']
        },
        {
          label: 'Contact Info',
          question: 'What business email should our architect reply to?',
          type: 'text',
          placeholder: 'architect@company.com'
        }
      ]
    },
    {
      id: 'fitness',
      name: 'Personal Coach',
      url: 'leadpulse.app/f/apex-fit',
      icon: 'fitness_center',
      title: 'Fitness Assessment',
      steps: [
        {
          label: 'Training Goal',
          question: 'What is your primary training objective?',
          type: 'radio',
          options: ['Weight Loss / Conditioning', 'Build Muscle & Strength', 'Athletic Performance']
        },
        {
          label: 'Frequency',
          question: 'How many days per week can you train?',
          type: 'select',
          options: ['1 - 2 days/week', '3 - 4 days/week', '5+ days/week']
        },
        {
          label: 'Contact Info',
          question: 'Where should we send your custom assessment results?',
          type: 'text',
          placeholder: 'your-name@fitness.com'
        }
      ]
    }
  ];

  selectedTemplateId = 'cleaning';
  currentStepIndex = 0;
  answers: { [key: string]: string } = {};
  emailInput = '';
  formSubmitted = false;
  submitting = false;

  // Workflow Showcase Steps
  activeWorkflowStep = 0;
  workflowSteps = [
    {
      title: 'Build Questionnaire',
      desc: 'Create custom multi-step forms using an intuitive, drag-and-drop form editor. Mix radios, select fields, and validation rules to qualify leads.',
      icon: 'construction',
      details: ['Add multiple choice, dates, text, and pricing sliders', 'Define conditional branch pathways', 'Preview responsiveness in real-time']
    },
    {
      title: 'Configure SEO & Slug',
      desc: 'Customize URL slugs and SEO tags. Every page is fully pre-rendered server-side (SSR), sending optimized HTML to Google crawlers for high ranks.',
      icon: 'search',
      details: ['Custom domains or custom /f/ slug', 'Edit title tags and open-graph images', 'Automatic generation of web-ready sitemaps']
    },
    {
      title: 'Deploy & Capture',
      desc: 'Share your public link or embed on your landing page. Customer responses are validated automatically to prevent bot spam and dead leads.',
      icon: 'rocket_launch',
      details: ['Hosted on a global, high-speed CDN network', 'Zero database hosting required on your end', 'Built-in double opt-in validation options']
    },
    {
      title: 'Qualify & Analyze',
      desc: 'Qualified leads populate your Kanban CRM board instantly. Review response charts, track conversions, and stage opportunities dynamically.',
      icon: 'query_stats',
      details: ['Convert form data directly to deal cards', 'Advanced funnel visualization metrics', 'Webhooks to push to Slack or email list']
    }
  ];

  // Simulator States
  recentLeads = [
    { name: 'David Miller', type: 'Home Cleaning', value: '$220', status: 'New', time: 'Just now' },
    { name: 'Jessica Vance', type: 'Web Development', value: '$12,500', status: 'Contacted', time: '1 min ago' },
    { name: 'Sarah Jenkins', type: 'Personal Coach', value: '$450/mo', status: 'Qualified', time: '3 mins ago' },
    { name: 'Robert Chen', type: 'Home Cleaning', value: '$180', status: 'Converted', time: '5 mins ago' }
  ];
  leadStatusStyles: { [key: string]: string } = {
    'New': 'status-badge-new',
    'Contacted': 'status-badge-contacted',
    'Qualified': 'status-badge-qualified',
    'Converted': 'status-badge-converted'
  };

  // Pricing State
  isAnnual = true;

  // Testimonials State
  currentTestimonialIndex = 0;
  testimonials = [
    {
      quote: "LeadPulse completely changed how we qualify cleaning contracts. Our booking rate increased by 32% since customers can calculate quotes themselves.",
      author: "Clara Vance",
      role: "CEO & Founder",
      company: "Sparkle Cleaners LLC",
      rating: 5,
      metric: "+32% Bookings"
    },
    {
      quote: "Setting up dynamic SEO-ready forms for our marketing agency took under five minutes. The webhooks integration pushed leads directly into HubSpot.",
      author: "Marcus Brody",
      role: "Head of Growth",
      company: "Innovate Digital",
      rating: 5,
      metric: "12x SEO Traffic"
    },
    {
      quote: "We filtered out 95% of spam requests using their step validations. The funnel drop-off analytics help us test which questions customers drop on.",
      author: "Coach Sarah",
      role: "Founder & Head Coach",
      company: "Apex Training Inc",
      rating: 5,
      metric: "-95% Lead Spam"
    }
  ];

  // FAQ State
  openFaqIndex: number | null = 0;
  faqs = [
    {
      q: 'How does the SEO-friendly SSR feature work?',
      a: 'All LeadPulse forms are served with Server-Side Rendering (SSR). This means that when a search engine bot crawls your form URL, it immediately receives complete, static HTML with your custom titles, descriptions, and meta tags. This leads to significantly faster index times and higher organic rankings.'
    },
    {
      q: 'Can I integrate LeadPulse with my existing CRM?',
      a: 'Absolutely. We support configurable Webhooks on form submissions. You can route leads automatically to tools like Zapier, HubSpot, Slack, Salesforce, or your own custom back-end endpoints in real-time.'
    },
    {
      q: 'Is there a limit to how many questions I can add to a form?',
      a: 'There is no hard limit. You can add as many steps and options as you need. However, our analytics dashboard shows step-by-step dropoff charts so you can see if a form is too long and optimize it for high conversion rates.'
    },
    {
      q: 'Do I need to host a database or server?',
      a: 'No. LeadPulse is fully hosted. We manage all PostgreSQL lead storage, server-side SSR, and global CDNs. You simply log in to your admin panel to build forms and manage incoming leads.'
    }
  ];

  simulatorInterval: any;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('LeadPulse | High-Converting Business Lead Capture');
    this.meta.updateTag({
      name: 'description',
      content: 'LeadPulse enables businesses to deploy high-converting, SEO-optimized dynamic questionnaire forms and manage qualified client leads inside a sleek visual dashboard.'
    });

    // Start lead inbox simulator
    this.startSimulator();
  }

  ngOnDestroy(): void {
    if (this.simulatorInterval) {
      clearInterval(this.simulatorInterval);
    }
  }

  // Interactive Form Helpers
  get currentTemplate() {
    return this.demoTemplates.find(t => t.id === this.selectedTemplateId) || this.demoTemplates[0];
  }

  get currentStep() {
    return this.currentTemplate.steps[this.currentStepIndex];
  }

  selectTemplate(id: string) {
    this.selectedTemplateId = id;
    this.currentStepIndex = 0;
    this.answers = {};
    this.emailInput = '';
    this.formSubmitted = false;
  }

  selectOption(question: string, option: string) {
    this.answers[question] = option;
  }

  nextStep() {
    const question = this.currentStep.question;
    // Basic validation
    if (this.currentStep.type !== 'text' && !this.answers[question]) {
      alert('Please select an option to proceed!');
      return;
    }
    if (this.currentStep.type === 'text' && !this.emailInput) {
      alert('Please enter your email to get a custom quote.');
      return;
    }

    if (this.currentStepIndex < this.currentTemplate.steps.length - 1) {
      this.currentStepIndex++;
    } else {
      this.submitForm();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  submitForm() {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.formSubmitted = true;

      // Add to simulator in real-time
      const leadVal = this.selectedTemplateId === 'webdev' ? '$15,000' : (this.selectedTemplateId === 'cleaning' ? '$220' : '$450/mo');
      this.recentLeads.unshift({
        name: this.emailInput.split('@')[0],
        type: this.selectedTemplateId === 'cleaning' ? 'Home Cleaning' : (this.selectedTemplateId === 'webdev' ? 'Web Development' : 'Personal Coach'),
        value: leadVal,
        status: 'New',
        time: 'Just now'
      });
      // Limit to 6 items
      if (this.recentLeads.length > 6) {
        this.recentLeads.pop();
      }
    }, 1200);
  }

  resetForm() {
    this.currentStepIndex = 0;
    this.answers = {};
    this.emailInput = '';
    this.formSubmitted = false;
  }

  // Workflow Helpers
  setWorkflowStep(idx: number) {
    this.activeWorkflowStep = idx;
  }

  // Pricing Helpers
  togglePricing(val: boolean) {
    this.isAnnual = val;
  }

  // Testimonial Carousel Helpers
  nextTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  // FAQ Accordion Helpers
  toggleFaq(idx: number) {
    if (this.openFaqIndex === idx) {
      this.openFaqIndex = null;
    } else {
      this.openFaqIndex = idx;
    }
  }

  // Live Inbox Simulator Logic
  startSimulator() {
    const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Ethan', 'Sophia', 'Lucas', 'Mia'];
    const serviceTiers = ['Deep Cleaning', 'Regular Clean', 'E-Commerce Store', 'Custom Web App', 'Strength Training', 'Lose Weight'];
    const statuses = ['New', 'Contacted', 'Qualified', 'Converted'];

    this.simulatorInterval = setInterval(() => {
      // 30% chance to update status of a random lead, 70% to add a new lead
      if (Math.random() > 0.6 && this.recentLeads.length > 0) {
        const randomIdx = Math.floor(Math.random() * this.recentLeads.length);
        const currentStatus = this.recentLeads[randomIdx].status;
        const currentStatusIdx = statuses.indexOf(currentStatus);
        if (currentStatusIdx < statuses.length - 1) {
          this.recentLeads[randomIdx].status = statuses[currentStatusIdx + 1];
          this.recentLeads[randomIdx].time = 'Updated';
        }
      } else {
        const randName = firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.';
        const randService = serviceTiers[Math.floor(Math.random() * serviceTiers.length)];
        let val = '$240';
        let type = 'Home Cleaning';
        if (randService.includes('Store') || randService.includes('App')) {
          val = '$' + (Math.floor(Math.random() * 15) + 5) + ',000';
          type = 'Web Development';
        } else if (randService.includes('Training') || randService.includes('Weight')) {
          val = '$' + (Math.floor(Math.random() * 4) + 2) + '00/mo';
          type = 'Personal Coach';
        }

        this.recentLeads.unshift({
          name: randName,
          type: type,
          value: val,
          status: 'New',
          time: 'Just now'
        });

        if (this.recentLeads.length > 6) {
          this.recentLeads.pop();
        }
      }
    }, 4500);
  }
}
