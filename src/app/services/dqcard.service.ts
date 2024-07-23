import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { dqcardInf ,dqcardDetailInf, linkRuleInf, dqcardRuleGridInf, dqCardLinkInf, PostLinkResponse, categoryInf, dqCardMdlInfpage, linkMdlInf} from '../Models/dqcard';
@Injectable({
  providedIn: 'root'
})
export class DQCardService {

  private endpointget = 'apiDQCard';
  private endpointDetail = 'apiDQCardDetails'
  private endpointLink ='apiDQCardRule'
  private endpointGrid= 'apiDQCardRuleGrid'
  private endpointLinkPost='apiCardList'
  private endpointDetailPG='pgDQCardDetails'
  private endpointCategory= 'apiCardCategory'
  private endpointRefresh= 'apiCardListRefresh'
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }


  getDQCard(): Observable<dqcardInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }
getCategory():Observable<categoryInf[]>{
  return this.http
  .get(`${this.apiService}${this.endpointCategory}`)
  .pipe(
    map((data: any) => data),
  )
}

  getDQCardDetail(page: number | null = null,ordering: string | null = null,searchTerm: string = ''): Observable<dqCardMdlInfpage>{
    let url = `${this.apiService}${this.endpointDetailPG}`;
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

    return this.http.get<dqCardMdlInfpage>(url);
  }
  getDQCardDetailPage(page: number | null = null): Observable<dqCardMdlInfpage[]>{
    let url = `${this.apiService}${this.endpointDetailPG}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }


    return this.http
    .get(url)
    .pipe(
      map((data: any) => data),
    )
  }
  updateDQCard(tab: dqcardInf): Observable<dqcardInf> {
    return this.http.put<dqcardInf>(`${this.apiService}${this.endpointget}/${tab.code}/`, tab);
  }

  addDQCard(tab: dqcardInf): Observable<dqcardInf> {
    return this.http.post<dqcardInf>(`${this.apiService}${this.endpointget}/`, tab);
  }
  deleteDQCard(code: number): Observable<any> { 
    return this.http.delete<dqcardInf>(`${this.apiService}${this.endpointget}/${code}/`);
  }

  linkRule(tab:linkRuleInf): Observable<linkRuleInf>{
    return this.http.post<linkRuleInf>(`${this.apiService}${this.endpointLink}/`, tab);

  }
  getLinkGrid(): Observable<dqcardRuleGridInf[]>{
    return this.http
    .get(`${this.apiService}${this.endpointGrid}`)
    .pipe(
      map((data: any) => data),
    )
  }
  getLinkGrid1( dqcardcode: string): Observable<dqcardRuleGridInf[]>{
    const url = `${this.apiService}${this.endpointGrid}?dqcardcode=${dqcardcode}`;
    return this.http
      .get(url)
      .pipe(
        map((data: any) => data as dqcardRuleGridInf[])
      );
  }

  postLink(payload: { code: number | null | string,is_linked:boolean, search?: string, sort_by?: string, sort_order?: string },page: number): Observable<linkMdlInf> {
    let params = new HttpParams().set('page', page.toString());
  
  
    return this.http.post<linkMdlInf>(`${this.apiService}${this.endpointLinkPost}`, payload, { params });
  }
  deleteUnlink(code:string):Observable<any>{
    return this.http.delete<linkRuleInf>(`${this.apiService}${this.endpointLink}/${code}/`);
  }
  refreshSP(payload:{DQCardCode:number}):Observable<any>{
    return this.http.post<any>(`${this.apiService}${this.endpointRefresh}`, payload);
  }
}