import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { WebsocketService } from './websocket.service';
import { notificationdetailMdlInf,notificationMdlCls,notificationMdlInf } from '../Models/notification';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private endpointget = 'apiNotification';
  private endpointgetdetails = 'apiNotificationDetails';
  private apiService: string | undefined;
  constructor(private http: HttpClient,private webSocketService: WebsocketService) { this.apiService = environment.apiService; }

  getNotification(): Observable<notificationMdlInf[]> {    
    return this.http
      .get(`${this.apiService}${this.endpointget}`)
      .pipe(
        map((data: any) => data),
      )
  }
  getNotificationDetails(): Observable<notificationdetailMdlInf> {    
    return this.http
      .get(`${this.apiService}${this.endpointgetdetails}`)
      .pipe(
        map((data: any) => data),
      )
  }
  get_realTimeUpdates$() {
    return this.webSocketService.messages$;
  }
  updateNotifications(notifications: notificationMdlCls[]): Observable<notificationMdlCls[]> {
    const observables = notifications.map(notification => {
      const { code, ...payload } = notification; 
      return this.http.put<notificationMdlCls>(`${this.apiService}${this.endpointget}/${code}/`, payload);
    });
  
    return forkJoin(observables);
  }
  
}
