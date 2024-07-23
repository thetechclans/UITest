import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe,CommonModule} from '@angular/common';
import { DataSourceComponent } from './data-source/data-source.component';
import { BussinessRulesComponent } from './bussiness-rules/bussiness-rules.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/MaterialModule';
import { HttpClient, HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { TechnicalRulesComponent } from './technical-rules/technical-rules.component';
import { DataQualityCardComponent } from './data-quality-card/data-quality-card.component';
import { FilterPipe } from '../filter.pipe'; 
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReferencedataComponent } from './referencedata/referencedata.component';
import { Max100Directive } from './max100.directive';
import { NgxEditorModule, schema } from 'ngx-editor';
import { DqCreateprofilingComponent } from './dq-createprofiling/dq-createprofiling.component';
import { DqSchedulingComponent } from './dq-scheduling/dq-scheduling.component';
import { DqProfilingComponent } from './dq-profiling/dq-profiling.component';
import { HttpConfigInterceptor } from './httpconfig.interceptor';
import { NgToastModule } from 'ng-angular-popup';
import { DqProfilingruleComponent } from './dq-profilingrule/dq-profilingrule.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from '../shared/auth.guard';
import { AuthService } from '../shared/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportComponent } from './report/report.component';
import { UsermangementComponent } from './usermanagement/usermanagement.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PaginationComponent } from './pagination/pagination.component'
import { AuthInterceptor } from '../shared/auth.interceptor';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { NgIdleModule } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { IdleService } from '../shared/idle.service';
import { IdleComponent } from './idle/idle.component';
import { NotificationService } from '../services/notification.service';
import { WebsocketService } from '../services/websocket.service';
import { DqmsRoutingModule } from './dqms-routing.module';
import { ChangeOldpasswordComponent } from '../auth/change-oldpassword/change-oldpassword.component';
@NgModule({
  declarations: [
  
    DataSourceComponent,
    BussinessRulesComponent,
    TechnicalRulesComponent,
    DataQualityCardComponent,
    FilterPipe,
    ReferencedataComponent,
    Max100Directive,
    DqCreateprofilingComponent,
    DqSchedulingComponent,
    DqProfilingruleComponent,
    SettingsComponent,
    DashboardComponent,
    ReportComponent,
    SpinnerComponent,
    PaginationComponent,
    DqProfilingComponent,
    ConfirmationModalComponent,
    UsermangementComponent,
    ChangeOldpasswordComponent


  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    MatMenuModule,
    MatDialogModule,
    NgToastModule ,
    NgxChartsModule,
    DqmsRoutingModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule.forRoot(),
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        blockquote: 'Blockquote',
        underline: 'Underline',
        strike: 'Strike',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',

        // popups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    }),
  
  
    
  ],
  providers: [ DatePipe,AuthService,IdleService, Keepalive ,NotificationService, WebsocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
 
})
export class DqmsModule { }
