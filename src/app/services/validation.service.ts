import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import {environment} from 'src/environments/environment';
import { ValidationInf, ValidationCls, validationDetailInf } from '../Models/validate';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validationDetailInf: any
  private endpointGet = 'apiDBConnectionGet';
  private endpointPost = 'apiDBConnectionPost';
  private endpointValidate = 'apiDBConnectionValidate';
  private endpointGetDetails = 'apiDBConnectionGetDetails' 

  private apiService: string| undefined;
  constructor(private http:HttpClient) {this.apiService = environment.apiService; }
  apiUrlConn = 'http://192.168.101.13:8200/api/validate-connection/';

 //This is dropdown bind only. For bug fix, endpointGet repalced as endpointGetDetails
  getDBConnectionByCode(tab: number): Observable<ValidationCls> {
    return this.http.get<ValidationCls>(`${this.apiService}${this.endpointGetDetails}/${tab}/`);
    //return this.http.get<ValidationCls>(`${this.apiService}${this.endpointGet}/${tab}/`);
  }

  getDBConnection(): Observable<ValidationInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointGet}`)
      .pipe(
        map((data: any) => data),
        catchError((error: any) => {
          console.error('Error fetching data:', error);
          // Handle the error as per your application's requirements
          throw error; // Rethrow the error to propagate it to the subscriber
        })
      );
  }

  //This is onDbconnectionChange() change event for showing the DBMS name. //ValidationInf was used
  getDBConnectionDetails(): Observable<ValidationInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointGetDetails}`)  
      .pipe(
        map((data: any) => data),
        catchError((error: any) => {
          console.error('Error fetching data:', error);
          // Handle the error as per your application's requirements
          throw error; // Rethrow the error to propagate it to the subscriber
        })
      );
  }
  getDBConnectionDetailsId(selectedValue:any): Observable<ValidationInf[]>{
   
    console.log('dataapi',selectedValue)
    return this.http
    .get(`${this.apiService}${this.endpointGetDetails}/${selectedValue}`)
    .pipe<ValidationInf[]>(map((data: any) => data));
  }

  ConnectDB(inputdata:ValidationInf){
    return this.http.post(this.apiUrlConn,inputdata);
  }

  validateDBConnection(tab: any): Observable<any> {
    console.log("validation service tab:", tab)
    return this.http.post<any>(`${this.apiService}${this.endpointValidate}/`, tab);
  }

  updateDBConnection(tab: ValidationInf): Observable<ValidationInf> {
    console.log('tab',tab.code)
    return this.http.put<ValidationInf>(`${this.apiService}${this.endpointGet}/${tab.code}/`, tab);
  }

  addDBConnection(tab: ValidationInf): Observable<ValidationInf> {
    return this.http.post<ValidationInf>(`${this.apiService}${this.endpointPost}/`, tab);
  }

  // sort(tables: ValidationInf[], column: string, direction: string): ValidationInf[] {
  //   if (direction === '' || column === '') {
  //     return tables;
  //   } else {
  //     return [...tables].sort((a, b) => {
  //       const res = this.compare(`${a[column]}`, `${b[column]}`);
  //       return direction === 'asc' ? res : -res;
  //     });
  //   }
  // }
  private compare(v1: string, v2: string): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}
