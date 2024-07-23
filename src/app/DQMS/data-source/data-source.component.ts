import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, Subject, debounceTime, takeUntil } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SourcetypeService } from 'src/app/services/sourcetype.service';
import { sourcetypeMdl } from 'src/app/Models/sourcetype';
import { DbmsService } from 'src/app/services/dbms.service';
import { dbmsMdlInf } from 'src/app/Models/dbms';
import { DatePipe } from '@angular/common';
//Change to DBConnection Service and Model
import { ValidationService } from 'src/app/services/validation.service';
import { ValidationCls, ValidationInf, validationDetailInf, validationDetailCls } from 'src/app/Models/validate';
import { filter } from 'rxjs';
import { DatasourceService } from 'src/app/services/datasource.service';
import { datasourceMdlInf, datasourceMdlCls, datasourceDetailMdlCls, datasourceDetailMdlInf, datasourceDetailMdlInfpage } from 'src/app/Models/datasource';
import { dbconnectionDetailCls } from 'src/app/Models/dbconnection';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/shared/auth.service';
import { permissionMdlInf } from 'src/app/Models/permission';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/DQMS/confirmation-modal/confirmation-modal.component';
import { EncryptdecryptService } from 'src/app/services/encryptdecrypt.service';
@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss'],

})
export class DataSourceComponent implements OnInit {
  //@ViewChild('newConnectionModal') myModal!: ElementRef;
  @ViewChild('newConnectionModal')
  newConnectionModal!: ElementRef;
  @ViewChild('confirmationModal', { static: true })
  confirmationModal!: ConfirmationModalComponent;
  @ViewChild('successModal', { static: true })
  successModal!: ConfirmationModalComponent;
  //form: FormGroup;
  selectedOption: string | undefined;
  showForm = false;
  editMode: boolean = false;
  selectedDatasource: any;
  selectedDbConnectionvalue: any;
  formGroup: any;
  dbconnectioncode: any;
  formDataSource!: FormGroup;
  formDataSourceMgt!: FormGroup;
  form!: FormGroup;
  formDBConnection!: FormGroup;
  contentDatasource: any;
  additionalData: any;
  dbmscode: any;
  filterData: string = '';
  editparam:string ='';
  appName: string = '';
  editbutton:boolean=false;
  canSave: boolean = false;
  canClear: boolean = false;
  canDelete: boolean = false;
  canEdit: boolean = false;
  canAdd: boolean = false;
  passwordVisible = false;
  saveButton: boolean = true;
  deleteButton: boolean = true;
  editedDatasourceId: number | null = null;
  headingConnection: string = 'New Database Connection';
  headingDatasource: string = 'Data Source Management';
  selectedDbConnectionCode: any;
  errorMessage!: string;

  showModal: boolean = false;
  ////table grid 

  datasources: datasourceDetailMdlInf[] = []; //Assign this varaiable to Grid loop
  selectedDataSourceCode: number = 0;
  //in ds form 
  selectedDbconnectionCode: any;
  selectedSourceTypeCode: any;
  selectedDBMSCode: any;
  dbConnectionInf: ValidationInf[] = [];
  dbConnectionCls: ValidationCls = new ValidationCls();
  selectedValue: any;
  dataSourceCls: datasourceMdlCls = new datasourceMdlCls(); //this fr datasource update
  datasourceDetailCls: datasourceDetailMdlCls = new datasourceDetailMdlCls(); //this for datasource details reload


  dataSource: datasourceMdlCls = new datasourceMdlCls(); //saveform
  selectedDbConnection: any;
  showPassword: boolean = false;
  hasPassword: boolean = false;
  selectedRow: any;
  // forms!: FormGroup; 
  togglePasswordsVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  // For DataSource Header Name
  isEditing: boolean = false;
  dataSourceName: any;
  public newDataSourceTitle: any;
  highlightRow: any = null;
  //Select - DropDown DataLoad
  sourceTypes: sourcetypeMdl[] = [];
  dbms: dbmsMdlInf[] = [];
  dbmsNew: dbmsMdlInf[] = [];
  DBconnections: ValidationInf[] = [];
  //formDBConnection!: FormGroup;
  pages: datasourceDetailMdlInfpage[] = [];
  rolecode: any;
  permissions: permissionMdlInf[] = [];
  totalPages: number = 0;
  loginname: string = '';
  loginpwd: string = '';
  name: string = '';
  port: number = 0;
  currentSortField: string = ''; 
  currentSortOrder: string = '';
  private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();
  //for pagenation
  currentpage: number = 1;
  @ViewChild('pagination')
  pagination!: ElementRef;
  @ViewChildren('rowElement') rowElements!: QueryList<ElementRef>;
  constructor(private srvDataSource: DatasourceService, private modalService: NgbModal, private renderer: Renderer2,
    private fb: FormBuilder, private srvValidation: ValidationService, private srvSourcetype: SourcetypeService, private srvDBMS: DbmsService,
    private srvDBMSNew: DbmsService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private datePipe: DatePipe, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private toast: NgToastService, private auth: AuthService, private srvPermission: ApppermissionService, private route: ActivatedRoute,
    private srvEncrypt: EncryptdecryptService) {
    this.rolecode = this.auth.getRolecode();
    console.log('construnctor', this.rolecode)

  }
  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      this.appName = urlSegments[urlSegments.length - 1].path;
    })
    this.searchSubject.pipe(
      debounceTime(3000),
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.getDataSourceDetails(this.currentpage);
    });
  
    this.formDataSource = this.formBuilder.group({
      code: [''],
      name: ['', Validators.required],
      dbconnectioncode: [null, Validators.required],
      sourcetypecode: ['', Validators.required],
      technicalcontactemail: ['', [Validators.required,Validators.email]],
      technicalcontactmobile: ['', Validators.required,Validators.pattern(/^[0-9]{10}$/)],
      technicalcontactname: ['', Validators.required],
      dbmscode: ['', Validators.required],
      dbmsname: [{ value: '', disabled: true }, Validators.required],
      connectionstring: [{ value: '', disabled: true }, Validators.required],
      errormessage: ['', Validators.required],
      servername: [{ value: '', disabled: true }, Validators.required],
      port: ['', Validators.required],
      authenticationmode: ['', Validators.required],
      loginname: ['', Validators.required],
      loginpwd: ['', Validators.required],
      databasename: [{ value: '', disabled: true }, Validators.required],
      schemaname: [{ value: '', disabled: true }, Validators.required],
      dbconnectionname: ['', Validators.required],
      databaselogin: ['', Validators.required],
      databasepassword: ['', Validators.required],
      lastvalidationstatus: [{ value: '', disabled: true }],
      lastvalidationdatetime: [{ value: '', disabled: true }],
      errormesage: [''],
      validationflag: ['']
    })
    this.formDBConnection = this.fb.group({
      code: [''],
      dbmscode: ['', Validators.required],
      servername: ['', Validators.required],
      loginname: ['', Validators.required],
      databasename: ['', Validators.required],
      name: ['', Validators.required],
      port: ['', Validators.required],
      loginpwd: ['', Validators.required],
      schemaname: ['', Validators.required],
      connectionstring: [{ value: '', disabled: true }], // You might want to add validation here if needed
      validationflag: [{ value: '', disabled: true }],
      lastvalidationdate: [{ value: '', disabled: true }],
      errormesage: [{ value: '', disabled: true }]
    });
    this.formDBConnection.valueChanges.subscribe(values => {
      this.formDBConnection.get('connectionstring')?.setValue(
        `Server Name=${values.servername}; Port=${values.port};Database Login=${values.loginname};Password=${'*'.repeat(values.loginpwd.length)}; Database Name=${values.databasename}; Schema Name=${values.schemaname}; `,
        { emitEvent: false }
      );
    });
    this.getPermission();
    this.getDataSourceDetails(this.currentpage);
    this.getSourceType();
    this.getDBMS();
    this.getDBMSNew();
    this.getDBconnectionDropdownLoad();
    this.datasourcePage(this.currentpage);
    this.form = this.fb.group({
      dbmsnameNew: ['']
    });
    this.formDBConnection.get('dbmscode')?.valueChanges.subscribe(value => {
      if (value === '1') {
        //this.formDBConnection.get('port')?.setValue('1433');
        this.formDBConnection.get('schemaname')?.setValue('dbo');
      } else {
        this.formDBConnection.get('port')?.setValue('');
        this.formDBConnection.get('schemaname')?.setValue('');
      }
    });

  }
  updateHasPassword(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.hasPassword = input.value.length > 0;
    }
  }
  getPermission() {
    this.srvPermission.getPermissions(this.rolecode).subscribe((data: permissionMdlInf[]) => {
      this.permissions = data;
      console.log(data)
      const appPermissions = this.permissions.find(permission => permission.appid.name === this.appName);
      if (appPermissions) {
        console.log(appPermissions);
        this.canSave = appPermissions.read;
        this.canEdit = appPermissions.write;
        this.canDelete = appPermissions.delete;
        console.log(this.canSave, this.canEdit, this.canDelete)
      } else {
        console.log('Permissions not found for app:', this.appName);
      }
    })
  }
  toggleFormVisibility() {
    this.showForm = !this.showForm;
    //window.location.reload();
    setTimeout(() => {
   this.ngOnInit();
    }, 500);
  }
  restrictNonNumeric(event: KeyboardEvent) {
    if (event.key && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  restrictToTenDigits() {
    const inputControl = this.formDataSource.get('technicalcontactmobile');
    if (inputControl?.value && inputControl.value.length > 10) {
      inputControl.setValue(inputControl.value.slice(0, 10));
    }
  }
  openConfirmationModal() {
    this.confirmationModal.open();
  }
  onInputChange(event: any) {
    const portControl = this.formDBConnection.get('port');
    if (portControl) { // Check if portControl is not null
      let newValue = event.target.value.replace(/[^0-9]/g, '');
      newValue = newValue.slice(0, 10);
      portControl.setValue(newValue);
    }
  }
  datasourcePage(page: number) {
    this.srvDataSource.getDataSourceDetailPage(page).subscribe((data: any) => {

      this.totalPages = data.page_count;
      this.currentpage = page;
      if (data) {
        const page_count = data.page_count;
        console.log("Page count:", page_count);
      } else {
        console.log("Data is undefined");
      }
    })
  }
 
  onInputChanges() {
    this.searchSubject.next();
  }
  
  getDataSourceDetails(page: number) {
   
    let ordering = this.currentSortField ? `${this.currentSortOrder}${this.currentSortField}` : null;
    this.spinner.show();
    this.srvDataSource.getDataSourceDetail(page,ordering,this.filterData).subscribe((data: datasourceDetailMdlInfpage) => {
      this.spinner.hide();
      console.log('getDataSourceDetails',data)
      let results = data.results
    
      if (results && results.length > 0) {
       
        this.datasources = results;
        this.totalPages = data.page_count
      console.log('datasources',data)
      }
    }, error => {
      this.spinner.hide();
    }
    );
  }

  getSourceType() {
    this.srvSourcetype.getSourcetype().subscribe(data => {
      this.sourceTypes = data;
    });
  }
  getDBMS() {
    this.srvDBMS.getDBMS().subscribe(data => {
      this.dbms = data;
    });
  }

  getDBMSNew() {
    this.srvDBMSNew.getDBMSNew().subscribe(data => {

      this.dbmsNew = data;
    });
  }

  getDBconnectionDropdownLoad(selectedCode?: number) {
    this.srvValidation.getDBConnectionDetails().subscribe(data => {
      this.DBconnections = data;
      // Create a default row with the constant string value
      const defaultRow: ValidationInf = {
        code: 0,
        dbmscode: null,
        name: '<< New Connection >>',
        connectionstring: null,
        servername: '',
        port: 0,
        authenticationmode: '',
        loginname: '',
        loginpwd: '',
        databasename: '',
        schemaname: '',
        validationflag: false,
        lastvalidationdate: '',
        errormessage: '',
        createdby: '',
        createddate: '',
        modifiedby: '',
        modifieddate: ''
        //connectionerrormesage: ''
      };

      // Add the default row to the array
      this.DBconnections = [defaultRow, ...data];
      if (selectedCode) {
        this.formDataSource.get('dbconnectioncode')?.setValue(selectedCode);
      }
    });
  }


  //select dbconnectivity
  onDbconnectionChange(event: any): void {
    this.editbutton=true;
    this.selectedValue = event.target.value.trim();


    if (this.selectedValue === '0') {
      this.resetFormAndOpenModal();
      this.headingConnection = 'New Database Connection'
    } else {
      this.spinner.show();
      this.srvValidation.getDBConnectionDetailsId(this.selectedValue).subscribe(
        (response: any) => {
          this.selectedValue = response;
          this.spinner.hide();
          console.log(this.selectedValue)
          this.headingConnection = 'Edit Database Connection'
          this.bindFormData();
          this.setValidationData(response.dbmscode, response.loginname, response.loginpwd, response.port, response.name);
          this.formDataSource.get('connectionstring')?.setValue(
            `Server Name=${response.servername}; Port=${response.port};Database Login=${response.loginname};Password=${'*'.repeat(response.loginpwd.length)}; Database Name=${response.databasename}; Schema Name=${response.schemaname}; `,
            { emitEvent: false }
          );

        })
    }
  }
  bindFormData(): void {

    if (this.selectedValue) {
      this.formDataSource.patchValue({
        dbmsname: this.selectedValue.dbmscode.name,
        servername: this.selectedValue.servername,
        databasename: this.selectedValue.databasename,
        schemaname: this.selectedValue.schemaname,
        lastvalidationstatus: this.selectedValue.validationflag ? 'Success' : 'Failed',
        lastvalidationdatetime: this.selectedValue.lastvalidationdate,
      });
    }
  }
  setValidationData(dbmscode: any, loginname: any, loginpwd: any, port: any, name: any): void {
    const dbmsCode = dbmscode ? dbmscode.code : null;
    this.dbmscode = dbmsCode;
    this.loginname = loginname;
    this.loginpwd = loginpwd;
    this.port = port;
    this.name = name;
  }
  resetFormAndOpenModal(): void {
    this.formDBConnection.reset({ dbmscode: 1 });
    const modalElement = document.getElementById('NewConnectionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
   
  }

  updateFormWithDbConnection(selectedDbConnection: any): void {
    this.formDBConnection.patchValue({
      dbmsname: selectedDbConnection.dbmscode,
      servername: selectedDbConnection.servername,
      databasename: selectedDbConnection.databasename,
      schemaname: selectedDbConnection.schemaname,
      connectionstring: selectedDbConnection.connectionstring,
      validationflag: selectedDbConnection.validationflag ? 'Success' : 'Failed',
      lastvalidationdate: selectedDbConnection.lastvalidationdate,
    });
  }


  clearForm() {
    this.formDataSource.reset();
  }
  addNewDatasource() {
    this.headingDatasource = 'Data Source Management - New Data Source'
    this.showForm = true;
    this.editMode = false;
    this.clearForm();
  }

  // edit datasource
  editDatasource(selectedRow: any): void {
    this.showForm = !this.showForm;
    this.editbutton=true;
    this.editedDatasourceId =selectedRow.code;
    this.selectedDataSourceCode = selectedRow.code;

    this.formDataSource.get('connectionstring')?.setValue(
      `Server Name=${selectedRow.dbconnectioncode.servername}; Port=${selectedRow.dbconnectioncode.port};Database Login=${selectedRow.dbconnectioncode.loginname};Password=${'*'.repeat(selectedRow.dbconnectioncode.loginpwd.length)}; Database Name=${selectedRow.dbconnectioncode.databasename}; Schema Name=${selectedRow.dbconnectioncode.schemaname}; `,
      { emitEvent: false }
    );
    this.formDataSource.patchValue({
      code: selectedRow.code,
      name: selectedRow.name,
      dbconnectioncode: selectedRow.dbconnectioncode.code,
      sourcetypecode: selectedRow.sourcetypecode.code,
      technicalcontactemail: selectedRow.technicalcontactemail,
      technicalcontactmobile: selectedRow.technicalcontactmobile,
      technicalcontactname: selectedRow.technicalcontactname,


      dbmsname: selectedRow.dbconnectioncode.dbmscode.name,
      dbmscode: selectedRow.dbconnectioncode.dbmscode.code,
      //connectionstring: selectedRow.dbconnectioncode.connectionstring,
      servername: selectedRow.dbconnectioncode.servername,
      loginname: selectedRow.dbconnectioncode.loginname,
      loginpwd: selectedRow.dbconnectioncode.loginpwd,
      databasename: selectedRow.dbconnectioncode.databasename,
      schemaname: selectedRow.dbconnectioncode.schemaname,
      lastvalidationdatetime: selectedRow.dbconnectioncode.lastvalidationdate,
      lastvalidationstatus: selectedRow.dbconnectioncode.validationflag ? 'Success' : 'Failed',
      errormesage: selectedRow.dbconnectioncode.errormesage

    });

    this.setValidationData(
      selectedRow.dbconnectioncode.dbmscode,
      selectedRow.dbconnectioncode.loginname,
      selectedRow.dbconnectioncode.loginpwd,
      selectedRow.dbconnectioncode.port,
      selectedRow.dbconnectioncode.name
    );

    this.formDBConnection.patchValue({
      dbmsnameNew: selectedRow.dbconnectioncode.dbmscode,
      dbconnectionnameNew: selectedRow.dbconnectioncode.name,
      servernameNew: selectedRow.dbconnectioncode.servername,
      portNew: selectedRow.dbconnectioncode.port,
      loginnameNew: selectedRow.dbconnectioncode.loginname,
      loginpwdNew: selectedRow.dbconnectioncode.loginpwd,
      databasenameNew: selectedRow.dbconnectioncode.databasename,
      schemanameNew: selectedRow.dbconnectioncode.schemaname,
      connectionstringNew: selectedRow.dbconnectioncode.connectionstring,
      lastvalidationdatetimeNew: selectedRow.dbconnectioncode.lastvalidationdate,
      errormesageNew: selectedRow.dbconnectioncode.errormesage
    });

    this.selectedDbconnectionCode = selectedRow.dbconnectioncode.code;
    this.selectedSourceTypeCode = selectedRow.sourcetypecode.code
    this.isEditing = true;
    this.dataSourceName = selectedRow.name;
    this.headingDatasource = `Data Source Management - ${selectedRow.name}`;
  }




  onDbmsChange(e: any) {
    this.selectedDBMSCode = e.code;

  }

  onDbmsNewChange(e: validationDetailCls) {
    this.selectedDBMSCode = e.code;

  }


  toggleFormAndGrid() {

    this.isEditing = true;
  }
  closeFormEdit() {

    this.isEditing = false;
  }

  // save dbconnectivity
  saveDBConnection() {
    this.markFormGroupTouched(this.formDBConnection);
    if (this.canEdit) {
      const formData = this.formDBConnection.getRawValue();
      let validationFlag: boolean;
      const validationFlagString = this.formDBConnection.controls['validationflag'].value;
      validationFlag = validationFlagString === 'Success';
      formData.validationflag = validationFlag;
  
      const password = this.formDBConnection.value.loginpwd;
      console.log('password', password); // Check the password
  
      const isPasswordEncrypted = password.length > 50; 
  
      if (formData.code) {
        if (!isPasswordEncrypted) {
          const payload = {
            Password: password,
            Type: 'E'
          };
  
          this.srvEncrypt.encryptdecrypt(payload).subscribe(
            (response: any) => {
              console.log('Encrypted response:', response);
  
              if (response && response.result) {
                formData.loginpwd = response.result;
                this.updateDBConnection(formData);
              }
            },
            (error) => {
              this.showError1();
            }
          );
        } else {
          this.updateDBConnection(formData);
        }
      } else {
        const payload = {
          Password: password,
          Type: 'E'
        };
  
        this.srvEncrypt.encryptdecrypt(payload).subscribe(
          (response: any) => {
            console.log('Encrypted response:', response);
  
            if (response && response.result) {
              formData.loginpwd = response.result;
              this.addDBConnection(formData);
            }
          },
          (error) => {
            this.showError1();
          }
        );
      }
    } else {
      this.saveButton = false;
    }
  }
  
  updateDBConnection(formData:any) {
    this.srvValidation.updateDBConnection(formData).subscribe(
      (response: any) => {
        this.showUpdateDataDB();
        this.getUpdateSelect(formData.code);
        this.cdr.detectChanges();
      },
      (error) => {
        this.showError1();
      }
    );
  }
  
  addDBConnection(formData:any) {
    this.srvValidation.addDBConnection(formData).subscribe(
      (response: any) => {
        this.getDBconnectionDropdownLoad();
        this.showSuccessDB();
      },
      (error) => {
        this.handleDBConnectionError(error);
      }
    );
  }
  
  handleDBConnectionError(error:any) {
    console.log('error', error.error.error);
    this.errorMessage = error.error.error;
    if (this.errorMessage) {
      this.showDBconnError(this.errorMessage);
    } else {
      this.showDBError();
    }
  }
  


  getUpdateSelect(dbconnectioncode: string) {
    this.srvValidation.getDBConnectionDetails().subscribe((data: any) => {

      this.DBconnections = data;
      const selectedConnection = this.DBconnections.find(connection => connection.code === dbconnectioncode);

      if (selectedConnection) {

        this.formDataSource.patchValue({

          dbmscode: selectedConnection.dbmscode.code,
          dbmsname: selectedConnection.dbmscode.name,
          servername: selectedConnection.servername,
          databasename: selectedConnection.databasename,
          schemaname: selectedConnection.schemaname,
          connectionstring: selectedConnection.connectionstring,
          lastvalidationstatus: selectedConnection.validationflag ? 'Success' : 'Failed',
          lastvalidationdatetime: selectedConnection.lastvalidationdate,
          //dbconnectioncode: selectedConnection.code 
        });
        this.onDbconnectionChanges(selectedConnection.code);

      }
    });
  }
  onDbconnectionChanges(selectedValue: string): void {


    this.srvValidation.getDBConnectionDetailsId(selectedValue).subscribe(
      (response: any) => {
        this.formDataSource.patchValue({
          dbconnectioncode: response.code,

        })

      }
    );
  }

  validateDBConnection(formGroup: FormGroup, isFormDataSource: boolean): void {
    this.spinner.show();
    this.resetValidationFields(formGroup);
    const formData = formGroup.getRawValue();
   // this.dbconnectioncode = formData.dbconnectioncode
    //console.log(this.dbconnectioncode)
    const currentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') || '';

    if (!formData) {
      console.error('Form data is missing.');
      return;
    }
    

    if (isFormDataSource) {
      const dbConnectionControl = formGroup.get('dbconnectioncode');
      this.dbconnectioncode = formGroup.get('dbconnectioncode')?.value;
      console.log('dbConnectionControl',dbConnectionControl)
      if (!dbConnectionControl?.value) {
        dbConnectionControl?.setErrors({ 'required': true });
        dbConnectionControl?.markAsTouched(); // Mark this specific control as touched
        this.spinner.hide();
        return;
      }
      

            const requestDataWithCredentials = {
              ...formData,
              dbmscode: this.dbmscode,
              loginname: this.loginname,
              loginpwd: this.loginpwd,
              port: this.port,
              name: this.name
            };

            formGroup.controls['validationflag'].setValue(null);
            const decryptionPayload = {
              Password: this.loginpwd,
              Type: 'D'
            };
      
            // Decrypt the password
            this.srvEncrypt.encryptdecrypt(decryptionPayload).subscribe(
              (decryptionResponse: any) => {
                console.log('Decrypted response:', decryptionResponse);
      
                if (decryptionResponse && decryptionResponse.result) {
                  // Update the form data with the decrypted password
                  requestDataWithCredentials.loginpwd = decryptionResponse.result;

            // Make API call with requestDataWithCredentials
            this.srvValidation.validateDBConnection(requestDataWithCredentials).subscribe(
              (response: any) => {
                this.updateFormControls(formGroup, response.valid, response.error, currentDateTime);
                this.spinner.hide();
              },
              (error: any) => {
                console.error('Validation error:', error);
                this.spinner.hide();
              }
            );
          } else {
            console.error('Failed to decrypt the password.');
            this.spinner.hide();
          }
        },
        (error: any) => {
          console.error('Decryption error:', error);
          this.spinner.hide();
        }
      );
    } else  {
      if (!formData.code) {

      this.srvValidation.validateDBConnection(formData).subscribe({
          next: (validationResult: any) => {
              this.updateFormControls(formGroup, validationResult.valid, validationResult.error, currentDateTime);
              this.spinner.hide();
          },
          error: (error: any) => {
              console.error('Validation error:', error);
              this.spinner.hide();
          }
      });
  } else {
      const password = formData.loginpwd;
     console.log('code', formData.code);    
      console.log('password:', password); 
      const payload = {
        Password: password,
        Type: 'D'
      };
  
      this.srvEncrypt.encryptdecrypt(payload).subscribe(
        (response: any) => {
          console.log('Encrypted response:', response);
  
          if (response && response.result) {
            // Update the form data with the encrypted password
            formData.loginpwd = response.result;
             
     
      this.srvValidation.validateDBConnection(formData).subscribe({
        next: (validationResult: any) => {
          this.updateFormControls(formGroup, validationResult.valid, validationResult.error, currentDateTime);
          this.spinner.hide();
        }
      });
    }
  });
  }
    }
  }

  resetValidationFields(formGroup: FormGroup): void {
    formGroup.controls['validationflag'].setValue(null);

  }
  updateFormControls(formGroup: FormGroup, isValid: boolean, errorMessage: string, currentDateTime: string): void {
    if (formGroup === this.formDBConnection) {

      const validationStatus = isValid ? 'Success' : 'Failed';
      formGroup.controls['validationflag'].setValue(validationStatus);
      formGroup.controls['lastvalidationdate'].setValue(currentDateTime);
      formGroup.controls['errormesage'].setValue(errorMessage);
    } else if (formGroup === this.formDataSource) {
      formGroup.controls['lastvalidationstatus'].setValue(isValid ? 'Success' : 'Failed');
      formGroup.controls['lastvalidationdatetime'].setValue(currentDateTime);
      formGroup.controls['errormesage'].setValue(errorMessage || '');

      const data = {
        Status: isValid,
        LastUpdated: currentDateTime,
        DBConnectionCode: this.dbconnectioncode
      }
      console.log('DBConnectionCode',this.dbconnectioncode)
      this.srvDataSource.postStatusUpdate(data).subscribe(
        response => {
          console.log(response);
        }
      )

    }

  }

  closeModal() { }

  //dbconnectivity edit
  editDbConnection(): void {
    const selectedDbConnectionCode = this.formDataSource.get('dbconnectioncode')?.value;
let selectedDbConnectionvalue;
    for (let i = 0; i < this.DBconnections.length; i++) {
      const dbConnection = this.DBconnections[i];
      if (selectedDbConnectionCode == dbConnection.code) {
        selectedDbConnectionvalue = dbConnection;
       
        break;
      }
     }
    const modalElement = document.getElementById('NewConnectionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    // Check if the selected database connection is found
    if (selectedDbConnectionvalue) {
      // Update the formDBConnection with the selected database connection details
      this.formDBConnection.patchValue({
        code: selectedDbConnectionvalue.code,
        dbmscode: selectedDbConnectionvalue.dbmscode.code,
        servername: selectedDbConnectionvalue.servername,
        loginname: selectedDbConnectionvalue.loginname,
        databasename: selectedDbConnectionvalue.databasename,
        name: selectedDbConnectionvalue.name,
        port: selectedDbConnectionvalue.port,
        loginpwd: selectedDbConnectionvalue.loginpwd,
        schemaname: selectedDbConnectionvalue.schemaname,
        connectionstring: selectedDbConnectionvalue.connectionstring,
        validationflag: selectedDbConnectionvalue.validationflag ? 'success' : 'Failed',
        lastvalidationdate: selectedDbConnectionvalue.lastvalidationdate,
        errormesage: selectedDbConnectionvalue.errormessage
      });

    }

  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // save datasource
  saveAllData() {
    this.markFormGroupTouched(this.formDataSource);
    if (this.canEdit) {
      const code = this.formDataSource.get('code')?.value;
      const name = this.formDataSource.get('name')?.value;
      const technicalContactEmail = this.formDataSource.get('technicalcontactemail')?.value;
      const technicalContactMobile = this.formDataSource.get('technicalcontactmobile')?.value;
      const technicalContactName = this.formDataSource.get('technicalcontactname')?.value;
      const dbConnectionCode = this.formDataSource.get('dbconnectioncode')?.value;
      const sourceTypeCode = this.formDataSource.get('sourcetypecode')?.value;



      if (name && technicalContactEmail && technicalContactMobile &&
        technicalContactName && dbConnectionCode && sourceTypeCode) {
        const formDataToSave = {
          code: code || null, // Allow null value for code
          name: name,
          technicalcontactemail: technicalContactEmail,
          technicalcontactmobile: technicalContactMobile,
          technicalcontactname: technicalContactName,
          dbconnectioncode: dbConnectionCode,
          sourcetypecode: sourceTypeCode
        };
        if (code !== null) {
          this.updateDataSource(formDataToSave);
        } else {

          this.addDataSource(formDataToSave);
        //  this.showDataduplicate();
        }
        this.editedDatasourceId = formDataToSave.code;
       
        //this.toggleFormVisibility();
      } else {
        this.markFormGroupTouched(this.formDataSource);
        this.showFormFill();
      }
    } else {
      this.saveButton = false;
    }

  }
  addDataSource(formData: any) {
    this.srvDataSource.addDataSource(formData)
      .subscribe(
        (response) => {
          // alert('Data saved successfully');
          this.formDataSource.patchValue({ code: response.code });
          this.showSuccess();
        },
        (error) => {
          console.log('error',error.error.error)
          this.errorMessage = error.error.error;
          if (this.errorMessage){
          this.showDataduplicate(this.errorMessage);
          }else{
            this.showError();
          }
        }
      );
  }

  updateDataSource(formData: any) {
    this.srvDataSource.updateDataSource(formData)
      .subscribe(
        (response) => {

          this.showUpdateData();
        },
        (error) => {

          this.showError();

        }
      );
  }
  //delete table row


  deleteGridRow(selectedRow: any) {
    if (this.canDelete) {
      this.selectedRow = selectedRow;
     
      if (this.confirmationModal) {
        this.confirmationModal.open();
      }else {
        console.error('Confirmation modal is not available');
      }
    } else {
      this.deleteButton = false;
    }
  }
 onConfirm() {
     if (this.selectedRow) {
      this.srvDataSource.deleteDataSource(this.selectedRow.code).subscribe(() => {
        this.datasources = this.datasources.filter((row) => row.code !== this.selectedRow.code);
        this.confirmationModal.close(); 
        this.successModal.open();
        setTimeout(() => { 
          this.cdr.detectChanges();
          this.successModal.close();
         // this.showDelete();
        }, 5000);
        });
        
    }
   
  }
  onCancelDelete() {
    console.log('Deletion canceled');
  }
  clear() {
    this.formDataSource.reset();
  }

  //sorting
  visible:boolean=false;
  sortColumn: string = '';
  sortAscending: boolean = true;
  sortTable(field: string): void {  // add function
    console.log('field',field)
    console.log('inside sort')
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
    this.getDataSourceDetails(this.currentpage);
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

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('loginpwd') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }
  //toastr
  showSuccess() {
    this.toast.success({ detail: "Data Source", summary: 'Data Saved Successfully', duration: 5000, position: 'topLeft' });
  }


  showError() {
    this.toast.error({ detail: "Data Source", summary: 'Not Saved !', duration: 5000, position: 'topLeft' });
  }
  showError1() {
    this.toast.error({ detail: "DB connection not updated ", duration: 5000, position: 'topLeft' });
  }
  showDBError() {
    this.toast.error({ detail: "DB connection", summary: 'Not Saved !', duration: 5000, position: 'topLeft' });
  }
  showDBconnError(errorMsg: string) {
    this.toast.error({ detail: errorMsg, duration: 5000, position: 'topLeft' });
  }
  showUpdateData() {
    this.toast.success({ detail: "Data Source", summary: 'Data Updated Successfully', duration: 5000, position: 'topLeft' });
  }
  showUpdateDataDB() {
    this.toast.success({ detail: "DB Connection", summary: 'Data Updated Successfully', duration: 5000, position: 'topLeft' });
  }

  showDelete() {
    console.log('showing')
    this.toast.success({ detail: "Data Source", summary: 'Data Source record deleted successfully !', duration: 5000, position: 'topLeft' });
  }
  showDatasave() {
    this.toast.success({ detail: "Data Source", summary: 'Data Saved Successfully', duration: 5000, position: 'topLeft' });
  }
  showSuccessDB() {
    this.toast.success({ detail: "DB Connection", summary: 'Saved Successfully !', duration: 5000, position: 'topLeft' });
  }
  showFormFill() {
    this.toast.error({ detail: "please fill the required form field", duration: 5000, position: 'topLeft' });

  }
  showDataduplicate(errorMsg: string) {
    this.toast.error({ detail: errorMsg, duration: 5000, position: 'topLeft' });

  }
  onPageChange(page: number): void {
    this.currentpage = page;
    this.getDataSourceDetails(this.currentpage);
    //this.datasourcePage(this.currentpage);
  }
}