import { dbmsMdl } from "./dbms";
export interface ValidationInf{
    code:any;
    name:string;
    dbmscode:any;
    connectionstring:any;
    servername:string;
    port:number;
    authenticationmode:string;
    loginname:string;
    loginpwd:string;
    databasename:string;
    schemaname:string;
    validationflag:boolean;
}

export interface dbconnectionDetailMdl{
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

}

export class dbconnectionDetailCls{
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
    validationflag:any=null;;
}

