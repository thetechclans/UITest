import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ChangePasswordInf, messageInf } from '../Models/auth';
@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {
  private endpoint = 'dqms/resetPassword'; 
  private endpointpwd = 'changepassword/';
  apiService: string;
  constructor(private http: HttpClient) { 
    this.apiService = environment.apiService;
  }
  resetPassword(data: ChangePasswordInf,id:string,token:string): Observable<messageInf> {
    return this.http.post<messageInf>(`${this.apiService}${this.endpoint}/${id}/${token}/`, data);
 
  }
  changePassword(data: ChangePasswordInf, accessToken: string): Observable<messageInf> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.post<messageInf>(`${this.apiService}${this.endpointpwd}`, data,{ headers });
  }
}



