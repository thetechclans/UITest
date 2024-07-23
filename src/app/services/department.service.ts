import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {departmentMdl} from '../Models/department'
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private endpointDepartment = 'apiDepartment';
  private apiService: string | undefined;

  constructor(private http: HttpClient) { this.apiService = environment.apiService; }


  getDepartment(): Observable<departmentMdl[]> {
    console.log('services');
    return this.http
      .get(`${this.apiService}${this.endpointDepartment}`)
      .pipe(
        map((data: any) => data),

      )
  }
}

