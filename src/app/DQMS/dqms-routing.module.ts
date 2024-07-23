import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSourceComponent } from './data-source/data-source.component';
import { BussinessRulesComponent } from './bussiness-rules/bussiness-rules.component';
import { TechnicalRulesComponent } from './technical-rules/technical-rules.component';
import { DataQualityCardComponent } from './data-quality-card/data-quality-card.component';
import { ReferencedataComponent } from './referencedata/referencedata.component';
import { DqCreateprofilingComponent } from './dq-createprofiling/dq-createprofiling.component';
import { DqProfilingComponent } from './dq-profiling/dq-profiling.component';
import { DqSchedulingComponent } from './dq-scheduling/dq-scheduling.component';
import { DqProfilingruleComponent } from './dq-profilingrule/dq-profilingrule.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard, canActivateChild } from '../shared/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { UsermangementComponent } from './usermanagement/usermanagement.component';
import { ChangeOldpasswordComponent } from '../auth/change-oldpassword/change-oldpassword.component';

const routes: Routes = [
  {path:"Dashboard",component:DashboardComponent},
  {path:"Datasource",component:DataSourceComponent},
  {path: "BussinessRules",component: BussinessRulesComponent},
  {path: "TechnicalRules",component:TechnicalRulesComponent},
  {path:"DataQualityCard",component:DataQualityCardComponent},
  {path:"ReferenceData",component:ReferencedataComponent},
  {path: "DQProfiling",component:DqProfilingComponent},
  {path: "DQScheduling", component:DqSchedulingComponent},
  {path: "DQCreateProfiling", component:DqCreateprofilingComponent},
  {path: "DQProfilingRule",component:DqProfilingruleComponent},
  {path: "Settings",component:SettingsComponent},
  {path: "Report",component:ReportComponent},
  {path: "Usermanagement",component:UsermangementComponent},
  {path:"Change-oldpassword",component:ChangeOldpasswordComponent}
    ]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DqmsRoutingModule { }
