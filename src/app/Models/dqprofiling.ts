import { Time } from "@angular/common";
import { frequencyMdlInf } from "./frequency";
import { profilestatusMdlInf } from "./profilestatus";
import { dqruleInf } from "./dqrule";

export interface dqProfilingMdlInf{
        code: any,
        createddate: Date,
        dqrulecode: any,
        profilestatus: any,
        schedulecode: any
}

export class dqProfilingMdlCls{
    code: any =null;
    createddate!: Date;
    dqrulecode: any=null;
    profilestatus: any=null;
    schedulecode: any=null
}

export interface dqProfilingResultMdlInf{
    code: any;
    profiledatetime: Date,
    validdatacount: number,
    invaliddatacount: number,
    totaldatacount: number,
    dqscoring: number,
    validdatalogfile: any,
    invaliddatalogfile: any,
    lastrunflag: boolean,
    executionseconds: Time,
    successflag: boolean,
    errormsgvalid: string,
    errormsginvalid: string,
    errormsgtotal: string,
    profilecode: any
}

export interface scheduleMdlInf{
    code: any;
    name: any;
    frequencycode: frequencyMdlInf;
}

export class dqProfilingResultMdlCls{
    code: any=null;
    profiledatetime!: Date;
    validdatacount!: number;
    invaliddatacount!: number;
    totaldatacount!: number;
    dqscoring!: number;
    validdatalogfile: any=null;
    invaliddatalogfile: any=null;
    lastrunflag!: boolean;
    executionseconds!: Time;
    successflag!: boolean;
    errormsgvalid!: string;
    errormsginvalid!: string;
    errormsgtotal!: string;
    profilecode: any=null
}

export interface profileMdlInf{
    code:any,
    createddate:Date,
    dqrulecode:dqruleInf,
    profilestatus:profilestatusMdlInf,
    schedulecode:scheduleMdlInf
}

export interface dqProfilingResultGridMdlInf{
    code: any;
    profiledatetime: Date,
    validdatacount: number,
    invaliddatacount: number,
    totaldatacount: number,
    dqscoring: number,
    validdatalogfile: any,
    invaliddatalogfile: any,
    lastrunflag: boolean,
    executionseconds: Time,
    successflag: boolean,
    errormsgvalid: string,
    errormsginvalid: string,
    errormsgtotal: string,
    profilecode: profileMdlInf
}

export interface dqProfileGridInf{
    Code: any;
    RuleCode:number;
    RuleNo: string;
    DataElement:string;
    ProfileStatus:string;
    ScheduleCode:number;
    ScheduleName:string;
    LastRunFlag:boolean;
    LastSuccesfulRun:Date;
    ExecutionSeconds:number;
    NofExecutions:number;
}

export interface dqProfileViewInf{
    IdentityColumn:number;
    DQProfilingCode: number;
    DQProfilingResults:number;
    JobName:string;
    ProfileDatetime: Date;
    FrequencyName: string;
    ProfileStatus: string;
    ValidDataCount:number;
    InvalidDataCount: number;
   TotalDataCount: number;
   ExecutionSeconds:number;
   DQScoring:number;
   SuccessFlag:boolean;
   LastRunFlag:boolean;
   ErrorMsgValid:string;
   ErrorMsgInvalid:string;
   ErrorMsgTotal:string;
}
export interface dqProfilingMdlInfpage{
    count: number;
    page_count: number;
    next: string;
    previous: string;
    results:dqProfileGridInf[];
   
 }