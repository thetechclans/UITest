import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import {environment} from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {settingMdlInf} from'../Models/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private endpoint='apiDQOrganisation';
  private apiService: string| undefined;
  constructor(private http:HttpClient) {this.apiService = environment.apiService; }

  getOrganisation(): Observable<settingMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpoint}`)  
      .pipe(
        map((data: any) => data)
      )}
 postOragnisation(tab: settingMdlInf): Observable<settingMdlInf> {
  return this.http.post<settingMdlInf>(`${this.apiService}${this.endpoint}/`, tab);
 }
 updateOrganisation(tab: settingMdlInf): Observable<settingMdlInf> {
  return this.http.put<settingMdlInf>(`${this.apiService}${this.endpoint}/${tab.code}/`, tab);
}
}
