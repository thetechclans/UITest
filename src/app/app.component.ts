import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IdleService } from './shared/idle.service';
import { IdleComponent } from './DQMS/idle/idle.component';
import { NotificationService } from './services/notification.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  AfterViewInit,OnInit {
  title = 'DQMS_UI';
  notifications: any[] = [];
  unreadCount = 0;
  @ViewChild(IdleComponent)
  idleModal!: IdleComponent;
  constructor(private idleService: IdleService,private notificationService: NotificationService) { }
  ngOnInit(): void {
    this.notificationService.get_realTimeUpdates$().subscribe((data: any) => {
      this.notifications = data.notifications;
      this.unreadCount = this.notifications.filter(n => !n.isread).length;
      console.log('unreadCount', this.unreadCount )
    });
  }
  ngAfterViewInit() {
    console.log('IdleModalComponent initialized');
    this.idleService.setIdleModal(this.idleModal);
    
  }
}