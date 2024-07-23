import { Component, OnInit } from '@angular/core';
import { DqruleService } from 'src/app/services/dqrule.service';
import { dqruleInf, dqruleCls, dqruleDetailMdl, dqruleDetailCls ,dqRuleMdlInfpage} from 'src/app/Models/dqrule';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DqprofilingService } from 'src/app/services/dqprofiling.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { permissionMdlInf } from 'src/app/Models/permission';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { NgToastService } from 'ng-angular-popup';
import { Subject, debounceTime, takeUntil } from 'rxjs';
@Component({
  selector: 'app-dq-profilingrule',
  templateUrl: './dq-profilingrule.component.html',
  styleUrls: ['./dq-profilingrule.component.scss']
})
export class DqProfilingruleComponent implements OnInit{
  selectedRuleCode: string[] = [];
  dqrules: dqruleInf[]=[];
  dqruledetails: dqruleDetailMdl[]=[];
  dqruleUpdate:any;
  updateno:any
  filterData: string ='';
  editparam:string ='';
  currentpage: number = 1;
  currentpages: number = 1;
  selectedRuleNo: any;
  canSave:boolean = false;
  canClear:boolean =false;
  canDelete:boolean =false;
  canEdit:boolean = false;
  saveButton:boolean = false;
  appName: string = '';
 permissions:permissionMdlInf[]=[];
 rolecode:any;
 totalPages: number=0;
 pages: dqRuleMdlInfpage[]=[];
 rules:dqruleInf = {} as dqruleInf;
 dqruleCls: dqruleCls = new dqruleCls();
 private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();
  currentSortField: string = ''; 
  currentSortOrder: string = '';
  constructor(private srvDqRule: DqruleService, private router: Router, private toastr: ToastrService, private srvDqProfile: DqprofilingService,
    private spinner :NgxSpinnerService,private auth:AuthService ,private srvPermission:ApppermissionService, private route: ActivatedRoute,
    private toast: NgToastService
  ){
    
  this.rolecode= this.auth.getRolecode();
      console.log('construnctor',this.rolecode)
	  
  }

  ngOnInit():void{
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
    this.getDqruleDetail(this.currentpage);
    this.getDqRulePage(null);
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
  getDqRule(){
    this.spinner.show();
    this.srvDqRule.getDQRuleDetail().subscribe(data=>{
      this.dqruledetails = data;
      this.spinner.hide();
    })
  }
  onInputChanges() {
    this.searchSubject.next();
  }
  getDqruleDetail(page: number ) {
    let ordering = this.currentSortField ? `${this.currentSortOrder}${this.currentSortField}` : null;
    this.spinner.show();
    this.srvDqRule.getDQRuleDetailCurrent(page,ordering,this.filterData).subscribe(data => {
     this.spinner.hide();
     let results = data.results
      if (results && results.length > 0) {
         
          this.dqruledetails  = results;
          this.totalPages = data.page_count
      } 
    },error => {
      this.spinner.hide();}
      );
  }
  /*loadPage(page: number | string): void {
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
}

getPageNumbers(): (number | string)[] {
  const pageNumbers = [];
  const maxPagesToShow = 8; // Maximum number of page numbers to show excluding ellipsis and last page number
  const totalPages = this.totalPages; // Assuming this.totalPages holds the total count of pages from the API
 //const totalPages = 3; // Assuming this.totalPages holds the total count of pages from the API

  if (totalPages <= maxPagesToShow) {
    // If total pages are less than or equal to maxPagesToShow, display all pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Display current 8 pages with ellipsis
    const currentPage = this.currentpage;
    const firstPage = Math.max(1, currentPage - 4); // Calculate the starting page number
    const lastPage = Math.min(totalPages, firstPage + maxPagesToShow - 1); // Calculate the ending page number

    // Add ellipsis if necessary
    if (firstPage > 1) {
      pageNumbers.push('...');
    }

    // Add current 8 pages
    for (let i = firstPage; i <= lastPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if necessary
    if (lastPage < totalPages) {
      pageNumbers.push('...');
    }
  }

  return pageNumbers;
}*/

    
    
// Add this function to your component class
filterDataById(id: string): dqruleDetailMdl[] {
  return this.dqruledetails.filter(dqruledetail => dqruledetail.code === id);
}
handleCheckboxChange(event: any, ruleno: string,ruleNumber: string) {
  if (event.target.checked) {
    // Clear selectedRuleCode array before adding the newly selected rule number
    this.selectedRuleCode = [ruleno];
    this.selectedRuleNo = ruleNumber;
    console.log('code', this.selectedRuleCode)
    this.updateno = ruleno
    const ruleNumberAsNumber: number = parseInt(ruleno, 10);
    this.srvDqRule.getDQRuleById( ruleNumberAsNumber).subscribe(data => {
      this.rules = data;
      console.log(data)
     // this.updateStatusCode(ruleNumberAsNumber,5)
    })
      
  } else {
   
    this.selectedRuleCode = [];
    this.selectedRuleNo = null;
    this.updateno = '';
   
  }
}
profileNow(){
  if(this.canEdit){
  if(this.selectedRuleNo){
    this.spinner.show();
    this.srvDqProfile.postProfile({ RuleNo:this.selectedRuleNo }).subscribe(
      response => {
        this.spinner.hide();
        this.showSuccess();
        const ruleNumberAsNumber: number = parseInt(this.updateno, 10);
        this.updateStatusCode(ruleNumberAsNumber,4 );
        this.selectedRuleNo = null;
      },
    )}else{
    this.Confirmationmsg();
 
  }
  
  }}
 
  updateStatusCode(ruleCode: number, statuscode: number) {
    this.srvDqRule.updateDQRule1(ruleCode,statuscode).subscribe(
      updatedRule => {
        console.log('Status code updated successfully:', updatedRule);
      },
      error => {
        console.error('Error updating status code:', error);
  
      }
    );
    this.ngOnInit();
  }
  getDqRulePage(page: number | null){

    this.srvDqRule.getDqRuleDetailPage(page).subscribe((data:any)=> {

  

      console.log("page",data);

      this.totalPages=data.page_count;

      if (data) {

        const page_count = data.page_count;

        console.log("Page count:", page_count);

    } else {

        console.log("Data is undefined");

    }

    })

  }
  Back(){
    this.router.navigate(['/Layout/DQProfiling'] );
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
    //return value ? value.toLowerCase() : '';
    if (typeof value === 'number') {
      return value.toString();
    } else if (typeof value === 'string') {
      return value.toLowerCase();
    } else {
      return '';
    }
  }
  
  showSuccess() {
    this.toast.success({detail:"Profiled Successfully",duration:5000, position:'topLeft'});
  }
  Confirmationmsg() {
    this.toast.error({ detail: 'Choose the rules for profiling (You can select only one rule).', duration: 10000, position: 'topLeft' });
  
  }
  onPageChange(page: number): void {
    this.currentpage = page;
    this.getDqruleDetail(this.currentpage);
  }
}
