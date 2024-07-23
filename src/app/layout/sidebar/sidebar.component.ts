import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router ,Event} from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  rolecode!: number;
   showRegister:boolean = false;
   currentUrl!: string;
constructor(private route: ActivatedRoute, private auth:AuthService,private router: Router,private userService: UserService){
  //this.rolecode= this.auth.getRolecode();
  //this.rolecode = sessionStorage.getItem('rolecode')
  //console.log('construnctor',this.rolecode)
  this.userService.getUserProfile$().subscribe(userProfile => {
    if (userProfile) {
      this.rolecode = userProfile.rolecode;
      console.log('Sidebar Role Code:', this.rolecode);
      this.checkRole();
    }
  });
}

ngOnInit():void{
  this.router.events.pipe(
    filter((event: Event): event is NavigationEnd => {
      return event instanceof NavigationEnd;
    })
  ).subscribe((event: NavigationEnd) => {
    this.currentUrl = event.urlAfterRedirects;
  });

}
checkRole() {
  if (this.rolecode === 1) {
    this.showRegister = true;
  } else {
    this.showRegister = false;
  }
}
isActive(urls: string[]): boolean {
  return !!this.currentUrl && urls.some(url => this.currentUrl.includes(url));
}
}
