import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

interface FormQuestion {
  id: string;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  options: any; // string[] or stringified JSON
}

@Component({
  selector: 'app-public-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="public-wrapper">
      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="spinner"></div>
        <p>Loading questionnaire...</p>
      </div>

      <!-- Error State -->
      <div class="error-state glass-panel animate-fade-in-up" *ngIf="errorMsg()">
        <span class="material-symbols-outlined error-icon">error</span>
        <h2>Form Unavailable</h2>
        <p>{{ errorMsg() }}</p>
        <a routerLink="/" class="btn-primary">Return Home</a>
      </div>

      <!-- Success State -->
      <div class="success-state glass-panel animate-fade-in-up" *ngIf="isSubmitted()">
        <div class="success-icon-wrapper">
          <span class="material-symbols-outlined success-icon">check_circle</span>
        </div>
        <h2>Inquiry Submitted!</h2>
        <p>Thank you for submitting your requirements. <strong>{{ businessName() }}</strong> has received your inquiry and will contact you shortly.</p>
        <button class="btn-primary" (click)="resetForm()">Submit Another Inquiry</button>
      </div>

      <!-- Form Wizard -->
      <div class="wizard-container glass-panel animate-fade-in-up" *ngIf="formLoaded() && !isSubmitted()">
        <!-- Header -->
        <header class="wizard-header">
          <div class="business-brand">
            <span class="avatar-sm">{{ businessName()[0].toUpperCase() }}</span>
            <span>{{ businessName() }}</span>
          </div>
          <h2>{{ formTitle() }}</h2>
          <p class="form-desc" *ngIf="currentStep() === 0">{{ formDescription() }}</p>
          
          <!-- Progress bar -->
          <div class="wizard-progress">
            <div class="progress-fill" [style.width.%]="progressPercent()"></div>
          </div>
          <span class="step-counter">Step {{ currentStep() + 1 }} of {{ totalSteps() }}</span>
        </header>

        <!-- Body -->
        <div class="wizard-body">
          <!-- Dynamically Render Single Question Step -->
          <div class="question-step" *ngIf="isQuestionStep()">
            <h3 class="question-label">
              {{ activeQuestion().questionText }}
              <span class="req-star" *ngIf="activeQuestion().isRequired">*</span>
            </h3>

            <!-- Input Rendering based on type -->
            <div class="answer-input-container">
              <!-- Text -->
              <input *ngIf="activeQuestion().questionType === 'text'" 
                     type="text" 
                     [(ngModel)]="answers[activeQuestion().id]" 
                     placeholder="Type your answer here..."
                     (keydown.enter)="nextStep()">

              <!-- Textarea -->
              <textarea *ngIf="activeQuestion().questionType === 'textarea'" 
                        [(ngModel)]="answers[activeQuestion().id]" 
                        placeholder="Provide details..."></textarea>

              <!-- Select -->
              <select *ngIf="activeQuestion().questionType === 'select'" 
                      [(ngModel)]="answers[activeQuestion().id]">
                <option value="" disabled selected>Choose an option...</option>
                <option *ngFor="let opt of parseOptions(activeQuestion().options)" [value]="opt">
                  {{ opt }}
                </option>
              </select>

              <!-- Radio -->
              <div class="radio-choices" *ngIf="activeQuestion().questionType === 'radio'">
                <label *ngFor="let opt of parseOptions(activeQuestion().options)" 
                       class="choice-label" 
                       [class.selected]="answers[activeQuestion().id] === opt">
                  <input type="radio" 
                         [name]="activeQuestion().id" 
                         [value]="opt" 
                         [(ngModel)]="answers[activeQuestion().id]">
                  <span>{{ opt }}</span>
                </label>
              </div>

              <!-- Checkbox -->
              <div class="checkbox-choices" *ngIf="activeQuestion().questionType === 'checkbox'">
                <label *ngFor="let opt of parseOptions(activeQuestion().options)" 
                       class="choice-label" 
                       [class.selected]="checkboxAnswers[activeQuestion().id]?.[opt]">
                  <input type="checkbox" 
                         [(ngModel)]="checkboxAnswers[activeQuestion().id][opt]"
                         (change)="onCheckboxChange(activeQuestion().id, opt)">
                  <span>{{ opt }}</span>
                </label>
              </div>

              <!-- Date -->
              <input *ngIf="activeQuestion().questionType === 'date'" 
                     type="date" 
                     [(ngModel)]="answers[activeQuestion().id]">
            </div>
            
            <div class="field-error-msg" *ngIf="showValidationError()">
              Please answer this required question to proceed.
            </div>
          </div>

          <!-- Final Step: Contact Info -->
          <div class="contact-step" *ngIf="isContactStep()">
            <h3>Final Step: Contact Information</h3>
            <p>Please provide your contact details so that we can get back to you with your quote.</p>

            <div class="contact-form">
              <div class="form-group">
                <label for="c-name">Full Name <span class="req-star">*</span></label>
                <input type="text" id="c-name" [(ngModel)]="contactName" placeholder="John Doe" required>
              </div>

              <div class="form-group">
                <label for="c-email">Email Address <span class="req-star">*</span></label>
                <input type="email" id="c-email" [(ngModel)]="contactEmail" placeholder="john@example.com" required>
              </div>

              <div class="form-group">
                <label for="c-phone">Phone Number <span class="req-star">*</span></label>
                <input type="tel" id="c-phone" [(ngModel)]="contactPhone" placeholder="e.g. +1 555 123 4567" required>
              </div>

              <div class="form-group">
                <label for="c-notes">Additional Notes / Message (Optional)</label>
                <textarea id="c-notes" [(ngModel)]="contactNotes" placeholder="Write any extra details for the business here..."></textarea>
              </div>
            </div>

            <div class="field-error-msg" *ngIf="showValidationError()">
              Please fill out all required contact fields.
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <footer class="wizard-footer">
          <button class="btn-secondary" (click)="prevStep()" [disabled]="currentStep() === 0">
            <span class="material-symbols-outlined">chevron_left</span> Back
          </button>

          <button class="btn-primary" (click)="nextStep()" *ngIf="!isLastStep()">
            Next <span class="material-symbols-outlined">chevron_right</span>
          </button>
          
          <button class="btn-primary" (click)="onSubmit()" *ngIf="isLastStep()" [disabled]="isSubmitting()">
            <span *ngIf="!isSubmitting()">Submit Inquiry</span>
            <span *ngIf="isSubmitting()" class="spinner-sm"></span>
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .public-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: radial-gradient(circle at 50% 50%, rgba(98, 0, 234, 0.05) 0%, transparent 60%);
      box-sizing: border-box;
    }

    .loading-state {
      text-align: center;
      color: var(--text-muted);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(124, 58, 237, 0.2);
      border-radius: 50%;
      border-top-color: var(--accent-purple);
      animation: spin 0.8s linear infinite;
      margin: 0 auto 15px auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Error & Success States */
    .error-state, .success-state {
      width: 100%;
      max-width: 480px;
      padding: 40px;
      text-align: center;
    }

    .error-icon {
      font-size: 54px;
      color: #ef4444;
      margin-bottom: 20px;
    }

    .success-icon-wrapper {
      display: inline-flex;
      padding: 16px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 50%;
      color: #34d399;
      margin-bottom: 20px;
    }

    .success-icon {
      font-size: 48px;
    }

    .success-state h2, .error-state h2 {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 12px 0;
    }

    .success-state p, .error-state p {
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 30px;
      font-size: 0.95rem;
    }

    /* Wizard styles */
    .wizard-container {
      width: 100%;
      max-width: 550px;
      padding: 30px;
    }

    .wizard-header {
      margin-bottom: 30px;
      position: relative;
    }

    .business-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .avatar-sm {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.75rem;
    }

    .wizard-header h2 {
      font-size: 1.45rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.3px;
    }

    .form-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0 0 20px 0;
      line-height: 1.4;
    }

    .wizard-progress {
      height: 4px;
      background: var(--dark-border);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 10px;
      margin-top: 15px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #7c3aed, #c084fc);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .step-counter {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    /* Wizard Body */
    .wizard-body {
      min-height: 200px;
      margin-bottom: 35px;
    }

    .question-label {
      font-size: 1.15rem;
      font-weight: 600;
      margin: 0 0 20px 0;
      line-height: 1.4;
      color: var(--text-primary);
    }

    .req-star {
      color: #ef4444;
      margin-left: 4px;
    }

    .answer-input-container {
      display: flex;
      flex-direction: column;
    }

    input[type="text"], input[type="date"], input[type="email"], input[type="tel"], select, textarea {
      width: 100%;
      background: var(--dark-bg);
      border: 1px solid var(--dark-border);
      color: var(--text-primary);
      padding: 14px 16px;
      border-radius: 10px;
      font-family: var(--font-family);
      font-size: 1rem;
      outline: none;
      box-sizing: border-box;
      transition: var(--transition-smooth);
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.15);
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    /* Choice list (radio & checkboxes) */
    .radio-choices, .checkbox-choices {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .choice-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
      transition: var(--transition-smooth);
    }

    .choice-label input {
      cursor: pointer;
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color);
    }

    .choice-label:hover {
      border-color: rgba(192, 132, 252, 0.3);
      background: var(--dark-surface-hover);
    }

    .choice-label.selected {
      border-color: var(--accent-purple);
      background: rgba(124, 58, 237, 0.08);
      color: var(--accent-purple);
    }

    .field-error-msg {
      color: #f87171;
      font-size: 0.85rem;
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Contact Details form */
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Footer actions */
    .wizard-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid var(--dark-border);
      padding-top: 20px;
    }

    .spinner-sm {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
  `]
})
export class PublicFormComponent implements OnInit {
  // Loading & State signals
  readonly isLoading = signal(true);
  readonly formLoaded = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly isSubmitted = signal(false);
  readonly isSubmitting = signal(false);

  // Form definition details
  formId = '';
  formSlug = '';
  readonly formTitle = signal('');
  readonly formDescription = signal('');
  readonly businessName = signal('');
  whatsappNumber = '';
  whatsappEnabled = false;
  
  // Questions array
  private readonly rawQuestions = signal<FormQuestion[]>([]);

  // Wizard state signals
  readonly currentStep = signal(0);
  readonly showValidationError = signal(false);

  // Customer Response store
  answers: { [questionId: string]: string } = {};
  // For checkboxes, we need a nested object: { [questionId]: { [optionVal]: boolean } }
  checkboxAnswers: { [questionId: string]: { [option: string]: boolean } } = {};

  // Contact Info bindings
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  contactNotes = '';

  // Computeds
  readonly totalSteps = computed(() => this.rawQuestions().length + 1); // Questions + Contact step
  readonly isQuestionStep = computed(() => this.currentStep() < this.rawQuestions().length);
  readonly isContactStep = computed(() => this.currentStep() === this.rawQuestions().length);
  readonly isLastStep = computed(() => this.currentStep() === this.totalSteps() - 1);
  readonly activeQuestion = computed(() => this.rawQuestions()[this.currentStep()]);
  readonly progressPercent = computed(() => Math.round((this.currentStep() / this.totalSteps()) * 100));

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.formSlug = slug;
      this.loadPublicForm();
    } else {
      this.errorMsg.set('No questionnaire path was specified.');
      this.isLoading.set(false);
    }
  }

  loadPublicForm(): void {
    this.apiService.getPublicForm(this.formSlug).subscribe({
      next: (res) => {
        this.formId = res.id;
        this.formTitle.set(res.title);
        this.formDescription.set(res.description || '');
        this.businessName.set(res.business?.name || 'Partner Business');
        this.rawQuestions.set(res.questions || []);
        this.whatsappNumber = res.whatsappNumber || '';
        this.whatsappEnabled = res.whatsappEnabled || false;
        
        // Dynamically set Meta tags for SEO ranking
        this.title.setTitle(res.metaTitle || `${res.title} | LeadPulse`);
        this.meta.updateTag({
          name: 'description',
          content: res.metaDescription || `Fill out the dynamic inquiry form for ${res.business?.name}.`
        });

        // Initialize answer objects
        res.questions.forEach((q: FormQuestion) => {
          this.answers[q.id] = '';
          if (q.questionType === 'checkbox') {
            this.checkboxAnswers[q.id] = {};
            const opts = this.parseOptions(q.options);
            opts.forEach((o) => {
              this.checkboxAnswers[q.id][o] = false;
            });
          }
        });

        this.formLoaded.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.error || 'This lead questionnaire is not available. Please verify the URL.');
      }
    });
  }

  parseOptions(options: any): string[] {
    if (!options) return [];
    try {
      const parsed = typeof options === 'string' ? JSON.parse(options) : options;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  onCheckboxChange(questionId: string, option: string): void {
    // Collect all checked keys
    const checks = this.checkboxAnswers[questionId];
    const checkedList = Object.keys(checks).filter((k) => checks[k]);
    this.answers[questionId] = JSON.stringify(checkedList);
  }

  validateCurrentStep(): boolean {
    this.showValidationError.set(false);

    if (this.isQuestionStep()) {
      const q = this.activeQuestion();
      if (!q.isRequired) return true;

      const val = this.answers[q.id];
      if (q.questionType === 'checkbox') {
        try {
          const list = JSON.parse(val || '[]');
          return list.length > 0;
        } catch (e) {
          return false;
        }
      }
      return val !== undefined && val !== null && val.trim() !== '';
    }

    if (this.isContactStep()) {
      return (
        this.contactName.trim() !== '' &&
        this.contactEmail.trim() !== '' &&
        this.contactPhone.trim() !== ''
      );
    }

    return true;
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep.update((s) => s + 1);
    } else {
      this.showValidationError.set(true);
    }
  }

  prevStep(): void {
    this.showValidationError.set(false);
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  onSubmit(): void {
    if (!this.validateCurrentStep()) {
      this.showValidationError.set(true);
      return;
    }

    this.isSubmitting.set(true);

    // Map answers into backend payload format: array of { questionId, value }
    const answersPayload = Object.keys(this.answers).map((qid) => ({
      questionId: qid,
      value: this.answers[qid]
    }));

    const payload = {
      formId: this.formId,
      contact: {
        name: this.contactName,
        email: this.contactEmail,
        phone: this.contactPhone,
        notes: this.contactNotes
      },
      answers: answersPayload
    };

    this.apiService.submitPublicLead(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
        if (this.whatsappEnabled && this.whatsappNumber) {
          this.redirectToWhatsApp();
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        alert(err.error?.error || 'Failed to submit inquiry. Please review entries and try again.');
      }
    });
  }

  redirectToWhatsApp(): void {
    let text = `*New Lead captured via LeadPulse*\n\n`;
    text += `*Form:* ${this.formTitle()}\n`;
    text += `*Name:* ${this.contactName}\n`;
    text += `*Phone:* ${this.contactPhone}\n`;
    text += `*Email:* ${this.contactEmail}\n`;
    if (this.contactNotes) {
      text += `*Notes:* ${this.contactNotes}\n`;
    }
    text += `\n*Answers:*\n`;

    this.rawQuestions().forEach((q) => {
      const ans = this.answers[q.id];
      let displayAns = ans;
      if (q.questionType === 'checkbox') {
        try {
          const list = JSON.parse(ans || '[]');
          displayAns = list.join(', ');
        } catch (e) {
          displayAns = ans;
        }
      }
      text += `• _${q.questionText}_: ${displayAns || 'N/A'}\n`;
    });

    const encodedText = encodeURIComponent(text);
    const cleanNumber = this.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodedText}`;

    setTimeout(() => {
      window.location.href = url;
    }, 1500);
  }

  resetForm(): void {
    this.currentStep.set(0);
    this.isSubmitted.set(false);
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.contactNotes = '';
    this.showValidationError.set(false);
    
    // Clear responses
    Object.keys(this.answers).forEach((k) => {
      this.answers[k] = '';
    });
    Object.keys(this.checkboxAnswers).forEach((qid) => {
      Object.keys(this.checkboxAnswers[qid]).forEach((opt) => {
        this.checkboxAnswers[qid][opt] = false;
      });
    });
  }
}
