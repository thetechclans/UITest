import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { responseMdlInf } from '../Models/login';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: string | null;
  private rolecode:any;
  private tokenKey = 'access';
  private responseKey = 'response';
   private response: responseMdlInf[] | null = null;
   private isAuthenicated = false;
   private authSecreteKey ='Bearer Token';
   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { 
    this.isAuthenicated = !!localStorage.getItem(this.authSecreteKey)
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.rolecode = localStorage.getItem('rolecode')
  }

  IsLoggedIn(){
   return !!sessionStorage.getItem('access');
  }
  setLoggedInUser(user: string): void {
    this.loggedInUser = user;
    localStorage.setItem('loggedInUser', user);
  }
  getLoggedInUser(): string | null {
    return this.loggedInUser;
  }
  setRolecode(id:any):void{
    this.rolecode =id;
    localStorage.setItem('rolecode',id);
  }
  getRolecode():any{
    return this.rolecode;
  }
getAccessToken(): string | null {
    return sessionStorage.getItem('access');
  }
  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }
  
  setResponse(response: any): void {
    const responseString = JSON.stringify(response); 
  
    sessionStorage.setItem('setresponse', responseString); // Store serialized string in sessionStorage
    const authToken = sessionStorage.getItem('access') || ''; 
     localStorage.setItem(this.authSecreteKey,authToken);
     this.updateAuthenticationStatus(true);
  }

  getResponse(): any {
    const responseString = sessionStorage.getItem('setresponse');
   
    return responseString ? JSON.parse(responseString) : null; 
  }


  checkLogin(): Observable<boolean> {
    const response = this.getResponse();

    return of(!!response);
  }
  isAuthenticated():Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  updateAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}