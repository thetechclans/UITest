import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DqruleService } from 'src/app/services/dqrule.service';
import { DQCardService } from 'src/app/services/dqcard.service';
import { dqcardInf,dqcardDetailInf, dqcardRuleGridInf, dqCardLinkInf, linkRuleInf, linkMdlInf } from 'src/app/Models/dqcard';
import { dqRuleMdlInfpage, dqruleDetailCls, dqruleDetailMdl, dqruleInf } from 'src/app/Models/dqrule';
import {DepartmentService} from 'src/app/services/department.service';
import { departmentMdl } from 'src/app/Models/department';
import { ToastrService } from 'ngx-toastr';
import { Tab } from 'bootstrap';
import { categoryMdlInf } from 'src/app/Models/dqcategory';
import { DqcategoryService } from 'src/app/services/dqcategory.service';
import { NgToastService } from 'ng-angular-popup';
import { permissionMdlInf } from 'src/app/Models/permission';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/DQMS/confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-data-quality-card',
  templateUrl: './data-quality-card.component.html',
  styleUrls: ['./data-quality-card.component.scss']
})
export class DataQualityCardComponent {
  @ViewChild('newConnectionModal')
  newConnectionModal!: ElementRef;
  @ViewChild('confirmationModal', { static: true })
  confirmationModal!: ConfirmationModalComponent;
  @ViewChild('successModal', { static: true })
  successModal!: ConfirmationModalComponent;
  showForm = false;
  form!: FormGroup;
  filterData:string ='';
  editparam:string ='';
  showGridBody: boolean = false;
  selectedDqCard:any;
  dqcards: dqcardInf[]=[];
  dqruledetails: dqruleDetailMdl[]=[];
  departments: departmentMdl[]=[];
  categories: categoryMdlInf[]=[];
  linkRules: dqcardRuleGridInf[]=[];
  showGrid= false;//grid
  showGrid1= false;//grid
  showLinkedGrid: boolean = false;
  links: dqCardLinkInf[] = [];
  selectedRows: { [key: number]: boolean } = {};
  checkboxes: boolean[] = [];
  linkedRuleCount: number = 0;
  addNewClicked: boolean = false;
  showAddNewButton: boolean = false;
  showEditNewButton: boolean = false;
  canSave:boolean = false;
  canDelete:boolean =false;
  canEdit:boolean = false;
  saveButton:boolean=false;
  appName: string = '';
 permissions:permissionMdlInf[]=[];
 rolecode:any;
  currentpage: number = 1;
  pages: dqRuleMdlInfpage[]=[];
  dqcardCode:any;
  totalPages: number = 0;
  errorMessage!:string;
 @ViewChild('pagination')
  pagination!: ElementRef;
  editedCardId: number | null = null;
  currentSortField: string = ''; 
   currentSortOrder: string = '';
   linkedSearchTerm: FormControl = new FormControl();
   unlinkedSearchTerm: FormControl = new FormControl();
   selectedTab: 'linked' | 'unlinked' = 'linked';
   sort_by: string | null = null;
  sort_order: 'asc' | 'desc' | null = null;
  private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();  
  dqcard: any;
  code: any;
  currentCode: any;
  constructor(private spinner: NgxSpinnerService,private formBuilder: FormBuilder,private srvDqRule: DqruleService,private srvDqCard:DQCardService,
    private srvDepartment: DepartmentService,private toastr: ToastrService,private srvCategory: DqcategoryService, private toast: NgToastService,
    private auth:AuthService ,private srvPermission:ApppermissionService, private route: ActivatedRoute)
   {
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
      this.getDqcard(this.currentpage);
    }); 
    this.linkedSearchTerm.valueChanges.pipe(
      debounceTime(3000), 
      distinctUntilChanged() 
    ).subscribe((search: string) => {
      if (this.selectedTab === 'linked') {
        this.link(this.selectedDqCard ? this.selectedDqCard.code : null, true,this.currentpage, search);
      }
    });
    this.unlinkedSearchTerm.valueChanges.pipe(
      debounceTime(3000), // wait for 3 seconds
      distinctUntilChanged()
    ).subscribe((search: string) => {
      if (this.selectedTab === 'unlinked') {
        this.link(this.selectedDqCard ? this.selectedDqCard.code : null, false, this.currentpage,search);
      }
    });
    this.getPermission();
    this.form = this.formBuilder.group({
      code:[''],
      name:['',Validators.required],
      cardthreshold:['',Validators.required],
      cardowner:['',Validators.required],
      cardowneremail:['',[Validators.required, Validators.email]],
      departmentcode:['',Validators.required],
      cardcategorycode:['',Validators.required],
      isactive:[''],
      isvisible:['']
    })
    this.getDqcard(null);
    this.getDqRule();
    this.getDepartment();
    this.getCategory();
    this.getDqCardPage(this.currentpage);
    //this.getLinkGrid();
    this.links.forEach(() => {
      this.checkboxes.push(false);
    });
  }
 
        
  selectTab(tab: 'linked' | 'unlinked'): void {
    this.selectedTab = tab;
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
  toggleLinkedGridVisibility() {
    this.showForm = !this.showForm;
    this.showGridBody =false;
    this.showAddNewButton = true;
    this.showEditNewButton = false;
    if (this.showForm) {
      // If "Add New Card" button is clicked, only show unlinked rule table
      this.showLinkedGrid = false;
      this.selectedTab = 'unlinked';
      this.links = []; // Clear linked rule data
      this.addNewClicked = true;
    } else {
      // If not clicked, toggle the visibility of the linked rule table
     
        this.selectedTab = 'linked';
        this.showLinkedGrid = true;
      
        if (this.addNewClicked && this.links.length === 0) {
          this.onAddLinkClick(true); // Call onAddLinkClick function when showing the linked rule tab
        }
      
      this.addNewClicked = false;
    }
  }
  
  logTabSelection(): void {
    console.log('Selected Tab:', this.selectedTab);
  }
  onInputChanges() {
    this.searchSubject.next();
  } 
  getDqcard(page: number | null) {
    let ordering = this.currentSortField ? `${this.currentSortOrder}${this.currentSortField}` : null;
    this.spinner.show();
    this.srvDqCard.getDQCardDetail(page,ordering,this.filterData).subscribe((data:any) => {
    
      this.spinner.hide();
      let results = data.results

      if (results && results.length > 0) {
        this.dqcards = results;
          this.totalPages = data.page_count
        }
    },error => {
      this.spinner.hide();}); 
   
  }
  getDqCardPage(page: number){
    this.srvDqCard.getDQCardDetailPage(page).subscribe((data:any)=> {
      console.log("page",data);
      this.totalPages=data.page_count;
      this.currentpage = page;
      if (data) {
        const page_count = data.page_count;
        console.log("Page count:", page_count);
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
  loadPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentpage = page; 
      this.getDqcard(this.currentpage);
    } else if (page === 'previous') {
      if (this.currentpage > 1) {
        this.currentpage--; 
        this.getDqcard(this.currentpage);
      }
    } else if (page === 'next') {
      this.currentpage++;
      this.getDqcard(this.currentpage);
    }
  }*/
  getDqRule() {
   this.spinner.show()
    this.srvDqRule.getDQRuleDetail().subscribe((data:any) => {
   
      this.spinner.hide();
      if (data && data.length > 0) {
        // If there are existing records, append empty rows if needed
        const remainingCount = Math.max(0, 10 - data.length);
        if (remainingCount > 0) {
          const emptyRows = Array(remainingCount).fill({
            code: '',
            ruleno: '',
            dataelement: '',
            categorycode: '',
            prioritycode: '',
            dqdomaincode: '',
            dqthresholdpercentage: null,
            statuscode: '',
            overallvalidationflag: ''
          });
          this.dqruledetails = [...data, ...emptyRows];
       
        } else {
          
          this.dqruledetails = data;
        }
      } else {
       
        this.dqruledetails = Array(10).fill({
          code: '',
          ruleno: '',
          dataelement: '',
          categorycode: '',
          prioritycode: '',
          dqdomaincode: '',
          dqthresholdpercentage: null,
          statuscode: '',
          overallvalidationflag: ''
        });
      }
    }); 
  }
  getDepartment(){
    this.srvDepartment.getDepartment().subscribe((data:any) => {
   
      this.departments = data;
    });
  }
  getCategory(){
    this.srvDqCard.getCategory().subscribe((data:any) => {
    
      this.categories = data;
    });
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  saveDqcard(){
    if(this.canEdit){
    this.markFormGroupTouched(this.form)
    if (this.form.valid) {
      const formData = this.form.value;
    
      if (!formData.code) { 
        this.srvDqCard.addDQCard(formData).subscribe(
          response => {
            
            this.form.patchValue({code:response.code})
            this.showSuccess();
            this.showGridBody = true;
            //this.form.reset();
            //this.link(response.code,true)
            this.selectedDqCard=response
          },(error) => {
            console.log('error',error.error.error)
            this.errorMessage = error.error.error;
            if (this.errorMessage){
            this.showDQerror(this.errorMessage);
            }else{
              this.showerror();
            }
          }
        );
    }else{
      this.srvDqCard.updateDQCard(formData).subscribe(
        response => {
         this.showUpdate();
          
        }
      );
    }
    this.editedCardId =formData.code;
  }else{
    this.showerror();
  }
}
  }
editDqCard(dqcard:any):void{
  this.showGridBody = true;
  this.selectedDqCard = dqcard;
  this.editedCardId =dqcard.code;
 this.dqcardCode = dqcard.code;
  console.log(this.dqcardCode)
  this.showForm = !this.showForm;
  this.form.patchValue({
    code:this.dqcardCode,
    name:dqcard.name,
    cardthreshold: dqcard.cardthreshold,
    cardowner: dqcard.cardowner,
    cardowneremail: dqcard.cardowneremail,
    departmentcode: dqcard.departmentcode.code,
    cardcategorycode:dqcard.cardcategorycode.code,
    isactive:dqcard.isactive,
    isvisible:dqcard.isvisible
  })
    
    this.link(dqcard.code,true,this.currentpage);
    this.showEditNewButton =true;
    this.showAddNewButton=false;
   
}
/*onLinkClick(isLinked: boolean): void {
  console.log('trigger')
  // Check if it's linked or unlinked
  console.log('isLinked',isLinked)
  if (isLinked) {
    //this.linkedRuleCount = this.links.length;
    console.log('this.selectedDqCard:', this.selectedDqCard);
    if (this.selectedDqCard && this.selectedDqCard.Code !== undefined) {
      console.log('this.selectedDqCard.Code:', this.selectedDqCard.Code);
      this.link(this.selectedDqCard.Code);
    } else {
      // If selectedDqCard.code is null, do not load the data
      this.links = [];
      this.selectedTab = 'linked';
    }
  } else {
    // If it's unlinked, pass null
    this.link(null);

  }
}
link(code: number | null | undefined):void{
  this.spinner.show();
  const requestCode = code !== undefined ? code : null;
  this.srvDqCard.postLink(requestCode).subscribe(
    (response: any)=>{
      console.log('Response from API:', response);
        this.links = response;
        this.linkedRuleCount = this.links.length;
      console.log('data',this.links)
      console.log('Number of array data in linked rule:', this.links.length);
      this.spinner.hide();
    },
    error => {
      console.error('Error occurred while posting link:', error);
      // Optionally, handle the error or show a user-friendly message
    }
  )
}*/
onAddLinkClick(isAddNew: boolean): void {
 
  const code = this.selectedDqCard && this.selectedDqCard.code ? this.selectedDqCard.code : null;
  this.srvDqCard.postLink({ code: code,is_linked:isAddNew},this.currentpage).subscribe(
    (response: any) => {
    
      this.links = response.results;
      
    },)
}

onLinkClick(isLinked: boolean): void {

  // Check if it's linked or unlinked
  if (isLinked) {
    if (this.selectedDqCard && this.selectedDqCard.code) {
      this.link(this.selectedDqCard.code,isLinked,this.currentpage,this.linkedSearchTerm.value);
    } else {
      console.warn('No card selected. Skipping link operation.');
    }
  } else {
    // If it's unlinked, pass null
    this.link(this.selectedDqCard ? this.selectedDqCard.code : null,isLinked,this.currentpage,this.unlinkedSearchTerm.value);
  
    this.links = []; 
    this.selectedTab = 'unlinked';
    this.checkboxes = [];
  }

}

link(code: number | string | null, isLinked: boolean, page: number, search?: string, sort_by?: string,sort_order?: string): void {
  let payload: { code: number | string | null, is_linked: boolean, search?: string, sort_by?: string, sort_order?: string }
  
  if (code === null) {
    payload = { code: null, is_linked: isLinked }; 
  } else {
    payload = { code: code !== null ? Number(code) : null, is_linked: isLinked }; 
  }
  if (search) {
    payload.search = search;
  }
  if (sort_by) {
    payload.sort_by = sort_by;
  }
  if (sort_order) {
    payload.sort_order = sort_order;
  }
  this.currentCode = payload.code;
  console.log('Payload being sent to postLink:', payload);
 
  this.srvDqCard.postLink(payload,page).subscribe(
    (response: linkMdlInf) => {
      this.links = response.results;
      console.log('this.link',this.links)
      this.totalPages = response.page_count

    }
  );

}

onCheckboxChange(index: number) {

  
  this.selectedRows[index] = !this.selectedRows[index];
  this.checkboxes[index] = this.selectedRows[index];
 
}
/*linkRule(){
  this.selectedRows = [];
  const dqcardCode = this.selectedDqCard.code;
  console.log('dqcardCode',dqcardCode)
  const selectedCodes: string[] = [];
    this.links.forEach((link, index) => {
      if (this.selectedRows[index]) {
        selectedCodes.push(String(link.Code)); 
      }
    });
    console.log('Number of array data:', selectedCodes.length);
    console.log(selectedCodes);
    if (!dqcardCode) {
      console.warn('dqcardCode is null or undefined. Skipping linkRule operation.');
      return; // Exit the function if dqcardCode is null or undefined
    }
    selectedCodes.forEach(code => {
      const payload: linkRuleInf = {
        dqcardcode: dqcardCode, // Assuming dqcardcode is available in selectedDqCard
        dqrulecode: code // Use current code from selectedCodes array
      };
      this.spinner.show()
      this.srvDqCard.linkRule(payload).subscribe(response => {
        console.log('Response:', response);
        this.link(null);
        this.showLink();
        this.spinner.hide();
      }, error => {
        console.error('Error:', error);
      });
    });
   
    this.selectedRows = [];
    this.checkboxes = [];
}*/
refreshScoreInSP(code:number){
  const payload={
    "DQCardCode" : code
  }
this.srvDqCard.refreshSP(payload).subscribe(data=>{
  console.log(data);
})
}
linkRule() {
  if(this.canEdit){
  this.dqcardCode = this.selectedDqCard?.code;
  console.log('dqcardCode',this.dqcardCode)
  if (!this.dqcardCode) {
    console.warn('dqcardCode is null or undefined. Skipping linkRule operation.');
    return;
  }

  const selectedCodes: string[] = this.links
    .filter((link, index) => this.selectedRows[index])
    .map(link => String(link.DQRuleCode));

  console.log('Selected Codes:', selectedCodes);

  if (selectedCodes.length === 0) {
    console.warn('No rules selected. Skipping linkRule operation.');
    return;
  }

  this.spinner.show();

  selectedCodes.forEach(code => {
    const payload: linkRuleInf = {
      dqcardcode: this.dqcardCode,
      dqrulecode: code
    };

    this.srvDqCard.linkRule(payload).subscribe(
      response => {
        this.showLink();
        this.onLinkClick(false);
        this.link(this.dqcardCode,false,this.currentpage);
        this.spinner.hide();
      }
      );
      setTimeout(() => {
        this.refreshScoreInSP(this.dqcardCode);
      }, 5000); //
  });

  // Clear selection and checkboxes after linking rules
  this.selectedRows = [];
  this.checkboxes = [];

  }
  
}

unlinkRule() {
  // Clear selected rows and show spinner
  this.selectedRows = [];
  this.spinner.show();

  // Collect selected card numbers
  const selectedCardNumbers: string[] = this.links
    .filter((link, index) => this.checkboxes[index])
    .map(link => String(link.code));
console.log(this.links)
  if (selectedCardNumbers.length === 0) {
    console.warn('No checkboxes selected.');
    this.spinner.hide();
    return;
  }

  console.log('selectedCardNumbers', selectedCardNumbers);

  // Process unlinking
  const unlinkPromises = selectedCardNumbers.map(cardNumber =>
    this.srvDqCard.deleteUnlink(cardNumber).toPromise()
  );

  Promise.all(unlinkPromises)
    .then(() => {
      this.resetCheckboxes();
      this.selectedRows = [];
      this.showUnlink();
      this.onLinkClick(true);
      this.link(this.selectedDqCard.code, true,this.currentpage);
    })
    .catch(error => {
      console.error('Error unlinking cards:', error);
    })
    .finally(() => {
      this.spinner.hide();
      setTimeout(() => {
        this.refreshScoreInSP(this.dqcardCode);
      }, 5000); 
    });
    
}
resetCheckboxes() {
  this.checkboxes = this.checkboxes.map(() => false);
}
deleteDqCard(dqcard:any):void{
  if (this.canDelete) {
    this.dqcard = dqcard;
    if (this.confirmationModal) {
      this.confirmationModal.open();
    }else {
      console.error('Confirmation modal is not available');
    }
  } 
  
}
onConfirm() {
  if(this.dqcard){
    this.srvDqCard.deleteDQCard(this.dqcard.code).subscribe(() => {this.dqcards = this.dqcards.filter((row) => row.code !== this.dqcard.code);
      this.confirmationModal.close(); 
        this.successModal.open();
        setTimeout(() => { 
          this.successModal.close();
         // this.showDelete();
        }, 5000);
  });
}
}
onCancelDelete() {
  console.log('Deletion canceled');
}
Clear(){
  this.form.reset();
}
Back(){
  this.showForm = !this.showForm;
 
  this.ngOnInit();
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
   this.getDqcard(this.currentpage)
  }
  /*sortTable1(column: string): void {
    if (column === this.sortColumn) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
  
    this.links.sort((a, b) => {
      const aValue = this.getColumnValue(a, column);
      const bValue = this.getColumnValue(b, column);
  
      if (aValue === '' && bValue !== '') {
        return 1;
      } else if (aValue !== '' && bValue === '') {
        return -1;
      }
      // Use the localeCompare function directly for string comparison
      return this.sortAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }*/
  
  sortTable1(column: string):void{
    console.log("func called")
    console.log(column)
    if (this.sort_by === column) {
      this.sort_order = this.sort_order === 'asc' ? 'desc' : 'asc';
      
    } else {
      this.sort_by = column;
      this.sort_order = 'asc';
      
    }
    
    const search = this.selectedTab === 'linked' ? this.linkedSearchTerm.value : this.unlinkedSearchTerm.value;
    this.link(this.selectedDqCard ? this.selectedDqCard.code : null, this.selectedTab === 'linked',this.currentpage, search, this.sort_by, this.sort_order);
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
  showSuccess() {
    this.toast.success({detail:"DQ Scorecards",summary:'Data Saved Succesfully !',duration:5000, position:'topLeft'});
  }
  showerror(){
  this.toast.error( {detail:"DQ Scorecards",summary:'Data not Saved Succesfully !',duration:5000, position:'topLeft'});
  }
  showDQerror(errorMsg:string){
    this.toast.error( {detail: errorMsg,duration:5000, position:'topLeft'});
    }
  showUpdate(){
    this.toast.success( {detail:"DQ Scorecards",summary:'Data updated Succesfully !',duration:5000, position:'topLeft'});
   
  }
  showLink(){
    this.toast.success({detail:"Rules Linked",duration:5000, position:'topLeft'});
  }
  showUnlink(){
    this.toast.success({detail:"Rules Unlinked",duration:5000, position:'topLeft'});
  }
  showDelete(){
    this.toast.success(  {detail:"DQ Scorecards",summary:'Data Deleted Succesfully !',duration:5000, position:'topLeft'});
  }
//spinner

loadData(): void {
  // Show the spinner
  this.spinner.show();

  // Simulate an asynchronous operation
  setTimeout(() => {
    // Hide the spinner after the operation is complete
    this.spinner.hide();
  }, 3000);
}
onPageChange(page: number): void {
  this.currentpage = page;
  this.getDqcard(this.currentpage);
}
onPagelink(page: number): void {
  this.currentpage = page;
  
  const search = this.selectedTab === 'linked' ? this.linkedSearchTerm.value : this.unlinkedSearchTerm.value;
  this.link(this.currentCode,true,this.currentpage,search);
}

onPageunlink(page: number): void {
  this.currentpage = page;
  const search = this.selectedTab === 'linked' ? this.linkedSearchTerm.value : this.unlinkedSearchTerm.value;
  this.link(this.currentCode,false,this.currentpage,search);
}

}