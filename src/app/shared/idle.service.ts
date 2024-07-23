import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { IdleComponent } from '../DQMS/idle/idle.component';
@Injectable({
  providedIn: 'root'
})
export class IdleService {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date | undefined;
  private idlecomponent!: IdleComponent;
  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router) {
    // Sets an idle timeout of 30 minutes.
    idle.setIdle(900); // 15 minutes
    idle.setTimeout(15);
    // Sets the default interrupts, in this case, things like clicks, scrolls, touches to the document.
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      console.log('No longer idle');
      this.updateModal('No longer idle.', 0, false);
      this.reset();
    });

    this.idle.onTimeout.subscribe(() => {
      console.log('Timed out');
      this.updateModal('Timed out!', 0, true);
      this.timedOut = true;
      this.logout();
    });

    this.idle.onIdleStart.subscribe(() => {
      console.log('You\'ve gone idle');
      this.updateModal('You\'ve gone idle!', 90, true);
    });
    

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      console.log('Timeout warning:', countdown);
      this.updateModal('You will time out in ' + countdown + ' seconds!', countdown, true);
    });

    // Set the ping interval to 15 seconds.
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.keepalive.start();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
    this.idlecomponent.hideModal();
  }
  setIdleModal(modal: IdleComponent) {
    this.idlecomponent = modal;
  }
  private updateModal(idleState: string, countdown: number, showModal: boolean) {
    if (this.idlecomponent) {
      this.idlecomponent.idleState = idleState;
      this.idlecomponent.countdown = countdown;
      this.idlecomponent.showModal = showModal;
    }
  }
}
