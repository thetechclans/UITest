import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { permissionMdlInf } from '../Models/permission';
@Injectable({
  providedIn: 'root'
})
export class ApppermissionService {
  private endpointget = 'apiAppPermissions';
  private apiService: string | undefined;
  constructor(private http: HttpClient) {this.apiService = environment.apiService;  }

  getPermissions(groupId: number): Observable<any> {
    return this.http.get(`${this.apiService}${this.endpointget}?groupid=${groupId}`);
  }
}
