import { responseMdlInf } from "./login";

export interface ChangePasswordInf {
   
     userpassword: string;
     userpassword2: string;

}


export interface ForgetPasswordMdlInf {
    email: string;

}


export class ForgetPasswordMdlCls {
    email: string='';

}
export interface successResponse {
    msg: string;
    token: responseMdlInf;
  }
  
  export interface errorResponse {
    msg: string;
    error: string;
    
  }
  export interface messageInf{
    msg: string;
    token?: responseMdlInf;
    error?: string;
  }
  //export type messageInf = successResponse | errorResponse;
  export interface messageMdlInf{
    msg: any;
    error: any;
  }