import { Component, Input } from '@angular/core';
import { IdleService } from 'src/app/shared/idle.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.scss']
})
export class IdleComponent {
  @Input()
  idleState!: string;
  @Input()
  countdown!: number;
  @Input()
  showModal!: boolean;
constructor(private idle:IdleService,private route:Router){}
  hideModal() {
    this.showModal = false;
  }
  logout() {
    this.hideModal();
    this.idle.logout();
  }

  stay() {
    this.hideModal();
    this.idle.reset();
  }
}
