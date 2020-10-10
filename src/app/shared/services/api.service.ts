import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EventService } from './event.service';
import { Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})
export class ApiService {

	private token: any;

	constructor(private http: HttpClient, private eventService: EventService) { }
	  
	apiRequestPost(method: string, params: any) {
		return this.http.post( this.prepareApiLink(method), params );
	}

	apiRequestPostWithToken(method: string, params: any) {
		const observable = new Observable((observer) => {
			const headers = new  HttpHeaders().set("Authorization", `Bearer ${this.token.accessToken}`);
			this.http.post( this.prepareApiLink(method), params, { headers } ).toPromise().then((response) => {
				observer.next(response);
			}).catch((error) => {
				if( error.status == 401 ) {
					// Invalid Token
					this.eventService.sendEvent('logout');
				}
				observer.error(error);
			});
		});
		return observable;
	}

	apiRequestFileWithToken(method: string, file: any) {
		const observable = new Observable((observer) => {
			const headers = new  HttpHeaders().set("Authorization", `Bearer ${this.token.accessToken}`);
			headers.append('Content-Type', 'multipart/form-data');

			let formData:FormData = new FormData();
			formData.append('file', file, file.name);

			this.http.post( this.prepareApiLink(method), formData, { headers } ).toPromise().then((response) => {
				observer.next(response);
			}).catch((error) => {
				if( error.status == 401 ) {
					// Invalid Token
					this.eventService.sendEvent('logout');
				}
				observer.error(error);
			});
		});
		return observable;
	}

	apiRequest(method: string, params: any) {
		return this.http.get( this.prepareApiLink(method), { params: params } );
	}

	apiRequestWithToken(method: string, params: any) {
		const observable = new Observable((observer) => {
			const headers = new  HttpHeaders().set("Authorization", `Bearer ${this.token.accessToken}`);
			this.http.get( this.prepareApiLink(method), { params: params, headers: headers } ).toPromise().then((response) => {
				observer.next(response);
			}).catch((error) => {
				if( error.status == 401 ) {
					// Invalid Token
					this.eventService.sendEvent('logout');
				}
				observer.error(error);
			});
		});
		return observable;
	}

	public setToken(token: any) {
		this.token = token;
	}

	prepareApiLink(method: string) {
		return environment.apiEndpoint + method;
	}
}
