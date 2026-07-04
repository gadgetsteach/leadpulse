import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface BuilderQuestion {
  id?: string;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  options: string[] | null;
  // Temporary string binding for editing options in a textarea
  optionsString?: string;
}

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="builder-wrapper animate-fade-in-up">
      <!-- Top Title Navigation -->
      <header class="builder-header glass-panel">
        <div class="header-left">
          <a routerLink="/dashboard" class="btn-back">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </a>
          <div class="form-title-info">
            <h2>{{ formTitle() || 'Design Questionnaire' }}</h2>
            <span class="status-badge" [class.active-form]="isActive()" [class.inactive-form]="!isActive()">
              {{ isActive() ? 'Live' : 'Draft' }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="onPreview()">
            <span class="material-symbols-outlined">visibility</span> Preview
          </button>
          <button class="btn-primary" (click)="onSave()" [disabled]="isSaving()">
            <span *ngIf="!isSaving()">Save Questionnaire</span>
            <span *ngIf="isSaving()" class="loading-spinner"></span>
          </button>
        </div>
      </header>

      <!-- Main Columns -->
      <div class="builder-columns">
        <!-- Left: Form Metadata & SEO settings -->
        <div class="settings-column dashboard-card">
          <div class="settings-tabs">
            <button [class.active]="activeSettingsTab() === 'general'" (click)="activeSettingsTab.set('general')">
              General Info
            </button>
            <button [class.active]="activeSettingsTab() === 'seo'" (click)="activeSettingsTab.set('seo')">
              SEO Optimization
            </button>
            <button [class.active]="activeSettingsTab() === 'whatsapp'" (click)="activeSettingsTab.set('whatsapp')">
              WhatsApp
            </button>
          </div>

          <div class="tab-content" *ngIf="activeSettingsTab() === 'general'">
            <div class="form-group">
              <label for="title">Questionnaire Title</label>
              <input type="text" id="title" [(ngModel)]="formTitle" placeholder="e.g. House Cleaning Inquiry">
            </div>

            <div class="form-group">
              <label for="description">Public Description</label>
              <textarea id="description" [(ngModel)]="formDescription" placeholder="Explain what this form is for..."></textarea>
            </div>

            <div class="form-group toggle-group">
              <label>
                <input type="checkbox" [(ngModel)]="isActive">
                Make form publicly active and receive leads
              </label>
            </div>
          </div>

          <div class="tab-content" *ngIf="activeSettingsTab() === 'seo'">
            <div class="seo-alert">
              <span class="material-symbols-outlined">seo</span>
              <p>These values will be injected during Server-Side Rendering (SSR) to ensure maximum indexing visibility on search engines.</p>
            </div>

            <div class="form-group">
              <label for="metaTitle">SEO Page Title (&lt;title&gt;)</label>
              <input type="text" id="metaTitle" [(ngModel)]="metaTitle" placeholder="Search engine display title">
            </div>

            <div class="form-group">
              <label for="metaDescription">Meta Description</label>
              <textarea id="metaDescription" [(ngModel)]="metaDescription" placeholder="Summarize for Google search results..."></textarea>
            </div>
            
            <div class="form-group readonly-group">
              <label>Public Link</label>
              <div class="public-url-display">
                http://localhost:4200/f/{{ formSlug() }}
              </div>
            </div>
          </div>

          <div class="tab-content" *ngIf="activeSettingsTab() === 'whatsapp'">
            <div class="seo-alert">
              <span class="material-symbols-outlined">chat</span>
              <p>When clients complete this form, they will be redirected to WhatsApp to send their details directly to your number.</p>
            </div>

            <div class="form-group toggle-group">
              <label>
                <input type="checkbox" [(ngModel)]="whatsappEnabled">
                Enable WhatsApp Redirection
              </label>
            </div>

            <div class="form-group" *ngIf="whatsappEnabled()">
              <label for="whatsappNumber">WhatsApp Phone Number</label>
              <input type="text" id="whatsappNumber" [(ngModel)]="whatsappNumber" placeholder="e.g. 919876543210 (include country code)">
              <p class="input-helper" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                Enter digits only (no spaces, dashes, or + signs). E.g. 919876543210.
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Questions list -->
        <div class="questions-column dashboard-card">
          <div class="column-header">
            <h3>Custom Questionnaire Steps</h3>
            <button class="btn-secondary add-q-btn" (click)="addQuestion()">
              <span class="material-symbols-outlined">add</span> Add Question
            </button>
          </div>

          <div class="questions-list">
            <div class="question-card glass-panel" *ngFor="let q of questions(); let idx = index">
              <!-- Question Header Controls -->
              <div class="q-card-header">
                <span class="q-number">Step {{ idx + 1 }}</span>
                <div class="q-controls">
                  <button (click)="moveQuestion(idx, 'up')" [disabled]="idx === 0">
                    <span class="material-symbols-outlined">arrow_upward</span>
                  </button>
                  <button (click)="moveQuestion(idx, 'down')" [disabled]="idx === questions().length - 1">
                    <span class="material-symbols-outlined">arrow_downward</span>
                  </button>
                  <button class="delete" (click)="deleteQuestion(idx)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>

              <!-- Question Body -->
              <div class="q-card-body">
                <div class="grid-2">
                  <div class="form-group">
                    <label>Question Label</label>
                    <input type="text" [(ngModel)]="q.questionText" placeholder="e.g. How many rooms require work?">
                  </div>
                  
                  <div class="form-group">
                    <label>Response Type</label>
                    <select [(ngModel)]="q.questionType" (change)="onTypeChange(q)">
                      <option value="text">Single Line Text</option>
                      <option value="textarea">Multi-line Paragraph</option>
                      <option value="select">Dropdown Select</option>
                      <option value="radio">Single Choice Radio</option>
                      <option value="checkbox">Multiple Choice Checkbox</option>
                      <option value="date">Date Picker</option>
                    </select>
                  </div>
                </div>

                <!-- Answer options editor (only visible if select/radio/checkbox) -->
                <div class="form-group options-editor" *ngIf="showOptionsEditor(q.questionType)">
                  <label>Answer Choices (one option per line)</label>
                  <textarea [(ngModel)]="q.optionsString" placeholder="Option 1&#10;Option 2&#10;Option 3" (ngModelChange)="onOptionsChange(q)"></textarea>
                </div>

                <div class="form-group toggle-group" style="margin-top: 10px;">
                  <label>
                    <input type="checkbox" [(ngModel)]="q.isRequired">
                    Required field (customer must answer to submit)
                  </label>
                </div>
              </div>
            </div>

            <div class="empty-questions" *ngIf="!questions().length">
              <span class="material-symbols-outlined empty-icon">help_outline</span>
              <p>Your questionnaire is currently empty. Click "Add Question" above to start designing custom questions for your leads!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .builder-wrapper {
      padding: 30px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 25px;
      min-height: 100vh;
      background: radial-gradient(circle at 10% 90%, rgba(98, 0, 234, 0.05) 0%, transparent 40%);
    }

    .builder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 25px;
    }

    .btn-back {
      color: var(--text-muted);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }

    .btn-back:hover {
      color: white;
    }

    .form-title-info {
      display: flex;
      align-items: center;
      gap: 12px;
      border-left: 1px solid var(--dark-border);
      padding-left: 20px;
    }

    .form-title-info h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 700;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Layout columns */
    .builder-columns {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 25px;
      align-items: start;
    }

    @media (max-width: 900px) {
      .builder-columns {
        grid-template-columns: 1fr;
      }
    }

    /* Settings Column */
    .settings-tabs {
      display: flex;
      border-bottom: 1px solid var(--dark-border);
      margin-bottom: 20px;
    }

    .settings-tabs button {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 12px;
      font-family: var(--font-family);
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
      border-bottom: 2px solid transparent;
    }

    .settings-tabs button.active {
      color: var(--accent-purple);
      border-bottom-color: var(--accent-purple);
    }

    .form-group {
      margin-bottom: 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    input, select, textarea {
      background: var(--dark-bg);
      border: 1px solid var(--dark-border);
      color: var(--text-primary);
      padding: 10px 12px;
      border-radius: 8px;
      font-family: var(--font-family);
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      width: 100%;
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--accent-purple);
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }

    .toggle-group label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 400;
      font-size: 0.9rem;
      cursor: pointer;
    }

    .toggle-group input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

    .seo-alert {
      display: flex;
      gap: 10px;
      background: rgba(192, 132, 252, 0.08);
      border: 1px solid rgba(192, 132, 252, 0.15);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
    }

    .seo-alert .material-symbols-outlined {
      color: var(--accent-purple);
      font-size: 22px;
    }

    .seo-alert p {
      margin: 0;
      font-size: 0.8rem;
      line-height: 1.4;
      color: var(--text-muted);
    }

    .public-url-display {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--dark-border);
      border-radius: 8px;
      padding: 10px;
      font-size: 0.85rem;
      color: var(--accent-purple);
      word-break: break-all;
      font-family: monospace;
    }

    /* Questions Column */
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      border-bottom: 1px solid var(--dark-border);
      padding-bottom: 14px;
    }

    .column-header h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .add-q-btn {
      padding: 6px 14px;
      font-size: 0.85rem;
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .question-card {
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--dark-border);
    }

    .q-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      border-bottom: 1px solid var(--dark-border);
      padding-bottom: 10px;
    }

    .q-number {
      font-weight: 700;
      color: var(--accent-purple);
      font-size: 0.9rem;
    }

    .q-controls {
      display: flex;
      gap: 6px;
    }

    .q-controls button {
      background: transparent;
      border: 1px solid var(--dark-border);
      color: var(--text-muted);
      border-radius: 6px;
      padding: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .q-controls button:hover:not(:disabled) {
      color: white;
      border-color: var(--accent-purple);
    }

    .q-controls button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .q-controls button.delete:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #f87171;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 600px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

    .options-editor textarea {
      min-height: 80px;
    }

    .empty-questions {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 48px;
      color: var(--dark-border);
      margin-bottom: 15px;
    }

    .empty-questions p {
      font-size: 0.9rem;
      max-width: 320px;
      margin: 0 auto;
      line-height: 1.5;
    }
  `]
})
export class FormBuilderComponent implements OnInit {
  formId = '';
  formSlug = signal('');
  formTitle = signal('');
  formDescription = signal('');
  isActive = signal(true);
  metaTitle = signal('');
  metaDescription = signal('');
  whatsappNumber = signal('');
  whatsappEnabled = signal(false);

  readonly questions = signal<BuilderQuestion[]>([]);
  readonly activeSettingsTab = signal('general');
  readonly isSaving = signal(false);

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formId = id;
      this.loadForm();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loadForm(): void {
    this.apiService.getFormById(this.formId).subscribe({
      next: (res) => {
        this.formSlug.set(res.slug);
        this.formTitle.set(res.title);
        this.formDescription.set(res.description || '');
        this.isActive.set(res.isActive);
        this.metaTitle.set(res.metaTitle || '');
        this.metaDescription.set(res.metaDescription || '');
        this.whatsappNumber.set(res.whatsappNumber || '');
        this.whatsappEnabled.set(res.whatsappEnabled || false);

        // Map database questions to local builder model
        const mappedQuestions = res.questions.map((q: any) => {
          let opts: string[] | null = null;
          let optsStr = '';
          if (q.options) {
            try {
              opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
              if (Array.isArray(opts)) {
                optsStr = opts.join('\n');
              }
            } catch (e) {
              opts = null;
            }
          }
          return {
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType,
            isRequired: q.isRequired,
            options: opts,
            optionsString: optsStr
          };
        });

        this.questions.set(mappedQuestions);
      },
      error: (err) => {
        console.error('Error fetching form details:', err);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  addQuestion(): void {
    this.questions.update((list) => [
      ...list,
      {
        questionText: 'Untitled Question',
        questionType: 'text',
        isRequired: false,
        options: null,
        optionsString: ''
      }
    ]);
  }

  deleteQuestion(idx: number): void {
    this.questions.update((list) => list.filter((_, i) => i !== idx));
  }

  moveQuestion(idx: number, direction: 'up' | 'down'): void {
    const list = [...this.questions()];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    
    // Swap items
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    
    this.questions.set(list);
  }

  showOptionsEditor(type: string): boolean {
    return ['select', 'radio', 'checkbox'].includes(type);
  }

  onTypeChange(q: BuilderQuestion): void {
    if (!this.showOptionsEditor(q.questionType)) {
      q.options = null;
      q.optionsString = '';
    } else if (!q.optionsString) {
      q.optionsString = 'Choice 1\nChoice 2';
      q.options = ['Choice 1', 'Choice 2'];
    }
  }

  onOptionsChange(q: BuilderQuestion): void {
    if (q.optionsString) {
      q.options = q.optionsString
        .split('\n')
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0);
    } else {
      q.options = [];
    }
  }

  onPreview(): void {
    // Open in a new tab
    window.open(`http://localhost:4200/f/${this.formSlug()}`, '_blank');
  }

  onSave(): void {
    this.isSaving.set(true);

    const payload = {
      title: this.formTitle(),
      description: this.formDescription(),
      isActive: this.isActive(),
      metaTitle: this.metaTitle(),
      metaDescription: this.metaDescription(),
      whatsappNumber: this.whatsappNumber(),
      whatsappEnabled: this.whatsappEnabled(),
      // Send the questions list (will recreate/update them based on our controller design)
      questions: this.questions().map((q) => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        isRequired: q.isRequired,
        options: q.options
      }))
    };

    this.apiService.updateForm(this.formId, payload).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        alert('Questionnaire saved successfully!');
        this.loadForm(); // Refresh ids
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Error saving form:', err);
        alert(err.error?.error || 'Failed to save form. Try again.');
      }
    });
  }
}
