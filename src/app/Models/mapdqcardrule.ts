import { sourcetypeMdl } from "./sourcetype";
import { ValidationInf } from "./validate";

export interface mapdqcardruleInf{
    code: any;
    name: string;
    technicalcontactemail:string;
    technicalcontactmobile: number;
    technicalcontactname: string;
    dbconnectioncode: any;
    sourcetypecode: any;
}


export class mapdqcardruleCls{
    code: any=null;
    name: string='';
    technicalcontactemail:string='';
    technicalcontactmobile: number;
    technicalcontactname: string='';
    dbconnectioncode: any=null;
    sourcetypecode: any=null;
}

export interface mapdqcardruleDetailMdl{
    code: any;
    name: string;
    technicalcontactemail:string;
    technicalcontactmobile: number;
    technicalcontactname: string;
    dbconnectioncode: ValidationInf;
    sourcetypecode: sourcetypeMdl;
}

export class mapdqcardruleDetailCls{
    code: any=null;
    name: string='';
    technicalcontactemail:string='';
    technicalcontactmobile: number;
    technicalcontactname: string='';
    dbconnectioncode: ValidationInf;
    sourcetypecode: sourcetypeMdl;
}

export interface SearchResult {
    tables: mapdqcardruleInf[];
    total: number;
}