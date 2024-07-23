export interface permissionMdlInf{
    code:any;
    appid:decodeMdlInf;
    groupid:decodeMdlInf;
    read:boolean;
    write:boolean;
    delete:boolean;
}

export interface decodeMdlInf{
    code: any;
    name:string;
}