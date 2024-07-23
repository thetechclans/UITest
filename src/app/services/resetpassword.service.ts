import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ForgetPasswordMdlInf, messageInf } from '../Models/auth';
@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  private endpoint = 'send-reset-password-email'; 
  apiService: string;
  constructor(private http: HttpClient) { 
    this.apiService = environment.apiService;
  }
  sendEmail(data: ForgetPasswordMdlInf): Observable<messageInf> {
    return this.http.post<messageInf>(`${this.apiService}${this.endpoint}/`, data);
 
  }
}
