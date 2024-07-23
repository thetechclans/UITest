

export interface notificationdetailMdlInf{
    unread_count : number;
    results:notificationMdlInf[];
}

export interface notificationMdlInf{
    code: number;
    dqprofilingresultscode?:profileMdlInf | null;
    isread?: boolean | null;
    userid?:number | null;
    showFullMessage?: boolean;
}
export class apinotificationCls{
    code!: number;
    dqprofilingresultscode!: number;
    isread!: boolean;
    userid!: number | null;
}
export class notificationMdlCls{
    code!: number;
    dqprofilingresultscode?:profileMdlInf | null;
    isread?: boolean | null;
    userid?:number | null;
    showFullMessage?: boolean;
}

export interface profileMdlInf{
    code: number;
    profilecode:profileInf;
    profiledatetime:Date;
    successflag:boolean;
}
 
export interface profileInf{
    dqrulecode:ruleInf;
    schedulecode:scheduleInf;
}

export interface ruleInf{
    code:number;
    ruleno:string;
}
export interface scheduleInf{
    code:number;
    name: string;
}
export interface webMdl{
    unread_count: number
  }