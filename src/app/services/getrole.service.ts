import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {getRoleMdlInf} from '../Models/getrole'
@Injectable({
  providedIn: 'root'
})
export class GetroleService {
  private endpoint = 'apiGetStewardName';
  private apiService: string | undefined;
  constructor(private http: HttpClient,private router: Router) { this.apiService = environment.apiService; }

  getRole(roleCode: number): Observable<getRoleMdlInf[]> {
    const payload = { "rolecode": roleCode };

    return this.http
      .post<getRoleMdlInf[]>(`${this.apiService}${this.endpoint}`, payload)
      .pipe(
        map((data: any) => data)
      );
  }
}
