import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { scheduleInf,scheduleFrequencyInf,scheduleMdlCls, scheduleMdlInfpage } from '../Models/schedule';
@Injectable({
  providedIn: 'root'
})
export class SchedulingService {

  private apiService: string| undefined;

  private endpointschedule = 'apiSchedule';
  private endpointschedulefrequency = 'apiScheduleDetails';
  private endpointschedulefrequencyPG = 'pgScheduleDetails';
  private endpointstatus = 'apiProfileSchedule';
  private endpointgetSchedule = 'apiGetSchedule';

  constructor(private http: HttpClient) {this.apiService = environment.apiService; }

  getSchedule(page: number | null = null,ordering: string | null = null,searchTerm: string = ''): Observable<scheduleMdlInfpage> {
    let url = `${this.apiService}${this.endpointschedulefrequencyPG}`;
    
    const params = new URLSearchParams();

    if (searchTerm) {
        params.append('search', searchTerm.toString());
    }else if (page !== null ) {
        params.append('page', page.toString());
    }

    if (ordering !== null) {
        params.append('ordering', ordering);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    return this.http.get<scheduleMdlInfpage>(url);
  }
  getSchedulePage(page: number | null = null):Observable<scheduleMdlInfpage[]>{
    let url = `${this.apiService}${this.endpointschedulefrequencyPG}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }
   return this.http
      .get(url)
      .pipe<scheduleMdlInfpage[]>(map((data: any) => data));
  }
  getScheduleById(scheduleCode: any): Observable<scheduleFrequencyInf | null> {
    return this.http.get<scheduleFrequencyInf>(`${this.apiService}${this.endpointschedulefrequency}/${scheduleCode}`).pipe(
      tap(data => console.log('Service API Response:', data)), // Log response data
      map((data: scheduleFrequencyInf) => data || null), // Extract first item or return null
      catchError((error) => {
        console.error('Error fetching schedule:', error);
        return of(null); // Return null on error
      })
    );
  }
  

  postSchedule(tab:scheduleMdlCls ): Observable<scheduleMdlCls> {
    return this.http.post<any>(`${this.apiService}${this.endpointschedule}/`,tab);                  
  }
putSchedulejob(tab:scheduleFrequencyInf): Observable<scheduleFrequencyInf> {
  console.log('code',tab.code);
  return this.http.put<scheduleFrequencyInf>(`${this.apiService}${this.endpointschedulefrequency}/${tab.code}/`, tab);
}
  putSchedule(tab:scheduleInf): Observable<scheduleInf> {
      console.log('code',tab.code);
      return this.http.put<scheduleInf>(`${this.apiService}${this.endpointschedule}/${tab.code}/`, tab);
    }
  getSchuduleforstatus(code:number):Observable<any>{
    const payload = { DQRuleCode: code };
    return this.http.post<any>(`${this.apiService}${this.endpointstatus}`, payload);
  }
  getSPSchedule(payload: { DQRuleNo: any, search?: string, sort_by?: string, sort_order?: string }, page: number): Observable<scheduleMdlInfpage> {
    let params = new HttpParams().set('page', page);
  
    return this.http.post<scheduleMdlInfpage>(`${this.apiService}${this.endpointgetSchedule}`,payload,{params} );
  }
  
  }
