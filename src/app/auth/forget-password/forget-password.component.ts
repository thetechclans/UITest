import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgetPasswordMdlInf } from 'src/app/Models/auth';
import { ResetpasswordService } from 'src/app/services/resetpassword.service';
import { messageInf } from 'src/app/Models/auth';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})


export class ForgetPasswordComponent {

  form!: FormGroup; 
message:any;
  errorMessage: string|undefined;
  nonFieldErrors: any;
  constructor(private srvResetpwd:ResetpasswordService,private formBuilder: FormBuilder,private toast: NgToastService, private spinner: NgxSpinnerService,){}

  ngOnInit(){
    this.form =this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
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
    this.spinner.show();
  this.srvResetpwd.sendEmail(formData).subscribe((response: messageInf) => {

    if(response.msg){
      this.message = response.msg
      this.showSuccess();
    }else{
      this.errorMessage=response.error
      this.showInvalid();
    }
    console.log(response)
    this.spinner.hide();
    
    },error => {
      let errorMessage = 'An unexpected error occurred';
               /*  if (error instanceof HttpErrorResponse && error.status === 404) {
                  errorMessage = error.error.msg;
                 }
                 this.errorMessage = errorMessage;*/
   
   this.spinner.hide();
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
