import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	isLoading: boolean = true;
	users: any[];
	usersBack: any[];
	tempPass = "";

	/* Drawer Config */
	visible = false;
	formTitle: string = 'Add New User';
	formAction: string = 'add';

	cotForm: FormGroup;
	cotForm2: FormGroup;

	roles = [{ type: 1, label: 'SUPER ADMIN' }, { type: 2, label: 'SUPER CAPTURER' }, { type: 3, label: 'DATA CAPTURER' }];
	selectedRole: any;

	isModalVisible: boolean = false;
	isSpinning: boolean = false;

	searchValue: string = '';

	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) {
		this.helperService.setTitle('Users List');

		this.fetchData();

		this.cotForm = this.fb.group({
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			userName: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			type: ['', [Validators.required]]
		});

		this.cotForm2 = this.fb.group({
			id: ['', [Validators.required]],
			firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			type: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
	}

	closeDrawer(): void {
		this.visible = false;
		this.cotForm.reset();
		this.cotForm2.reset();
	}

	openDrawer(action: string, rec?: any): void {

		if( action == 'add' ) {
			this.formTitle = 'Add New User';
			this.formAction = 'add';

			this.cotForm.controls['firstName'].setValue('');
			this.cotForm.controls['lastName'].setValue('');
			this.cotForm.controls['userName'].setValue('');
			this.cotForm.controls['email'].setValue('');
			this.cotForm.controls['password'].setValue('');
			this.cotForm.controls['type'].setValue('');

		} else {
			this.formTitle = 'Edit User';
			this.formAction = 'edit';
			this.cotForm2.controls['id'].setValue(rec._id);
			this.cotForm2.controls['firstName'].setValue(rec.firstName);
      this.cotForm2.controls['lastName'].setValue(rec.lastName);
      this.cotForm2.controls['password'].setValue(rec.password);
      this.tempPass = rec.password
			this.cotForm2.controls['type'].setValue(rec.type);
		}
		this.visible = true;
	}

	fetchData(): void {
		this.apiService.apiRequestPostWithToken('user/getAllUser', {}).subscribe((data: any) => {
			this.users = data.users;
			this.usersBack = this.users;
			this.isLoading = false;
		});
	}

	submitForm(): void {

		this.isLoading = true;

		let postData: any = {
			firstName: this.cotForm.value.firstName,
			lastName: this.cotForm.value.lastName,
			userName: this.cotForm.value.userName,
			email: this.cotForm.value.email,
			password: this.cotForm.value.password,
			type: this.cotForm.value.type,
		};

		this.apiService.apiRequestPostWithToken('auth/register', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'User has been created');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
			this.isLoading = false;
		})

	}

	editUser(): void {

		this.isLoading = true;

		var postData: any = {
			id: this.cotForm2.value.id,
			firstName: this.cotForm2.value.firstName,
			lastName: this.cotForm2.value.lastName,
			type: this.cotForm2.value.type,
    };

    if(this.cotForm2.value.password != "" && this.cotForm2.value.password != this.tempPass){
      postData.password = this.cotForm2.value.password
    }

    console.log("data: "+JSON.stringify(postData));
		this.apiService.apiRequestPostWithToken('user/updateUser', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'User has been updated');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
		})

	}

	delete(rec: any): void {
		this.isLoading = true;
		this.apiService.apiRequestPostWithToken('user/deleteUser', rec).subscribe((resp) => {
			this.helperService.presentMessage('success', 'User has been deleted');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
		})
	}

	isNotSelected(value: string): boolean {
		return this.cotForm2.value.type !== value;
	}

	openModal(): void {
		this.isModalVisible = true;
	}

	closeModal(): void {
		this.isModalVisible = false;
	}

	csvUpload = (file: any): boolean => {

		this.isSpinning = true;
		this.isLoading = true;

		this.apiService.apiRequestFileWithToken('user/bulkUploadUsers', file).subscribe((resp) => {
      if(resp['failed'].length >0){
        var msg = "";
        resp['failed'].forEach(res => {
          msg+= '<p>'+res+'</p>';
        });
        this.helperService.presentMessageModal('error','User upload',msg);
      }else {
        this.helperService.presentMessage('success', 'User(s) have been uploaded');
      }
			this.fetchData();
			this.closeModal();
			this.isSpinning = false;
		}, (err) => {
			this.isSpinning = false;
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
		});
		return false;
	};

	search(): void {
		let data = this.users.filter((user) => {
			return user.userName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
		})
		this.users = data;
	}

	reset(): void {
		this.users = this.usersBack;
		this.searchValue = '';
	}

}
