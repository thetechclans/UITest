import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
    // tslint:disable-next-line: max-line-length
    declarations: [LayoutComponent, SidebarComponent, TopbarComponent, MaincontentComponent],
    imports: [
      CommonModule,
      RouterModule,
      HttpClientModule,
      FormsModule
    ],
    exports: [LayoutComponent, SidebarComponent, TopbarComponent, MaincontentComponent],
    providers: []
  })
  export class LayoutsModule { }