// For Lookup Tables
export interface ReferenceDataMdlInf {
description: any;
    code: any;
    name: string;    
  }
  
  export class ReferenceDataMdlCls {
    code: any = null;
    name: string ='';     
  }
  
  export interface LookupMdlInf {
    code: any;
    name: string;    
 
  }

  // Table data
export interface Table {
  code: string;
  name: string; 
}

// Search Data
export interface SearchResult {
  tables: Table[];
  total: number;
}
