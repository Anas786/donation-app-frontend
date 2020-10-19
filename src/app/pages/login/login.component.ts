import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { HelperService } from '../../shared/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	forgotForm: FormGroup;
	loading: boolean = false;
	activeForm: string = 'login';

	constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private helperService: HelperService) { 

		this.helperService.setTitle('Login');

		this.loginForm = this.fb.group({
			username: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]]
		});

		this.forgotForm = this.fb.group({
			email: [null, [Validators.required, Validators.email]],
		});

	}

	doLogin(): void {
		if( this.loginForm.valid ) {
			this.loading = true;
			this.userService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
				(res: any) => {
					// Store User info and token
					this.userService.storeUser(res.user);
					this.userService.storeToken(res.access_token);
					this.helperService.presentMessage('success', 'Welcome back!');
					this.loading = false;

					this.router.navigate(['/dashboard']);
				},
				(err: any) => {
					console.log( err )
					this.loading = false;
					this.helperService.presentMessage('error', err.error.message);
				}
			);
		}
	}

	doForgot(): void {
		
	}

	ngOnInit(): void {
	}

}
