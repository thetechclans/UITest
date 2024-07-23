import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { messageInf } from 'src/app/Models/auth';
import { LoginService } from 'src/app/services/login.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/shared/auth.service';
import { IdleService } from 'src/app/shared/idle.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPassword: boolean = false;
  form!: FormGroup; 
  incorrectPasswordMessage: string = '';
  incorrectPassword: boolean = false;
  responsedata: any;
  userdata:any;
  rolecode:any
  errorMessage:any
  message!: string;
  response:any;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(private formBuilder: FormBuilder,private srvLogin:LoginService,private route: Router,private srvProfile:ProfileService
    ,private srvUser:UserService,private auth:AuthService,private toast: NgToastService,private idle:IdleService, private activatedRoute:ActivatedRoute
  ){}
  ngOnInit():void{
    
this.form =this.formBuilder.group({
  username:['',Validators.required],
  password:['',Validators.required]
})
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  login() {
    this.markFormGroupTouched(this.form);
    
    if (this.form.valid) {
        const formData = this.form.value;
        const username = formData.username
        this.srvLogin.Post(formData).subscribe((response:messageInf) => {
          this.message = response.msg
          this.auth.setResponse(response);
          sessionStorage.setItem('response',this.response)

         if(response !==null){
          this.responsedata= response
          this.showSuccess();
               
                sessionStorage.setItem('access',this.responsedata.token.access)
                sessionStorage.setItem('refresh',this.responsedata.token.refresh)   
            this.srvProfile.getProfile(this.responsedata.token.access,username).subscribe((data:any)=>{
             this.userdata = data 
             this.srvUser.setuserProfile(data)
          
             this.rolecode =this.userdata.rolecode
             this.auth.setRolecode(this.rolecode)
             this.auth.setToken(this.responsedata.token.access)
          
             //window.location.reload();
            })
            this.route.navigate(['/Layout/Dashboard'])
               
                this.idle.reset();
         } },
            error => {
                console.error('Failed to save data:', error);
                 let errorMessage = 'An unexpected error occurred';
                 if (error instanceof HttpErrorResponse && error.status === 404) {
                  errorMessage = error.error.msg;
                 }
                 this.errorMessage = errorMessage;
               this.showInvalid();
            }
        );
    } else {
        console.error('Form is not valid'); 
    }
}
showInvalid(){
  this.toast.error({detail:this.errorMessage,duration:5000, position:'topLeft' });
}
showSuccess(){
  this.toast.success({detail:this.message,duration:5000, position:'topLeft' });
}
}
