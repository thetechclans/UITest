import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/MaterialModule';
import { NgToastModule } from 'ng-angular-popup';
import { NgIdleModule } from '@ng-idle/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoginComponent } from './auth/login/login.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthInterceptor } from './shared/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './services/notification.service';
import { Keepalive } from '@ng-idle/keepalive';
import { IdleService } from './shared/idle.service';
import { AuthService } from './shared/auth.service';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { LayoutsModule } from './layout/layout.module';
import { CommonModule } from '@angular/common';
import { IdleComponent } from './DQMS/idle/idle.component';
import { DqmsModule } from './DQMS/dqms.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    IdleComponent,
  ],
  imports: [
    DqmsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot(),
    FormsModule,
    NgToastModule ,
    NgxSpinnerModule.forRoot(),
    NgIdleModule.forRoot(),
    DqmsModule
  ],
  providers: [
    DatePipe,AuthService,IdleService, Keepalive ,NotificationService, WebsocketService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
