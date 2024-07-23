import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { userprofileMdlInf } from '../../Models/profile';
import { settingMdlInf } from 'src/app/Models/setting';
import { SettingService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { notificationdetailMdlInf,notificationMdlCls,notificationMdlInf } from 'src/app/Models/notification';
import { WebsocketService } from 'src/app/services/websocket.service';
declare var bootstrap: any;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit{
  settings: settingMdlInf[]=[];
  organisation!: string;
  user:userprofileMdlInf|undefined;
  username!: string;
  rolecode: string = '';
  rolename:string = '';
  notificationPanelOpen = false;
  @ViewChild('offcanvas')
  offcanvas!: ElementRef;
  unreadcount: any;

  openOffcanvas() {
    $(this.offcanvas.nativeElement).offcanvas('toggle');
  }
  notification!: notificationdetailMdlInf;
  notifications: notificationMdlInf[]=[];
  unreadNotifications:notificationMdlInf[]=[];
  count:any;
  allRead = false;
  showAllNotifications = false;
  constructor(private srvsetting:SettingService,private srvUser:UserService,private router:Router,private auth:AuthService,private srvnotification:NotificationService,
    private websocketService: WebsocketService, private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ){
   
  
  }
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.rolecode = localStorage.getItem('rolecode') || '';
    const roleMap: { [key: string]: string } = {
      '1': 'Super Admin',
      '2': 'Business Steward',
      '3': 'Data Steward',
      '4': 'Data Admin'
    };
    this.rolename = roleMap[this.rolecode] || '';
    this.getOrganisation();
    this.srvUser.userProfile.subscribe(userProfile => {
      this.ngZone.run(() => {
        this.user = userProfile;
        if (userProfile) {
          this.username = userProfile.username;
          this.rolecode = userProfile.rolecode.toString();
          this.auth.setLoggedInUser(this.username);
          sessionStorage.setItem('username', userProfile.username);
          sessionStorage.setItem('rolecode', userProfile.rolecode);
          this.rolename = roleMap[this.rolecode] || '';
         if (this.rolecode === '4') {
            this.websocketService.messages$.subscribe(
              msg => this.handleMessage(msg),
              err => console.error('WebSocket error:', err),
              () => console.log('WebSocket connection closed')
            );
          }
        }
      });
    });
    this.getNotification();
  }
  private handleMessage(msg: any): void {
  
    console.log('message received: ', msg);
    this.count = msg.message.unread_count;

  }
  getOrganisation(){
    this.srvsetting.getOrganisation().subscribe(data => {
      this.organisation= data[0].organisationname
    })
  }
  logout(){
   
      localStorage.removeItem('access');
      this.router.navigate(['']);
    
  }
  getNotification(){
    this.srvnotification.getNotificationDetails().subscribe((data: notificationdetailMdlInf) =>{
    this.notification = data;
    this.unreadcount = data.unread_count;
    let results = data.results
    this.notifications = results;
    console.log('this.notificationsdata',data.unread_count)
    console.log('this.notifications',this.notifications)
    this.filterUnreadNotifications();
    })
  }
  getDescription(notification: notificationMdlInf): string {
    const ruleNo = notification.dqprofilingresultscode?.profilecode?.dqrulecode?.ruleno;
    const scheduleName = notification.dqprofilingresultscode?.profilecode?.schedulecode?.name;
    const profileDatetime = notification.dqprofilingresultscode?.profiledatetime;
    const successFlag = notification.dqprofilingresultscode?.successflag;

    if (successFlag) {
      let description = `This rule ${ruleNo} was successfully profiled`;
      if (scheduleName) {
        description += ` at ${scheduleName}`;
      }
      description += ` on ${profileDatetime}.`;
      return description;
    } else {
      return `This rule ${ruleNo} was not successfully profiled.`;
    }
  }
  getStatusIconClass(successFlag: boolean | undefined): string {
    return successFlag ? 'fas fa-check-circle status-icon success' : 'fas fa-times-circle status-icon failure';
  }

  getStatusText(successFlag: boolean | undefined): string {
    return successFlag ? 'Success' : 'Failure';
  }
  filterUnreadNotifications(): void {
    this.unreadNotifications = this.notifications.filter(notify => !notify.isread);
    console.log('this.unreadNotifications',this.unreadNotifications)
    
  }
  getUnreadNotificationCodes(): number[] {
    return this.unreadNotifications.map(notify => notify.code);
  }
  toggleNotificationPanel() {
    if (!this.notificationPanelOpen) {
    this.getNotification();
    }
    this.notificationPanelOpen = !this.notificationPanelOpen;
    if (!this.notificationPanelOpen) {
      const unreadCodes = this.getUnreadNotificationCodes();
      this.markNotificationsAsRead(unreadCodes);
      this.resetNotificationPanel();
    }
    
  }
  markNotificationsAsRead(codes: number[]): void {
    const notifications: notificationMdlCls[] = codes.map(code => {
      const notification = new notificationMdlCls();
      notification.code = code;
      notification.isread = true;
      return notification;
    });

    this.srvnotification.updateNotifications(notifications).subscribe(
      updatedNotifications => {
        console.log('Notifications marked as read:', updatedNotifications);
        // Reset the unread count and notification messages here
        this.unreadcount = 0;
        this.notifications = this.notifications.map(notification => {
          if (codes.includes(notification.code)) {
            notification.isread = true;
          }
          return notification;
        });
      },
      error => {
        console.error('Error marking notifications as read:', error);
      }
    );
  }
  resetNotificationPanel() {
    
    this.unreadcount = 0; 
    this.notifications = this.notifications.map(notification => {
      notification.isread = true;
      return notification;
    })
  }
  markAllAsRead(event: any) {
    this.allRead = event.target.checked;
  }
  toggleFullMessage(notification: any) {
    notification.showFullMessage = !notification.showFullMessage;
  }
  toggleViewAll(): void {
    this.showAllNotifications = !this.showAllNotifications;
  }
}
