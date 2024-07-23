import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { rolesMdlInf } from '../Models/register';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  
  private endpointget = 'apiRole';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }

  getRole(): Observable<rolesMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }
}
