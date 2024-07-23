export interface settingMdlInf{
    code:any
    organisationname:string;
    contactname:string;
    contactemail:string;
    contactmobile:number;
    fullincrement:boolean;
    prefixincrement:boolean;
    prefixtext:string;
    sendprofilingresults:string;
}

export class settingMdlCls{
    organisationname:string='';
    contactname:string='';
    contactemail:string='';
    contactmobile!: number;
    fullincrement!: boolean;
    prefixincrement!: boolean;
    prefixtext:string='';
    sendprofilingresults:string='';
}