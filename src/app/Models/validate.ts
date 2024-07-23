import { dbmsMdl } from "./dbms";

export interface ValidationInf{
    code: any;
    dbmscode:any;
    name:string;
    connectionstring:any;
    servername:string;
    port:number;
    authenticationmode:string;
    loginname:string;
    loginpwd:string;
    databasename:string;
    schemaname:string;
    validationflag:boolean;
    lastvalidationdate:any;
    errormessage:string;
    createdby:string;
    createddate:any;
    modifiedby:string;
    modifieddate:any;
}

export class ValidationCls{
    code:any=null;
    dbmscode:any=null;
    name:string='';
    connectionstring:any=null;
    servername:string='';
    port:any=null;
    authenticationmode:string='';
    loginname:string='';
    loginpwd:string='';
    databasename:string='';
    schemaname:string='';
    validationflag!: boolean;
    lastvalidationdate:any=null;
    errormessage:string='';
    createdby:string='';
    createddate:any=null;
    modifiedby:string='';
    modifieddate:any=null;
}

export interface validationDetailInf{
    code:any;
    name:string;
    dbmscode:dbmsMdl;
    connectionstring:any;
    servername:string;
    port:string;
    authenticationmode:string;
    loginname:string;
    loginpwd:string;
    databasename:string;
    schemaname:string;
    validationflag:boolean;
    lastvalidationdate:any;
    errormessage:string;
    createdby:string;
    createddate:any;
    modifiedby:string;
    modifieddate:any;

}

export class validationDetailCls{
    code: any=null;
    name: string='';
    dbmscode:dbmsMdl | undefined; //DbmsInf
    connectionstring:any=null;
    servername:string='';
    port:string='';
    authenticationmode:string='';
    loginname:string='';
    loginpwd:string='';
    databasename:string='';
    schemaname:string='';
    validationflag:any=null;
    lastvalidationdate:any;
    errormessage:string='';
    createdby:string='';
    createddate:any=null;
    modifiedby:string='';
    modifieddate:any=null;
}

export interface SearchResult {
    tables: ValidationInf[];
    total: number;
}

