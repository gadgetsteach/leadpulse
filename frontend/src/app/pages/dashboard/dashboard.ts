import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-wrapper animate-fade-in-up">
      <!-- Sidebar Nav -->
      <aside class="sidebar glass-panel">
        <div class="sidebar-brand">
          <span class="material-symbols-outlined logo-icon">insights</span>
          <span class="logo-text">LeadPulse</span>
        </div>
        
        <div class="business-profile" *ngIf="business()">
          <div class="avatar">{{ business().name[0].toUpperCase() }}</div>
          <div class="business-info">
            <h4>{{ business().name }}</h4>
            <p>Admin Panel</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a href="javascript:void(0)" [class.active]="activeTab() === 'overview'" (click)="activeTab.set('overview')">
            <span class="material-symbols-outlined">dashboard</span> Overview
          </a>
          <a href="javascript:void(0)" [class.active]="activeTab() === 'leads'" (click)="activeTab.set('leads')">
            <span class="material-symbols-outlined">group</span> Manage Leads
          </a>
          <a href="javascript:void(0)" [class.active]="activeTab() === 'forms'" (click)="activeTab.set('forms')">
            <span class="material-symbols-outlined">dynamic_form</span> Dynamic Forms
          </a>
        </nav>

        <button class="logout-btn" (click)="onLogout()">
          <span class="material-symbols-outlined">logout</span> Log Out
        </button>
      </aside>

      <!-- Main Panel -->
      <main class="main-content">
        <!-- Top Title Bar -->
        <header class="content-header">
          <div>
            <h1>{{ activeTab() === 'overview' ? 'Seller Overview' : activeTab() === 'leads' ? 'Lead Pipeline' : 'Form Templates' }}</h1>
            <p class="subtitle">Real-time dynamic acquisition dashboard</p>
          </div>
          <button *ngIf="activeTab() === 'forms'" class="btn-primary" (click)="onCreateForm()">
            <span class="material-symbols-outlined">add</span> Create Form
          </button>
        </header>

        <!-- Tab 1: Overview -->
        <section *ngIf="activeTab() === 'overview'" class="tab-content">
          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="dashboard-card stat-card">
              <span class="material-symbols-outlined stat-icon purple">group</span>
              <div>
                <p class="stat-label">Total Leads</p>
                <h2 class="stat-value">{{ analytics()?.totalLeads || 0 }}</h2>
              </div>
            </div>
            
            <div class="dashboard-card stat-card">
              <span class="material-symbols-outlined stat-icon green">check_circle</span>
              <div>
                <p class="stat-label">Won Leads</p>
                <h2 class="stat-value">{{ analytics()?.statusCounts?.won || 0 }}</h2>
              </div>
            </div>

            <div class="dashboard-card stat-card">
              <span class="material-symbols-outlined stat-icon yellow">trending_up</span>
              <div>
                <p class="stat-label">Conversion Rate</p>
                <h2 class="stat-value">{{ analytics()?.conversionRate || 0 }}%</h2>
              </div>
            </div>

            <div class="dashboard-card stat-card">
              <span class="material-symbols-outlined stat-icon blue">assignment</span>
              <div>
                <p class="stat-label">Active Forms</p>
                <h2 class="stat-value">{{ forms().length }}</h2>
              </div>
            </div>
          </div>

          <!-- Bottom Columns -->
          <div class="overview-grid">
            <!-- Recent Leads -->
            <div class="dashboard-card col-recent">
              <h3>Recent Leads</h3>
              <div class="table-container">
                <table class="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Form</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let lead of analytics()?.recentLeads" (click)="viewLeadDetails(lead.id)">
                      <td>{{ lead.contact?.name }}</td>
                      <td>{{ lead.form?.title }}</td>
                      <td><span class="status-badge" [ngClass]="lead.status">{{ lead.status }}</span></td>
                      <td>{{ lead.createdAt | date:'shortDate' }}</td>
                    </tr>
                    <tr *ngIf="!analytics()?.recentLeads?.length">
                      <td colspan="4" class="empty-state">No leads collected yet. Submit your forms to see them here!</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Forms Summary -->
            <div class="dashboard-card col-forms">
              <h3>Acquisition Channels</h3>
              <div class="forms-summary-list">
                <div class="channel-row" *ngFor="let ch of analytics()?.leadsByForm">
                  <div class="channel-info">
                    <span class="channel-title">{{ ch.title }}</span>
                    <span class="channel-count">{{ ch.count }} leads</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="getMaxPercentage(ch.count)"></div>
                  </div>
                </div>
                <div *ngIf="!analytics()?.leadsByForm?.length" class="empty-state">No forms created yet.</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tab 2: Leads Pipeline -->
        <section *ngIf="activeTab() === 'leads'" class="tab-content leads-pipeline-layout">
          <!-- Filters & List -->
          <div class="leads-list-section dashboard-card">
            <div class="filter-bar">
              <select [(ngModel)]="filterFormId" (change)="loadLeads()">
                <option value="">All Forms</option>
                <option *ngFor="let f of forms()" [value]="f.id">{{ f.title }}</option>
              </select>
              <select [(ngModel)]="filterStatus" (change)="loadLeads()">
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div class="table-container pipeline-table-container">
              <table class="leads-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Form Name</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let l of leads()" [class.selected]="selectedLeadId() === l.id" (click)="viewLeadDetails(l.id)">
                    <td>
                      <div class="customer-cell">
                        <span class="cust-name">{{ l.contact?.name }}</span>
                        <span class="cust-phone">{{ l.contact?.phone }}</span>
                      </div>
                    </td>
                    <td>{{ l.contact?.email }}</td>
                    <td>{{ l.form?.title }}</td>
                    <td><span class="status-badge" [ngClass]="l.status">{{ l.status }}</span></td>
                    <td>{{ l.createdAt | date:'MMM d, y' }}</td>
                  </tr>
                  <tr *ngIf="!leads().length">
                    <td colspan="5" class="empty-state">No matching leads found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Slide-out Drawer Panel -->
          <div class="lead-detail-panel glass-panel" [class.open]="selectedLead()">
            <div class="panel-header" *ngIf="selectedLead()">
              <h3>Lead Profile</h3>
              <button class="close-panel-btn" (click)="selectedLead.set(null)">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div class="panel-body" *ngIf="selectedLead()">
              <!-- Customer Profile -->
              <div class="profile-card">
                <div class="profile-avatar">{{ selectedLead().contact?.name[0].toUpperCase() }}</div>
                <h3>{{ selectedLead().contact?.name }}</h3>
                <p class="form-origin">From: {{ selectedLead().form?.title }}</p>
                <span class="status-badge" [ngClass]="selectedLead().status">{{ selectedLead().status }}</span>
              </div>

              <!-- Contact Info -->
              <div class="info-section">
                <h4>Contact Details</h4>
                <div class="info-row">
                  <span class="material-symbols-outlined">mail</span>
                  <a href="mailto:{{ selectedLead().contact?.email }}">{{ selectedLead().contact?.email }}</a>
                </div>
                <div class="info-row">
                  <span class="material-symbols-outlined">call</span>
                  <a href="tel:{{ selectedLead().contact?.phone }}">{{ selectedLead().contact?.phone }}</a>
                </div>
              </div>

              <!-- Questionnaire Answers -->
              <div class="info-section answers-section">
                <h4>Questionnaire Submissions</h4>
                <div class="qa-block" *ngFor="let ans of selectedLead().answers">
                  <div class="question-text">{{ ans.question?.questionText }}</div>
                  <div class="answer-text">{{ formatAnswerValue(ans.value, ans.question?.questionType) }}</div>
                </div>
                <div *ngIf="!selectedLead().answers?.length" class="empty-state-small">No custom answers submitted.</div>
              </div>

              <!-- Pipeline Management -->
              <div class="info-section update-section">
                <h4>Pipeline Stage</h4>
                <select [ngModel]="selectedLead().status" (ngModelChange)="onUpdateStatus($event)">
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="won">Closed - Won</option>
                  <option value="lost">Closed - Lost</option>
                </select>
                
                <h4 style="margin-top: 20px;">Notes / Follow-up History</h4>
                <textarea [(ngModel)]="leadNotes" placeholder="Write internal notes about this lead..."></textarea>
                <button class="btn-primary" (click)="onSaveNotes()" style="margin-top: 10px; width: 100%; justify-content: center;">
                  Save Internal Notes
                </button>
              </div>
            </div>

            <div class="panel-empty" *ngIf="!selectedLead()">
              <span class="material-symbols-outlined panel-empty-icon">arrow_back</span>
              <p>Select a lead from the list to view profile, dynamic questionnaire answers, and update status.</p>
            </div>
          </div>
        </section>

        <!-- Tab 3: Forms Templates -->
        <section *ngIf="activeTab() === 'forms'" class="tab-content">
          <div class="dashboard-card">
            <div class="table-container">
              <table class="leads-table">
                <thead>
                  <tr>
                    <th>Form Title</th>
                    <th>Public URL Link (SEO Indexed)</th>
                    <th>Status</th>
                    <th>Total Leads</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let f of forms()">
                    <td class="form-title-cell">
                      <span class="material-symbols-outlined form-icon-logo">assignment</span>
                      <div>
                        <strong>{{ f.title }}</strong>
                        <p class="meta-desc">{{ f.description || 'No description provided.' }}</p>
                      </div>
                    </td>
                    <td>
                      <a href="http://localhost:4200/f/{{ f.slug }}" target="_blank" class="public-link">
                        <span class="material-symbols-outlined link-icon">link</span>
                        /f/{{ f.slug }}
                      </a>
                    </td>
                    <td>
                      <span class="status-badge" [class.active-form]="f.isActive" [class.inactive-form]="!f.isActive">
                        {{ f.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td><strong>{{ f._count?.leads || 0 }}</strong></td>
                    <td class="action-cell">
                      <a [routerLink]="['/dashboard/builder', f.id]" class="btn-edit-action">
                        <span class="material-symbols-outlined">edit</span> Customize Questions
                      </a>
                      <button class="btn-delete-action" (click)="onDeleteForm(f.id)">
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="!forms().length">
                    <td colspan="5" class="empty-state">You haven't built any lead questionnaires yet. Click "Create Form" to start.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
      background: radial-gradient(circle at 90% 10%, rgba(98, 0, 234, 0.05) 0%, transparent 40%);
    }

    @media (max-width: 1000px) {
      .dashboard-wrapper {
        grid-template-columns: 1fr;
      }
      .sidebar {
        display: none !important; /* Make mobile-friendly or collapse in production */
      }
    }

    /* Sidebar styles */
    .sidebar {
      background: rgba(10, 10, 14, 0.95);
      border-right: 1px solid var(--dark-border);
      border-radius: 0;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      box-sizing: border-box;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 35px;
      padding-left: 10px;
    }

    .logo-icon {
      font-size: 28px;
      color: var(--accent-purple);
    }

    .logo-text {
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .business-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--dark-border);
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
    }

    .business-info h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
    }

    .business-info p {
      margin: 2px 0 0 0;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.95rem;
      transition: var(--transition-smooth);
    }

    .sidebar-nav a:hover, .sidebar-nav a.active {
      color: white;
      background: rgba(124, 58, 237, 0.12);
      border-left: 3px solid var(--accent-purple);
      padding-left: 13px;
    }

    .sidebar-nav a .material-symbols-outlined {
      font-size: 20px;
    }

    .logout-btn {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: transparent;
      border: 1px solid var(--dark-border);
      color: #f87171;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-family: var(--font-family);
      transition: var(--transition-smooth);
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.3);
    }

    /* Main Panel styles */
    .main-content {
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 30px;
      overflow-y: auto;
      max-height: 100vh;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .content-header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .content-header .subtitle {
      margin: 4px 0 0 0;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    /* Tab: Overview */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 32px;
      padding: 12px;
      border-radius: 10px;
    }

    .stat-icon.purple { background: rgba(124, 58, 237, 0.1); color: var(--accent-purple); }
    .stat-icon.green { background: rgba(16, 185, 129, 0.1); color: #34d399; }
    .stat-icon.yellow { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
    .stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0 0 4px 0;
    }

    .stat-value {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: 1.3fr 0.7fr;
      gap: 25px;
      margin-top: 30px;
    }

    @media (max-width: 900px) {
      .overview-grid {
        grid-template-columns: 1fr;
      }
    }

    .col-recent h3, .col-forms h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 20px 0;
    }

    /* Leads Table */
    .table-container {
      overflow-x: auto;
    }

    .leads-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .leads-table th {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid var(--dark-border);
    }

    .leads-table td {
      padding: 14px 16px;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--dark-border);
      color: var(--text-primary);
      transition: var(--transition-smooth);
    }

    .leads-table tbody tr {
      cursor: pointer;
    }

    .leads-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.new { background: rgba(124, 58, 237, 0.15); color: var(--accent-purple); border: 1px solid rgba(192, 132, 252, 0.2); }
    .status-badge.contacted { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.2); }
    .status-badge.in_progress { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
    .status-badge.won { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.2); }
    .status-badge.lost { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.2); }

    .status-badge.active-form { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-badge.inactive-form { background: rgba(239, 68, 68, 0.15); color: #f87171; }

    .empty-state {
      text-align: center;
      color: var(--text-muted);
      padding: 40px 0 !important;
      font-style: italic;
    }

    /* Acquisition Channels */
    .forms-summary-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .channel-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .channel-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }

    .channel-title {
      font-weight: 500;
      color: var(--text-primary);
    }

    .channel-count {
      color: var(--text-muted);
    }

    .progress-bar {
      height: 6px;
      background: var(--dark-border);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #7c3aed, #c084fc);
      border-radius: 3px;
    }

    /* Tab: Leads Pipeline Panel Layout */
    .leads-pipeline-layout {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 25px;
      align-items: start;
    }

    @media (max-width: 900px) {
      .leads-pipeline-layout {
        grid-template-columns: 1fr;
      }
    }

    .leads-list-section {
      padding: 20px;
    }

    .filter-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .filter-bar select {
      background: var(--dark-bg);
      border: 1px solid var(--dark-border);
      color: var(--text-primary);
      padding: 8px 12px;
      border-radius: 6px;
      font-family: var(--font-family);
      font-size: 0.85rem;
      outline: none;
      cursor: pointer;
    }

    .filter-bar select:focus {
      border-color: var(--accent-purple);
    }

    .pipeline-table-container {
      max-height: 480px;
    }

    .customer-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .cust-name {
      font-weight: 600;
    }

    .cust-phone {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .leads-table tbody tr.selected {
      background: rgba(124, 58, 237, 0.08);
      border-left: 3px solid var(--accent-purple);
    }

    /* Lead Detail Drawer Panel */
    .lead-detail-panel {
      padding: 24px;
      min-height: 400px;
      box-sizing: border-box;
      position: sticky;
      top: 40px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      border-bottom: 1px solid var(--dark-border);
      padding-bottom: 14px;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .close-panel-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .close-panel-btn:hover {
      color: white;
    }

    .profile-card {
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--dark-border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .profile-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.4rem;
      margin-bottom: 12px;
    }

    .profile-card h3 {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .form-origin {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0 0 12px 0;
    }

    .info-section {
      margin-bottom: 25px;
    }

    .info-section h4 {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 600;
      margin: 0 0 12px 0;
      letter-spacing: 0.5px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    .info-row a {
      color: var(--accent-purple);
      text-decoration: none;
    }

    .info-row .material-symbols-outlined {
      color: var(--text-muted);
      font-size: 18px;
    }

    /* Custom Questionnaire Submissions */
    .qa-block {
      background: rgba(0, 0, 0, 0.15);
      border-left: 2px solid var(--accent-purple);
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 10px;
    }

    .question-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .answer-text {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .empty-state-small {
      color: var(--text-muted);
      font-size: 0.85rem;
      font-style: italic;
    }

    /* Pipeline Status & Notes Update */
    .update-section select {
      width: 100%;
      background: var(--dark-bg);
      border: 1px solid var(--dark-border);
      color: var(--text-primary);
      padding: 10px;
      border-radius: 8px;
      font-family: var(--font-family);
      outline: none;
      cursor: pointer;
    }

    .update-section textarea {
      width: 100%;
      height: 80px;
      background: var(--dark-bg);
      border: 1px solid var(--dark-border);
      color: var(--text-primary);
      padding: 10px;
      border-radius: 8px;
      font-family: var(--font-family);
      font-size: 0.85rem;
      outline: none;
      resize: vertical;
      box-sizing: border-box;
    }

    .panel-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 350px;
      text-align: center;
      color: var(--text-muted);
      padding: 20px;
    }

    .panel-empty-icon {
      font-size: 40px;
      color: var(--dark-border);
      margin-bottom: 15px;
    }

    .panel-empty p {
      font-size: 0.85rem;
      line-height: 1.5;
    }

    /* Tab: Forms templates list */
    .form-title-cell {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .form-icon-logo {
      font-size: 26px;
      color: var(--accent-purple);
      padding: 8px;
      background: rgba(124, 58, 237, 0.08);
      border-radius: 8px;
    }

    .meta-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 2px 0 0 0;
    }

    .public-link {
      color: var(--accent-purple);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }

    .public-link:hover {
      text-decoration: underline;
    }

    .link-icon {
      font-size: 16px;
    }

    .action-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-edit-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--dark-border);
      padding: 6px 12px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 500;
      transition: var(--transition-smooth);
    }

    .btn-edit-action:hover {
      border-color: var(--accent-purple);
      background: rgba(124, 58, 237, 0.05);
    }

    .btn-delete-action {
      background: transparent;
      border: none;
      color: #f87171;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 6px;
      border-radius: 6px;
      transition: var(--transition-smooth);
    }

    .btn-delete-action:hover {
      background: rgba(239, 68, 68, 0.08);
    }
  `]
})
export class DashboardComponent implements OnInit {
  // Tabs & Lists state
  readonly activeTab = signal('overview');
  readonly business = signal<any | null>(null);
  readonly analytics = signal<any | null>(null);
  readonly forms = signal<any[]>([]);
  readonly leads = signal<any[]>([]);

  // Selection state
  readonly selectedLeadId = signal<string | null>(null);
  readonly selectedLead = signal<any | null>(null);
  leadNotes = '';

  // Pipeline Filter state
  filterFormId = '';
  filterStatus = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.business.set(this.apiService.businessSignal());
    this.loadData();
  }

  loadData(): void {
    this.loadAnalytics();
    this.loadForms();
    this.loadLeads();
  }

  loadAnalytics(): void {
    this.apiService.getAnalytics().subscribe({
      next: (res) => this.analytics.set(res),
      error: (err) => console.error('Error fetching analytics:', err)
    });
  }

  loadForms(): void {
    this.apiService.getForms().subscribe({
      next: (res) => this.forms.set(res),
      error: (err) => console.error('Error fetching forms:', err)
    });
  }

  loadLeads(): void {
    this.apiService.getLeads({
      formId: this.filterFormId,
      status: this.filterStatus
    }).subscribe({
      next: (res) => this.leads.set(res),
      error: (err) => console.error('Error fetching leads:', err)
    });
  }

  viewLeadDetails(leadId: string): void {
    this.selectedLeadId.set(leadId);
    this.apiService.getLeadDetails(leadId).subscribe({
      next: (res) => {
        this.selectedLead.set(res);
        this.leadNotes = res.contact?.notes || '';
        // Switch to leads tab if not already there, to open the drawer
        if (this.activeTab() !== 'leads') {
          this.activeTab.set('leads');
        }
      },
      error: (err) => console.error('Error fetching lead details:', err)
    });
  }

  onUpdateStatus(status: string): void {
    const lead = this.selectedLead();
    if (!lead) return;

    this.apiService.updateLeadStatus(lead.id, status, this.leadNotes).subscribe({
      next: (res) => {
        // Refresh local details and list
        this.selectedLead.update(curr => ({ ...curr, status: res.status }));
        this.loadLeads();
        this.loadAnalytics();
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }

  onSaveNotes(): void {
    const lead = this.selectedLead();
    if (!lead) return;

    this.apiService.updateLeadStatus(lead.id, lead.status, this.leadNotes).subscribe({
      next: (res) => {
        alert('Internal notes saved successfully.');
        this.selectedLead.update(curr => ({
          ...curr,
          contact: { ...curr.contact, notes: this.leadNotes }
        }));
        this.loadLeads();
      },
      error: (err) => console.error('Error saving notes:', err)
    });
  }

  onCreateForm(): void {
    const defaultForm = {
      title: 'New Service Questionnaire',
      description: 'Fill out this questionnaire to apply for our services.',
      metaTitle: 'New Service Questionnaire',
      metaDescription: 'Complete our questions to get an proposal.'
    };

    this.apiService.createForm(defaultForm).subscribe({
      next: (res) => {
        // Direct to builder with the newly created form ID
        this.router.navigate(['/dashboard/builder', res.id]);
      },
      error: (err) => console.error('Error creating form:', err)
    });
  }

  onDeleteForm(id: string): void {
    if (confirm('Are you sure you want to delete this form? This will delete all questions and submitted leads associated with it.')) {
      this.apiService.deleteForm(id).subscribe({
        next: () => {
          this.loadData();
          if (this.selectedLead()?.formId === id) {
            this.selectedLead.set(null);
          }
        },
        error: (err) => console.error('Error deleting form:', err)
      });
    }
  }

  onLogout(): void {
    this.apiService.logout();
    this.router.navigate(['/']);
  }

  // Formatting values
  formatAnswerValue(value: string, type?: string): string {
    if (!value) return '';
    if (type === 'checkbox') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch (e) {}
    }
    return value;
  }

  getMaxPercentage(count: number): number {
    const counts = this.analytics()?.leadsByForm?.map((l: any) => l.count) || [];
    const max = Math.max(...counts, 1);
    return (count / max) * 100;
  }
}
