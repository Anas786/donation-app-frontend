import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

	isCollapsed = true;
	appName: string = '';
	user: any;

	constructor(private router: Router, private userService: UserService, private helperService: HelperService) { 
		this.appName = environment.appName;

		this.userService.currentUser.then((user) => {
			this.user = user;
		});
	}

	ngOnInit(): void {
	}

	logout(): void {
		this.userService.logout().then(() => {
			this.router.navigate(['/login']).then(() => {
				this.helperService.presentMessage('success', 'You have been signed out');
			});
		})
	}

}
