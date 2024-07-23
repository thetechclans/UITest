import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { priorityMdlInf } from '../Models/priority';
@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  private endpointget = 'apiDQPriority';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }

  getPriority(): Observable<priorityMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }
}
