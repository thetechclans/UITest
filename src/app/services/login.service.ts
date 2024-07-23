import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { messageInf } from '../Models/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private endpoint = 'login';
  private apiService: string | undefined;
  constructor(private http: HttpClient,private router: Router) { this.apiService = environment.apiService; }

  Post(data:any): Observable<messageInf> {
    return this.http.post<messageInf>(`${this.apiService}${this.endpoint}/`,data);
    
  }
  GenerateRefreshToken() {
    let input = {
      "access": this.GetToken(),
      "refresh": this.GetRefreshToken()
    }
    return this.http.post(this.apiService + 'refresh', input);
  }

  IsLoggedIn(){
    return localStorage.getItem('access')!=null;
     }
  GetToken(){
      return localStorage.getItem('access')||'';
     }
     GetRefreshToken() {
      return localStorage.getItem("refresh") || '';
    }
    SaveTokens(tokendata: any) {
      localStorage.setItem('access', tokendata.access);
      localStorage.setItem('refresh', tokendata.refresh);
    }
     HaveAccess(){
      var loggintoken=localStorage.getItem('token')||'';
      var _extractedtoken=loggintoken.split('.')[1];
      var _atobdata=atob(_extractedtoken);
      var _finaldata=JSON.parse(_atobdata);
      if(_finaldata.role=='0'){
        return true
      }else{
        this.router.navigateByUrl('/access');
        return false
      }
}
Logout() {
  alert('Your session expired')
  localStorage.clear();
  this.router.navigateByUrl('/login');
}
}
