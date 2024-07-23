import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard, canActivateChild } from './shared/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Forget-password', component: ForgetPasswordComponent },
  { path: 'Change-password/:id/:token', component: ChangePasswordComponent },
  {
    path: 'Layout',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./DQMS/dqms-routing.module').then(m => m.DqmsRoutingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
