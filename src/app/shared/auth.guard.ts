import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChildFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, map, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | any> => {
  const router = inject(Router);

  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  //const token = sessionStorage.getItem('access');
  
  /*return authService.checkLogin().pipe(
    map(isLoggedIn => {
      console.log('isLoggedIn',isLoggedIn)
      if (isLoggedIn) {
        return true;
      } else {
        return router.createUrlTree(['']);
      }
    }),
    catchError(() => of(router.createUrlTree([''])))
  );*/
return authService.isAuthenticated().pipe(
  map(isLoggedIn =>{
    if (isLoggedIn) {
      return true;
    } else {
      return router.createUrlTree(['']);
    }
})
)
}
export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => authGuard(route, state); 