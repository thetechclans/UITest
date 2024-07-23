import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { dqProfilingResultGridMdlInf,dqProfilingResultMdlInf ,dqProfilingMdlInf, dqProfileGridInf, dqProfilingMdlInfpage} from '../Models/dqprofiling'; 

@Injectable({
  providedIn: 'root'
})
export class DqprofilingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  constructor(private http: HttpClient) {this.apiService = environment.apiService;  }


  //private endpointget = 'apiDQProfiling';
  // private endpointget = 'apiDQProfilingGrid';
  private endpointgetDQProfilingResultsGrid = 'apiDQProfilingResultsGrid';
  private endpointgetDQProfilingResultsGridPG = 'pgDQProfilingResultsGrid';
  private endpointDQProfilingResult ='apiDQProfilingResults';
  private endpointDQProfilingResultPG ='pgDQProfilingGrid';
  private endpointgetProfileGrid='apiGetDQProfilingResults';
  private endpointDQProfiling = 'apiDQProfiling';
  private endpointProfile='apiProfileNow';
  private endpointView= 'apiViewDQProfilingResults';
  private endpointValid='apiGetValidLogFile';
  private endpointInvalid= 'apiGetInValidLogFile';
  private apiService: string | undefined;
  
  getDqProfile(page: number | null = null): Observable<dqProfilingResultGridMdlInf []> {
    let url = `${this.apiService}${this.endpointgetDQProfilingResultsGridPG}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }

    return this.http
      .get(url)
      .pipe(
        map((data: any) => data.results),

      )
  }
  getDqProfileByID(code: number):Observable<dqProfilingResultGridMdlInf []> {
   
    return this.http
      .get(`${this.apiService}${this.endpointgetDQProfilingResultsGrid}/${code}/`)
      .pipe(
        map((data: any) => data),

      )
  }
  getDqProfileByIDvalid(data:{ "ProfileResultCode" :any}):Observable<any>{
    return this.http.post<any>(`${this.apiService}${this.endpointValid }`, data);
  }
  getDqProfileByIDinvalid(data:{ "ProfileResultCode" :any}):Observable<any>{
    return this.http.post<any>(`${this.apiService}${this.endpointInvalid }`, data);
  }
  getProfilling(dqrulecode: number):Observable<dqProfilingMdlInf[]>{
    return this.http
    .get(`${this.apiService}${this.endpointDQProfiling}/?dqrulecode=${dqrulecode}`)
    .pipe(
      map((data: any) => data),

    )
  }
  getProfileGrid(page: number | null = null,ordering: string | null = null,searchTerm: string| null):Observable<dqProfilingMdlInfpage>{
    let url = `${this.apiService}${this.endpointgetProfileGrid}`;
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
    return this.http.get<dqProfilingMdlInfpage>(url);
  }
  getProfileGridpage(page: number | null = null):Observable<dqProfilingMdlInfpage[]>{
    let url = `${this.apiService}${this.endpointgetProfileGrid}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }

    return this.http
      .get(url)
      .pipe(
        map((data: any) => data),

      )
  }
  postProfile(selectedRule: { 'RuleNo': string }): Observable<any> {
    
    return this.http.post<any>(`${this.apiService}${this.endpointProfile }`, selectedRule);
  }
  postView(payload: any,page:number| null=null): Observable<any>{
    this.loadingSubject.next(true);
    let url = `${this.apiService}${this.endpointView}`;
    if (page !== null) {
      url += `?page=${page}`;
    }
    return this.http.post<any>(url, payload).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        // Handle the error as needed here
        return throwError(error);
      })
    );
  }
  postDqProfiling(tab:dqProfilingMdlInf):Observable<dqProfilingMdlInf>{
    return this.http.post<dqProfilingMdlInf>(`${this.apiService}${this.endpointDQProfiling }/`,tab);
  }
putDqProfiling(tab:dqProfilingMdlInf):Observable<dqProfilingMdlInf>{
  return this.http.put<dqProfilingMdlInf>(`${this.apiService}${this.endpointDQProfiling}/${tab.code}/`,tab);
}
  deleteDqProfile(code: number):Observable<any> { 
    return this.http.delete<dqProfilingResultMdlInf>(`${this.apiService}${this.endpointDQProfiling}/${code}/`);
  
   }
   getDqProfilingResultsGridPage(page: number | null = null): Observable<dqProfilingMdlInfpage[]>{
    let url = `${this.apiService}${this.endpointgetDQProfilingResultsGridPG}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }
    
    return this.http.get(url).pipe(map((data: any) => data),
      
    )
   
  }
  isRuleScheduled(dqRuleCode: number): Observable<dqProfilingMdlInf[]> {
    return this.http.get<dqProfilingMdlInf[]>(`${this.apiService}${this.endpointDQProfiling}?dqrulecode=${dqRuleCode}`);
  }
}
