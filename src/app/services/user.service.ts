import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable,Subscription } from 'rxjs';
import { userprofileMdlInf } from '../Models/profile';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  [x: string]: any;
  private _userProfile$ = new BehaviorSubject<userprofileMdlInf | undefined>(undefined);
  GroupId:any;
 roleCode!: number;
  constructor() { 
    this._userProfile$.subscribe(userProfile => {
      if (userProfile) {
        this.roleCode = userProfile.rolecode;
        console.log('Role Code:', this.roleCode);
      }
    });
  }

  public setuserProfile(userData:any){
    const userProfile: userprofileMdlInf = userData; 
    this._userProfile$.next(userProfile);
    console.log("username",this._userProfile$)
    //console.log("username",this._userProfile$
  }
  public getUserProfile$() {
    return this._userProfile$.asObservable();
  }
  public get userProfile(): Observable<userprofileMdlInf | undefined> {
    return this._userProfile$.asObservable();
  }
  
  IsLoggedIn(){    
    console.log("In UserSevice", this._userProfile$)
    if ( this._userProfile$ == null ){
      return false;
    }
    else{
      return true;
    }
  }
}
