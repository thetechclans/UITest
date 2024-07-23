import { sourcetypeMdl } from "./sourcetype";
import { ValidationInf } from "./validate";

export interface datasourceMdlInf{
    code: any;
    name: string;
    technicalcontactemail:string;
    technicalcontactmobile: string;
    technicalcontactname: string;
    dbconnectioncode: any;
    sourcetypecode: any;
}


export class datasourceMdlCls{
    code: any=null;
    name: string='';
    technicalcontactemail:string='';
    technicalcontactmobile: string ='';
    technicalcontactname: string='';
    dbconnectioncode: any=null;
    sourcetypecode: any=null;
}
export interface datasourceMdl{
    code: any;
    name: string;
}

export interface datasourceDetailMdlInf{
    code: any;
    name: string;
    technicalcontactemail:string;
    technicalcontactmobile: number;
    technicalcontactname: string;
    dbconnectioncode: ValidationInf; //This will fetch all info from DB Connection
    sourcetypecode: sourcetypeMdl;
}

export class datasourceDetailMdlCls{
    code: any=null;
    name: string='';
    technicalcontactemail:string='';
    technicalcontactmobile: number | undefined;
    technicalcontactname: string='';
    dbconnectioncode: ValidationInf | undefined; //This will fetch all info from DB Connection
    sourcetypecode: sourcetypeMdl | undefined;
}

export interface SearchResult {
    tables: datasourceMdlInf[];
    total: number;
}

export interface datasourceDetailMdlInfpage{
    count: number;
    page_count: number;
    next: string;
    previous: string;
    results:datasourceDetailMdlInf[];
 }

 