export interface loginMdlInf{
    username: any;
    password: any;
}

export class loginMdlCls{
    username: any;
    password: any;
}

export interface responseMdlInf{
    msg: string;
    token: tokenMdl;
}

export interface tokenMdl{
    access:any;
    refresh:any;
}