import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
// import { datasourceInf ,datasourceDetailMdl} from '../Models/datasource';
import { ReferenceDataMdlInf, LookupMdlInf,ReferenceDataMdlCls } from '../Models/referencedata'; 
@Injectable({
  providedIn: 'root'
})
export class ReferencedataService {

  private apiService: string| undefined;
  private endpoint = 'apiLookup';
  constructor(private http: HttpClient ) { this.apiService = environment.apiService;}

  getLookup(): Observable<LookupMdlInf[]> {
    return this.http
      .get(`${this.apiService}${this.endpoint}`)
      .pipe<LookupMdlInf[]>(map((data: any) => data));
  }

  getReferenceData(endpoint:any): Observable<ReferenceDataMdlInf[]> {     
    let tableName =endpoint ? endpoint.substr(3) :'';  
    return this.http
      .get(`${this.apiService}${endpoint}`)
      .pipe<ReferenceDataMdlInf[]>(map((data: any) => data));   
  }

  UpdateReferenceData(endpoint:any,tab:ReferenceDataMdlCls): Observable<ReferenceDataMdlCls> {
    return this.http.put<ReferenceDataMdlCls>(`${this.apiService}${endpoint}/${tab.code}/`, tab);
  }

  SaveReferenceData(endpoint:any,tab:ReferenceDataMdlCls ): Observable<ReferenceDataMdlCls> {
    return this.http.post<any>(`${this.apiService}${endpoint}/`,tab);                  
  }

  DeleteReferenceData(endpoint:any,code:number): Observable<any> {
    return this.http.delete<any>(`${this.apiService}${endpoint}/${code}/`);
  }

}
