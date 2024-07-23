import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiInterceptorService {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = ''
    let jwttoken = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + token
      }
    });

    return next.handle(jwttoken);
  }
}
