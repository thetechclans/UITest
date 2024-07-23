import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder ,AbstractControl,ValidatorFn,} from '@angular/forms';
import { settingMdlInf } from 'src/app/Models/setting';
import { SettingService } from 'src/app/services/setting.service';
import { NgToastService } from 'ng-angular-popup';
import { permissionMdlInf } from 'src/app/Models/permission';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare var bootstrap: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit{

  form!: FormGroup;
  settings: settingMdlInf[]=[];
  showButton: boolean=true;
  canSave:boolean = false;
  canClear:boolean =false;
  canDelete:boolean =false;
  canEdit:boolean = false;
  appName: string = '';
 permissions:permissionMdlInf[]=[];
 rolecode:any;
 saveButton:boolean=false;
 nullValuesValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
  const formGroup = control as FormGroup;

  // Exclude 'code' field from validation
  const controlsToCheck = Object.keys(formGroup.controls).filter(key => key !== 'code');

  // Check if any of the form controls have null values
  const hasNullValues = controlsToCheck.some(key => formGroup.get(key)?.value === null);

  return hasNullValues ? { hasNullValues: true } : null;
};

  
  constructor(private srvsetting:SettingService,private router:Router,private toast: NgToastService,private formBuilder: FormBuilder,private cdr: ChangeDetectorRef,
    private auth:AuthService ,private srvPermission:ApppermissionService, private route: ActivatedRoute,private spinner :NgxSpinnerService){
    
  this.rolecode= this.auth.getRolecode();
      console.log('construnctor',this.rolecode)
  }
ngOnInit():void{
  this.route.url.subscribe(urlSegments => {
    this.appName = urlSegments[urlSegments.length - 1].path;
  })
  this.getPermission();
  this.form= this.formBuilder.group({
    code:[null],
    organisationname:['',Validators.required],
    contactname:['',Validators.required],
    contactemail:['',Validators.required],
    contactmobile:['',Validators.required],
    fullincrement:[{ value: 'true', disabled: false },Validators.required],
    prefixincrement:[{ value: 'true', disabled: false },Validators.required],
    prefixtext:['',Validators.required],
    sendprofilingresults:['',Validators.required]
  },{ validator: this.nullValuesValidator });
 this.getOrganisation();
}
getPermission(){
  this.srvPermission.getPermissions(this.rolecode).subscribe((data:permissionMdlInf[])=>{
    this.permissions=data;
    console.log(data)
    const appPermissions = this.permissions.find(permission => permission.appid.name === this.appName);
    if (appPermissions) {
        this.canSave = appPermissions.read;
        this.canEdit = appPermissions.write;
        this.canDelete = appPermissions.delete;
        console.log( this.canSave,this.canEdit,this.canDelete)
      } else {
        console.log('Permissions not found for app:', this.appName);
      }
      })
    }
getOrganisation(){
  this.srvsetting.getOrganisation().subscribe(data => {
    this.settings= data
    console.log(data)
    if (data && data.length > 0) {
      const settings = data[0];
      this.form.patchValue({
        code:settings.code ||'',
        organisationname: settings.organisationname || '',
        contactname: settings.contactname || '',
        contactemail:settings.contactemail || '',
        contactmobile: settings.contactmobile || '',
        fullincrement: settings.fullincrement || false,
        prefixincrement: settings.prefixincrement || false,
        prefixtext:settings.prefixtext || '',
        sendprofilingresults:settings.sendprofilingresults || ''
      });
      this.form.get('fullincrement')?.disable();
      this.form.get('prefixincrement')?.disable();
      this.form.get('prefixtext')?.disable();
      this.showButton=false; 
    } else {
      this.form.enable(); 
      this.showButton=true; 
    }
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
saveOrganisation(){
  this.markFormGroupTouched(this.form)
  
 const formData = this.form.getRawValue();
console.log(formData.code)
const prefixincrementValue = this.form.get('prefixtext')?.value;
console.log(prefixincrementValue)
const hasNullValues = Object.values(formData).some(value => value === '');
if (prefixincrementValue !== '') {
if (!hasNullValues) {
  if (formData.code === null) {
   this.spinner.show();
    this.srvsetting.postOragnisation(formData).subscribe(
      response => {
     //   this.showSuccess();
        this.openSecondModal();
        console.log(response);
        // Refresh data
        this.spinner.hide
        //this.ngOnInit();
        // window.location.reload();
      }
    );
  } else {
    this.spinner.show();
    this.srvsetting.updateOrganisation(formData).subscribe(
      response => {
        //this.showSuccess();
        this.openfirstModal();
        console.log(response);
        // Refresh data
        this.spinner.hide();
       // this.ngOnInit();
        //window.location.reload();
      }
    );
  }
}else{
this.showError();
}}
}
openSecondModal() {
  // Hide the first modal
  const firstModal = new bootstrap.Modal(document.getElementById('NewConnectionModal'));
  firstModal.show();

}
openfirstModal() {
  // Hide the first modal
  const firstModal = new bootstrap.Modal(document.getElementById('NewConnectionModal1'));
  firstModal.show();

}
showSuccess(){
  this.toast.success({detail:"Organisation Saved Successfully",duration:5000, position:'topLeft'});
}
showError(){
  this.toast.error({detail:"please fill the required form field",duration:5000, position:'topLeft'});
}
// logout(){
//   const confirmation= confirm('Do you want to logout');
//   if(confirmation){
//     localStorage.removeItem('access');
//     this.router.navigate(['/']);
//   }
// }

logout(){
  
    localStorage.removeItem('access');
    this.router.navigate(['/']);
  
}
}