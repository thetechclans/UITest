import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { frequencyMdlInf } from '../Models/frequency';

@Injectable({
  providedIn: 'root'
})
export class FrequencyService {
  private endpointget = 'apiFrequency';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }

  getFrequency(): Observable<frequencyMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }
}