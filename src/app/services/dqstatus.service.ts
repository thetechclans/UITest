import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { statusMdlInf } from '../Models/dqstatus';
@Injectable({
  providedIn: 'root'
})
export class DqstatusService {

  private endpointget = 'apiDQStatus';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }
 
  getStatus(): Observable<statusMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }

}