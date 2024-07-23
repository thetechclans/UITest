import { businesssytemMdl } from "./business";
import { dqdomainMdlInf } from "./dqdomain";
import { datasourceMdl } from "./datasource";
import { ValidationInf } from "./validate";
import { priorityMdlInf } from "./priority";
import { statusMdlInf } from "./dqstatus";
import { categoryMdlInf } from "./dqcategory";

export interface dqruleInf{
    code: any;
    ruleno:any;
    dataelement: string; 
    ruledefinition: string;
    dqthresholdpercentage: number;
    businessstewardname: string;
    rulecreateddate: Date;
    dqbusinesscriteria: string;
    dqsqlexpressionvaliddata: string;
    dqsqlexpressionvaliddatavalidate: boolean;
    dqsqlexpressionvaliderrormsg: string;
    dqsqlexpressioninvaliddata: string;
    dqsqlexpressioninvaliddatavalidate: boolean;
    dqsqlexpressioninvaliderrormsg:string;
    dqsqlexpressiontotaldata:string;
    dqsqlexpressiontotaldatavalidate:boolean;
    dqsqlexpressiontotalerrormsg:string;
    datastewardname:string;
    dqexpressioncreateddate:Date;
    overallvalidationflag:boolean;
    createdby: any;
    modifiedby:any;
    modifieddate:any;
    targetresolutiondate:any;
    dqdomaincode: any;
    businesssystemcode: any;
    datasourcecode:any;
    dbconnectioncode:any;
    prioritycode:any;
    statuscode:any;
    categorycode:any;
    profiletypecode:any;
    spcolumnname:string;
    sptablename:string;
    spdomainname:string;
}


export class dqruleCls{
    code: any = null;
    ruleno:any = null;
    dataelement: string =''; 
    ruledefinition: string ='';
    dqthresholdpercentage!: number;
    businessstewardname: string ='';
    rulecreateddate!: Date;
    dqbusinesscriteria: string ='';
    dqsqlexpressionvaliddata: string='';
    dqsqlexpressionvaliddatavalidate: boolean= false;
    dqsqlexpressionvaliderrormsg: string='';
    dqsqlexpressioninvaliddata: string='';
    dqsqlexpressioninvaliddatavalidate: boolean =false;
    dqsqlexpressioninvaliderrormsg:string='';
    dqsqlexpressiontotaldata:string='';
    dqsqlexpressiontotaldatavalidate:boolean =false;
    dqsqlexpressiontotalerrormsg:string='';
    datastewardname:string='';
    dqexpressioncreateddate!: Date;
    overallvalidationflag:boolean= false;
    createdby: any =null;
    modifiedby:any =null;
    modifieddate:any =null;
    targetresolutiondate: any=null;
    dqdomaincode: any=null;
    businesssystemcode:any=null;
    datasourcecode: any=null; //this table contains more fields but i took code,name field alone to show the name
    dbconnectioncode:any=null;
    prioritycode: any=null;
    statuscode: any=null;
    categorycode:any=null; 
    profiletypecode: any=null;
    spcolumnname:string='';
    sptablename:string='';
    spdomainname:string='';   
}

export interface dqruleDetailMdl{
    length: number;
    code: any;
    ruleno:any;
    dataelement: string; 
    ruledefinition: string;
    dqthresholdpercentage: number;
    businessstewardname: string;
    rulecreateddate: Date;
    dqbusinesscriteria: string;
    dqsqlexpressionvaliddata: string;
    dqsqlexpressionvaliddatavalidate: boolean;
    dqsqlexpressionvaliderrormsg: string;
    dqsqlexpressioninvaliddata: string;
    dqsqlexpressioninvaliddatavalidate: boolean;
    dqsqlexpressioninvaliderrormsg:string;
    dqsqlexpressiontotaldata:string;
    dqsqlexpressiontotaldatavalidate:boolean;
    dqsqlexpressiontotalerrormsg:string;
    datastewardname:string;
    dqexpressioncreateddate:Date;
    overallvalidationflag:boolean;
    createdby: any;
    modifiedby:any;
    modifieddate:any;
    targetresolutiondate:Date;
    dqdomaincode: dqdomainMdlInf;
    businesssystemcode: businesssytemMdl;
    datasourcecode: datasourceMdl 
    dbconnectioncode:ValidationInf;
    prioritycode: priorityMdlInf;
    statuscode:statusMdlInf
    categorycode:categoryMdlInf;
    Profiletypecode:profileTypeInf;
    spcolumnname:string;
    sptablename:string;
    spdomainname:string;
   
   
}

export class dqruleDetailCls{
    code: any =null;
    ruleno:any =null;
    dataelement: string=''; 
    ruledefinition: string='';
    dqthresholdpercentage!: number;
    businessstewardname: string='';
    rulecreateddate!: Date;
    dqbusinesscriteria: string='';
    dqsqlexpressionvaliddata: string='';
    dqsqlexpressionvaliddatavalidate: boolean=false;
    dqsqlexpressionvaliderrormsg: string='';
    dqsqlexpressioninvaliddata: string='';
    dqsqlexpressioninvaliddatavalidate: boolean=false;
    dqsqlexpressioninvaliderrormsg:string='';
    dqsqlexpressiontotaldata:string='';
    dqsqlexpressiontotaldatavalidate:boolean=false;
    dqsqlexpressiontotalerrormsg:string='';
    datastewardname:string='';
    dqexpressioncreateddate!: Date;
    overallvalidationflag:boolean=false;
    createdby: any;
    modifiedby:any;
    modifieddate:any;
    targetresolutiondate:any=null;
    dqdomaincode!: dqdomainMdlInf[];
    businesssystemcode!: businesssytemMdl[];
    datasourcecode!: datasourceMdl[]; 
    dbconnectioncode!: ValidationInf[];
    prioritycode!: priorityMdlInf[];
    statuscode!: statusMdlInf[];
    categorycode!: categoryMdlInf[];
    Profiletypecode!: profileTypeInf[];
    spcolumnname:string='';
    sptablename:string='';
    spdomainname:string='';
}

export interface SearchResult {
    tables: dqruleInf[];
    total: number;
}
export class dqrulevaliddatavalidateqryMdlCls{
    DbconnectionCode: any; 
    Query:  any; 
}

export class dqruleinvaliddatavalidateqryMdlCls{
    DbconnectionCode: any; 
    Query:  any; 
}

export class dqruletotaldatavalidateqryMdlCls{
    DbconnectionCode: any; 
    Query:  any; 
}

export interface profileTypeInf{
    code: any;
    name:string;
}
export interface dqRuleMdlInfpage{
    count: number;
    page_count: number;
    next: string;
    previous: string;
    results:dqruleDetailMdl[];
 }