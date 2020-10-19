import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { ApiService } from './api.service';
import { EventService } from './event.service';
import { Router } from '@angular/router';

@Injectable({
  	providedIn: 'root'
})
export class UserService {

	private USER_KEY: string = 'DAAS_USER';
	private TOKEN_KEY: string = 'DAAS_TOKEN';
	public user: any;
	public token: any;

  	constructor(private apiService: ApiService, private eventService: EventService, private router: Router, private storage: LocalStorageService) { 
		this.eventService.getEvent().subscribe((event) => {
			if( event.event === 'logout' ) {
				this.logout().then(() => {
					this.router.navigate(['/login']);
				});
			}
		})
	}

	get currentUser() {
		return this.storage.asPromisable().get(this.USER_KEY);
	}

	get currentToken() {
		return this.storage.asPromisable().get(this.TOKEN_KEY);
	}

	storeUser(user: any): void {
		this.user = user;
		this.storage.set(this.USER_KEY, user);
	}

	storeToken(token: any): void {
		this.token = token;
		this.apiService.setToken(token);
		this.storage.set(this.TOKEN_KEY, token);
	}

	login(username: string, password: string) {
		let params = {
			username: username,
			password: password
		};
		return this.apiService.apiRequestPost('auth/login', params);
	}

	logout() {
		return this.storage.asPromisable().clear();
	}


}
