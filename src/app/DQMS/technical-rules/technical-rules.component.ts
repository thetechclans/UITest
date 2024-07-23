import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DqruleService } from 'src/app/services/dqrule.service';
import { dqruleInf, dqruleCls, dqruleDetailMdl, dqruleDetailCls, dqrulevaliddatavalidateqryMdlCls, dqruleinvaliddatavalidateqryMdlCls, dqruletotaldatavalidateqryMdlCls, profileTypeInf, dqRuleMdlInfpage } from 'src/app/Models/dqrule';
import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { DatasourceService } from 'src/app/services/datasource.service';
import { datasourceMdlInf } from 'src/app/Models/datasource';
import { NgxSpinnerService } from "ngx-spinner";
import { Editor, Toolbar } from 'ngx-editor';
import { DqdomainService } from 'src/app/services/dqdomain.service';
import { dqdomainMdlInf } from 'src/app/Models/dqdomain';
import { ProfiletypeService } from 'src/app/services/profiletype.service';
import { NgToastService } from 'ng-angular-popup';
import { timer } from 'rxjs';
import { permissionMdlInf } from 'src/app/Models/permission';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GetroleService } from 'src/app/services/getrole.service';
import { getRoleMdlInf } from 'src/app/Models/getrole';
@Component({
  selector: 'app-technical-rules',
  templateUrl: './technical-rules.component.html',
  styleUrls: ['./technical-rules.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TechnicalRulesComponent implements OnInit, OnDestroy {
  editor!: Editor;
  editor_ruledefinition = new Editor();
  editor_dqbusinesscriteria = new Editor();
  showThresholdField: boolean = false;
  showResolutionDateField: boolean = false;
  profileType!: 1;
  isCustom: boolean = true;
  canSave:boolean = false;
  canClear:boolean =false;
  canDelete:boolean =false;
  canEdit:boolean = false;
  saveButton:boolean=false;
  appName: string = '';
  editparam:string ='';
 permissions:permissionMdlInf[]=[];
 rolecode:any;
 private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();
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

  // form = new FormGroup({
  //   editorContent: new FormControl('', Validators.required()),
  // });
  tables: any[] = [];
  dqrule:dqruleInf[]=[];
  dqrules: dqruleDetailMdl[] = []; //Assign this varaiable to Grid loop
  dqruleCls: dqruleCls = new dqruleCls(); //for Dqrule validate
  dqruleDetailCls: dqruleDetailCls= new dqruleDetailCls();
  datasources: datasourceMdlInf[] = [];
  domains: dqdomainMdlInf[] = [];
  profiletypes: profileTypeInf[]=[];
  profileForm!: FormGroup;
  dqrulevaliddatavalidateqryCls: dqrulevaliddatavalidateqryMdlCls = new dqrulevaliddatavalidateqryMdlCls()
  dqruleinvaliddatavalidateqryCls: dqruleinvaliddatavalidateqryMdlCls = new dqruleinvaliddatavalidateqryMdlCls()
  dqruletotaldatavalidateqryCls: dqruletotaldatavalidateqryMdlCls = new dqruletotaldatavalidateqryMdlCls()

  selectedDqruleCode: number = 0;
  showForm = false;
  isDisabled = true;
  isValid = false;
  isTotalValidated: string;
  filterData: string = '';
  selectedTableName: string | null = null;
  TableName: string | null = null;
  selectedColumnName: string | null = null;
  selectedPrimaryKey: string | null = null;
    
  currentSortField: string = ''; 
  currentSortOrder: string = '';
  formDqRule = new FormGroup({
    code: new FormControl({ value: '', disabled: true }),
    editorContent: new FormControl('', Validators.required),
    ruleno: new FormControl({ value: '', disabled: true }),
    dbconnectioncode: new FormControl({ value: '', disabled: true }),
    datasourcecode: new FormControl({ value: '', disabled: false }, Validators.required),
    dataelement: new FormControl({ value: '', disabled: true }),
    datastewardname: new FormControl({ value: '', disabled: false }, Validators.required),
    dqdomainname: new FormControl({ value: '', disabled: true }),
    dqthresholdpercentage: new FormControl({ value: '', disabled: true }),
    overallvalidationflag: new FormControl({ value: '', disabled: true }),
    ruledefinition: new FormControl({ value: '', disabled: true }),
    dqbusinesscriteria: new FormControl({ value: '', disabled: true }),
    category: new FormControl({ value: '', disabled: true }),
    status: new FormControl({ value: '', disabled: true }),
    priority: new FormControl({ value: '', disabled: true }),
    targetresolutiondate: new FormControl({ value: '', disabled: true }),

    readyforprofilinginfo: new FormControl({ value: '', disabled: true }),
    dqsqlexpressionvaliddata: new FormControl({ value: '', disabled: false } ),
    dqsqlexpressionvaliddatavalidate: new FormControl({ value: '', disabled: true }),
    dqsqlexpressionvaliderrormsg: new FormControl({ value: '', disabled: true }),

    dqsqlexpressioninvaliddata: new FormControl({ value: '', disabled: false }),
    dqsqlexpressioninvaliddatavalidate: new FormControl({ value: '', disabled: true }),
    dqsqlexpressioninvaliderrormsg: new FormControl({ value: '', disabled: true }),

    dqsqlexpressiontotaldata: new FormControl({ value: '', disabled: false }),
    dqsqlexpressiontotaldatavalidate: new FormControl({ value: '', disabled: true }),
    dqsqlexpressiontotalerrormsg: new FormControl({ value: '', disabled: true }),
    validexpressionvalidateinfo: new FormControl({ value: '', disabled: true }),
    invalidexpressionvalidateinfo: new FormControl({ value: '', disabled: true }),
    totalexpressionvalidateinfo: new FormControl({ value: '', disabled: true }),

    // validexpressionvalidatebtn: new FormControl({ value: '', disabled: true }),
    // invalidexpressionvalidatebtn: new FormControl({ value: '', disabled: true }),
    // totalexpressionvalidatebtn: new FormControl({ value: '', disabled: true }),
    profiletypecode: new FormControl(''),
    sptablename: new FormControl({ value: '', disabled: true }),
    spcolumnname: new FormControl({ value: '', disabled: true  }),
    spdomainname: new FormControl({ value: '', disabled: true  })
  });
  selectedDomain: any;
  showAlert: boolean = false;
  formBuilder: any;
  selectedRow: any;
  dbConnectionCode: any;
  columns: any;
  roles:getRoleMdlInf[]=[];
  pages: dqRuleMdlInfpage[]=[];
  totalPages: number= 0;
  previousTableName: string = '';
  currentpage: number = 1;
  @ViewChild('pagination')
  pagination!: ElementRef;
  elementRef: any;
  renderer: any;
  editedTechnicalId: number | null = null;
  isInvalid: boolean = false;
  isInvalid1: boolean = false;
  isInvalid2: boolean = false;
  constructor(private srvDqrule: DqruleService, private srvDataSource: DatasourceService, private toastr: ToastrService,
    private cdr: ChangeDetectorRef, private datePipe: DatePipe, private spinner: NgxSpinnerService, private srvdomain: DqdomainService,
    private fb: FormBuilder, private toast: NgToastService, private zone: NgZone,private srvprofiletype: ProfiletypeService,
    private auth:AuthService ,private srvPermission:ApppermissionService, private route: ActivatedRoute,private srvrole:GetroleService) {
    // this.tables$ = datasource.tables$;
    // this.total$ = datasource.total$;
    this.rolecode= this.auth.getRolecode();
    console.log('construnctor',this.rolecode)
    this.isTotalValidated = 'expression-not-validated';
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
    this.formDqRule.get('profiletypecode')?.valueChanges.subscribe(value => {
      if (value === '2') {
        this.formDqRule.get('sptablename')?.enable();
        this.formDqRule.get('spcolumnname')?.enable();
        this.formDqRule.get('spdomainname')?.enable();
      } else {
        this.formDqRule.get('sptablename')?.disable();
        this.formDqRule.get('spcolumnname')?.disable();
        this.formDqRule.get('spdomainname')?.disable();
      }
    });
    this.editor = new Editor();
    this.getDqruleDetail(null);
    this.getDatasource();
    this.getDomain();
    this.getRoles();
    this.getProfileType();
    this.getDqRulePage(null);
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  getRoles(){
    this.srvrole.getRole(3).subscribe((data:getRoleMdlInf[])=>{
      this.roles=data
    })
   }  
  getDatasource() {
    this.srvDataSource.getDataSource().subscribe(data => {
      this.datasources = data;

    })
  }
  getDomain() {
    this.srvdomain.getDqdomain().subscribe(data => {
      this.domains = data;

    })
  }
  getProfileType() {
    this.srvprofiletype.getProfiletype().subscribe(data => {
      this.profiletypes = data;

    })
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
  onDatasourceChange(datasource: Event) {
    // Ensure formDqRule is initialized and datasourcecode control exists
    if (!this.formDqRule || !this.formDqRule.get('datasourcecode')) {
      console.error('Form or control not initialized properly.');
      return;
    }

    // Store the current value of datasourcecode field
    const previousSelectedValue = this.formDqRule.get('datasourcecode')?.value;

    const selectedDataSourceCode = (datasource.target as HTMLSelectElement).value;
    this.dqruleCls.datasourcecode = selectedDataSourceCode;

    const selecteddatasource: datasourceMdlInf = {
      code: selectedDataSourceCode,
      name: '',
      technicalcontactemail: '',
      technicalcontactmobile: '',
      technicalcontactname: '',
      dbconnectioncode: null,
      sourcetypecode: null
    };

    this.spinner.show();

    this.srvDataSource.getDataSourceId(selecteddatasource).subscribe(
      (response: any) => {
        if (response && response.dbconnectioncode) {
          this.formDqRule.patchValue({
            dbconnectioncode: response.dbconnectioncode,
            sptablename: ''
          });

          this.dqruleCls.dbconnectioncode = response.dbconnectioncode;
          this.dbConnectionCode = response.dbconnectioncode;
          this.selectTable();
          this.dqruleCls.statuscode = 2;
          this.dqruleCls.profiletypecode=this.formDqRule.get('profiletypecode')?.value??'';
          // Update the DQRule only after receiving dbconnectioncode
          this.srvDqrule.updateDQRule(this.dqruleCls).subscribe((dbresp: any) => {

            this.showSuccess_DatasourceLink();

            // this.ngOnInit();
            // Set the previous value back to the dropdown after processing
            if (previousSelectedValue !== null && previousSelectedValue !== undefined) {
              this.formDqRule.patchValue({
                datasourcecode: previousSelectedValue
              });
            }

          });
        }
      },
      () => {
        // Perform any cleanup or finalization here
        this.spinner.hide();
      }
    );

    this.getDqruleDetail(null);
    //this.ngOnInit();
    this.cdr.detectChanges();
  }
   getDqRulePage(page: number | null){
    this.spinner.show();
    this.srvDqrule.getDqRuleDetailPage(page).subscribe((data:any)=> {
  
      console.log("page",data);
      this.totalPages=data.page_count;
      if (data) {
        const page_count = data.page_count;
        console.log("Page count:", page_count);
    } else {
        console.log("Data is undefined");
    }
    this.spinner.hide();
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
  selectTable(): void {

    const selectedValue = this.formDqRule.get('sptablename')?.value;

this.spinner.show();
    const payload = {
      DBConnectionCode: this.dbConnectionCode
    }

    this.srvDqrule.getTable(payload).subscribe(response => {

      this.tables = response.data;
      console.log(this.tables)
      
this.spinner.hide();


    })
  }
  onTableSelectChange(event: Event): void {

    const selectedValue = (event.target as HTMLSelectElement).value;

    this.selectedTableName = selectedValue; // Update selectedTableName
    this.selectColumn();

    // Reset column select
    this.formDqRule.controls['spcolumnname']?.setValue('');

    // Reset domain select
    this.formDqRule.get('spdomainname')?.setValue('');

  }


  selectColumn() {

    const payload = {
      DBConnectionCode: this.dbConnectionCode,
      TableName: this.selectedTableName ?? ''
    }
    this.srvDqrule.getColumn(payload).subscribe(response => {

      this.columns = response;
      console.log(this.columns);
      const primaryKeyColumn = this.columns.find((column: { ColumnName: string; IsPrimaryKey: boolean }) => column.IsPrimaryKey === true);
      if (primaryKeyColumn) {
        this.selectedPrimaryKey = primaryKeyColumn.ColumnName.toLowerCase();
      } else {

        console.error("No primary key column found in response");
      }
    });
  }

  onColumnSelectChange(event: any) {

    const selectedColumn = (event.target as HTMLSelectElement).value;

    this.selectedColumnName = selectedColumn
    this.formDqRule.get('spdomainname')?.setValue('');
  }
  isValidDomain(domain: any): boolean {
    return domain && (domain.name === "Completeness" || domain.name === "Uniqueness");
  }
  onDomainChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedDomain = selectedValue;
    const selectedDomain = this.domains.find(d => d.code === selectedValue);

    if (selectedValue === 'Completeness') {
      this.formDqRule.patchValue({
        dqsqlexpressionvaliddata: `select [${this.selectedPrimaryKey}],[${this.selectedColumnName}] from [${this.selectedTableName}] where [${this.selectedColumnName}] is not null `,
        dqsqlexpressioninvaliddata: `select [${this.selectedPrimaryKey}],[${this.selectedColumnName}] from [${this.selectedTableName}] where [${this.selectedColumnName}]  is null `,
        dqsqlexpressiontotaldata: `Select count(*) as Total From  [${this.selectedTableName}] `
      });
    } else if (selectedValue === 'Uniqueness') {
      this.formDqRule.patchValue({
        dqsqlexpressionvaliddata: `select [${this.selectedColumnName}], count(*) as NonDuplicate from [${this.selectedTableName}] group by [${this.selectedColumnName}] having count(*) = 1`,
        dqsqlexpressioninvaliddata: `select [${this.selectedColumnName}], count(*) as Duplicate from [${this.selectedTableName}] where [${this.selectedColumnName}] is Not null group by [${this.selectedColumnName}] having count(*) > 1`,
        dqsqlexpressiontotaldata: `select count(*) from [${this.selectedTableName}] where [${this.selectedColumnName}]  is Not null`
      });
    } else {
      this.formDqRule.patchValue({
        dqsqlexpressionvaliddata: "",
        dqsqlexpressioninvaliddata: "",
        dqsqlexpressiontotaldata: ""
      });
    }
  }
  onInputChanges() {
    this.searchSubject.next();
  } 
  getDqruleDetail(page: number | null) {
    let ordering = this.currentSortField ? `${this.currentSortOrder}${this.currentSortField}` : null;
    this.spinner.show();
    this.srvDqrule.getDQRuleDetailCurrent(page,ordering,this.filterData).subscribe(data => {
      this.spinner.hide();
      let results = data.results
      if (results && results.length > 0) {
       
          this.dqrules = results;
          this.totalPages = data.page_count
      } 
    }, error => {

      this.spinner.hide();
    });
  }

  //valid data expression validate accordion
 
public validateValidExpression(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.dqrulevaliddatavalidateqryCls.DbconnectionCode = this.formDqRule['controls']['dbconnectioncode'].value;
    this.dqrulevaliddatavalidateqryCls.Query = this.formDqRule['controls']['dqsqlexpressionvaliddata'].value;

    this.srvDqrule.validateDqruleValidateQuery(this.dqrulevaliddatavalidateqryCls).pipe(
      map((dbresponse: any) => {
       
        const isValid = dbresponse.query_status === 'Valid';
        const errorMessage = isValid ? "Query Parsed Successfully" : dbresponse.query_status;

        this.dqruleCls.dqsqlexpressionvaliddata = this.dqrulevaliddatavalidateqryCls.Query;
        this.dqruleCls.dqsqlexpressionvaliddatavalidate = isValid;
        this.dqruleCls.dqsqlexpressionvaliderrormsg = errorMessage;

        this.formDqRule.patchValue({
          dqsqlexpressionvaliderrormsg: errorMessage,
          dqsqlexpressionvaliddatavalidate: isValid ? "Success" : "Failed",
          validexpressionvalidateinfo: isValid ? "Expression Validated" : "Expression Not Validated"
        });
      })
    ).subscribe({
      next: () => resolve(),
      error: () => {
        this.dqruleCls.dqsqlexpressionvaliddatavalidate = false;
        resolve();
      }
    });
  });
}

public validateInvalidExpression(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.dqruleinvaliddatavalidateqryCls.DbconnectionCode = this.formDqRule['controls']['dbconnectioncode'].value;
    this.dqruleinvaliddatavalidateqryCls.Query = this.formDqRule['controls']['dqsqlexpressioninvaliddata'].value;

    this.srvDqrule.validateDqruleValidateQuery(this.dqruleinvaliddatavalidateqryCls).pipe(
      map((dbresponse: any) => {
        const isValid = dbresponse.query_status === 'Valid';
        const errorMessage = isValid ? "Query Parsed Successfully" : dbresponse.query_status;

        this.dqruleCls.dqsqlexpressioninvaliddata = this.dqruleinvaliddatavalidateqryCls.Query;
        this.dqruleCls.dqsqlexpressioninvaliddatavalidate = isValid;
        this.dqruleCls.dqsqlexpressioninvaliderrormsg = errorMessage;

        this.formDqRule.patchValue({
          dqsqlexpressioninvaliderrormsg: errorMessage,
          dqsqlexpressioninvaliddatavalidate: isValid ? "Success" : "Failed",
          invalidexpressionvalidateinfo: isValid ? "Expression Validated" : "Expression Not Validated"
        });
      })
    ).subscribe({
      next: () => resolve(),
      error: () => {
        this.dqruleCls.dqsqlexpressioninvaliddatavalidate = false;
        resolve();
      }
    });
  });
}

public validateTotalDataExpression(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.dqruletotaldatavalidateqryCls.DbconnectionCode = this.formDqRule['controls']['dbconnectioncode'].value;
    this.dqruletotaldatavalidateqryCls.Query = this.formDqRule['controls']['dqsqlexpressiontotaldata'].value;

    this.srvDqrule.validateDqruleValidateQuery(this.dqruletotaldatavalidateqryCls).pipe(
      map((dbresponse: any) => {
        const isValid = dbresponse.query_status === 'Valid';
        const errorMessage = isValid ? "Query Parsed Successfully" : dbresponse.query_status;

        this.dqruleCls.dqsqlexpressiontotaldata = this.dqruletotaldatavalidateqryCls.Query;
        this.dqruleCls.dqsqlexpressiontotaldatavalidate = isValid;
        this.dqruleCls.dqsqlexpressiontotalerrormsg = errorMessage;

        this.formDqRule.patchValue({
          dqsqlexpressiontotalerrormsg: errorMessage,
          dqsqlexpressiontotaldatavalidate: isValid ? "Success" : "Failed",
          totalexpressionvalidateinfo: isValid ? "Expression Validated" : "Expression Not Validated"
        });
      })
    ).subscribe({
      next: () => resolve(),
      error: () => {
        this.dqruleCls.dqsqlexpressiontotaldatavalidate = false;
        resolve();
      }
    });
  });
}


  updateOverallValidateFlag(): void {
    if (!this.formDqRule['controls']['datastewardname'].value) {
      this.showError();
      return;
    }
    if (!this.formDqRule['controls']['datasourcecode'].value) {
      this.showError();
      return;
    }
    const selectedDataSourceCode = this.formDqRule['controls']['datasourcecode'].value;
    this.spinner.show();

    if (this.dqruleCls.dqsqlexpressionvaliddatavalidate &&
      this.dqruleCls.dqsqlexpressioninvaliddatavalidate &&
      this.dqruleCls.dqsqlexpressiontotaldatavalidate) {
      this.dqruleCls.overallvalidationflag = true
      this.dqruleCls.statuscode = 2 // 'Technical Rule Definition'
      this.formDqRule.patchValue({ readyforprofilinginfo: 'Ready for Profiling' });

    } else {
      this.dqruleCls.overallvalidationflag = false
      //this.dqruleCls.statuscode = 1 // 'Business Rule Definition'. Once statuscode become 2, never it changed into backward status.
      this.formDqRule.patchValue({ readyforprofilinginfo: 'Not Ready for Profiling' });

    }
    this.dqruleCls.datastewardname = this.formDqRule.get('datastewardname')!.value as string;



    this.srvDqrule.updateDQRule(this.dqruleCls).subscribe((dbresp: any) => {

      if (dbresp.overallvalidationflag) {
        this.formDqRule.patchValue({
          overallvalidationflag: "Yes",
          status: "Technical Rule Definition"
        });
      } else {
        this.formDqRule.patchValue({
          overallvalidationflag: "No",
          status: "Business  Rule Definition"
        });
      }

      //alert(dbresp.isValid)

      this.spinner.hide();
      this.showSuccess();
      // Restore the selected value of the datasource dropdown
      this.formDqRule.patchValue({
        datasourcecode: selectedDataSourceCode
      });  //close for patchValu         
    }); //close api cal
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  
  updateReadyForProfiling(): void {
    if (this.canEdit) {
      this.markFormGroupTouched(this.formDqRule);
      if (!this.formDqRule.get('datastewardname')?.valid || !this.formDqRule.get('datasourcecode')?.value) {
        this.showError();
        return;
      }
  
      // Call all validation functions asynchronously
      Promise.all([
        this.validateValidExpression(),
        this.validateInvalidExpression(),
        this.validateTotalDataExpression()
      ]).then(() => {
        // Compute the readiness based on the validation flags
        const isValidated = this.dqruleCls.dqsqlexpressionvaliddatavalidate &&
          this.dqruleCls.dqsqlexpressioninvaliddatavalidate &&
          this.dqruleCls.dqsqlexpressiontotaldatavalidate;
  
        // Update the overallvalidationflag based on the computed value
        this.dqruleCls.overallvalidationflag = isValidated;
  
        // Update the form field for readiness
        const readinessInfo = isValidated ? 'Ready for Profiling' : 'Not Ready for Profiling';
        this.formDqRule.patchValue({ readyforprofilinginfo: readinessInfo });
  
        if (isValidated) {
          this.dqruleCls.statuscode = 3;
        } else {
          this.dqruleCls.statuscode = 2;
        }
  
        // Show a spinner while the update is in progress
        this.spinner.show();
  
        // Update other form fields and make the API call to update the DQ rule in the backend
        this.dqruleCls.datastewardname = this.formDqRule.get('datastewardname')?.value ?? '';
        this.dqruleCls.profiletypecode=this.formDqRule.get('profiletypecode')?.value??'';
        this.dqruleCls.sptablename= this.formDqRule.get('sptablename')?.value??'';
        this.dqruleCls.spcolumnname= this.formDqRule.get('spcolumnname')?.value??'';
        this.dqruleCls.spdomainname= this.formDqRule.get('spdomainname')?.value??'';
        // Update other form fields...
        this.srvDqrule.updateDQRule(this.dqruleCls).subscribe((dbresp: any) => {
          this.spinner.hide();
          this.editedTechnicalId =dbresp.code;
          if (dbresp.statuscode !== 500) {
            // Handling successful update
            this.formDqRule.patchValue({ code: dbresp.code });
            this.showSuccess();
          }
        });
      }).catch(error => {
        console.error('Error during validation:', error);
      });
    }
  }
  


  editDqRule(selectedRow: any): void {

    this.toggleFormVisibilityEdit();
  
    console.log(selectedRow);
    this.editedTechnicalId =selectedRow.code;
    this.dbConnectionCode = selectedRow?.dbconnectioncode?.code;
    this.selectedTableName = selectedRow.sptablename; 
    console.log(this.selectedTableName)
    this.selectColumn();
    this.selectedDqruleCode = selectedRow.code;
    this.patchFormValues(selectedRow);
   
    this.dqruleCls.code = selectedRow.code
    this.dqruleCls.ruleno = selectedRow.ruleno
    this.dqruleCls.dataelement = selectedRow.dataelement
    this.dqruleCls.ruledefinition = selectedRow.ruledefinition
    this.dqruleCls.dqthresholdpercentage = selectedRow.dqthresholdpercentage
    this.dqruleCls.businessstewardname = selectedRow.businessstewardname
    this.dqruleCls.rulecreateddate = selectedRow.rulecreateddate
    this.dqruleCls.dqbusinesscriteria = selectedRow.dqbusinesscriteria
    this.dqruleCls.dqsqlexpressionvaliddata = selectedRow.dqsqlexpressionvaliddata
    this.dqruleCls.dqsqlexpressionvaliddatavalidate = selectedRow.dqsqlexpressionvaliddatavalidate
    this.dqruleCls.dqsqlexpressionvaliderrormsg = selectedRow.dqsqlexpressionvaliderrormsg
    this.dqruleCls.dqsqlexpressioninvaliddata = selectedRow.dqsqlexpressioninvaliddata
    this.dqruleCls.dqsqlexpressioninvaliddatavalidate = selectedRow.dqsqlexpressioninvaliddatavalidate
    this.dqruleCls.dqsqlexpressioninvaliderrormsg = selectedRow.dqsqlexpressioninvaliderrormsg
    this.dqruleCls.dqsqlexpressiontotaldata = selectedRow.dqsqlexpressiontotaldata
    this.dqruleCls.dqsqlexpressiontotaldatavalidate = selectedRow.dqsqlexpressiontotaldatavalidate
    this.dqruleCls.dqsqlexpressiontotalerrormsg = selectedRow.dqsqlexpressiontotalerrormsg
    this.dqruleCls.datastewardname = selectedRow.datastewardname
    this.dqruleCls.dqexpressioncreateddate = selectedRow.dqexpressioncreateddate
    this.dqruleCls.overallvalidationflag = selectedRow.overallvalidationflag
    this.dqruleCls.dqdomaincode = selectedRow.dqdomaincode.code
    this.dqruleCls.businesssystemcode = selectedRow.businesssystemcode.code
    this.dqruleCls.datasourcecode = selectedRow?.datasourcecode?.code
    this.dqruleCls.dbconnectioncode = selectedRow?.dbconnectioncode?.code
    this.dqruleCls.prioritycode = selectedRow.prioritycode.code
    this.dqruleCls.statuscode = selectedRow.statuscode.code
    this.dqruleCls.categorycode = selectedRow.categorycode.code
    this.dqruleCls.targetresolutiondate = selectedRow.targetresolutiondate
    this.dqruleCls.profiletypecode=selectedRow.profiletypecode.code;
    this.dqruleCls.sptablename=selectedRow.sptablename;
    this.dqruleCls.spcolumnname=selectedRow.spcolumnname;
    this.dqruleCls.spdomainname=selectedRow.spdomainname;
    //alert(this.dqruleCls.datastewardname) 
    const Selected_Category_Name = selectedRow.categorycode.name
    switch (Selected_Category_Name) {
      case 'Data Cleansing':
        this.showThresholdField = true;
        this.showResolutionDateField = false;
        break;
      case 'Data Issue':
        this.showThresholdField = false;
        this.showResolutionDateField = true;
        break;
      default:
        this.showThresholdField = false;
        this.showResolutionDateField = false;
        break;
    }
   this.selectTable(); 
    setTimeout(() => {
      console.log('repatch',selectedRow.spcolumnname);
      this.formDqRule.patchValue({
        sptablename: selectedRow.sptablename || '',
        spcolumnname:selectedRow.spcolumnname || ''
    });
  
 }, 3000);
  }
  patchFormValues(selectedRow: any): void{
    const profileTypeCode = selectedRow.profiletypecode.code === 2 ? '2' : '1';
    console.log('profileTypeCode (before patch)', profileTypeCode); 
    console.log('selectedRow.profiletypecode', selectedRow.profiletypecode);
    const existingColumnValue = selectedRow.sptablename;
    console.log(existingColumnValue);
    this.formDqRule.patchValue({
      ruleno: selectedRow.ruleno,
      dbconnectioncode: selectedRow?.dbconnectioncode?.code,
      datasourcecode: selectedRow?.datasourcecode?.code,
      dataelement: selectedRow.dataelement,
      datastewardname: selectedRow.datastewardname,
      dqdomainname: selectedRow.dqdomaincode.name,
      dqthresholdpercentage: selectedRow.dqthresholdpercentage + '%',
      overallvalidationflag: selectedRow.overallvalidationflag ? 'Yes' : 'No',
      ruledefinition: selectedRow.ruledefinition,
      dqbusinesscriteria: selectedRow.dqbusinesscriteria,
      category: selectedRow.categorycode.name,
      status: selectedRow.statuscode.name,
      priority: selectedRow.prioritycode.name,
      targetresolutiondate: selectedRow.targetresolutiondate,
      readyforprofilinginfo: selectedRow.overallvalidationflag ? 'Ready for Profiling' : 'Not Ready for Profiling',
      dqsqlexpressionvaliddatavalidate: selectedRow.dqsqlexpressionvaliddatavalidate ? 'Expression Validated' : 'Expression Not Validated',
      validexpressionvalidateinfo: selectedRow.dqsqlexpressionvaliddatavalidate ? 'Expression Validated' : 'Expression Not Validated',
      dqsqlexpressionvaliddata: selectedRow.dqsqlexpressionvaliddata,
      dqsqlexpressionvaliderrormsg: selectedRow.dqsqlexpressionvaliderrormsg,
      dqsqlexpressioninvaliddatavalidate: selectedRow.dqsqlexpressioninvaliddatavalidate ? 'Expression Validated' : 'Expression Not Validated',
      invalidexpressionvalidateinfo: selectedRow.dqsqlexpressioninvaliddatavalidate ? 'Expression Validated' : 'Expression Not Validated',
      dqsqlexpressioninvaliddata: selectedRow.dqsqlexpressioninvaliddata,
      dqsqlexpressioninvaliderrormsg: selectedRow.dqsqlexpressioninvaliderrormsg,
      dqsqlexpressiontotaldatavalidate: selectedRow.dqsqlexpressiontotaldatavalidate ? 'Expression Validated' : 'Expression Not Validated', //'Success' : 'Failed'
      totalexpressionvalidateinfo: selectedRow.dqsqlexpressiontotaldatavalidate ? 'Expression Validated' : 'Expression Not Validated',
      dqsqlexpressiontotaldata: selectedRow.dqsqlexpressiontotaldata,
      dqsqlexpressiontotalerrormsg: selectedRow.dqsqlexpressiontotalerrormsg,
      profiletypecode:profileTypeCode ,
      sptablename: selectedRow.sptablename || '',
      spcolumnname: selectedRow.spcolumnname || '',
      spdomainname: selectedRow.spdomainname || ''
    });


  }
  toggleFormVisibilityEdit() {
    this.showForm = !this.showForm;
  }

  toggleFormVisibility() {
    // this.updateReadyForProfiling();
    this.showForm = !this.showForm;
    //window.location.reload();
   this.getDqruleDetail(null);
  }

  clear() {

    this.formDqRule.patchValue({
      dqsqlexpressionvaliddatavalidate: null,
      dqsqlexpressionvaliddata: null,
      dqsqlexpressionvaliderrormsg: null,
      dqsqlexpressioninvaliddatavalidate: null,
      dqsqlexpressioninvaliddata: null,
      dqsqlexpressioninvaliderrormsg: null,
      dqsqlexpressiontotaldatavalidate: null,
      dqsqlexpressiontotaldata: null,
      dqsqlexpressiontotalerrormsg: null

    });
  }

  //sorting
  visible:boolean=false;
  sortColumn: string = '';
  sortAscending: boolean = true;
  sortTable(field: string): void {
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

  //toastr

  openModal(expression: any) {
    this.spinner.show()
    if (!this.dbConnectionCode) {

      this.spinner.hide();
      return;
    }

    const dbConnectionCode = this.dbConnectionCode;



    const payload = {
      DQSQLValid: expression,
      DBConnectionCode: dbConnectionCode
      // Add more fields to the payload if needed
    };

    const hideSpinner = timer(40000).subscribe(() => {
      this.zone.run(() => { // Ensure this runs within Angular's zone to update the view
        this.spinner.hide();
      });
    });

    this.srvDqrule.getPreview(payload).subscribe(data => {


      try {
        const result = JSON.parse(data.result)

        if (result === null) {
          this.showPreview();
          return;
        }
        $('#previewTable tbody').empty();

        if (result && result.length > 0) {
          // Get the keys from the first object in the array
          const keys = Object.keys(result[0]);

          const headerHTML = keys.map(key => `<th style=" background-color: cadetblue;
         color: #ffffff;
         text-align: center;">${key}</th>`).join('');
          $('#tableHeaderRow').html(headerHTML);

          // Populate table with data
          result.forEach((row: Record<string, any>) => {
            const rowData = keys.map(key => `<td >${row[key]}</td>`).join('');
            $('#tableBody').append(`<tr style="text-align:center">${rowData}</tr>`);

            $('#staticBackdropValid').modal('show');
          });
        }
      } catch (error) {
        console.log('No preview Data')
        this.showPreview();
      }

    });


  }
  closePreview() {
    $('#staticBackdropValid').modal('hide');
  }
  showSuccess() {

    this.toast.success({ detail: "Technical Rule", summary: ' Data Updated Successfully !', duration: 5000, position: 'topLeft' });
  }

  showError() {
    this.toast.error({ detail: "Technical Rule", summary: 'please fill the required form field !', duration: 5000, position: 'topLeft' });
  }

  showSuccess_DatasourceLink() {
    const ruleNo = this.formDqRule['controls']['ruleno'].value;
    this.toast.success({ detail: "Technical Rule", summary: `Data Source associated with the Rule No: ${ruleNo} Data Updated Successfully!`, duration: 5000, position: 'topLeft' });
  }
  showPreview() {
    this.toast.error({ detail: "Data not found", duration: 5000, position: 'topLeft' });
  }
  showSuccessTopCenter() {
    this.toast.success({ detail: "SUCCESS", summary: 'Your Success Message', duration: 5000, position: 'topLeft' });
  }
  onPageChange(page: number): void {
    this.currentpage = page;
    this.getDqruleDetail(this.currentpage);
  }
}
