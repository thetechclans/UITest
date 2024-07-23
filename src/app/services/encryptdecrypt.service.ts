import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EncryptdecryptService {


  private endpoint= 'apiEncrypt&Decrypt';
  private apiService: string | undefined;
  constructor(private http: HttpClient) {this.apiService = environment.apiService; }

  encryptdecrypt(data:any){
    return this.http.post<any>(`${this.apiService}${this.endpoint}`, data);
  }

  }

