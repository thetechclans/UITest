import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserEditMdlCls, UserInfpage, UserMdlInf } from '../Models/usermangement';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsermangementService {

  private endpointEdit = 'apiUserManagementEdit';
  private endpointGrid = 'apiUserManagementGrid';

  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }


  getUsers(page: number | null = null,ordering: string | null = null,searchTerm: string = ''): Observable<UserInfpage> {
    let url = `${this.apiService}${this.endpointGrid}`;

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
    return this.http.get<UserInfpage>(url)

  }

  updateUser(user: UserEditMdlCls): Observable<UserEditMdlCls> {
    const url = `${this.apiService}${this.endpointEdit}/${user.id}/`;
    return this.http.put<UserEditMdlCls>(url, user);
  }

  // getDataSourceId(tab: UserMdlInf): Observable<UserMdlInf> {
  //   console.log('code', tab);
  //   return this.http.get<UserMdlInf>(`${this.apiService}${this.endpoint}/${tab}/`);
  // }
 getUserPage(page: number | null = null): Observable<UserInfpage[]>{
    let url = `${this.apiService}${this.endpointGrid}`;
    
    if (page !== null) {
      url += `?page=${page}`;
    }
    
    return this.http.get(url).pipe(map((data: any) => data),
      
    )
   
  }

}