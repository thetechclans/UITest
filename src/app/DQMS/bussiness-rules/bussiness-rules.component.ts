import { Component, OnInit, Directive, HostListener, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DqruleService } from 'src/app/services/dqrule.service';
import { dqRuleMdlInfpage, dqruleDetailCls, dqruleDetailMdl, dqruleInf } from 'src/app/Models/dqrule';
import { DqcategoryService } from 'src/app/services/dqcategory.service';
import { DqstatusService } from 'src/app/services/dqstatus.service';
import { PriorityService } from 'src/app/services/priority.service';
import { priorityMdlInf } from 'src/app/Models/priority';
import { statusMdlInf } from 'src/app/Models/dqstatus';
import { categoryMdlInf } from 'src/app/Models/dqcategory';
import { dqdomainMdlInf } from 'src/app/Models/dqdomain';
import { DqdomainService } from 'src/app/services/dqdomain.service';
import { BusinesssystemService } from 'src/app/services/businesssystem.service';
import { businesssytemMdl } from 'src/app/Models/business';
import { datasourceMdlInf } from 'src/app/Models/datasource';
import { DatasourceService } from 'src/app/services/datasource.service';
import { SettingService } from 'src/app/services/setting.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, filter, takeUntil } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { Editor, Toolbar } from 'ngx-editor';
import { settingMdlInf } from 'src/app/Models/setting';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { permissionMdlInf } from 'src/app/Models/permission';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from 'src/app/services/roles.service';
import { GetroleService } from 'src/app/services/getrole.service';
import { getRoleMdlInf } from 'src/app/Models/getrole';
import { ConfirmationModalComponent } from 'src/app/DQMS/confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-bussiness-rules',
  templateUrl: './bussiness-rules.component.html',
  styleUrls: ['./bussiness-rules.component.scss']
})
export class BussinessRulesComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationModal', { static: true })
  confirmationModal!: ConfirmationModalComponent;
  @ViewChild('successModal', { static: true })
  successModal!: ConfirmationModalComponent;
  showForm = false;
  form!: FormGroup;
  selectedRuleDetail: any;
  dqrules: dqruleInf[] = [];
  domainid: any[] = [];
  dqrulesdetail: dqruleDetailMdl[] = [];
  category: categoryMdlInf[] = [];
  priority: priorityMdlInf[] = [];
  status: statusMdlInf[] = [];
  domains: dqdomainMdlInf[] = [];
  business: businesssytemMdl[] = [];
  datasources: datasourceMdlInf[] = [];
  permissions: permissionMdlInf[] = [];
  dqruledetail: dqruleDetailCls = new dqruleDetailCls;
  isStatusDisabled: boolean = false;
  filterData: string = '';
  editparam: string = '';
  selectedCode: any;
  overallvalidationflag: any;
  selectedStatusName: string | undefined;
  selectedStatusCode: any;
  headingText: string = 'Bussiness Rules Management';
  lastUpdatedRuleno!: string;
  loggedInUser: string | null;
  rolecode: any;
  nextRuleNumber: string | null = null;
  showThresholdField: boolean = false;
  showResolutionDateField: boolean = false;
  appName: string = '';
  editor!: Editor;
  canSave: boolean = false;
  canClear: boolean = false;
  canDelete: boolean = false;
  canEdit: boolean = false;
  canAdd: boolean = false;
  roles: getRoleMdlInf[] = [];
  ruleEditor: Editor = new Editor();
  businessEditor: Editor = new Editor();
  editorHeight: number = 200;
  patternNumber: number = 1;
  currentpage: number = 1;
  pages: dqRuleMdlInfpage[] = [];
  totalPages: number = 0;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  @ViewChild('pagination')
  pagination!: ElementRef;
  elementRef: any;
  renderer: any;
  currentSortField: string = '';
  currentSortOrder: string = '';
  private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();
  editedBusinessId: number | null = null;
  constructor(private srvdqrule: DqruleService, private formBuilder: FormBuilder, private srvdqpriority: PriorityService,
    private srvdqstatus: DqstatusService, private srvcategory: DqcategoryService, private srvdqdomain: DqdomainService,
    private srvbusiness: BusinesssystemService, private cdr: ChangeDetectorRef, private toastr: ToastrService, private datePipe: DatePipe,
    private el: ElementRef, private srvdatasource: DatasourceService, private spinner: NgxSpinnerService, private toast: NgToastService,
    private srvSetting: SettingService, private auth: AuthService, private srvPermission: ApppermissionService, private router: Router,
    private route: ActivatedRoute, private srvrole: GetroleService) {
    this.loggedInUser = this.auth.getLoggedInUser();
    this.rolecode = this.auth.getRolecode();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }


  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      this.appName = urlSegments[urlSegments.length - 1].path;
    })
    this.searchSubject.pipe(
      debounceTime(3000),
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.getDqruleDetail(this.currentpage);
    });
    this.getPermission();
    this.editor = new Editor();
    this.initform();
    this.getDqrule();
    this.getDqruleDetail(this.currentpage);
    this.getRoles();
    this.getBusiness();
    this.getDqcategory();
    this.getDqdomain();
    this.getDqpriority();
    this.getDqstatus();
    this.getDatasource();
    this.getDqRulePage(this.currentpage);
    this.form.get('categorycode')?.valueChanges.subscribe(value => {
      this.onCategoryChange(value);
    });
  }
  ngAfterViewInit() {
    console.log('confirmationModal after view init', this.confirmationModal);
    console.log('successModal after view init', this.successModal);
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
  getRoles() {
    this.srvrole.getRole(2).subscribe((data: getRoleMdlInf[]) => {
      this.roles = data
    })
  }


  /*if (data && data.length > 0) {
    data.forEach(permission => {
      const appName = permission.appid.name;
      if (this.router.url.includes(appName)) {
        console.log('URL matches with appName:', appName);
        this.canSave = data.some(permission => permission.write);
        matchFound = true;
      } else {
        console.log('URL does not match with appName:', appName);
      }
    });
  } */


  getDqrule() {
    this.srvdqrule.getDQRule().subscribe(data => {
      if (data && data.length > 0) {
        this.dqrules = data
        data.sort((a, b) => {
          return new Date(b.rulecreateddate).getTime() - new Date(a.rulecreateddate).getTime();
        });
        this.lastUpdatedRuleno = data[0].ruleno;
        console.log("Ruleno from last updated data:", this.lastUpdatedRuleno);
        this.nextRuleNumber = this.generateNextRuleNumber1();
        console.log("Next rule number:", this.nextRuleNumber);

      } else {
        this.getOrganisation()
      }
    })
  }
  getOrganisation() {
    this.srvSetting.getOrganisation().subscribe(data => {
      const prefix = data[0].prefixtext
      console.log(prefix);
      this.nextRuleNumber = this.generateNextRuleNumber(prefix, 1);
      console.log("Next rule number:", this.nextRuleNumber);
    })
  }
  getDqRulePage(page: number) {
    this.srvdqrule.getDqRuleDetailPage(page).subscribe((data: any) => {

      console.log("page", data);
      this.totalPages = data.page_count;
      this.currentpage = page;
      if (data) {
        const page_count = data.page_count;
        console.log("Page count:", data.page_count);
      } else {
        console.log("Data is undefined");
      }
    })
  }
  /*getPageNumbers(): (number | string)[] {
    const pageNumbers = [];
    const maxPagesToShow = 8; 
    const totalPages = this.totalPages; 
   if (totalPages <= maxPagesToShow) {
      
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const currentPage = this.currentpage;
      const firstPage = Math.max(1, currentPage - 4); 
      const lastPage = Math.min(totalPages, firstPage + maxPagesToShow - 1)
      if (firstPage > 1) {
        pageNumbers.push('...');
      }
      for (let i = firstPage; i <= lastPage; i++) {
        pageNumbers.push(i);
      }
      if (lastPage < totalPages) {
        pageNumbers.push('...');
      }
    }
  
    return pageNumbers;
  }
   loadPage(page: number | string): void {
      if (typeof page === 'number') {
        this.currentpage = page; 
        this.getDqruleDetail(this.currentpage);
      } else if (page === 'previous') {
        if (this.currentpage > 1) {
          this.currentpage--; 
          this.getDqruleDetail(this.currentpage);
        }
      } else if (page === 'next') {
        this.currentpage++;
        this.getDqruleDetail(this.currentpage);
      }
  }*/
  onInputChanges() {
    this.searchSubject.next();
  }
  getDqruleDetail(page: number) {
    let ordering = this.currentSortField ? `${this.currentSortOrder}${this.currentSortField}` : null;
    this.spinner.show();
    this.srvdqrule.getDQRuleDetailCurrent(page, ordering, this.filterData).subscribe(data => {
      this.spinner.hide();
      console.log('data', data)
      let results = data.results
      //this.dqrulesdetail = data;
      // Check if there are records
      if (results && results.length > 0) {
        this.dqrulesdetail = results;
        this.totalPages = data.page_count
      }
    }, error => {
      this.spinner.hide();
    });
  }

  getDqcategory() {
    this.srvcategory.getcategory().subscribe(data => {
      this.category = data;
    })
  }
  getDqstatus(): void {
    /* this.srvdqstatus.getStatus().subscribe(data=>{
       this.status = data;
       const defaultStatusName = this. getDefaultStatusName();
       const defaultStatusCode = this.status.find(data => data.name === defaultStatusName)?.name;
       this.form.get('statuscode')!.setValue(defaultStatusCode);
       this.selectedStatusName = defaultStatusName;
      })*/
    this.srvdqstatus.getStatus().subscribe(data => {
      this.status = data;
      const defaultStatusName = this.getDefaultStatusName();
      const defaultStatus = this.status.find(data => data.name === defaultStatusName);
      if (defaultStatus) {
        this.form.get('statuscode')!.setValue(defaultStatus.name); // Set the code instead of the name
        this.selectedStatusCode = defaultStatus.code;
        this.selectedStatusName = defaultStatusName;
      }
    });
  }
  getDqpriority() {
    this.srvdqpriority.getPriority().subscribe(data => {
      this.priority = data;
    })
  }
  getDqdomain() {
    this.srvdqdomain.getDqdomain().subscribe(data => {
      this.domains = data;
    })
  }
  getBusiness() {
    this.srvbusiness.getBusinesssystem().subscribe(data => {
      this.business = data;
    })
  }
  getDatasource() {
    this.srvdatasource.getDataSource().subscribe(data => {
      this.datasources = data;

    })
  }
  getDefaultStatusName(): string {

    return "Business Rule Defined";

  }
  addNewBusinessRule() {

    this.form.patchValue({
      ruleno: this.nextRuleNumber,
    });

    this.form.get('ruleno')?.disable();
    this.headingText = 'Add New Business Rule';
    this.showThresholdField = true;
    this.showForm = !this.showForm;
    this.getDqstatus();
    this.form.patchValue({
      readyforprofiling: 'No',
    });
  }



  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  initform() {
    this.form = this.formBuilder.group({
      code: [''],
      ruleno: [{ value: '', disabled: true }, Validators.required],
      dataelement: ['', Validators.required],
      prioritycode: ['', Validators.required],
      categorycode: ['', Validators.required],
      dqthresholdpercentage: ['', Validators.required],
      // datasourcecode: ['',Validators.required],
      ruledefinition: ['', Validators.required],
      dqbusinesscriteria: [''],
      businesssystemcode: ['', Validators.required],
      businessstewardname: ['', Validators.required],
      dqdomaincode: ['', Validators.required],
      description: [{ value: '', disabled: true }],
      //dbconnectioncode:[''],
      statuscode: [{ value: '', disabled: true }, Validators.required],
      rulecreateddate: [this.getCurrentDate(), Validators.required],
      readyforprofiling: [{ value: '', disabled: true }, Validators.required],
      targetresolutiondate: ['', Validators.required]
    })
    /*  this.srvdqrule.getDQRuleDetail().subscribe((data:any) =>{
       this.form.patchValue(data);
       if (data.overallvalidationflag === true) {
         this.form.get('statuscode')!.setValue(2); // Assuming statuscode is the control for DQ Rule Status
         this.form.get('readyforprofiling')!.setValue('Yes');
       } 
       this.form.patchValue({
         statuscode: this.form.get('statuscode')!.value,
         readyforprofiling: this.form.get('readyforprofiling')!.value
       });
      }
      )*/

  }


  onDataSourceCode(datasource: Event) {
    const selectedDataSourceCode = (datasource.target as HTMLSelectElement).value;
    const selecteddatasource: datasourceMdlInf = {
      code: selectedDataSourceCode,
      name: '',
      technicalcontactemail: '',
      technicalcontactmobile: '',
      technicalcontactname: '',
      dbconnectioncode: null,
      sourcetypecode: null
    }

    this.srvdatasource.getDataSourceId(selecteddatasource).subscribe(
      (response: any) => {
        if (response && response.dbconnectioncode) {
          this.form.patchValue({ dbconnectioncode: response.dbconnectioncode });
        }

      })
  }
  onCategoryChange(category: Event) {
    const selectedIndex = (category.target as HTMLSelectElement).selectedIndex;
    const categoryName = (category.target as HTMLSelectElement).options[selectedIndex].text;

    const thresholdControl = this.form.get('dqthresholdpercentage');
    const resolutionDateControl = this.form.get('targetresolutiondate');


    if (categoryName === 'Data Cleansing') {
      this.showThresholdField = true;
      this.showResolutionDateField = false;
      thresholdControl?.setValidators([Validators.required]);
      resolutionDateControl?.clearValidators();
      //this.form.controls['targetresolutiondate'].setValue('');

    } else if (categoryName === 'Data Issue') {
      this.showThresholdField = false;
      this.showResolutionDateField = true;
      resolutionDateControl?.setValidators([Validators.required]);
      thresholdControl?.clearValidators();
      //this.form.controls['dqthresholdpercentage'].setValue('');
    }

    thresholdControl?.updateValueAndValidity();
    resolutionDateControl?.updateValueAndValidity();
    /*switch (categoryName) {
      case 'Data Cleansing':
        this.showThresholdField = true;
        this.showResolutionDateField = false;
       
        this.form.controls['targetresolutiondate'].clearValidators();
        this.form.controls['targetresolutiondate'].updateValueAndValidity();
        break;
      case 'Data Issue':
        this.showThresholdField = false;
        this.showResolutionDateField = true;
        this.form.controls['dqthresholdpercentage'].clearValidators();
        this.form.controls['dqthresholdpercentage'].updateValueAndValidity();
       
        break;
      default:
        this.showThresholdField = false;
        this.showResolutionDateField = false;
        this.form.controls['dqthresholdpercentage'].clearValidators();
        this.form.controls['dqthresholdpercentage'].updateValueAndValidity();
        this.form.controls['targetresolutiondate'].clearValidators();
        this.form.controls['targetresolutiondate'].updateValueAndValidity();
        break; 
    }*/
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  saveBusinessRule() {
    this.markFormGroupTouched(this.form)
    if (this.canEdit) {
      if (!this.showThresholdField) {
        this.form.get('dqthresholdpercentage')?.clearValidators();
        this.form.get('dqthresholdpercentage')?.updateValueAndValidity();
      }
      if (!this.showResolutionDateField) {
        this.form.get('targetresolutiondate')?.clearValidators();
        this.form.get('targetresolutiondate')?.updateValueAndValidity();
      }
      if (this.form.valid /*&&(this.showThresholdField && this.form.get('dqthresholdpercentage')?.valid) || 
(this.showResolutionDateField && this.form.get('targetresolutiondate')?.valid)*/) {
        const formData = this.form.value;

        // Ensure the statusCode is updated
        formData.statuscode = this.selectedStatusCode;
        if (formData.code) {
          const resolutionDateControl = this.form.get('targetresolutiondate');
          if (!resolutionDateControl || !this.showResolutionDateField || !resolutionDateControl.value) {
            formData.targetresolutiondate = null;
          }

          this.srvdqrule.updateDQRule(formData).subscribe(
            response => {
              this.showUpdate();
            },
            error => {
              this.showNOtupdate();
            }
          );
        } else {
          const resolutionDateControl = this.form.get('targetresolutiondate');
          if (!resolutionDateControl || !this.showResolutionDateField || !resolutionDateControl.value) {
            formData.targetresolutiondate = null; // Set to null if not visible or not entered
          }
          formData.ruleno = this.nextRuleNumber;
          this.srvdqrule.addDQRule(formData).subscribe(
            response => {
              this.showSuccess();
              this.form.patchValue({ code: response.code });

              // this.form.patchValue({ ruleno: 'DQ' + this.padNumber(this.patternNumber, 4) });
            },
            error => {

              this.showError();
            }
          );
        }
        this.editedBusinessId = formData.code;
      } else {
        this.showInvalid(); // Display validation error message
      }
    } else {
      this.showSuccessP();
      console.log('User does not have write permission for app:', this.appName);
    }
  }

  formatDate(date: any): string {
    // Format the date as per the server's expected format (YYYY-MM-DDThh:mm:ss)
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  resetForm() {
    this.form.reset();
    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.form.get('statuscode')?.setValue('Business Rule Defined');
    this.form.get('rulecreateddate')?.setValue(currentDate);
    this.form.get('readyforprofiling')?.setValue('No'); // Assuming readyforprofiling is a boolean
  }
  onDomainCodeChange(event: Event): void {
    const selectedCode = (event.target as HTMLSelectElement).value;
    const selectedDomain: dqdomainMdlInf = { code: selectedCode, name: '', description: '' };

    this.srvdqdomain.getDqdomainId(selectedDomain).subscribe(
      (response: any) => {
        if (response) {
          this.form.patchValue({ description: response.description || 'No description available' });
        } else {
          this.form.patchValue({ description: 'No description available' });
        }
      },
      (error) => {
        this.form.patchValue({ description: 'Failed to fetch domain details' });
      }
    );
  }
  editBusinessRule(dqruledetail: any) {
    this.selectedRuleDetail = dqruledetail;
    this.selectedRuleDetail.readyforprofiling = dqruledetail.overallvalidationflag ? 'Yes' : 'No';
    if (this.selectedRuleDetail.categorycode.code === 1) {
      this.showResolutionDateField = false;
      this.showThresholdField = true;
    } else {
      this.showResolutionDateField = true;
      this.showThresholdField = false;
    }
    const targetResolutionDate = dqruledetail.targetresolutiondate ? dqruledetail.targetresolutiondate.split('T')[0] : '';
    /*this.srvdqstatus.getStatus().subscribe((statusOptions: any[]) => {
      
      const technicalStatusOption = statusOptions.find(option => option.name === 'Technical Rule Definition');
      if (technicalStatusOption && dqruledetail.overallvalidationflag) {
        // If overallvalidationflag is true, set statuscode to code 2 (Technical Rule Definition)
        this.form.get('statuscode')!.setValue(technicalStatusOption.name);
      } else {
        // Otherwise, set statuscode to code 1 (Business Rule Definition)
        this.form.get('statuscode')!.setValue('Business Rule Definition');
      }
    });*/
    this.showForm = !this.showForm;
    this.form.patchValue({
      code: dqruledetail.code,
      ruleno: dqruledetail.ruleno,
      dataelement: dqruledetail.dataelement,
      prioritycode: dqruledetail.prioritycode.code,
      categorycode: dqruledetail.categorycode.code,
      dqthresholdpercentage: dqruledetail.dqthresholdpercentage,
      //datasourcecode: dqruledetail.datasourcecode.code,
      ruledefinition: dqruledetail.ruledefinition,
      dqbusinesscriteria: dqruledetail.dqbusinesscriteria,
      businesssystemcode: dqruledetail.businesssystemcode.code,
      businessstewardname: dqruledetail.businessstewardname,
      dqdomaincode: dqruledetail.dqdomaincode.code,
      description: dqruledetail.dqdomaincode.description,
      // dbconnectioncode:dqruledetail.dbconnectioncode.code,
      statuscode: dqruledetail.statuscode.name,
      rulecreateddate: dqruledetail.rulecreateddate,
      readyforprofiling: dqruledetail.overallvalidationflag ? 'Yes' : 'No',
      targetresolutiondate: targetResolutionDate

    });
    this.editedBusinessId = dqruledetail.code;
    this.headingText = `Edit Rule No: ${dqruledetail.ruleno}`;
    this.cdr.detectChanges();
  }
  close() {
    //window.location.reload();
    this.showForm = false;
    this.ngOnInit();
  }
  clear() {
    this.form.patchValue({
      ruledefinition: '',
      dqbusinesscriteria: ''
    });
  }

  deleteBusinessRule(dqruledetail: any) {
    //const confirmation = confirm('Are you sure you want to delete this BusinessRule  ');
    if (this.canDelete) {
      this.dqruledetail = dqruledetail
      console.log('confirmationModal', this.confirmationModal)
      if (this.confirmationModal) {
        this.confirmationModal.open();
      } else {
        console.error('Confirmation modal is not available');
      }
    } else {
      this.showDeleteP();
    }
  }
  onConfirm() {
    if (this.dqruledetail) {
      this.srvdqrule.deleteDQRule(this.dqruledetail.code).subscribe(() => {
        this.dqrulesdetail = this.dqrulesdetail.filter((row) => row.code !== this.dqruledetail.code);
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
  onCancelDelete() { }
  //sorting
  visible: boolean = false;
  sortColumn: string = '';
  sortAscending: boolean = true;
  sortTable(field: string): void {
    console.log('field', field)
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
    this.getDqruleDetail(this.currentpage);
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



  //toast
  showSuccess() {
    this.toast.success({ detail: "Bussiness Rule", summary: ' Data Saved Succesfully !', duration: 5000, position: 'topLeft' });
  }

  showError() {
    this.toast.error({ detail: "Bussiness Rule", summary: ' Not Saved!', duration: 5000, position: 'topLeft' });
  }
  showDelete() {
    this.toast.success({ detail: "Bussiness Rule", summary: ' Deleted successfully!', duration: 5000, position: 'topLeft' });
  }

  showUpdate() {
    this.toast.success({ detail: "Bussiness Rule", summary: ' Data Updated Succesfully !', duration: 5000, position: 'topLeft' });
  }
  showNOtupdate() {
    this.toast.error({ detail: "Bussiness Rule", summary: ' Data not update!', duration: 5000, position: 'topLeft' });
  }
  showInvalid() {
    this.toast.error({ detail: 'Not Saved!', summary: 'Form is invalid. Please fill in all required fields.', duration: 5000, position: 'topLeft' });
  }
  showDeleteP() {
    this.toast.error({ detail: "Does not have delete permission", duration: 5000, position: 'topLeft' });
  }
  showSuccessP() {
    this.toast.error({ detail: "Does not have save and edit permission", duration: 5000, position: 'topLeft' });
  }
  generateNextRuleNumber(prefix = '', startNumber = 1) {
    // If prefix is not provided, try to get it from lastUpdatedRuleno
    if (!prefix && this.lastUpdatedRuleno) {
      prefix = this.lastUpdatedRuleno.match(/[a-zA-Z]+/)?.[0] || '';
    }

    const nextRuleNumber = prefix + String(startNumber).padStart(4, '0');

    return nextRuleNumber;
  }
  generateNextRuleNumber1() {

    const lastNumber = parseInt(this.lastUpdatedRuleno.match(/\d+/)?.[0] || '');

    const prefix = this.lastUpdatedRuleno.match(/[a-zA-Z]+/)?.[0];

    const nextNumber = lastNumber + 1;

    const paddedNextNumber = String(nextNumber).padStart(4, '0');

    const nextRuleNumber = prefix + paddedNextNumber;

    return nextRuleNumber;
  }
  onPageChange(page: number): void {
    this.currentpage = page;
    this.getDqruleDetail(this.currentpage);
  }
}
