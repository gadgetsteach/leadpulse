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
              <h2>1. Our Mission</h2>
              <p>We believe that capturing business leads shouldn't feel like fishing in the dark. LeadPulse empowers businesses with intelligent, multi-step Q&A questionnaires that screen and qualify prospects before they even reach your inbox. This ensures that you only spend time on leads that convert, optimizing overall acquisition efficiency.</p>
            </div>

            <div class="content-section">
              <h2>2. The Problem with Traditional Forms</h2>
              <p>Standard website forms have remained unchanged for decades. Massive forms with ten fields at once immediately intimidate visitors, resulting in low conversion rates averaging below 4%. In today's fast-paced digital environment, capturing user attention requires interactive, dynamic experiences that load fast and request information progressively.</p>
            </div>

            <div class="content-section">
              <h2>3. Our Solution: Progressive Stepper Flows</h2>
              <p>LeadPulse solves drop-off by breaking complex forms into micro-stepper Q&A screens. By asking only one question at a time, we maintain user focus and build micro-commitment. This method results in conversion rates of up to 27.4%, dramatically lowering customer acquisition costs for small and large enterprises alike.</p>
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

            <div class="content-section">
              <h2>4. The Power of Intent Scoring</h2>
              <p>Our backend parses leads as they come in, rating prospect intent based on responses, timelines, and interaction patterns. This automated qualification ensures that you prioritize premium prospects first. No more wasting hours calling cold leads that only wanted to browse; instead, you focus on ready-to-buy clients.</p>
            </div>

            <div class="content-section">
              <h2>5. Customization Tailored for All Niches</h2>
              <p>Every business operates differently. Whether you are in home cleaning, SaaS, legal consulting, construction, or real estate, LeadPulse forms can be customized. You can select, sort, and add form questions, edit placeholder text, require specific answers, and toggle redirection variables in a few clicks.</p>
            </div>

            <div class="content-section">
              <h2>6. Analytics and Growth Channels</h2>
              <p>LeadPulse features detailed analytics on form starts, drops, and completes. By tracking which specific questions cause users to leave, you can refine your funnel to perfection. These insights let you test different question structures and optimize your marketing budget for maximum return on investment.</p>
            </div>

            <div class="content-section highlight-box">
              <h3>7. Constant Platform Innovation</h3>
              <p>We are dedicated to building the most intuitive lead capture engine on the web. Our team constantly releases design upgrades, adds layout options, and maintains robust databases to keep your sales funnel running smoothly 24/7/365.</p>
            </div>

            <div class="content-section">
              <h2>8. Partnering for Long-Term Growth</h2>
              <p>At LeadPulse, we view ourselves as a growth partner for your business. We don't just sell software; we work with you to understand your lead generation goals, streamline acquisition pathways, and supply high-quality pipelines that help your enterprise scale consistently year over year.</p>
            </div>
          </div>

          <!-- Privacy Policy -->
          <div *ngIf="currentPage() === 'privacy'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">Privacy Policy</h1>
            <p class="last-updated">Last Updated: July 4, 2026</p>

            <div class="content-section">
              <h2>1. Agreement and Consent</h2>
              <p>At LeadPulse, accessible from leadpulse.app, one of our main priorities is the privacy of our visitors and businesses. This Privacy Policy document outlines the types of information collected and recorded by LeadPulse and how we use it. By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
            </div>

            <div class="content-section">
              <h2>2. Information We Collect</h2>
              <p>We collect information to provide better services to all our users. When you register a business, we request account details such as your name, business name, and email address. If you contact us directly, we may receive additional information about you, including the contents of the message and attachments you send us.</p>
            </div>

            <div class="content-section">
              <h2>3. Lead Submissions Protection</h2>
              <p>Any data submitted by users on your public forms (such as names, emails, phone numbers, and answers to your custom questionnaire) is stored securely. LeadPulse acts as a data processor for these leads. We will never sell, lease, or distribute your leads' data or your business details to third-party entities.</p>
            </div>

            <div class="content-section">
              <h2>4. Log Files and Analytical Data</h2>
              <p>LeadPulse follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. This data is not linked to any personally identifiable information.</p>
            </div>

            <div class="content-section">
              <h2>5. Cookies and Web Beacons</h2>
              <p>Like any other website, LeadPulse uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and other information.</p>
            </div>

            <div class="content-section">
              <h2>6. Security Measures and Certifications</h2>
              <p>We employ enterprise-grade SSL/TLS encryption for all data in transit and at rest. Leads are stored securely in our PostgreSQL databases and are accessible only to authenticated business owners. We run routine audits to maintain the integrity of our security infrastructure and protect against unauthorized access.</p>
            </div>

            <div class="content-section">
              <h2>7. GDPR Data Protection Rights</h2>
              <p>We want to ensure you are fully aware of all your data protection rights. Every user is entitled to the following: The right to access, the right to rectification, the right to erasure, the right to restrict processing, the right to object to processing, and the right to data portability. If you make a request, we have one month to respond to you.</p>
            </div>

            <div class="content-section">
              <h2>8. Data Retention Limits</h2>
              <p>We retain your personal data and leads' data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>
            </div>
          </div>

          <!-- Terms of Service -->
          <div *ngIf="currentPage() === 'terms'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">Terms of Service</h1>
            <p class="last-updated">Last Updated: July 4, 2026</p>

            <div class="content-section">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using LeadPulse, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and others who access or use the Service.</p>
            </div>

            <div class="content-section">
              <h2>2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on LeadPulse's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.</p>
            </div>

            <div class="content-section">
              <h2>3. Business Account Responsibilities</h2>
              <p>You are responsible for safeguarding your login credentials and for all activities that occur under your business account. You must notify us immediately of any unauthorized use or security breach. LeadPulse will not be liable for any loss or damage arising from your failure to protect your login info.</p>
            </div>

            <div class="content-section animate-fade-in-up">
              <h2>4. Acceptable Use Policy</h2>
              <p>You agree not to use LeadPulse to build forms that capture sensitive personal information such as credit card details, government identification, or passwords. Any account found violating this policy will be terminated immediately, and their lead database will be permanently deleted.</p>
            </div>

            <div class="content-section highlight-box warning">
              <h3>5. Platform Disclaimer</h3>
              <p>LeadPulse acts solely as a lead capture platform. We do not guarantee the conversion rates, verification status, or financial viability of any lead captured using our templates. It is the user's responsibility to qualify leads before business transactions.</p>
            </div>

            <div class="content-section">
              <h2>6. Intellectual Property Rights</h2>
              <p>All content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by LeadPulse, its licensors, or other providers of such material and are protected by international copyright laws.</p>
            </div>

            <div class="content-section">
              <h2>7. Limitations of Liability</h2>
              <p>In no event shall LeadPulse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>
            </div>

            <div class="content-section">
              <h2>8. Governing Law and Policy Revisions</h2>
              <p>These terms and conditions are governed by and construed in accordance with local regulations, and you submit to the exclusive jurisdiction of the regional courts. We reserve the right to modify these terms at any time. Changes will be posted instantly on this page.</p>
            </div>
          </div>

          <!-- Return & Refund Policy -->
          <div *ngIf="currentPage() === 'refund'" class="page-content animate-fade-in-up">
            <h1 class="gradient-text">Return & Refund Policy</h1>
            <p class="last-updated">Last Updated: July 4, 2026</p>

            <div class="content-section">
              <h2>1. Coin Purchases and Billing</h2>
              <p>LeadPulse operates on a credit-based system (Coins) for unlocking premium features, custom templates, or viewing advanced lead analytics. All coin packages purchased are instantly credited to your business account upon payment, allowing immediate utility.</p>
            </div>

            <div class="content-section">
              <h2>2. No-Refund General Rule</h2>
              <p>Since Coins are digital assets that are instantly credited to your business account upon payment, all sales are final. Unused coin balances cannot be returned, exchanged, or converted back into real-world currency under standard circumstances.</p>
            </div>

            <div class="content-section">
              <h2>3. Refund Eligibility Exceptions</h2>
              <p>Refunds or coin adjustments may be considered under the following conditions: Double billing due to a technical error on our payment gateway, or system-wide outages that prevented coin utilization for more than 48 consecutive hours. Refund requests must be made within 7 days of transaction.</p>
            </div>

            <div class="content-section">
              <h2>4. Subscription Cancellation Policy</h2>
              <p>If you are subscribed to a monthly recurring package, you may cancel your membership at any time. Upon cancellation, your account will remain active at its current tier until the end of the billing cycle, and no partial refunds will be issued for unused days.</p>
            </div>

            <div class="content-section">
              <h2>5. Account Abuse Penalties</h2>
              <p>If an account is suspended, restricted, or terminated due to policy violations (such as collecting forbidden sensitive credentials), any unused coin balance or package credits remaining on the account are non-refundable and will be forfeited.</p>
            </div>

            <div class="content-section">
              <h2>6. Failed Transaction Assistance</h2>
              <p>If your bank account was debited but the coins were not credited due to network failure, please contact our support team immediately. We will audit our gateway logs and credit the appropriate coins manually within 24 hours of confirmation.</p>
            </div>

            <div class="content-section">
              <h2>7. Third-Party Integrations Refund Policy</h2>
              <p>Payments made for third-party integrations, such as external CRM plugins, webhook tools, or mailing lists synced with LeadPulse, are subject to the respective provider's terms. LeadPulse is not responsible for refunding third-party charges.</p>
            </div>

            <div class="content-section">
              <h2>8. Claims Process and Support</h2>
              <p>To request a refund review under the exception criteria, email our claims team at <strong>support&#64;leadpulse.com</strong> with your Transaction ID, account email, and receipt. Approved requests will be processed to the original payment method within 5-7 business days.</p>
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

            <div class="content-section">
              <h2>Support Philosophy</h2>
              <p>At LeadPulse, we are dedicated to providing support to ensure your lead capturing forms run smoothly and convert efficiently. We believe that clear communication is the foundation of any successful business relationship.</p>
            </div>

            <div class="content-section">
              <h2>Technical & Bug Reports</h2>
              <p>Encountered a bug or need help configuring a stepper flow? Select 'Technical Support' in the contact dropdown. Provide as much detail as possible, including browser details and step-by-step reproduction info, so our engineers can resolve it fast.</p>
            </div>

            <div class="content-section">
              <h2>Billing & Coin Package Queries</h2>
              <p>For questions regarding your coin balance, payment receipt issues, or wallet details, we are here to help. Our billing specialists handle audits and manually resolve transaction drops in a timely manner.</p>
            </div>

            <div class="content-section">
              <h2>Custom Design Consultation</h2>
              <p>Need a specialized stepper flow or question layout that you don't see in our default builder? Reach out to our design team. We offer tailored layouts and integration support to match your brand's unique specifications.</p>
            </div>

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
                  <p>+91 7753058069</p>
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
