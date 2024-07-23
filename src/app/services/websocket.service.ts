import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { webMdl } from '../Models/notification';
@Injectable({
  providedIn: 'root'
})


export class WebsocketService {
  private endpointget = 'apiNotification';
  private apiService: string | undefined;
  private socket$!: WebSocketSubject<any>;

  constructor(private http: HttpClient) { 
    this.apiService = environment.apiService;
    this.socket$ = new WebSocketSubject('ws://127.0.0.1:8000/ws/apiNotification/');
    
    this.socket$.subscribe(
      msg => this.handleMessage(msg),
      err => console.error('WebSocket error:', err),
      () => console.log('WebSocket connection closed')
    );
  }
  private handleMessage(msg: any): void {
    // Log the received message
    console.log('message received: ', msg);

    // If you need to convert it to a JSON string for readability
    console.log('message received (JSON): ' + JSON.stringify(msg));
  }
  get messages$() {
    return this.socket$.asObservable();
  }
}
