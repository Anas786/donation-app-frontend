import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(public router: Router, private userService: UserService) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		// Guard for user is login or not
		return this.userService.currentUser.then((user) => {
			if( !user ) {
				this.router.navigate(['/login']);
				return true
			} else {
				this.userService.storeUser(user);
				this.userService.currentToken.then((token) => {
					this.userService.storeToken(token);
				});
			}
			return true
		});
	}
  
}
