import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-users',
	templateUrl: './users_recipient.component.html',
	styleUrls: ['./users_recipient.component.scss']
})
export class UsersRecipientComponent implements OnInit {

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

	genders = ['Male', 'Female'];
	selectedGender: any;

	isModalVisible: boolean = false;
	isSpinning: boolean = false;

	searchValue: string = '';

	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) {
		this.helperService.setTitle('Users List');

		this.fetchData();

		this.cotForm = this.fb.group({
			first_name: ['', [Validators.required]],
			last_name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			cnic_no: ['', [Validators.required]],
			age: ['', [Validators.required]],
			phone_primary: ['', [Validators.required]],
			phone_secondary: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(8)]],
			gender: ['', [Validators.required]]
		});

		this.cotForm2 = this.fb.group({
			id: ['', [Validators.required]],
			first_name: ['', [Validators.required]],
			last_name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			cnic_no: ['', [Validators.required]],
			age: ['', [Validators.required]],
			phone_primary: ['', [Validators.required]],
			phone_secondary: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(8)]],
			gender: ['', [Validators.required]]
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

			this.cotForm.controls['first_name'].setValue('');
			this.cotForm.controls['last_name'].setValue('');
			this.cotForm.controls['email'].setValue('');
			this.cotForm.controls['cnic_no'].setValue('');
			this.cotForm.controls['age'].setValue('');
			this.cotForm.controls['phone_primary'].setValue('');
			this.cotForm.controls['phone_secondary'].setValue('');
			this.cotForm.controls['gender'].setValue('');
			// this.cotForm.controls['password'].setValue('');
		} else {
			this.formTitle = 'Edit User';
			this.formAction = 'edit';
			this.cotForm2.controls['id'].setValue(rec.id);
			this.cotForm2.controls['first_name'].setValue(rec.first_name);
			this.cotForm2.controls['last_name'].setValue(rec.last_name);
			this.cotForm2.controls['email'].setValue(rec.email);
			this.cotForm2.controls['cnic_no'].setValue(rec.cnic_no);
			this.cotForm2.controls['age'].setValue(rec.age);
			this.cotForm2.controls['phone_primary'].setValue(rec.phone_primary);
			this.cotForm2.controls['phone_secondary'].setValue(rec.phone_secondary);
			this.cotForm2.controls['gender'].setValue(rec.gender);

		}
		this.visible = true;
	}

	fetchData(): void {
		this.apiService.apiRequestWithToken('webapi/getRecipientUsers', {}).subscribe((data: any) => {
			this.users = data;
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
			return user.cnic_no.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
		})
		this.users = data;
	}

	reset(): void {
		this.users = this.usersBack;
		this.searchValue = '';
	}

}
