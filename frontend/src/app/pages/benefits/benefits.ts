import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="benefits-container animate-fade-in-up">
      <!-- Header -->
      <header class="page-header glass-panel">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </a>
          <h1 class="gradient-text">LeadPulse Growth Levels & Benefits</h1>
          <p class="subtitle">Understand tier thresholds, coin discounts, and features to help your business scale</p>
        </div>
      </header>

      <!-- Tiers Grid -->
      <div class="benefits-grid">
        <!-- Starter Tier -->
        <div class="tier-card active glass-panel">
          <div class="tier-header">
            <span class="badge yellow">Active Tier</span>
            <span class="material-symbols-outlined tier-icon">verified</span>
            <h2>Starter</h2>
            <p class="tier-price">Included by Default</p>
          </div>
          <div class="tier-body">
            <p class="tier-intro">Perfect for freelancers, side hustlers, and local businesses starting out.</p>
            <ul class="features-list">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Up to 10 qualified leads/month</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Standard Form Builder templates</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Basic real-time Analytics</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Email notification alerts</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Growth Tier -->
        <div class="tier-card premium glass-panel">
          <div class="tier-header">
            <span class="badge purple">Next Level</span>
            <span class="material-symbols-outlined tier-icon">trending_up</span>
            <h2>Growth</h2>
            <p class="tier-price">Unlock at 10+ Leads/mo</p>
          </div>
          <div class="tier-body">
            <p class="tier-intro">For expanding teams looking to automate screening and increase speed-to-lead.</p>
            <ul class="features-list">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Up to 50 qualified leads/month</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>WhatsApp client notifications</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Custom redirects after submission</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span><strong>10% discount</strong> on coin packages</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Professional Tier -->
        <div class="tier-card super glass-panel">
          <div class="tier-header">
            <span class="badge purple">Ultimate</span>
            <span class="material-symbols-outlined tier-icon">military_tech</span>
            <h2>Professional</h2>
            <p class="tier-price">Unlock at 30+ Leads/mo</p>
          </div>
          <div class="tier-body">
            <p class="tier-intro">For agencies and high-volume operations requiring deep CRM integrations.</p>
            <ul class="features-list">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Unlimited leads & custom domains</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Instant Webhooks & REST API sync</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span>Dedicated account manager support</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span><strong>25% discount</strong> on coin packages</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .benefits-container {
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

    /* Tiers Grid */
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
    }

    .tier-card {
      padding: 35px;
      display: flex;
      flex-direction: column;
      gap: 25px;
      transition: var(--transition-smooth);
    }

    .tier-card:hover {
      border-color: rgba(192, 132, 252, 0.25);
      transform: translateY(-3px);
    }

    .tier-card.active {
      border-color: rgba(245, 158, 11, 0.25);
      background: linear-gradient(180deg, rgba(245, 158, 11, 0.03) 0%, rgba(19, 19, 26, 0.75) 100%);
    }

    .tier-card.premium {
      border-color: rgba(124, 58, 237, 0.25);
      background: linear-gradient(180deg, rgba(124, 58, 237, 0.03) 0%, rgba(19, 19, 26, 0.75) 100%);
    }

    .tier-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      border-bottom: 1px solid var(--dark-border);
      padding-bottom: 20px;
    }

    .tier-header h2 {
      font-size: 1.6rem;
      font-weight: 800;
      color: white;
      margin: 0;
    }

    .tier-price {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--accent-purple);
      margin: 0;
    }

    .tier-icon {
      font-size: 32px;
      color: var(--accent-purple);
      align-self: flex-start;
      background: rgba(192, 132, 252, 0.08);
      padding: 10px;
      border-radius: 8px;
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .badge.yellow { background: #fef3c7; color: #b45309; }
    .badge.purple { background: #f5f3ff; color: #7c3aed; }

    .tier-intro {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 10px 0;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .features-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .features-list li .check {
      font-size: 20px;
      color: #10b981;
    }
  `]
})
export class BenefitsComponent {}
