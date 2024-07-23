import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { dqdomainMdlInf } from '../Models/dqdomain';
@Injectable({
  providedIn: 'root'
})
export class DqdomainService {

  private endpointget = 'apiDQDomain';
  private apiService: string | undefined;
  constructor(private http: HttpClient) {this.apiService = environment.apiService;  }

  getDqdomain(): Observable<dqdomainMdlInf  []> {
   
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),

      )
  }
  getDqdomainId(tab: dqdomainMdlInf): Observable<dqdomainMdlInf> {
    console.log('code', tab.code);
    return this.http.get<dqdomainMdlInf>(`${this.apiService}${this.endpointget}/${tab.code}/`);
  }
}
