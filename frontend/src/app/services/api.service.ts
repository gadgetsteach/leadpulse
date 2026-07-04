import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/api';
  
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  readonly businessSignal = signal<any | null>(this.getStoredBusiness());
  
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {}

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('leadpulse_token');
    }
    return null;
  }

  private getStoredBusiness(): any | null {
    if (typeof window !== 'undefined') {
      const biz = localStorage.getItem('leadpulse_business');
      return biz ? JSON.parse(biz) : null;
    }
    return null;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = this.tokenSignal();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  register(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, body).pipe(
      tap(res => this.setSession(res.token, res.business))
    );
  }

  login(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, body).pipe(
      tap(res => this.setSession(res.token, res.business))
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('leadpulse_token');
      localStorage.removeItem('leadpulse_business');
    }
    this.tokenSignal.set(null);
    this.businessSignal.set(null);
  }

  private setSession(token: string, business: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadpulse_token', token);
      localStorage.setItem('leadpulse_business', JSON.stringify(business));
    }
    this.tokenSignal.set(token);
    this.businessSignal.set(business);
  }

  getForms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/forms`, { headers: this.getHeaders() });
  }

  getFormById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/forms/${id}`, { headers: this.getHeaders() });
  }

  createForm(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forms`, body, { headers: this.getHeaders() });
  }

  updateForm(id: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/forms/${id}`, body, { headers: this.getHeaders() });
  }

  deleteForm(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/forms/${id}`, { headers: this.getHeaders() });
  }

  getLeads(params?: { formId?: string; status?: string }): Observable<any[]> {
    let url = `${this.baseUrl}/leads`;
    const queryParts: string[] = [];
    if (params?.formId) queryParts.push(`formId=${params.formId}`);
    if (params?.status) queryParts.push(`status=${params.status}`);
    if (queryParts.length > 0) {
      url += `?${queryParts.join('&')}`;
    }
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  getLeadDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/leads/${id}`, { headers: this.getHeaders() });
  }

  updateLeadStatus(id: string, status: string, notes?: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/leads/${id}/status`, { status, notes }, { headers: this.getHeaders() });
  }

  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics`, { headers: this.getHeaders() });
  }

  getPublicForm(slug: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/public/forms/${slug}`);
  }

  submitPublicLead(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/public/leads`, body);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, { token, newPassword });
  }
}
