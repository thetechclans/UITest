
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rolesMdlInf } from 'src/app/Models/register';
import { RegisterService } from 'src/app/services/register.service';
import { RolesService } from 'src/app/services/roles.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsermangementService } from 'src/app/services/usermanagement.service';
import { ApiResponse, UserEditMdlCls, UserEditMdlInf, UserInfpage, UserMdlInf } from 'src/app/Models/usermangement';
import { userprofileMdlInf } from 'src/app/Models/profile';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { permissionMdlInf } from 'src/app/Models/permission';
import { GetroleService } from 'src/app/services/getrole.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { EncryptdecryptService } from 'src/app/services/encryptdecrypt.service';
declare var bootstrap: any;


@Component({
  selector: 'app-usermangement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermangementComponent implements OnInit{

  users: UserMdlInf[] = [];
 

  rolecode:any;
  filterData:string ='';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  form!: FormGroup; 
  formEdit!: FormGroup;
  roles:rolesMdlInf[]=[];
  permissions:permissionMdlInf[]=[];
  canSave:boolean = false;
  canClear:boolean =false;
  canDelete:boolean =false;
  canEdit:boolean = false;
  saveButton:boolean=false;
  appName: string = '';
  editparam:string ='';
  msg!: string;
  selectedUser: UserMdlInf | undefined;
  selectedUsercls!: UserEditMdlCls;
  disabled: boolean = true; // Set to true to disable the input box
  //selecedusermdl:UserEditMdlCls|undefined;
  currentpage: number = 1;
  totalPages: number = 0;
  editedUserId: number | null = null;
  private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();
  currentSortField: string = ''; 
  currentSortOrder: string = '';
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility(): void {
    this. showConfirmPassword = !this. showConfirmPassword;
  }
  toggleActiveStatus(): void {
    if (this.selectedUser) {
      this.selectedUsercls.is_active = !this.selectedUsercls.is_active;
    }
  }
  constructor(private formBuilder: FormBuilder,
    private srvRegister: RegisterService,
    private route: Router,
    private srvRole: RolesService,
    private srvUserMagement:UsermangementService,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private srvPermission:ApppermissionService,
    private auth:AuthService,
    private srvEncrpt: EncryptdecryptService){
      this.rolecode= this.auth.getRolecode();
    console.log('construnctor',this.rolecode)

    }
  ngOnInit(){
    this.searchSubject.pipe(
      debounceTime(3000),
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.getUsers(this.currentpage);
    });
    this.form =this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      username:['',Validators.required],
      rolecode:['',Validators.required],
      usermobile:['',Validators.required,Validators.pattern(/^[0-9]{10}$/)],
      userpassword:['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      userpassword2:['',Validators.required]
    },{
      validator: this.mustMatch('userpassword', 'userpassword2')
    });
    this.formEdit = this.formBuilder.group({
      id: ['', Validators.required],
      email: ['', Validators.required],
       username: ['', Validators.required],
      rolecode: ['', Validators.required],
      usermobile: ['', Validators.required],
      is_active:['',Validators.required],


    });
    this.getRole();
    this. getUsers(this.currentpage);
    this. getPermission();
    this.getUserPage(this.currentpage);
  }
  get f() {
    return this.form.controls;
  }
  getPermission(){
    this.spinner.show();
    this.srvPermission.getPermissions(this.rolecode).subscribe((data:permissionMdlInf[])=>{
      this.permissions=data;
      console.log(data)
      const appPermissions = this.permissions.find(permission => permission.appid.name === this.appName);
      if (appPermissions) {
        console.log(appPermissions);
          this.canSave = appPermissions.read;
          this.canEdit = appPermissions.write;
          this.canDelete = appPermissions.delete;
          console.log( this.canSave,this.canEdit,this.canDelete)
        } else {
          console.log('Permissions not found for app:', this.appName);
        }
        this.spinner.hide();
        })
      }
  getRole(){
    this.srvRole.getRole().subscribe(data=>{
    this.roles=data;
    console.log(data)
    })
  }
  getUsers(page: number): void {
    let ordering = this.currentSortField ? `${this.currentSortOrder}${this.currentSortField}` : null;
    this.spinner.show();
    this.srvUserMagement.getUsers(page,ordering,this.filterData).subscribe(
      (data: UserInfpage) => {
        let results = data.results
        this.users =results
       this.totalPages = data.page_count
        this.spinner.hide();
        console.log(' load users table', results);

      },
      (error) => {
        console.error('Failed to load users', error);
      }
    );
  }
  restrictNonNumeric(event: KeyboardEvent) {
    if (event.key && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  restrictToTenDigits() {
    const inputControl = this.form.get('technicalcontactmobile');
    if (inputControl?.value && inputControl.value.length > 10) {
      inputControl.setValue(inputControl.value.slice(0, 10));
    }
  }
  onInputChanges() {
    this.searchSubject.next();
  } 
  openEditModal(user: UserEditMdlInf) {
    this.selectedUser = user;
    this.formEdit.setValue({
      id: user.id,
      email: user.email,
      username: user.username,
      rolecode: user.rolecode.code,
      usermobile: user.usermobile,
      is_active:user.is_active,

    });
    this.editedUserId = user.id;
    const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editModal.show();
  }

  updateUser() {
    if (this.formEdit.valid) {
      const updatedUser = this.formEdit.value;
      this.spinner.show();
      this.srvUserMagement.updateUser(updatedUser).subscribe(
        response => {
          console.log('User updated successfully:', response);
          this.spinner.hide();
          this.editedUserId =updatedUser.id;
          this.showSuccessEdit();
          this.getUsers(this.currentpage);
          
        },
        error => {
          console.error('Failed to update user:', error);
          this.spinner.hide();
          this.showErrorEdit();
        }
      );
    } else {
      this.showError1();
    }
  }
  register(){
    this.markFormGroupTouched(this.form)
    if (this.form.valid) {
      const formData = this.form.value;
      console.log('Form data:', formData); // Debug log
     this.spinner.show();
      // Post form data to the server
      this.srvRegister.Post(formData).subscribe(
          (response:ApiResponse) => {
           this.msg= response.msg
              console.log(this.msg);
              this.spinner.hide();
              this.showSuccess(); 
              //this.route.navigate(['']);
              this.ngOnInit();
             
          },
          error => {
              this.showError();
          }
      );
  } else {
    this.showError1();
      console.error('Form is not valid'); 
  }
  }
  
  back(){
    this.route.navigate(['']);
  }
  exit(){
    this.form.reset();
  }
  Close(){
    this.form.reset();
  }
  getUserPage(page: number){
    this.srvUserMagement.getUserPage(page).subscribe((data:any)=> {
  
      console.log("page",data);
      this.users = data.results
      this.totalPages=data.page_count;
      this.currentpage = page;
      if (data) {
        const page_count = data.page_count;
        console.log("Page count:", data.page_count);
    } else {
        console.log("Data is undefined");
    }
    })
  }
  mustMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => ValidationErrors | null {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // Return if another validator has already found an error on the matchingControl
        return null;
      }

      // Set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }

       };
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  showSuccess(){
    this.toast.success({detail:this.msg ,duration:5000, position:'topLeft'});
  }
  showError(){
    this.toast.error({detail:"Email or Username already exists",duration:5000, position:'topLeft'});
  }
  showError1(){
    this.toast.error({detail:"Please fill the required form field",duration:5000, position:'topLeft'});
  }
  showSuccessEdit(){
    this.toast.success({detail:"User register updated successfully",duration:5000, position:'topLeft'});
  }
  showErrorEdit(){
    this.toast.error({detail:"Failed to update user",duration:5000, position:'topLeft'});
  }
  openSecondModal() {
    // Hide the first modal
    const firstModal = new bootstrap.Modal(document.getElementById('NewConnectionModal'));
    firstModal.show();

  
  }

  visible:boolean=false;
  sortColumn: string = '';
  sortAscending: boolean = true;
  sortTable(field: string): void {
    if (this.currentSortField === field) {
      this.currentSortOrder = this.currentSortOrder === '' ? '-' : '';
      this.visible = !this.visible;
      console.log(this.visible ? 'asc' : 'desc');
    } else {
      this.currentSortOrder = '';
      this.visible = false;
      console.log('desc')
    }
    this.currentSortField = field;
    this.getUsers(this.currentpage);
  }
  
  

  getColumnValue(item: any, column: string): string {
    const columns = column.split('.');
    let value = item;
  
    for (const col of columns) {
      if (value && typeof value === 'object' && col in value) {
        value = value[col];
      } else {
        return '';  // or return some default value
      }
    }
  
    return value ? value.toLowerCase() : '';

  }
  onPageChange(page: number): void {
    this.currentpage = page;
    this.getUsers(this.currentpage);
  }
  


}