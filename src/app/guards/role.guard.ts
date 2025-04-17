import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserForLogin } from '../models/auth/userForLogin';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router  ) { }

    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    const expectedRole = route.data['expectedRole'];
      
    if (this.authService.isLoggedIn) {
      
      let user: UserForLogin = this.authService.getUser()!;
      
      if (this.authService.hasRole(user, expectedRole)) {
        return true;
      } 
      else {
        this.router.navigate([""]);
        this.toastrService.warning("Bu sayfaya erişmek için yeterli yetkiniz yok", "Yetkiniz yok");
        return false;
      }
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}