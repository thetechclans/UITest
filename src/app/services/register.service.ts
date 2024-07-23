import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { registerMdlInf } from '../Models/register';
import { ApiResponse } from '../Models/usermangement';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private endpoint = 'register';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }

  Post(data:registerMdlInf): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${this.apiService}${this.endpoint}/`,data)
    
  }

}
