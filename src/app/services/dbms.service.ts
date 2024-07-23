import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { dbmsMdlInf, dbmsMdlInf2 } from '../Models/dbms';

@Injectable({
  providedIn: 'root'
})
export class DbmsService  {
  private endpoint = 'apiDBMS';  
  private endpoint2 = 'apiDBMS';  

  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }

  getDBMS(): Observable<dbmsMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpoint}`)
      .pipe(
        map((data1: any) => data1),
      )
  }

  getDBMSNew(): Observable<dbmsMdlInf2[]> {    
    return this.http
      .get(`${this.apiService}${this.endpoint2}`)
      .pipe(
        map((data2: any) => data2),
      )
  }

  
}

