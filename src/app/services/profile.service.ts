import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { userprofileMdlInf } from '../Models/profile';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private endpointget = 'profile';
  private apiService: string | undefined;
  constructor(private http: HttpClient) { this.apiService = environment.apiService; }

getProfile(token: string, email: string): Observable<userprofileMdlInf[]> {    
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log("Test getProfile",headers);
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiService}${this.endpointget}/`,{ headers,params })
                    .pipe<userprofileMdlInf[]>(map((data: any) => data))    
}

}