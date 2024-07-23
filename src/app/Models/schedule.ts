import { Time } from "@angular/common";
import { frequencyMdlInf } from "./frequency";

export interface scheduleInf{
    code:any;
    name:string;
    daynumber:number;
    datenumber:number;
    starttime:TimeRanges;
    startdate:Date;
    enddate:Date;
    noenddate:boolean;
    jobscount:number;
    frequencycode:any;
    highlighted?: boolean;
}


export class scheduleMdlCls{
    code:any=null;
    name:string='';
    daynumber!: number;
    datenumber!: number;
    starttime!: TimeRanges;
    startdate!: Date;
    enddate!: Date;
    noenddate!: boolean;
    jobscount!: number;
    frequencycode:any=null;
}


export interface scheduleFrequencyInf{
    code:any;
    name:string;
    daynumber:number;
    datenumber:number;
    starttime:TimeRanges;
    startdate:Date;
    enddate:Date;
    noenddate:boolean;
    jobscount:number;
    frequencycode:frequencyMdlInf;
}
export interface scheduleMdlInfpage{
    count: number;
    page_count: number;
    next: string;
    previous: string;
    results: schedulefrequencyMdlInf[];
 }
export interface statusscheduleMdlInf{
    DQRuleCode:number;
    StartDate:Date;
    EndDate:Date;
    StartTime:TimeRanges;
}
export interface schedulefrequencyMdlInf{
        code: any,
        name: string,
        frequencycode: number,
        FrequencyName : string,
        daynumber: number,
        datenumber: number,
        starttime: TimeRanges,
        startdate : Date,
        enddate: Date,
        noenddate : boolean,
        jobscount: number,
        isScheduleSelected: boolean
}