export interface registerMdlInf{
    email:any;
    username:string;
    rolecode:number;
    usermobile:number;
    userpassword:any;
    userpassword2:any;
}

export class registerMdlCls{
    email:any;
    username:string='';
    rolecode!: number;
    usermobile!: number;
    userpassword:any;
    userpassword2:any;
}

export interface rolesMdlInf{
    code:any;
    name:string;
}