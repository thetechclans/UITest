import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { dqruleInf ,dqruleDetailMdl, dqrulevaliddatavalidateqryMdlCls, dqruleinvaliddatavalidateqryMdlCls, dqRuleMdlInfpage} from '../Models/dqrule';
@Injectable({
  providedIn: 'root'
})
export class DqruleService {

  private endpointget = 'apiDQRule';
  private endpointDetail = 'pgDQRuleDetails';
  private endpointDetailcurrent='pgDQRuleDetailsCurrent';
  private endpointValidateQuery = 'apiSqlValidator';
  private endpointPreview = 'apiDQRulePreview';
  private endpoinTable = 'apiGetTableName';
  private endpointColumn ='apiGetColumnName';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }


  getDQRule(): Observable<dqruleInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }
  getDQRuleDetailCurrent(page: number | null = null,ordering: string | null = null,searchTerm: string = ''): Observable<dqRuleMdlInfpage> {
    let url = `${this.apiService}${this.endpointDetailcurrent}`;
    
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
    return this.http.get<dqRuleMdlInfpage>(url);
  }

  getDQRuleDetail(page: number | null = null): Observable<dqruleDetailMdl[]> {
    let url = `${this.apiService}${this.endpointDetail}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }
  
    return this.http
      .get(url)
      .pipe(
        map((data: any) => data.results),
      );
  }
  getDQRuleById(code: number):Observable<dqruleInf>{   
    console.log(' getDQRuleDetailById code : ',code);
    return this.http
    .get(`${this.apiService}${this.endpointget}/${code}/`)
    .pipe(
      map((data: any) => data),
    )
  }
  getDQRuleDetailById(code: number):Observable<dqruleDetailMdl>{   
    console.log(' getDQRuleDetailById code : ',code);
    return this.http
    .get(`${this.apiService}${this.endpointDetail}/${code}/`)
    .pipe(
      map((data: any) => data),
    )
  }
  getPreview(payload: { DQSQLValid: string, DBConnectionCode: number }): Observable<any>{
return this.http.post<any>(`${this.apiService}${this.endpointPreview}`, payload);
  }
  updateDQRule(tab: dqruleInf): Observable<dqruleInf> {
    console.log('code',tab.code);
    return this.http.put<dqruleInf>(`${this.apiService}${this.endpointget}/${tab.code}/`, tab);
  }
  updateDQRuledetail(tab: dqruleDetailMdl): Observable<dqruleDetailMdl> {
    console.log('code',tab.code);
    return this.http.put<dqruleDetailMdl>(`${this.apiService}${this.endpointget}/${tab.code}/`, tab);
  }
  updateDQRule1(ruleCode: number, statuscode: number): Observable<dqruleInf> {
    const updatedData = { statuscode }; 
    
    console.log('Updating status code to', statuscode, 'for rule', ruleCode);
    
    return this.http.put<dqruleInf>(`${this.apiService}${this.endpointget}/${ruleCode}/`, updatedData);
  }
  
  addDQRule(tab: dqruleInf): Observable<dqruleInf> {
    return this.http.post<dqruleInf>(`${this.apiService}${this.endpointget}/`, tab);
  }
  validateDqruleValidateQuery(tab: dqrulevaliddatavalidateqryMdlCls): Observable<dqrulevaliddatavalidateqryMdlCls> {
    // console.log("dqrule validate_query service api executed :", tab)
     return this.http.post<dqrulevaliddatavalidateqryMdlCls>(`${this.apiService}${this.endpointValidateQuery}`, tab);
   }

 deleteDQRule(code: number):Observable<any> { 
  return this.http.delete<dqruleInf>(`${this.apiService}${this.endpointget}/${code}/`);

 }
getTable(payload:{DBConnectionCode: NumberConstructor}): Observable<any>{
  return this.http.post<any>(`${this.apiService}${this.endpoinTable}`, payload);
}
getColumn(payload:{DBConnectionCode: number,TableName: string}):Observable<any>{
  return this.http.post<any>(`${this.apiService}${this.endpointColumn}`, payload);
}
getDqRuleDetailPage(page: number | null = null): Observable<dqRuleMdlInfpage[]>{
  let url = `${this.apiService}${this.endpointDetailcurrent}`;
  
  if (page !== null) {
    url += `?page=${page}`;
  }
  
  return this.http.get(url).pipe(map((data: any) => data),
    
  )
 
}

}
