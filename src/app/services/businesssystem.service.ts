import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { businesssytemMdl } from '../Models/business';
@Injectable({
  providedIn: 'root'
})
export class BusinesssystemService {

  private endpointget = 'apiBusinessSystem';
  private apiService: string | undefined;
  constructor(private http: HttpClient) {this.apiService = environment.apiService;  }

  getBusinesssystem(): Observable<businesssytemMdl []> {
   
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),

      )
  }
 
}
