import { departmentMdl } from "./department";
import { dqruleInf } from "./dqrule";
// import { ValidationInf } from "./validate";

export interface dqcardInf{
    code: any;
    name: string;
    cardscore:string;
    cardthreshold: any;
    lastupdate: any;
    cardowner: any;
    cardowneremail: any;
    createdby: any;
    createddate: any;
    departmentcode: any;
    rulecount:any;
    cardcategorycode:any;
    isactive: boolean;
    isvisible:boolean;

}


export class dqcardCls{
    code: any=null;
    name: string='';
    cardscore:string='';
    cardthreshold: string='';
    lastupdate: any;
    cardowner: string='';
    cardowneremail: string='';
    createdby: any=null;
    createddate: any=null;
    rulecount:any =null;
     departmentcode: any=null;
    cardcategorycode:any=null;
    isactive: any=null;
    isvisible:any=null;
}

export interface dqcardDetailInf{
    code: any;
    name: string;
    cardscore:string;
    cardthreshold: any;
    lastupdate: any;
    cardowner: any;
    cardowneremail: any;
    createdby: any;
    createddate: any;
    departmentcode: departmentMdl;
}

export class dqcardDetailCls{
    code: any=null;
    name: string='';
    cardscore:string='';
    cardthreshold: string='';
    lastupdate: any;
    cardowner: string='';
    cardowneremail: string='';
    createdby: any=null;
    createddate: any=null; 
    departmentcode!: departmentMdl;
}

export interface SearchResult {
    tables: dqcardInf[];
    total: number;
}

export interface linkRuleInf{
    code?: any;
    dqcardcode: any;
    dqrulecode:any;
}

/*export interface dqcardRuleGridInf{
    code:any;
    dqcardcode: any;
    dqrulecode:dqruleInf[];
}*/
export interface dqcardRuleGridInf{

}
export interface dqCardLinkInf{
    code: number,
    DQCardCode: number,
    DQRuleCode: number,
    Ruleno: string;
    DataElement: string;
    CategoryCode: number;
    CategoryName: string;
    PriorityCode: number;
    PriorityName: string;
    DQDomainCode: number;
    DQDomainName: string;
    DQThresholdPercentage: number;
    StatusCode: number;
    StatusName: string;
    OverallValidationFlag:boolean;
    isSelected: boolean;
    Scoring:any;
}
export interface PostLinkResponse{
    linkData: dqCardLinkInf[];
    additionalData: any;
}

export interface categoryInf{
    code: any;
    name: string;
}
export interface dqCardMdlInfpage{
    count: number;
    page_count: number;
    next: string;
    previous: string;
    results:dqcardDetailInf[];
 }

 export interface linkMdlInf{
    count: number;
    page_count: number;
    next: string;
    previous: string;
    results:dqCardLinkInf[];
 }