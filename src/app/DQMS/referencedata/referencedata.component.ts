import { Component, ViewChild } from '@angular/core';
import { ReferencedataService } from 'src/app/services/referencedata.service';
import { ReferenceDataMdlInf,ReferenceDataMdlCls, LookupMdlInf } from 'src/app/Models/referencedata';
import { data } from 'jquery';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { permissionMdlInf } from 'src/app/Models/permission';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-referencedata',
  templateUrl: './referencedata.component.html',
  styleUrls: ['./referencedata.component.scss']
})
export class ReferencedataComponent {
  @ViewChild('confirmationModal', { static: true })
  confirmationModal!: ConfirmationModalComponent;
  @ViewChild('successModal', { static: true })
  successModal!: ConfirmationModalComponent;
lookups: LookupMdlInf[]=[];
  selectedReferenceTable: any;
  apiEndPoint!: string;
  referencesdata:ReferenceDataMdlInf[]=[];
  editingRowIndex: number = -1;
  addingNew = false;
  addbutton:boolean = false;
  canSave:boolean = false;
  canClear:boolean =false;
  canDelete:boolean =false;
  canEdit:boolean = false;
  saveButton:boolean=false;
  appName: string = '';
 permissions:permissionMdlInf[]=[];
 rolecode:any;
 editparam:string ='';
  formData = FormGroup;
  codeValue!: string;
  constructor(private srvReferenceData: ReferencedataService,private fb : FormBuilder,private toastr: ToastrService, private toast: NgToastService,
    private spinner: NgxSpinnerService,private auth:AuthService ,private srvPermission:ApppermissionService, private route: ActivatedRoute){
      
  this.rolecode= this.auth.getRolecode();
      console.log('construnctor',this.rolecode)
    }

  ngOnInit(): void{
    this.route.url.subscribe(urlSegments => {
      this.appName = urlSegments[urlSegments.length - 1].path;
    })
	  this.getPermission();
    /* this.formData = this.fb.group({
       code:['',Validators.required],
       name:['',Validators.required]
     })*/
    this.getLookup();
  }
  newRow: ReferenceDataMdlInf = {
    code: '', name: '',
    description: undefined
  };
  getLookup(){
    this.srvReferenceData.getLookup().subscribe(data=>{
      this.lookups = data;
    })
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

  isValidSelection(): boolean {
    return !!this.selectedReferenceTable && this.selectedReferenceTable !== 'DQDomain';
  }

  onChangeOfSelectedTable(event: any) {
    const selectedValue = event?.target?.value;
    this.selectedReferenceTable = selectedValue;

    this.addbutton = !!selectedValue; 
    if (selectedValue) {
       
        
        this.apiEndPoint = 'api' + this.selectedReferenceTable;
        this.addingNew = false;
        this.newRow = {
          code: '',
          name: '',
          description: '' 
        };
        this.spinner.show();
        this.srvReferenceData.getReferenceData(this.apiEndPoint)
            .subscribe(data => {
                this.referencesdata = data;
                this.spinner.hide();
            });
    }
}
addNewRow(): void {
  this.addingNew = true;
}
saveRow(newItem: any):void{
  if(this.canSave){
 // newItem.code = (this.referencesdata.length + 1).toString();
  this.referencesdata.push(newItem);
  this.srvReferenceData.SaveReferenceData(this.apiEndPoint, newItem)
      .subscribe(response => {
       
        //this.ngOnInit();
        this.addingNew = false;
        this.showSave();
        this.onChangeOfSelectedTable({ target: { value: this.selectedReferenceTable } });
      });

}}
editRow(index: number): void {
  this.editingRowIndex = index;
}
saveEdit(updatedItem: any):void{
if(this.canEdit){
const index = this.referencesdata.findIndex(item => item.code === updatedItem.code);

  if (index !== -1 ) {
      this.referencesdata[index] = updatedItem;
      this.srvReferenceData.UpdateReferenceData(this.apiEndPoint, updatedItem)
          .subscribe(response => {
             
              this.editingRowIndex = -1;
              this.showUpdate();
          });
  }

}}
deleteRow(code: string): void {
if(this.canDelete){
  this.codeValue = code;
  if (this.confirmationModal) {
    this.confirmationModal.open();
  }else {
    console.error('Confirmation modal is not available');
  }
}
  }
  onConfirm(): void {
   
    if (this.codeValue) {
      const index = this.referencesdata.findIndex(item => item.code === this.codeValue);
      if (index !== -1) {
        const itemToDelete = this.referencesdata[index];
  
        this.srvReferenceData.DeleteReferenceData(this.apiEndPoint, itemToDelete.code).subscribe(
          (response: any) => {
            this.referencesdata.splice(index, 1); 
            this.confirmationModal.close();
            this.successModal.open();
            setTimeout(() => {
              this.successModal.close();
              // this.showDelete();
            }, 5000);
          },
          (error: any) => {
            console.error('Error deleting reference data:', error);
          }
        );
      } else {
        console.error('Item not found in referencesdata array.');
      }
    }
  }
onCancelDelete(){}
sortColumn: string = '';
sortAscending: boolean = true;
visible: boolean = false;
sortTable(column: string): void {
  if (column === this.sortColumn) {
    this.sortAscending = !this.sortAscending;
  } else {
    this.sortColumn = column;
    this.sortAscending = true;
  }
  this.visible = !this.sortAscending;  
  this.referencesdata.sort((a, b) => {
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
cancelAdd(){
  this.addingNew = false; 
}


cancelEdit(){
  this.editingRowIndex = -1;
}
showSave(){
  this.toast.success({detail:"Data Saved Successfully",duration:5000, position:'topLeft'});
}
showUpdate(){
  this.toast.success({detail:"Data Update Successfully",duration:5000, position:'topLeft'});
}
showDelete(){
  this.toast.success({detail:"Data Deleted Successfully",duration:5000, position:'topLeft'});

}
}
