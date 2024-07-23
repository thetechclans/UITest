import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-maincontent',
  templateUrl: './maincontent.component.html',
  styleUrls: ['./maincontent.component.scss']
})
export class MaincontentComponent {
constructor(private router: Router){}
}
