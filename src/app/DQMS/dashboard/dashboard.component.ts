import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DdatasourceMdlInf,DdomainInf,DstatusMdlInf,DruleMdlInf, ProfilingMdlInf } from 'src/app/Models/dashboard';
import { AuthService } from 'src/app/shared/auth.service';
import { ApppermissionService } from 'src/app/services/apppermission.service';
import { ScaleLinear, ScalePoint, ScaleTime , ScaleBand} from 'd3-scale';
import { PlacementTypes, ScaleType, StyleTypes } from '@swimlane/ngx-charts';
import { formatDate } from '@angular/common';
import { Color } from '@swimlane/ngx-charts';
import { DatePipe } from '@angular/common';
//import { formatDate, padLeft } from './formatDate';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{


  datasource: DdatasourceMdlInf[]=[];
  status: DstatusMdlInf[]=[];
  rule: DruleMdlInf[]=[];
  domain:DdomainInf[]=[];
  profiling:ProfilingMdlInf[]=[];
  ruletotal!: number;
  totaldatasource: any = {};
  statuschart: any[] =[];
  rules: any[] =[];
  profiles:any[]=[];
  CodeValuebar!: number;
  CodeValuepie!: number;
  domains:any;
  selectedProfiling: number | null = null;
tooltipPlacement: PlacementTypes = PlacementTypes.Top;
tooltipType: StyleTypes = StyleTypes.tooltip;
legendPosition: any;
customColorScheme: Color = {
  name: 'customScheme',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: [ '#33FF7D','#FF5733']
};
  datePipe: any;



  constructor(private srvDashboard: DashboardService,private auth:AuthService ,private srvPermission:ApppermissionService ){
 
  }

  ngOnInit(): void {
 this.legendPosition = 'below';
     this.getDatasource();
     this.getStatus();
     this.getDomain();
     //this.getRu(); 
     this.getProfile();
  }

  getDatasource(){
    this.srvDashboard.getDatasource().subscribe(data => {
     this.totaldatasource = data
     console.log(this.totaldatasource)
  })
}
getStatus(){
  this.srvDashboard.getStatus().subscribe(data => {
    if (data) {
    this.statuschart = data?.map(item => ({
      
      name: item.Name,
      value: item.NofRules,
      code: item.Code
    
 })) ||[]
}
 console.log(this.statuschart);
 if (Array.isArray(this.statuschart) && this.statuschart.every(item => 'name' in item && 'value' in item && 'code' in item)) {
  // Data is valid, proceed with binding  
} else {
  console.error('Data is not in the expected format', this.statuschart);
}
})
}

getDomain(){
  this.srvDashboard.getDomain().subscribe((data:DdomainInf[])=> {
    this.domains = data[0]
   console.log(this.ruletotal)
    if (data) {
      this.rules= data?.map(item => ({
        
        name: item.Dname,
        value: item.nofrule,
        code: item.code
      
   })) 
  }
   console.log('rules', this.domains);
   this.ruletotal = this.domains.ruleTotal 
   if (Array.isArray(this.rules) && this.rules.every(item => 'name' in item && 'value' in item &&'code' in item)) {
    // Data is valid, proceed with binding
  } else {
    console.error('Data is not in the expected format', this.rules);
  }
 }) 
}
getProfile() {
  
  this.srvDashboard.getProfiling().subscribe((data:any[]) => {
 this.profiles =data;
    console.log('profile',data)
   this.selectedProfiling= this.profiles[0].value
if (data) {
  
      this.profiles = data.map(item => ({
        name: this.datePipe.transform(item.WeekStartDate, 'dd/MM/yyyy'),
        series: [
          {
            name: 'Success',
            value: item.series[0].WeeklySuccess    
          },
          {
            name: 'Failure',
            value: item.series[0].WeeklyFailure
          }
        ],
        value:item.CompleteProfiling
      }))
    } else {
      console.error('Received undefined data from the API');
    }
  }, error => {
    console.error('Error fetching profiling data', error);
  });
}
onBarSelect(event: any) {
  console.log('stack',event);
  const selectedProfile = this.profiles.find(profile => profile.name === event.series);
  console.log(selectedProfile )
  if (selectedProfile) {
    const successItem = selectedProfile.series.find((item: any) => item.name === 'WeeklySuccess');
    const failureItem = selectedProfile.series.find((item: any) => item.name === 'WeeklyFailure');
    const successValue = successItem ? successItem.value : 0;
    const failureValue = failureItem ? failureItem.value : 0;
    
    console.log('successValue', successValue);
    console.log('failureValue', failureValue);

    this.selectedProfiling = successValue + failureValue;
    console.log('selectedProfiling', this.selectedProfiling);
  }
}
onSelectpie(event:any) {
  this.getDomain();
  console.log('pie',event);
  const selectedItem = this.rules.find(item => item.name === event.name && item.value === event.value);

  if (selectedItem) {
    const codeValue = selectedItem.code;
    console.log('Code valuepie:', codeValue);
    const payload ={
      "DQDomainCode" : codeValue
    }
    this.srvDashboard.postPiechart(payload).subscribe(data =>{
      console.log('response domain',data)
      this.updateBarChart(data);
    })
  }else {
    console.error('Selected item not found in piechart data.');
  }
}
onSelectbar(event: any) {
  this.getStatus();
  console.log('status',event);
  const selectedItem = this.statuschart.find(item => item.name === event.name && item.value === event.value);

  if (selectedItem) {
    const codeValue = selectedItem.code;
    console.log('Code value:', codeValue);

    const payload ={
      "DQStatus" : codeValue
    }
    this.srvDashboard.postBarchart(payload).subscribe(data =>{
      console.log('response status',data)
this.updatePieChart(data);
  })} else {
    console.error('Selected item not found in statuschart data.');
  }
}
updateBarChart(data: any) {
  // Process the response data to match the format expected by ngx-charts-bar-horizontal
  const barChartData = Object.keys(data).map(key => {
    return {
      "name": data[key].Name,
      "value": data[key].NofRules
    };
  });

  // Update the statuschart data and trigger change detection
  this.statuschart = [...barChartData];
  console.log('Updated bar chart data:', this.statuschart);

  this.ruletotal = barChartData.reduce((total, item) => total + item.value, 0);
  console.log('Total number of rules:', this.ruletotal);
}

updatePieChart(data:any){
  const pieChartData = Object.keys(data).map(key => {
    return {
      "name": data[key].Dname,
      "value": data[key].nofrule
    };
  });
  this.rules=[...pieChartData];
  console.log('Updated bar chart data:', this.rules)

  if (data.length > 0) {
    this.ruletotal = data[0].ruleTotal; // Assuming all items have the same ruleTotal
  }
  console.log('Updated rule total:', this.ruletotal);

}


}
