import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { messageInf } from 'src/app/Models/auth';
import { ChangepasswordService } from 'src/app/services/changepassword.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{
  form!: FormGroup; 
  id:any;
  token:any;
  successMessage: string = '';
  errorMessage: string | undefined;
  showPassword!: boolean;
  showPassword1!: boolean;
  message:any;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility1(): void {
    this.showPassword1 = !this.showPassword1;
  }
  constructor(private route: ActivatedRoute,private formBuilder: FormBuilder,private srvChange:ChangepasswordService,
    private toast: NgToastService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params); 
       this.id = params['id'];
       this.token = params['token'];
     console.log(this.id,this.token)
    });
    this.form =this.formBuilder.group({
      userpassword:['',Validators.required],
      userpassword2:['',Validators.required],
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
Submit(){
  this.markFormGroupTouched(this.form);
  if (this.form.valid) {
    const formData = this.form.value;
    console.log('Form data:', formData);
   // this.spinner.show();
  this.srvChange.resetPassword(formData,this.id,this.token).subscribe((response: messageInf) => {
    if(response.msg){
      this.message = response.msg
      this.showSuccess();
    }else{
      this.errorMessage=response.error
      this.showInvalid();
    }
    console.log(response)
    this.form.reset();
  this.spinner.hide();
  },error => {
    let errorMessage = 'An unexpected error occurred';
               /*  if (error instanceof HttpErrorResponse && error.status === 404) {
                  errorMessage = error.error.msg;
                 }
                 this.errorMessage = errorMessage;*/
    this.showInvalid()

  })
}
}
showSuccess(){
  this.toast.success({detail:`${this.message}`,duration:7000, position:'topLeft'});
}
showInvalid(){
  this.toast.error({detail:`${this.errorMessage}`,duration:7000, position:'topLeft'});
}
}