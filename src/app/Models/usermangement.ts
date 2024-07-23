export interface RoleCodeMdlInf {
    code: number;
    name: string;
  }
  export interface ApiResponse {
    token: any;  
    msg: string;
  }

  export interface UserMdlInf {
    id: any;
    username: string;
    rolecode: RoleCodeMdlInf;
    email: string;
    usermobile: string;
    last_login: string | null;
    is_active:boolean;
  }

 export interface UserEditMdlInf {
    id: any;
    username: string;
    rolecode: any;
    email: string;
    usermobile: string;
    last_login: string | null;
    is_active:boolean;
  }
  export class UserEditMdlCls {
    id: any=null;
    username:string='';
    rolecode: any;
    email:string='';
    usermobile:string='';
    last_login: string ='';
    is_active:boolean | undefined;
  }

  export class UserMdlCls {
    id: any=null;
    username: string='';
    rolecode: any;
    email: string='';
    usermobile: string ='';
    last_login:  string ='';
    is_active:boolean | undefined;

  }
  export interface UserInfpage{
    count: number;
    page_count: number;
    next: string;
    previous: string;
    results: UserMdlInf[];
 }