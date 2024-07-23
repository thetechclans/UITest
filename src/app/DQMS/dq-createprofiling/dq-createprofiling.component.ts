import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dqruleDetailMdl } from 'src/app/Models/dqrule';
import { DqruleService } from 'src/app/services/dqrule.service';
import {
  scheduleInf,
  scheduleMdlCls,
  scheduleFrequencyInf,
  scheduleMdlInfpage,
  statusscheduleMdlInf,
  schedulefrequencyMdlInf,
} from 'src/app/Models/schedule';
import { SchedulingService } from 'src/app/services/scheduling.service';
import { FrequencyService } from 'src/app/services/frequency.service';
import { frequencyMdlInf } from 'src/app/Models/frequency';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dqProfileViewInf,
  dqProfilingMdlInf,
  dqProfilingResultGridMdlInf,
} from 'src/app/Models/dqprofiling';
import { DqprofilingService } from 'src/app/services/dqprofiling.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { permissionMdlInf } from 'src/app/Models/permission';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
@Component({
  selector: 'app-dq-createprofiling',
  templateUrl: './dq-createprofiling.component.html',
  styleUrls: ['./dq-createprofiling.component.scss'],
})
export class DqCreateprofilingComponent {
  dqrules: dqruleDetailMdl[] = [];
  schedules: schedulefrequencyMdlInf[] = [];
  frequencies: frequencyMdlInf[] = [];
  profileResultGrids: dqProfilingResultGridMdlInf[] = [];
  profilings: dqProfilingMdlInf[] = [];
  view: dqProfileViewInf[] = [];
  scheduleCodes: any[] = [];
  canSave: boolean = false;
  canClear: boolean = false;
  canDelete: boolean = false;
  canEdit: boolean = false;
  saveButton: boolean = false;
  appName: string = '';
  permissions: permissionMdlInf[] = [];
  Gridpages: scheduleMdlInfpage[] = [];
  statusSchedule!: statusscheduleMdlInf;
  rolecode: any;
  showForm = false;
  form!: FormGroup;
  editparam: string = '';
  filterData: string = '';
  showWeekly: boolean = false;
  showMonthly: boolean = false;
  endDateSelected: boolean = false;
  noEndDateSelected: boolean = false;
  showModal: boolean = false;
  currentSortField: string = '';
  currentSortOrder: string = '';
  selectedScheduleCode!: string;
  profileCode!: string;
  scheduleCode: any;
  dqRuleCode: any;
  ProfilingResults: any;
  schedule: any;
  totalPages: number = 0;
  errorMessage!: string;
  ruleNoCode: any;
  modal: any;
  //for pagenation
  currentpage: number = 1;
  currentpages: number = 1;
  searchTerm: string = '';
  editedScheduleId: number | null = null;
  ruleno:any
  sort_by: string | null | undefined = null;
  sort_order: 'asc' | 'desc' | null = null;
  
  private onDestroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private srvDqrule: DqruleService,
    private route: ActivatedRoute,
    private router: Router,
    private srvSchedule: SchedulingService,
    private formBuilder: FormBuilder,
    private srvFrequency: FrequencyService,
    private srvProfiling: DqprofilingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    private auth: AuthService,
    private srvPermission: ApppermissionService
  ) {
    this.rolecode = this.auth.getRolecode();
    console.log('construnctor', this.rolecode);
  }

  ngOnInit(): void {
    this.route.url.subscribe((urlSegments) => {
      this.appName = urlSegments[urlSegments.length - 1].path;
    });
    this.searchSubject
      .pipe(debounceTime(3000), takeUntil(this.onDestroy$))
      .subscribe((searchTerm: string) => {
        this.searchTerm = searchTerm;
        this.getSchedulePage(this.currentpage, this.ruleno, searchTerm);
      });
    this.getPermission();
    this.form = this.formBuilder.group({
      code: [''],
      name: ['', Validators.required],
      daynumber: [''],
      datenumber: [''],
      starttime: ['', Validators.required],
      startdate: ['', Validators.required],
      noenddate: [false, Validators.required],
      enddate: [{ value: '', disabled: true }, Validators.required],
      frequencycode: ['', Validators.required],
      endDateSelected: [false, Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      const scheduleCode = params['scheduleCode'];
      const profileCode = params['profileCode'];
       this.ruleno = params['RuleNo'];
      //this.getSchedule(this.currentpage);
      this.getSchedulePage(this.currentpage,this.ruleno);
      const profile = {
        ProfileCode: profileCode,
      };
      this.srvProfiling.postView(profile).subscribe((data) => {
        this.view = data;
      });
    });
    this.getDqruleDetailById();
    this.getFrequency();
    // this.getProfilingResultGrid(null);
    this.getScheduleInProfiling();
    //this.getSchedulePage(null,this.ruleno);
  }

  toggleFormVisibility() {
    this.showForm = !this.showForm;
  }

  getPermission() {
    this.srvPermission
      .getPermissions(this.rolecode)
      .subscribe((data: permissionMdlInf[]) => {
        this.permissions = data;
        console.log(data);
        const appPermissions = this.permissions.find(
          (permission) => permission.appid.name === this.appName
        );
        if (appPermissions) {
          this.canSave = appPermissions.read;
          this.canEdit = appPermissions.write;
          this.canDelete = appPermissions.delete;
          console.log(this.canSave, this.canEdit, this.canDelete);
        } else {
          console.log('Permissions not found for app:', this.appName);
        }
      });
  }

  onChanges(): void {
    this.form.get('frequencycode')?.valueChanges.subscribe((selectedValue) => {
      console.log('selectedValue', selectedValue);
      if (selectedValue === 2) {
        //week
        this.form.get('daynumber')?.setValidators([Validators.required]);
        this.form.get('datenumber')?.clearValidators();
        this.form.get('datenumber')?.setValue('');
      } else if (selectedValue === 3) {
        //month
        this.form.get('datenumber')?.setValidators([Validators.required]);
        this.form.get('daynumber')?.clearValidators();
        this.form.get('daynumber')?.setValue('');
      } else {
        this.form.get('datenumber')?.clearValidators();
        this.form.get('daynumber')?.clearValidators();
      }
      this.form.get('datenumber')?.updateValueAndValidity();
      this.form.get('daynumber')?.updateValueAndValidity();
    });
  }
  
  getDqruleDetailById() {
    this.route.queryParams.subscribe((params) => {
      this.ruleNoCode = params['ruleNoCode'];
      // Use the value of ruleNos as needed
      this.srvDqrule.getDQRuleDetailById(this.ruleNoCode).subscribe((data) => {
        this.dqrules = [data];
        this.dqRuleCode = data.code;
      });
    });
  }

  updateStatusCode(ruleCode: number, statuscode: number) {
    this.srvDqrule.updateDQRule1(ruleCode, statuscode).subscribe(
      (updatedRule) => {
        console.log('Status code updated successfully:', updatedRule);
      },
      (error) => {
        console.error('Error updating status code:', error);
      }
    );
    this.ngOnInit();
  }

  getScheduleInProfiling() {
    this.route.queryParams.subscribe((params) => {
      const ruleNoCode = params['ruleNoCode'];
      const scheduleCode = params['scheduleCode']; // Get the scheduleCode from query params

      // Call the service method to get profiling data based on ruleNoCode
      this.srvProfiling.getProfilling(ruleNoCode).subscribe((data) => {
        let scheduleCodes: any[] = [];

        // Check if data is an array
        if (Array.isArray(data)) {
          // Iterate over each object in the data array
          for (const rule of data) {
            // Check if the rule object has the schedulecode property
            if ('schedulecode' in rule) {
              // Push the schedulecode to the scheduleCodes array
              scheduleCodes.push(rule.schedulecode);
            }
          }
          // If scheduleCode exists and is not empty, filter it out from scheduleCodes
          if (scheduleCode) {
            scheduleCodes = scheduleCodes.filter(
              (code) => code !== scheduleCode
            );
          }
          // Pass the modified scheduleCodes array to highlightRow
          this.highlightRow(scheduleCodes);
        }
      });
    });
  }

  getSchedulePage(page: any,ruleno:any,search?: string,sort_by?: string,sort_order?: string) {
    this.spinner.show();
    let payload={
      "DQRuleNo": ruleno,
      "search": search || undefined,
       "sort_by": sort_by || undefined, 
       "sort_order": sort_order || undefined, 
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
    console.log('payload',payload)
    this.srvSchedule.getSPSchedule(payload,page).subscribe((data: any) => {
      this.Gridpages = data;
      this.totalPages = data.page_count;
      if (data) {
        const page_count = data.page_count;
        console.log('Page count:', page_count);
        let results = data.results;
        this.schedules = Array.isArray(results) ? results : [results];
        console.log('this.schedules',this.schedules)
      } else {
        console.log('Data is undefined');
      }
      this.spinner.hide();
    });
  }

  onInputChanges() {
    this.searchSubject.next(this.filterData);
  }

  getSchedule(scheduleCode?: any) {
    console.log('scheduleCode', scheduleCode);

    let ordering = this.currentSortField
      ? `${this.currentSortOrder}${this.currentSortField}`
      : null;    
    this.spinner.show();
    this.srvSchedule
      .getSchedule(scheduleCode, ordering, this.filterData)
      .subscribe(
        (data) => {
          this.spinner.hide();
          let results = data.results;
          this.schedules = Array.isArray(results) ? results : [results];
          this.totalPages = data.page_count;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }



  highlightRow(scheduleCode: any) {
    this.selectedScheduleCode = scheduleCode;
  }



  getFrequency() {
    this.srvFrequency.getFrequency().subscribe((data) => {
      this.frequencies = data;
    });
  }

  getProfilingResultGrid(page: number | null) {
    this.spinner.show();
    this.srvProfiling.getDqProfile(page).subscribe(
      (data) => {
        this.profileResultGrids = data;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  // Function to open the modal
  openModal() {
    const modalElement = document.getElementById('scheduleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    this.form.reset();
  }

  closeModal(): void {
    const modalElement = document.getElementById('scheduleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.showWeekly = false;
    this.showMonthly = false;
    this.ngOnInit();
    this.form.reset();
  }

  selectedFrequency: string = 'Select Type'; // Default value

  onFrequencyChange() {
    this.onChanges();
    // Check if the selected frequency is 'weekly' or 'monthly'
    if (this.selectedFrequency) {
      if (this.selectedFrequency === '2') {
        // Show the weekly schedule section
        this.showWeekly = true;
        // Hide the monthly schedule section
        this.showMonthly = false;
      } else if (this.selectedFrequency === '3') {
        // Show the monthly schedule section
        this.showMonthly = true;
        // Hide the weekly schedule section
        this.showWeekly = false;
      } else {
        // Hide both weekly and monthly schedule sections
        this.showWeekly = false;
        this.showMonthly = false;
      }
    } else {
      // Hide both weekly and monthly schedule sections
      this.showWeekly = false;
      this.showMonthly = false;
    }
  }

  onEndDateChange(): void {
    const endDateSelected = this.form.get('endDateSelected')?.value;
    console.log('End Date Selected:', endDateSelected);

    if (endDateSelected === false) {
      console.log('Disabling end date');
      this.form.get('enddate')?.disable();
      this.form.get('enddate')?.clearValidators();
      this.form.get('enddate')?.setValue(null);
    } else {
      console.log('Enabling end date');
      this.form.get('enddate')?.enable();
      this.form.get('enddate')?.setValidators([Validators.required]);
    }

    this.form.get('enddate')?.updateValueAndValidity();
    console.log('enddate',this.form.get('enddate')?.value)
    if (this.form.get('enddate')?.value === null) {
      this.form.get('noenddate')?.setValue(true);
    }
    console.log('Form Value:', this.form.value);
  }


  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  saveSchedule(): void {
    this.markFormGroupTouched(this.form);
    const enddate = this.form.get('enddate')?.value;
  
    // Set noenddate to false if enddate has a value
    if (enddate) {
      this.form.get('noenddate')?.setValue(false);
    }
    const formData = {
      ...this.form.getRawValue(), // Get all values, including disabled controls
      enddate: enddate // Explicitly include the enddate value
    };
  
    console.log('enddate', this.form.get('enddate')?.value);
    console.log('Form Data:', formData);
    this.editedScheduleId = formData.code;
    if (this.form.valid) {
      if (formData.frequencycode === '3') {
        formData.daynumber = null;
        this.form.get('daynumber')?.setValue(null);
      } else if (formData.frequencycode === '2') {
        formData.datenumber = null;
        this.form.get('datenumber')?.setValue(null);
      } else {
        formData.datenumber = null;
        formData.daynumber = null;
        this.form.get('datenumber')?.setValue(null);
        this.form.get('daynumber')?.setValue(null);
      }
      if (formData.code) {
        // Existing schedule, send a PUT request to update
        this.srvSchedule.putSchedule(formData).subscribe((response: any) => {
          this.putschedule();
          this.getSchedulePage(this.currentpage,this.ruleno);
          this.form.reset();
          this.closeModal();
        });
      } else {
        this.srvSchedule.postSchedule(formData).subscribe(
          (response: any) => {
            this.postschedule();
            this.getSchedulePage(this.currentpage,this.ruleno);
            this.form.reset();
            this.closeModal();
          },
          (error) => {
            console.log('error', error.error.error);
            this.errorMessage = error.error.error;
            if (this.errorMessage) {
              this.uniqueSchedule(this.errorMessage);
            } else {
              this.scheduleError();
            }
          }
        );
      }
    } else {
      Object.keys(this.form.controls).forEach((controlName) => {
        const control = this.form.get(controlName);
        if (control && control.invalid) {
          const errors = control.errors;
          console.log(`Validation errors for ${controlName}:`, errors);
        }
        this.showFormFill();
      });
    }
  }

  editSchedule(schedule: any) {
    this.schedule = schedule;
    if (schedule.datenumber) {
      this.showWeekly = false;
      this.showMonthly = true;
    } else if (schedule.daynumber) {
      this.showWeekly = true;
      this.showMonthly = false;
    }
    if (schedule.enddate) {
      this.form.get('enddate')?.enable();
    } else {
      this.form.get('enddate')?.disable();
    }
    
    this.editedScheduleId = schedule.code;
    const endDateSelected = schedule.noenddate ? false : true;
    //this.showModal = true;
    this.openModal();
    this.form.patchValue({
      code: schedule.code,
      name: schedule.name,
      frequencycode: schedule.frequencycode,
      daynumber: schedule.daynumber || null,
      datenumber: schedule.datenumber || null,
      starttime: schedule.starttime,
      startdate: schedule.startdate,
      enddate: schedule.enddate,
      noenddate: schedule.noenddate,
      endDateSelected: endDateSelected,
    });
    if (schedule.frequencycode === 'weekly') {
      this.form.get('daynumber')?.setValue(schedule.daynumber);
    }

    this.form.get('daynumber')?.setValue(schedule.daynumber);
    this.onEndDateChange();
    //this.ngOnInit();
  }



  saveProfile() {
    this.route.queryParams.subscribe((params) => {
      const profilecode = params['profileCode'];
      const code = profilecode !== undefined ? profilecode : null;
      console.log('profilecode', code);
      const newData: dqProfilingMdlInf = {
        code: code, // Set code to profilecode if it exists, otherwise null
        createddate: new Date(),
        dqrulecode: this.dqRuleCode,
        profilestatus: 2,
        schedulecode: this.selectedScheduleCode,
      };

      if (code !== null) {
        this.updateProfile(newData);
      } else {
        this.srvProfiling
          .isRuleScheduled(this.dqRuleCode)
          .subscribe((data: dqProfilingMdlInf[]) => {
            console.log('Existing Schedule :', data);

            if (data.length === 0) {
              this.postNewProfile(newData);
            } else {
              this.alreadyScheduled();
            }
          });
      }
      //window.location.reload();
    });
  }

  updateProfile(data: dqProfilingMdlInf) {
    const previousScheduleCode = data.schedulecode;
    console.log('previousScheduleCode', previousScheduleCode);
    this.srvProfiling.putDqProfiling(data).subscribe((response) => {
      this.putschedule();
      this.getSchedulePage(this.currentpage,this.ruleno)
      //this.decrementJobCount();

      /*if (data.schedulecode) {
        this.incrementJobCount(data.schedulecode);
      }*/
    });
    // this.updateJobCount(data.schedulecode);
  }

  postNewProfile(data: dqProfilingMdlInf) {
    this.srvProfiling.postDqProfiling(data).subscribe((response) => {
      this.postschedule();
      if (data.schedulecode) {
        this.getSchedulePage(this.currentpage,this.ruleno)
        //this.incrementJobCount(data.schedulecode);
      }
    });
    this.updateStatusCode(this.ruleNoCode, 5);
  }

  /*incrementJobCount(scheduleCode: any) {
    this.srvSchedule
      .getScheduleById(scheduleCode)
      .subscribe((schedule: scheduleFrequencyInf | null) => {
        if (schedule) {
          schedule.jobscount = (schedule.jobscount || 0) + 1;
          this.srvSchedule.putSchedulejob(schedule).subscribe(
            (response: any) => {
              console.log('Schedule job count incremented successfully');
              this.ngOnInit();
            },
            (error: any) => {
              console.error('Error incrementing schedule job count', error);
            }
          );
        }
      });
  }*/

 /* decrementJobCount() {
    this.route.queryParams.subscribe((params) => {
      this.scheduleCode = params['scheduleCode'];
      this.srvSchedule
        .getScheduleById(this.scheduleCode)
        .subscribe((schedule: scheduleFrequencyInf | null) => {
          if (schedule) {
            schedule.jobscount = Math.max((schedule.jobscount || 0) - 1, 0); // Ensure job count doesn't go below 0
            this.srvSchedule.putSchedulejob(schedule).subscribe(
              (response: any) => {
                console.log('Schedule job count decremented successfully');
              },
              (error: any) => {
                console.error('Error decrementing schedule job count', error);
              }
            );
          }
        });
    });
  }*/

    handleCheckboxSelection(scheduleCode: string, event: Event): void {
      const checkbox = event.target as HTMLInputElement;

      if (checkbox.checked) {
        // Set the selected schedule code
        this.selectedScheduleCode = scheduleCode;
        // Deselect all other schedules
        this.schedules = this.schedules.map((schedule) => ({
          ...schedule,
          isScheduleSelected: schedule.code === scheduleCode,
        }));
      } else {
      
        this.schedules = this.schedules.map((schedule) =>
          schedule.code === scheduleCode
            ? { ...schedule, isScheduleSelected: false }
            : schedule
        );
        //this.selectedScheduleCode = null; 
      }
  
      console.log(
        'Selected Schedule Code:',
        this.selectedScheduleCode || 'None'
      );
    }
    
  isSelectedSchedule(scheduleCode: any): boolean {
    return String(scheduleCode) === String(this.selectedScheduleCode);
  }

 

  Back() {
    this.router.navigate(['/Layout/DQProfiling']);
  }

  View() {
    this.route.queryParams.subscribe((params) => {
      const ruleNoCode = params['ruleNoCode'];
      const scheduleCode = params['scheduleCode'];
      const profileCode = params['profileCode'];
      // Use the value of ruleNoCode as needed
      this.router.navigate(['/Layout/DQScheduling'], {
        queryParams: {
          ruleNoCode: ruleNoCode,
          scheduleCode: scheduleCode,
          profileCode: profileCode,
        },
      });
    });
  }

  Close() {
    this.router.navigate(['/Layout/DQProfiling']);
  }
  
  visible: boolean = false;
  sortColumn: string = '';
  sortAscending: boolean = true;

  sortTable(field: string): void {
    console.log('field', field);
    console.log('inside sort');
    if (this.sort_by === field) {
      this.sort_order = this.sort_order === 'asc' ? 'desc' : 'asc';
      
    } else {
      this.sort_by = field;
      this.sort_order = 'asc';
      
    }
   
    this.getSchedulePage(this.currentpage,this.ruleno,this.searchTerm,this.sort_by,this.sort_order);
  }
  
  sortTable1(column: string): void {
    if (column === this.sortColumn) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.view.sort((a: any, b: any) => {
      const aValue = this.getColumnValue(a, column);
      const bValue = this.getColumnValue(b, column);

      if (aValue === '' && bValue !== '') {
        return 1;
      } else if (aValue !== '' && bValue === '') {
        return -1;
      }
      // Use the localeCompare function directly for string comparison
      return this.sortAscending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }

  getColumnValue(item: any, column: string): string {
    const columns = column.split('.');
    let value = item;

    for (const col of columns) {
      if (value && typeof value === 'object' && col in value) {
        value = value[col];
      } else {
        return ''; // or return some default value
      }
    }

    return value ? value.toLowerCase() : '';
  }

  postschedule() {
    this.toast.success({
      detail: 'Schedule saved successfully',
      duration: 5000,
      position: 'topLeft',
    });
  }

  scheduleError() {
    this.toast.error({
      detail: 'Schedule Not Saved ',
      duration: 5000,
      position: 'topLeft',
    });
  }

  uniqueSchedule(errorMsg: string) {
    this.toast.success({
      detail: errorMsg,
      duration: 5000,
      position: 'topLeft',
    });
  }

  putschedule() {
    this.toast.success({
      detail: 'Schedule update successfully',
      duration: 5000,
      position: 'topLeft',
    });
  }

  linkSuccess() {
    this.toast.success({
      detail: 'Schedule updated successfully',
      duration: 5000,
      position: 'topLeft',
    });
  }

  showFormFill() {
    this.toast.error({
      detail: 'please fill the required form field',
      duration: 5000,
      position: 'topLeft',
    });
  }

  alreadyScheduled() {
    this.toast.error({
      detail:
        'This rule is already scheduled. You cannot create a new schedule for it.',
      duration: 10000,
      position: 'topLeft',
    });
  }

  onPageChange(page: number): void {
    this.currentpage = page;
    let sortBy: string | undefined = undefined;
    let sortOrder:string | undefined = undefined;
    if (this.sort_by !== null) {
        sortBy = this.sort_by;
    }
    if (this.sort_order !== null) {
      sortOrder = this.sort_order;
  }

    this.getSchedulePage(this.currentpage,this.ruleno,this.searchTerm,sortBy,sortOrder);
  }
}
