import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import { DqruleService } from 'src/app/services/dqrule.service';
import { DqstatusService } from 'src/app/services/dqstatus.service'; 
import { DQCardService } from 'src/app/services/dqcard.service';
import { DqprofilingService } from 'src/app/services/dqprofiling.service';
import { DqdomainService } from 'src/app/services/dqdomain.service';
import { FrequencyService } from 'src/app/services/frequency.service';
import { frequencyMdlInf } from 'src/app/Models/frequency';
import { departmentMdl } from 'src/app/Models/department';
import { dqdomainMdlInf } from 'src/app/Models/dqdomain';
import { dqruleInf, dqruleCls, dqruleDetailMdl, dqruleDetailCls } from 'src/app/Models/dqrule';
import { statusMdlInf } from 'src/app/Models/dqstatus';
import { dqProfilingResultGridMdlInf,dqProfileGridInf, dqProfilingMdlInfpage, profileMdlInf } from 'src/app/Models/dqprofiling';
import { dqcardInf } from 'src/app/Models/dqcard';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { permissionMdlInf } from 'src/app/Models/permission';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { catchError, debounceTime, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-dq-profiling',
  templateUrl: './dq-profiling.component.html',
  styleUrls: ['./dq-profiling.component.scss']
})
export class DqProfilingComponent {
  @ViewChild('confirmationModal', { static: true })
  confirmationModal!: ConfirmationModalComponent;
  @ViewChild('successModal', { static: true })
  successModal!: ConfirmationModalComponent;
  selectedRuleCode: string[] = [];
  showForm = false;
  form!: FormGroup;
  // formDqLinkProfiling !: FormGroup;
  // formDqProfiling !: FormGroup;
  
  departments: departmentMdl[]=[];
  //departments2: departmentMdl[]=[];
  dqrules: dqruleInf[]=[];
  dqruledetails: dqruleDetailMdl[]=[];
  statuses: statusMdlInf[]=[];
  frequencies: frequencyMdlInf[]=[];
  dqcards: dqcardInf[]=[];
  dqdomains: dqdomainMdlInf[]=[];
 
 // dqprofilings: dqProfilingResultGridMdlInf[]=[];  
 dqprofilings: dqProfileGridInf[]=[];
 dqprofilingresult:dqProfilingResultGridMdlInf[]=[];
 canSave:boolean = false;
 canDelete:boolean =false;
 canEdit:boolean = false;
 deleteButton:boolean=false;
 codeValue!: number;
 appName: string = '';
 permissions:permissionMdlInf[]=[];
 rolecode:any;
  filterData: string='';
  editparam:string ='';
pages: dqProfilingMdlInfpage[]=[];
totalPages: number = 0;
editedProfilingId: number | null = null;
  formDqLinkProfiling = new FormGroup({
    dqcardcode: new FormControl({ value: '', disabled: false }),
    departmentcode: new FormControl({ value: '', disabled: false }),
    technicalrulecode: new FormControl({ value: '', disabled: false }),
    schedulefrequencycode: new FormControl({ value: '', disabled: false }),
    profilestatuscode: new FormControl({ value: '', disabled: false }),
    //profiledate: new FormControl({ value: '', disabled: false }), 
    profilefromdate: new FormControl({ value: '', disabled: false }), 
    profiletodate: new FormControl({ value: '', disabled: false }), 
  });

  formDqProfiling = new FormGroup({
    scorecardcode: new FormControl({ value: '', disabled: false }),
    departmentcode: new FormControl({ value: '', disabled: false }),
    dqdomaincode: new FormControl({ value: '', disabled: false }),

  })
  private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();
  currentSortField: string = ''; 
  currentSortOrder: string = '';
selectedRow: any;
  selectedRuleNo: any;
  //for pagenation
currentpage: number = 1;
currentpages: number = 1;

@ViewChild('pagination')
pagination!: ElementRef;
  constructor(private srvDepartment: DepartmentService, private srvDqRule: DqruleService, private srvDqStatus: DqstatusService, private srvFrequency: FrequencyService,
     private srvDqCard: DQCardService, private srvDqDomain: DqdomainService, private srvDqProfile: DqprofilingService, private toastr: ToastrService,
      private router: Router, private spinner :NgxSpinnerService, private auth:AuthService ,private srvPermission:ApppermissionService, private route: ActivatedRoute,
      private toast: NgToastService) {
      this.rolecode= this.auth.getRolecode();
      console.log('construnctor',this.rolecode)

  }

  ngOnInit(): void {
   // this.getDqprofilingDetail(null);
     this.route.url.subscribe(urlSegments => {
      this.appName = urlSegments[urlSegments.length - 1].path;
    })
    this.searchSubject.pipe(
      debounceTime(3000),
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.getProfileGrid(this.currentpage);
    });
     this.getPermission();
   this.getProfileGrid(this.currentpage);
  
    this.getDepartment();
    this.getDqRule();
    this.getDqStatus();
    this.getDqCard(); // this is Score Card data items load
    this.getDqDomain();
    this.getFrequency();
    this.getDqRulePage(this.currentpage);
    //throw new Error('Method not implemented.');
  }

  navigateToSchedulingComponent() {    
    this.router.navigate(['/Layout/DQScheduling']);
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
  // // This function will get array of rule nos
  // handleCheckboxChange(event: any, ruleno: string) {
  //   if (event.target.checked) {
  //     this.selectedRuleCode.push(ruleno);
  //   } else {
  //     const index = this.selectedRuleCode.indexOf(ruleno);
  //     if (index !== -1) {
  //       this.selectedRuleCode.splice(index, 1);
  //     }
  //   }
  // }

  createProfilingWithSelectedRuleCode() { 
    if (this.selectedRuleCode.length === 1 ) {
      // Navigate to 'DQCreateProfiling' route with selectedRuleNos as query parameter
      // this.router.navigate(['/DQCreateProfiling'], { queryParams: { ruleNo: this.selectedRuleCode.join(',') } });
      this.router.navigate(['/Layout/DQCreateProfiling'], { queryParams: { ruleNoCode: this.selectedRuleCode } });
    } else {
      this.Confirmationmsg();
      return;
    }
  }
  onInputChanges() {
    this.searchSubject.next();
  } 
  getDqRulePage(page: number | null){
    this.spinner.show();
    this.srvDqProfile.getProfileGridpage(page).pipe(
      catchError(error => {

        this.spinner.hide();
        return of(null); 
      })
    ).subscribe((data:any)=> {
  
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

  // navigateToSchedulingComponent(ruleNo: string) {
  //   this.router.navigate(['/DQScheduling', ruleNo]);
  // }

  // onCheckboxChange(event: any, ruleNo: string) {
  //   alert(ruleNo)
  //   if (event.target.checked) {
  //     this.navigateToSchedulingComponent();
  //     //this.navigateToSchedulingComponent(ruleNo);
  //   }
  // }

  onCheckboxChange(event: any, ruleNo: string) {
    if (event.target.checked) {
      this.navigateToSchedulingComponent();
      //this.navigateToSchedulingComponent(ruleNo);
    }
  }
  /*getProfileGrid(){
    this.srvDqProfile.getProfileGrid().subscribe(data=>{
      this.dqprofilings= data;
    })
  }*/
  getDepartment(){
    this.srvDepartment.getDepartment().subscribe(data=>{
      this.departments = data;
      //this.departments2 = data;
      
    })
  }

  getDqRule(){
    this.srvDqRule.getDQRuleDetail().subscribe(data=>{
      this.dqruledetails = data;
     
    })
  }

  getDqStatus(){
    this.srvDqStatus.getStatus().subscribe(data=>{
      this.statuses = data;
   
    })
  }

  getFrequency(){
    this.srvFrequency.getFrequency().subscribe(data=>{
      this.frequencies = data;
     
    })
  }
  
  getDqCard() {
    this.srvDqCard.getDQCard().subscribe(data=>{
      this.dqcards = data;
    
    })
  }

  getDqDomain() {
    this.srvDqDomain.getDqdomain().subscribe(data=>{
      this.dqdomains = data;
    
    })
    
  }
  
  getProfileGrid(page: number ){
    let ordering = this.currentSortField ? `${this.currentSortOrder}${this.currentSortField}` : null;
    this.spinner.show();
    this.srvDqProfile.getProfileGrid(page,ordering,this.filterData).subscribe(data=>{
      
      let results = data.results
    
    this.spinner.hide();
    //this.dqprofilings = data;
       // Check if there are records
       if (results && results.length > 0) {
        console.log('dqprofiling list', data)
        this.totalPages = data.page_count
         this.dqprofilings = results;
      }
     },error => {
      console.error('Error fetching Profiling Results Grid:', error);
      this.spinner.hide();
  }); 
    console.log("this.dqprofilings data are : ", this.dqprofilings)
  }
  loadPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentpage = page; 
      this.getDqRulePage(this.currentpage);
    } else if (page === 'previous') {
      if (this.currentpage > 1) {
        this.currentpage--; 
        this.getDqRulePage(this.currentpage);
      }
    } else if (page === 'next') {
      this.currentpage++;
      this.getDqRulePage(this.currentpage);
    }
}

getPageNumbers(): (number | string)[] {
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
    const lastPage = Math.min(totalPages, firstPage + maxPagesToShow - 1); 


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
  
 
  
// Add this function to your component class
filterDataById(id: string): dqruleDetailMdl[] {
  return this.dqruledetails.filter(dqruledetail => dqruledetail.code === id);
}

editDqRule(selectedRow: any): void {
    
    //alert(selectedRow.code); // b4 nested serializer -> dqrulecode
    this.selectedRow = selectedRow; // Set selectedRow here    
    this.srvDqRule.getDQRuleDetailById(selectedRow.code).subscribe(data => {
      this.dqruledetails = [data];
      
    });
    this.toggleFormVisibility();
}

  /*editDqRule(selectedRow: any): void{ 
      console.log("Edit Test ",selectedRow)
      alert(selectedRow.dqrulecode)
      this.srvDqRule.getDQRuleDetailById(selectedRow.dqrulecode).subscribe(data=>{
      this.dqruledetails = data;
      // this.srvDqRule.getDQRuleDetail().subscribe(data=>{
      // this.dqruledetails = data;
      console.log('dq rule details by id', this.dqruledetails)
    })
      this.ngOnInit();
      this.toggleFormVisibility();
  }*/

  editProfile(dqrulecode: any,scheduleCode: any,profileCode:any,RuleNo:any){
  //  this.editedProfilingId =profileCode;
      this.router.navigate(['/Layout/DQCreateProfiling'], { queryParams: { ruleNoCode: dqrulecode, scheduleCode: scheduleCode,profileCode:profileCode,RuleNo:RuleNo  } });
    
  }
  View(ruleCode:any,profilecode: any){
    this.router.navigate(['/Layout/DQScheduling'], { queryParams: { ruleNoCode: ruleCode,profileCode : profilecode} });
  }

deleteDqProfile(dqprofilings:any){ 
  const confirmation = confirm('Are you sure you want to delete this selected DQ Profile : ' + dqprofilings.code);
  if (confirmation) {
   
    this.srvDqProfile.deleteDqProfile(dqprofilings.code).subscribe(
      () => {       
        this.dqprofilings = this.dqprofilings.filter((row) => row.Code !== dqprofilings.code);
       this.showDelete();
      }
    );
  }

}

//sorting
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

  this.getProfileGrid(this.currentpage)
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
  //return value ? value.toLowerCase() : '';
  if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'string') {
    return value.toLowerCase();
  } else {
    return '';
  }
}

showDelete() {
  this.toastr.success('Profiling  ', 'Deleted successfully!');
}
Confirmationmsg() {
  this.toast.error({ detail: 'Choose the rules for profiling (You can select only one rule).', duration: 10000, position: 'topLeft' });

}
Delete(code:number) {
  if(this.canDelete){
  this.codeValue =code;
  if (this.confirmationModal) {
    this.confirmationModal.open();
  }else {
    console.error('Confirmation modal is not available');
  }
} 
}
onConfirm(){
  if(this.codeValue){
    this.srvDqProfile.deleteDqProfile(this.codeValue).subscribe(
      () => {
        this.confirmationModal.close(); 
        this.successModal.open();
        setTimeout(() => { 
          this.successModal.close();
        }, 5000);
      });
  }

}
onCancelDelete(){

}
  toggleFormVisibility(){
    this.router.navigate(['/Layout/DQProfilingRule'])
  }
  onPageChange(page: number): void {
    this.currentpage = page;
    this.getProfileGrid(this.currentpage);
  }
}

