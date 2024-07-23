import { Component,OnInit ,ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import * as XLSX from 'xlsx';
import { dqruleDetailMdl  } from 'src/app/Models/dqrule';
import { DqruleService } from 'src/app/services/dqrule.service';
import { ActivatedRoute,Router } from '@angular/router';
import { dqProfileViewInf, dqProfilingMdlInf, dqProfilingMdlInfpage, dqProfilingResultGridMdlInf } from 'src/app/Models/dqprofiling';
import { DqprofilingService } from 'src/app/services/dqprofiling.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { DatePipe } from '@angular/common';
import { permissionMdlInf } from 'src/app/Models/permission';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { AuthService } from 'src/app/shared/auth.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-dq-scheduling',
  templateUrl: './dq-scheduling.component.html',
  styleUrls: ['./dq-scheduling.component.scss']
})
export class DqSchedulingComponent {
  loading$ = this.srvProfiling.loading$;
  dqrules: dqruleDetailMdl[] = [];
  profileResultGrids: dqProfilingResultGridMdlInf[]=[];
  gridpages:dqProfilingMdlInfpage[]=[];
  view: dqProfileViewInf[]=[];
  showForm = false;
  ruleNoCode!: string;
  profileCode!: string;
  form!: FormGroup;
  filterData:string ='';
  editparam:string ='';
  result: any;
  ProfilingResults: any;
  binaryData: any;
  jsonData: any;
  validFileName!: string;
  InvalidFileName!: string;
   //for pagenation
   currentpages: number = 1;

   @ViewChild('pagination')
   pagination!: ElementRef;
   encodedData: string[] = [];
   decodedData: any[] = [];
   isFetchingData: boolean = false;
   canSave:boolean = false;
  canClear:boolean =false;
  canDelete:boolean =false;
  canEdit:boolean = false;
  appName: string = '';
 permissions:permissionMdlInf[]=[];
 rolecode:any;
 totalPages!: number;
 sortBy!: string | null;
  sortOrder: 'asc' | 'desc' | null = null;
  SearchTerm: FormControl = new FormControl();
 isdisabled:boolean=true;
  constructor(private srvDqrule: DqruleService,private route: ActivatedRoute,private srvProfiling: DqprofilingService,
    private toastr: ToastrService,private spinner: NgxSpinnerService, private formBuilder: FormBuilder,private model: ElementRef,
    private router: Router,private toast: NgToastService ,private datePipe: DatePipe,  private auth:AuthService ,private srvPermission:ApppermissionService){
    
  this.rolecode= this.auth.getRolecode();
      console.log('construnctor',this.rolecode)
    }
  ngOnInit(): void {
  
    this.route.url.subscribe(urlSegments => {
      this.appName = urlSegments[urlSegments.length - 1].path;
    })
    this.SearchTerm.valueChanges.pipe(
      debounceTime(3000), 
      distinctUntilChanged() 
    ).subscribe((search: string) => {
      this.fetchProfileData(null, search);
    });
	  this.getPermission();
    this.form = this.formBuilder.group({
      profiledatetime:[{ value: '', disabled: true }],
      totaldatacount:[{ value: '', disabled: true }],
      dqscoring:[{ value: '', disabled: true }],
      validdatacount:[{ value: '', disabled: true }],
      invaliddatacount:[{ value: '', disabled: true }],
      lastrunflag:[{ value: '', disabled: true }],
      successflag:[{ value: '', disabled: true }],
      errorMessages:[{ value: '', disabled: true }],
      profilecode:[{ value: '', disabled: true }],
      executionseconds:[{ value: '', disabled: true }],
      validdatalogfile:[''],
      invaliddatalogfile:[''],
      //validName:[{ value: '', disabled: true }],
      //invalidName:[{ value: '', disabled: true }]
    })
    this.route.queryParams.subscribe(params => {
      const ruleNoCode = params['ruleNoCode'];
      this.profileCode = params['profileCode'];
       if (ruleNoCode) {
        const ruleNoCodeNumber = parseInt(ruleNoCode, 10);
        this.getDqruleDetailById(ruleNoCodeNumber);
      } 
       });
    //this.getDqruleDetailById();
    this.fetchProfileData(null); 
    this. getProfilingResultGrid(null);

  }
  getPermission(){
   // this.spinner.show();
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
       // this.spinner.hide();
        })
      }
  fetchProfileData(page: number|null, search?: string, sortBy?: string, sortOrder?: string) {
   /* setTimeout(() => {
      this.spinner.show();
  }, 10000);*/
 //this.spinner.show();
    const profile ={
      ProfileCode : this.profileCode
    };
    const payload: any = {
      ...profile,
      search: search || null ,
      sort_by: sortBy ,
      sort_order: sortOrder
    };

    this.srvProfiling.postView(payload,page).subscribe(data => {
      
      if (data) {
      this.view= data.results;
      this.totalPages=data.page_count;
      console.log('view',data);
        const page_count = data.page_count;
        console.log("Page count:", page_count);
    } else {
        console.log("Data is undefined");
    }
    //this.spinner.hide();
    });
    
  }

  getDqruleDetailById(ruleNoCode:number) {
   // this.spinner.show();
        // Use the value of ruleNos as needed
        this.srvDqrule.getDQRuleDetailById(ruleNoCode).subscribe(data => {
          console.log('DQrule Grid display with selected Rule Code :', data);
          this.dqrules = [data];
          this.validFileName = 'validData '+ data.ruleno;
          this.InvalidFileName = 'InvalidData '+ data.ruleno;
         // this.spinner.hide();
        });
       
  }
 
  getProfilingResultGrid(page: number | null){
   // this.spinner.show();
    this.srvProfiling.getDqProfile(page).subscribe(data=>{
      this.profileResultGrids =data;
     // this.spinner.hide();
    },error => {
      console.error('Error fetching Profiling results Grid:', error);
      
      //this.spinner.hide();
    })
  }
  getProfilingResultGridPage(page: number | null){
  //  this.spinner.show();
    this.srvProfiling.getDqProfilingResultsGridPage(page).subscribe((data:any)=>{
      console.log("page",data);
      this.totalPages=data.page_count;
      if (data) {
        const page_count = data.page_count;
        console.log("Page count:", page_count);
    } else {
        console.log("Data is undefined");
    }
      this.spinner.hide();
    },error => {
      console.error('Error fetching Profiling results Grid:', error);
     
      this.spinner.hide();})
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
     
      const currentPage = this.currentpages;
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
      this.currentpages = page; 
      this. fetchProfileData(this.currentpages);
    } else if (page === 'previous') {
      if (this.currentpages > 1) {
        this.currentpages--; 
        this.fetchProfileData(this.currentpages);
      }
    } else if (page === 'next') {
      this.currentpages++;
      this.fetchProfileData(this.currentpages);
    }
  }*/
  exportToExcel(data: any[],fileNamePrefix: string) {
    const timestamp = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
  });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, `${fileNamePrefix}_${timestamp}`);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: 'application/octet-stream'});
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(data);
    a.download = fileName + '.xlsx';
    a.click();
    document.body.removeChild(a);
   this.closeValidModal();
   this.closeInvalidModal();
  }
  openModalValid() {
    this.route.queryParams.subscribe(params => {
      const profileCode = params['profileCode'];

      this.srvProfiling.getDqProfileByID(profileCode).subscribe((data: any) => {
          try {
              // Parse the JSON string into a JavaScript object
              const validDataLogFile = JSON.parse(data.validdatalogfile);

              // Clear previous table data
              $('#validDataTable tbody').empty();

              if (validDataLogFile && validDataLogFile.length > 0) {
                
                // Get the keys from the first object in the array
                const keys = Object.keys(validDataLogFile[0]);
            
                   const headerHTML = keys.map(key => `<th style=" background-color: cadetblue;
                   color: #ffffff;
                   text-align: center;">${key}</th>`).join('');
                    $('#tableHeaderRow').html(headerHTML);

                    // Populate table with data
                    validDataLogFile.forEach((row: Record<string, any>) => {
                        const rowData = keys.map(key => `<td >${row[key]}</td>`).join('');
                        $('#tableBody').append(`<tr style="text-align:center">${rowData}</tr>`);
                    });
    
                  
                  // Show the modal after populating the table
                  $('#staticBackdropValid').modal('show');
              } 
          } catch (error) {
              console.error('Error parsing validdatalogfile:', error);
          }
      });
  });
}
closeValidModal(){
  $('#staticBackdropValid').modal('hide');
}
/*exportValidToJson() {
  this.route.queryParams.subscribe(params => {
      const profileCode = params['profileCode'];

      this.srvProfiling.getDqProfileByID(profileCode).subscribe((data: any) => {
          try {
              // Parse the JSON string into a JavaScript object
              const validDataLogFile = JSON.parse(data.validdatalogfile);

              if (validDataLogFile && validDataLogFile.length > 0) {
                  const jsonBlob = new Blob([JSON.stringify(validDataLogFile)], { type: 'application/json' });
                  
                  // Get the current date and time
                  const currentDate = new Date();
                  const dateString = currentDate.toISOString().slice(0, 19).replace(/[-T]/g, '').replace(/:/g, '');
                  
                  // Create a filename with the current date and time
                  const filename = `validData_${dateString}.json`;

                  // Create a temporary link element
                  const link = document.createElement('a');
                  link.href = window.URL.createObjectURL(jsonBlob);
                  link.download = filename;

                  // Append the link to the body and trigger the download
                  document.body.appendChild(link);
                  link.click();

                  // Clean up
                  document.body.removeChild(link);
              } else {
                  console.log('Valid Data Log File is empty');
              }
          } catch (error) {
              console.error('Error parsing validdatalogfile:', error);
          }
      });
  });
}*/
exportValidToJson() {
  const varbinaryData = "0x5B007B00220070006500720073006F006E005F006900640022003A0031002C00220061006700650022003A00330030002C00220063006900740079005F006900640022003A0031002C00220043006F0075006E007400720079005F004900440022003A0031002C002200530074006100740065005F004900440022003A0031002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0031003200330034003500360037003800390030002C00220055006E0069007100750065005F004900440022003A0039003800370036003500340033003200310030007D002C007B00220070006500720073006F006E005F006900640022003A0032002C00220061006700650022003A00320035002C00220063006900740079005F006900640022003A0032002C00220043006F0075006E007400720079005F004900440022003A0031002C002200530074006100740065005F004900440022003A0032002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0032003300340035003600370038003900300031002C00220055006E0069007100750065005F004900440022003A0038003700360035003400330032003100300039007D002C007B00220070006500720073006F006E005F006900640022003A0033002C00220061006700650022003A00330035002C00220063006900740079005F006900640022003A0033002C00220043006F0075006E007400720079005F004900440022003A0032002C002200530074006100740065005F004900440022003A0033002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0033003400350036003700380039003000310032002C00220055006E0069007100750065005F004900440022003A0037003600350034003300320031003000390038007D002C007B00220070006500720073006F006E005F006900640022003A0034002C00220061006700650022003A00320038002C00220063006900740079005F006900640022003A0034002C00220043006F0075006E007400720079005F004900440022003A0033002C002200530074006100740065005F004900440022003A0034002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0034003500360037003800390030003100320033002C00220055006E0069007100750065005F004900440022003A0036003500340033003200310030003900380037007D002C007B00220070006500720073006F006E005F006900640022003A0035002C00220061006700650022003A00340030002C00220063006900740079005F006900640022003A0035002C00220043006F0075006E007400720079005F004900440022003A0034002C002200530074006100740065005F004900440022003A0035002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0035003600370038003900300031003200330034002C00220055006E0069007100750065005F004900440022003A0035003400330032003100300039003800370036007D002C007B00220070006500720073006F006E005F0069006400220036002C00220061006700650022003A00320032002C00220063006900740079005F006900640022003A0036002C00220043006F0075006E007400720079005F004900440022003A0036002C002200530074006100740065005F004900440022003A0036002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0036003700380039003000310032003300340035002C00220055006E0069007100750065005F004900440022003A0034003300320031003000390038003700360035007D002C007B00220070006500720073006F006E005F0069006400220037002C00220061006700650022003A00330031002C00220063006900740079005F006900640022003A0037002C00220043006F0075006E007400720079005F004900440022003A0037002C002200530074006100740065005F004900440022003A0037002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0039003000310032003300340035003600370038002C00220055006E0069007100750065005F004900440022003A0032003100300039003800370036003500340033007D002C007B00220070006500720073006F006E005F0069006400220038002C00220061006700650022003A00320037002C00220063006900740079005F006900640022003A0038002C00220043006F0075006E007400720079005F004900440022003A0038002C002200530074006100740065005F004900440022003A0038002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0039003000310032003300340035003600370038002C00220055006E0069007100750065005F004900440022003A0032003100300039003800370036003500340033007D002C007B00220070006500720073006F006E005F0069006400220039002C00220061006700650022003A00320039002C00220063006900740079005F006900640022003A0039002C00220043006F0075006E007400720079005F004900440022003A0039002C002200530074006100740065005F004900440022003A0039002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0039003000310032003300340035003600370038002C00220055006E0069007100750065005F004900440022003A0031003000390038003700360035003400330032007D002C007B00220070006500720073006F006E005F00690064002200310030002C00220061006700650022003A00320036002C00220063006900740079005F006900640022003A00310030002C00220043006F0075006E007400720079005F004900440022003A00310030002C002200530074006100740065005F00490044002200310030002C0022004D006F00620069006C0065005F004E0075006D0062006500720022003A0031003200330034003500360037003800390030002C00220055006E0069007100750065005F004900440022003A0039003800370036003500340033003200310030007D005D00";

// Remove '0x' prefix
const hexString = varbinaryData.substr(2);

// Convert hex string to byte array
const bytes = [];
for (let i = 0; i < hexString.length; i += 2) {
  bytes.push(parseInt(hexString.substr(i, 2), 16));
}

// Convert byte array to string
const decodedData = new TextDecoder().decode(new Uint8Array(bytes));

console.log(decodedData);

}
/*exportValidToJson() {
  this.route.queryParams.subscribe(params => {
    const profileCode = params['profileCode'];

    this.srvProfiling.getDqProfileByID(profileCode).subscribe(
      (data) => {
        console.log('Received data:', data); // Log the received data

        // Assert the type of data to 'any' to avoid type errors
        const dataObject: any = data;
        if (typeof dataObject.validdatalogfile === 'string') {
          // Handle the case where validdatalogfile is a string
          console.log('validdatalogfile is a string:', dataObject.validdatalogfile);
          const cleanedData = this.preprocessData(dataObject.validdatalogfile);
          console.log('Cleaned data:', cleanedData);
          try {
            const jsonData = this.parseNonStandardJSON(cleanedData);
            console.log('Parsed JSON data:', jsonData);
            // Proceed with further processing of the parsed JSON data
          } catch (error) {
            console.error('Error parsing JSON data:', error);
            // Handle parsing error accordingly, e.g., provide default values
          }
        } else if (typeof dataObject.validdatalogfile === 'object') {
          // Handle the case where validdatalogfile is an object
          console.log('validdatalogfile is an object:', dataObject.validdatalogfile);
          // Proceed with further processing of the object
        } else {
          console.error('Unexpected type of validdatalogfile:', typeof dataObject.validdatalogfile);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  });
}*/
preprocessData(data: string): string {
  // Remove non-printable ASCII characters
  const printableCharsRegex = /[^\x20-\x7E]/g;
  const cleanedData = data.replace(printableCharsRegex, '');

  // Remove leading and trailing whitespace
  const trimmedData = cleanedData.trim();

  return trimmedData;
}

cleanBinaryData(binaryData: string): string {
  // Remove the 'b' character and any other unwanted characters
  const cleanedData = binaryData.replace(/^b'|'$/g, '');
  return cleanedData;
}

parseNonStandardJSON(data: string): any {
  // Implement your custom parsing logic here
  // For example, you can remove the 'b' character and parse the JSON
  const cleanedData = data.replace(/^b'|'$/g, '');
  return JSON.parse(cleanedData);
}



decodeBinaryData(encodedData: string): any {
  try {
    // Parse the JSON string
    const decodedObject = JSON.parse(encodedData);

    return decodedObject;
  } catch (error) {
    console.error('Error decoding data:', error);
    // Handle the error accordingly
    return null;
  }
}




openModalInvalid() {
  this.route.queryParams.subscribe(params => {
      const profileCode = params['profileCode'];

      this.srvProfiling.getDqProfileByID(profileCode).subscribe((data: any) => {
          
          try {
              // Parse the JSON string into a JavaScript object
              const invalidDataLogFile = JSON.parse(data.invaliddatalogfile);
            
              // Clear previous table data
              $('#tableHeaderRowInvalid').empty();
              $('#tableBodyInvalid').empty();

              if (invalidDataLogFile && invalidDataLogFile.length > 0) {
                  // Get the keys from the first object in the array
                  const keys = Object.keys(invalidDataLogFile[0]);
              

                  // Generate table headers
                  const headerHTML = keys.map(key => `<th style=" background-color: cadetblue;
                  color: #ffffff;
                  text-align: center;">${key}</th>`).join('');
                  $('#tableHeaderRowInvalid').html(headerHTML);

                  // Populate table with data
                  invalidDataLogFile.forEach((row: Record<string, any>) => {
                      const rowData = keys.map(key => `<td>${row[key]}</td>`).join('');
                      $('#tableBodyInvalid').append(`<tr style="text-align:center">${rowData}</tr>`);
                  });

                  // Show the modal after populating the table
                  $('#staticBackdropInvalid').modal('show');
              } 
          } catch (error) {
              console.error('Error parsing invaliddatalogfile:', error);
          }
      });
  });
}
closeInvalidModal(){
  $('#staticBackdropInvalid').modal('hide');
}
exportValidtoExcel(){
  if(this.canEdit){
    this.spinner.show();
  this.route.queryParams.subscribe(params => {
    const profileCode = params['Code'];

    this.srvProfiling.getDqProfileByID(profileCode).subscribe((data: any) => {
        
        try {
            // Parse the JSON string into a JavaScript object
            const validDataLogFile = JSON.parse(data.validdatalogfile);
            console.log('Valid Data Log File:', validDataLogFile); // Log the parsed data

            // Clear previous table data
            $('#tableHeaderRowInvalid').empty();
            $('#tableBodyInvalid').empty();

            if (validDataLogFile && validDataLogFile.length > 0) {
              this.exportToExcel(validDataLogFile,`${this.validFileName}`);
                // Get the keys from the first object in the array
                const keys = Object.keys(validDataLogFile[0]);
                console.log('Keys:', keys); // Log the keys

                // Generate table headers
                const headerHTML = keys.map(key => `<th style=" background-color: cadetblue;
                color: #ffffff;
                text-align: center;">${key}</th>`).join('');
                $('#tableHeaderRowInvalid').html(headerHTML);

                // Populate table with data
                validDataLogFile.forEach((row: Record<string, any>) => {
                    const rowData = keys.map(key => `<td>${row[key]}</td>`).join('');
                    $('#tableBodyValid').append(`<tr style="text-align:center">${rowData}</tr>`);
                });
            } else {
                console.log('Valid Data Log File is empty');
                this.showValid();
            }
        } catch (error) {
            console.error('Error parsing invaliddatalogfile:', error);
        }
        this.spinner.hide();
    });
});
}
}
exportInvalidtoExcel(){
  if(this.canEdit){
    this.spinner.show();
  this.route.queryParams.subscribe(params => {
    const profileCode = params['Code'];

    this.srvProfiling.getDqProfileByID(profileCode).subscribe((data: any) => {
        console.log('Data:', data); // Log the retrieved data
        try {
            // Parse the JSON string into a JavaScript object
            const invalidDataLogFile = JSON.parse(data.invaliddatalogfile);
            console.log('Invalid Data Log File:', invalidDataLogFile); // Log the parsed data

            // Clear previous table data
            $('#tableHeaderRowInvalid').empty();
            $('#tableBodyInvalid').empty();

            if (invalidDataLogFile && invalidDataLogFile.length > 0) {
              this.exportToExcel(invalidDataLogFile,`${this.InvalidFileName}`);
                // Get the keys from the first object in the array
                const keys = Object.keys(invalidDataLogFile[0]);
                console.log('Keys:', keys); // Log the keys

                // Generate table headers
                const headerHTML = keys.map(key => `<th style=" background-color: cadetblue;
                color: #ffffff;
                text-align: center;">${key}</th>`).join('');
                $('#tableHeaderRowInvalid').html(headerHTML);

                // Populate table with data
                invalidDataLogFile.forEach((row: Record<string, any>) => {
                    const rowData = keys.map(key => `<td>${row[key]}</td>`).join('');
                    $('#tableBodyInvalid').append(`<tr style="text-align:center">${rowData}</tr>`);
                });
            } else {
                console.log('Invalid Data Log File is empty');
                this.showInvalid();
            }
        } catch (error) {
            console.error('Error parsing invaliddatalogfile:', error);
        }
        this.spinner.hide();
    });
});
}
}
View(result:any){
  console.log(result);
  this.showForm = !this.showForm;
  const ruleNoCode = this.ruleNoCode;
  const booleanToString = (value: boolean) => value ? 'Yes' : 'No';

  const successFlagToString = (value: boolean) => value ? 'Success' : 'Failed';
  const [datePart, timePart] = result.ProfileDatetime.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  const parsedDate = new Date(year, month - 1, day, hours, minutes);
  const formattedDate = this.datePipe.transform(parsedDate, 'dd/mm/yyyy HH:mm');
  const errorMessages = `ValidErrorMessage:${result.ErrorMsgValid}\nInvalidErrorMessage:${result.ErrorMsgInvalid}\nTotalErrorMessage:${result.ErrorMsgTotal}`;

  this.form.patchValue({
    profiledatetime: formattedDate,
    totaldatacount: result.TotalDataCount,
    dqscoring: result.DQScoring,
    validdatacount: result.ValidDataCount,
    invaliddatacount: result.InvalidDataCount,
    lastrunflag: booleanToString(result.LastRunFlag),
    successflag: successFlagToString(result.SuccessFlag),
    errorMessages: errorMessages,
    profilecode: result.JobName,
    executionseconds: result.ExecutionSeconds,

    validdatalogfile: result.validdatalogfile,
    invaliddatalogfile: result.invaliddatalogfile
    })
    if (!result.JobName) {
      this.form.get('profilecode')?.disable();
  }
   this.route.queryParams.subscribe(params => {
    const ruleNoCode = params['ruleNoCode'];
   this.router.navigate([], { relativeTo: this.route, queryParams: { ruleNoCode: ruleNoCode,profileCode: result.DQProfilingCode,Code:result.DQProfilingResultsCode}});
})
}

/*View(result:number,profile:number){
 
  this.isFetchingData = true;
  const ruleNoCode = this.ruleNoCode;

  console.log('result',result);
  console.log('profile',profile);
  
  this.srvProfiling.getDqProfileByID(profile).subscribe(data=>{
    console.log('data',data);
   

    // Patch form values after fetching data
    this.patchFormValues(profile);
    this.isFetchingData = false;
    this.showForm = true;
  }, error => {
    // Handle any errors
    console.error('Error fetching data:', error);
    // Reset the flag in case of error
    this.isFetchingData = false;
  });


  
   // this.router.navigate(['/DQScheduling'], { queryParams: { profileCode: result.code ,ruleNoCode: ruleNoCode}});
   this.route.queryParams.subscribe(params => {
    const ruleNoCode = params['ruleNoCode'];
   this.router.navigate([], { relativeTo: this.route, queryParams: { ruleNoCode: ruleNoCode,profilecode:result,Code:profile}});
})
}


patchFormValues(result: number) {

  console.log('resultform',result);
  const booleanToString = (value: boolean) => value ? 'Yes' : 'No';

const successFlagToString = (value: boolean) => value ? 'Success' : 'Failed';

if (!this.isFetchingData) {
  // Reset the form to its initial state
  this.form.reset();
}
  // Find the correct object based on the result code
  const selectedResult = this.profileResultGrids.find(item => item.code === result);
   console.log('selectedResult',selectedResult)
  if (selectedResult) {
      // Patch the values into the form
      this.form.patchValue({
          profiledatetime: selectedResult.profiledatetime,
          totaldatacount: selectedResult.totaldatacount,
          dqscoring: selectedResult.dqscoring,
          validdatacount: selectedResult.validdatacount,
          invaliddatacount: selectedResult.invaliddatacount,
          lastrunflag: booleanToString(selectedResult.lastrunflag),
          successflag: successFlagToString(selectedResult.successflag),
          errorMessages: `ValidErrorMessage:${selectedResult.errormsgvalid}\nInvalidErrorMessage:${selectedResult.errormsginvalid}\nTotalErrorMessage:${selectedResult.errormsgtotal}`,
          profilecode: selectedResult.profilecode.schedulecode.name,
          executionseconds: selectedResult.executionseconds,
          validdatalogfile: selectedResult.validdatalogfile,
          invaliddatalogfile: selectedResult.invaliddatalogfile
      });
  }else {
    // Handle the case where selectedResult is undefined
    console.error('Selected result is undefined for profile:', result);
    // You can choose to display an error message or handle the situation in another appropriate manner
  }
 
}*/
  toggleFormVisibility() {
    this.showForm = !this.showForm;

  }
  visible:boolean=false;
  sortColumn: string = '';
sortAscending: boolean = true;
sortTable(column: string):void{
  if (this.sortBy === column) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortBy = column;
    this.sortOrder = 'asc';
  }
const search = this.SearchTerm.value;
this.fetchProfileData(null,search,this.sortBy,this.sortOrder)
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
 showValid(){
  this.toast.error({detail:'No ValidData',duration:5000, position:'topLeft'})
 } 
 showInvalid(){
  this.toast.error({detail:'No InvalidData',duration:5000, position:'topLeft'})
 }
 onPageChange(page: number): void {
  this.currentpages = page;
  this.fetchProfileData(this.currentpages);
}
}
