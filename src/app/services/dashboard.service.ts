import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { DdatasourceMdlInf,DdomainInf,DruleMdlInf,DstatusMdlInf, ProfilingMdlInf } from '../Models/dashboard';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private endpointDatasource = 'apiDboardCardDataSource';
  private endpointStatus = 'apiDboardRuleByStatus';
  //private endpointDomain = 'apiDboardRuleByDomain';
  private endpointRule = 'apiDboardDQRuleByDomain';
  private endpointprofile ='apiDboardDQProfilingCount';
  private apiService: string | undefined;
  constructor(private http: HttpClient) {this.apiService = environment.apiService;  }

  getDatasource(): Observable<DdatasourceMdlInf []> {
   return this.http
      .get(`${this.apiService}${this.endpointDatasource}`)
      .pipe(
        map((data: any) => data),

      )
  }
  getStatus(): Observable<DstatusMdlInf[]> {
    return this.http
       .get(`${this.apiService}${this.endpointStatus}`)
       .pipe(
         map((data: any) => data),
 
       )
   }
   /*getDomain(): Observable<DruleMdlInf[]> {
    return this.http
       .get(`${this.apiService}${this.endpointDomain}`)
       .pipe(
         map((data: any) => data),
 
       )
   }*/
   getDomain(): Observable<DdomainInf[]> {
    return this.http
       .get(`${this.apiService}${this.endpointRule}`)
       .pipe(
         map((data: any) => data),
 
       )
   }
   getProfiling(): Observable<any[]> {
    return this.http
       .get<any[]>(`${this.apiService}${this.endpointprofile}`)
       .pipe(
         map((data: any) => data.map((item: { series: string; WeekStartDate: any;CompleteProfiling:any}) => {
          const series = JSON.parse(item.series);
          return {
            name: item.WeekStartDate,
            series: [
              { name: 'WeeklySuccess', value: series[0].WeeklySuccess },
              { name: 'WeeklyFailure', value: series[0].WeeklyFailure }
            ],
           value:item.CompleteProfiling
          };
   }),
   tap((transformedData: any) => console.log('Transformed Profiling Data:', transformedData))
))
   }

   postPiechart(payload: {DQDomainCode:any}):Observable<any>{
    return this.http.post<any>(`${this.apiService}${this.endpointStatus}`, payload);
   }

   postBarchart(payload: {DQStatus:any}):Observable<any>{
    return this.http.post<any>(`${this.apiService}${this.endpointRule}`, payload);
   }
}
