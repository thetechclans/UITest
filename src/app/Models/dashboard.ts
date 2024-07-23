export interface DdatasourceMdlInf{
    DataSource:any;
    DQCard:any;
}

export interface DstatusMdlInf{
    Code:any;
    Name:string;
    NofRules:any;
}

export interface DruleMdlInf{
    DQDomainCode:any;
    Name:string;
    NofRules:any;

}

export interface DdomainInf{
    code:any;
    Dname:string;
    nofrule:any;
    ruleTotal:any;
}

export interface ProfilingMdlInf{
    WeekStartDate:Date;
    series: { WeeklyFailure: number; WeeklySuccess: number }[];
   CompleteProfiling:any;
}

export interface profileMdlInf{
    WeeklyFailure:any;
    WeeklySuccess:any;
}