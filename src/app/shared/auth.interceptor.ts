import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token =  sessionStorage.getItem('access');
  
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
        
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
    
            // Token is invalid or expired
            sessionStorage.removeItem('access');
            this.router.navigate(['']);
          }else {
            console.error('AuthInterceptor: HTTP error occurred:', error);
          }
          return throwError(error);
        })
      );
    } else {
      console.log('AuthInterceptor: No token found in sessionStorage');
      return next.handle(req);
    }
  }
}
