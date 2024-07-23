import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { datasourceMdlInf, datasourceMdlCls ,datasourceDetailMdlInf, datasourceDetailMdlInfpage} from '../Models/datasource';
@Injectable({
  providedIn: 'root'
})
export class DatasourceService {

  private endpointget = 'apiDataSource';
  private endpointDetail = 'apiDataSourceDetails';
  private endpointDetailPG = 'pgDataSourceDetails';
  private endpointUpdate = 'apiDBConnectionUpdateSP';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }


  getDataSource(): Observable<datasourceMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }
  getDataSourceId(tab: datasourceMdlInf): Observable<datasourceMdlInf> {
    console.log('code', tab.code);
    return this.http.get<datasourceMdlInf>(`${this.apiService}${this.endpointget}/${tab.code}/`);
  }
  getDataSourceDetail(page: number | null = null,ordering: string | null = null,searchTerm: string = ''): Observable<datasourceDetailMdlInfpage>{
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
    return this.http.get<datasourceDetailMdlInfpage>(url);
  }
  getDataSourceDetailPage(page: number | null = null): Observable<datasourceDetailMdlInfpage[]>{
    let url = `${this.apiService}${this.endpointDetailPG}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }
    
    return this.http.get(url).pipe(map((data: any) => data),
      
    )
   
  }
  updateDataSource(tab: datasourceMdlCls): Observable<datasourceMdlCls> {
    console.log("`${this.apiService}${this.endpointget}/${tab.code}/` is: ",`${this.apiService}${this.endpointget}/${tab.code}/`);
    return this.http.put<datasourceMdlCls>(`${this.apiService}${this.endpointget}/${tab.code}/`, tab);
  }

  addDataSource(tab: datasourceMdlInf): Observable<datasourceMdlInf> {
    return this.http.post<datasourceMdlInf>(`${this.apiService}${this.endpointget}/`, tab);
  }

  deleteDataSource(code: number): Observable<any> { 
    return this.http.delete<datasourceMdlInf>(`${this.apiService}${this.endpointget}/${code}/`);
  }
  getDataSourceById(code:number): Observable<any> {
   
    return this.http.get<datasourceMdlInf>(`${this.apiService}${this.endpointget}/${code}/`);
  }

postStatusUpdate(data:{"Status": boolean ,"LastUpdated": any,"DBConnectionCode": number}): Observable<any>{
  return this.http.post<any>(`${this.apiService}${this.endpointUpdate}`, data);
}
}