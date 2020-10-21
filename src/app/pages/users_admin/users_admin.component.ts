import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-users',
	templateUrl: './users_admin.component.html',
	styleUrls: ['./users_admin.component.scss']
})
export class UsersAdminComponent implements OnInit {

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

	genders = [{'name':'Male'}, {'name':'Female'}];
	selectedGender: any;

	isModalVisible: boolean = false;
	isSpinning: boolean = false;

	searchValue: string = '';

	active_states = [{'label':'Yes', 'value':true}, {'label':'No', 'value':false}]

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
			gender: ['', [Validators.required]],
			is_active: ['', [Validators.required]],
			address_line_1: ['', [Validators.required]],
			address_line_2: ['', []],
			address_line_3: ['', []],
			area: ['', [Validators.required]],
			city: ['', [Validators.required]],
			country: ['', [Validators.required]],
			geocoordinates: ['', [Validators.required]],
			near_by_location: ['', []],
			state: ['', [Validators.required]]

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
			gender: ['', [Validators.required]],
			is_active: ['', [Validators.required]],
			address_line_1: ['', [Validators.required]],
			address_line_2: ['', []],
			address_line_3: ['', []],
			area: ['', [Validators.required]],
			city: ['', [Validators.required]],
			country: ['', [Validators.required]],
			geocoordinates: ['', [Validators.required]],
			near_by_location: ['', []],
			state: ['', [Validators.required]]
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
			this.cotForm.controls['password'].setValue('');
			this.cotForm.controls['is_active'].setValue('');
			this.cotForm.controls['address_line_1'].setValue('');
			this.cotForm.controls['address_line_2'].setValue('');
			this.cotForm.controls['address_line_3'].setValue('');
			this.cotForm.controls['area'].setValue('');
			this.cotForm.controls['city'].setValue('');
			this.cotForm.controls['country'].setValue('');
			this.cotForm.controls['state'].setValue('');
			this.cotForm.controls['near_by_location'].setValue('');
			this.cotForm.controls['geocoordinates'].setValue('');
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
			this.cotForm2.controls['is_active'].setValue(rec.is_active);
			this.cotForm2.controls['address_line_1'].setValue(rec.addresses[0].address_line_1);
			this.cotForm2.controls['address_line_2'].setValue(rec.addresses[0].address_line_2);
			this.cotForm2.controls['address_line_3'].setValue(rec.addresses[0].address_line_3);
			this.cotForm2.controls['area'].setValue(rec.addresses[0].area);
			this.cotForm2.controls['city'].setValue(rec.addresses[0].city);
			this.cotForm2.controls['country'].setValue(rec.addresses[0].country);
			this.cotForm2.controls['state'].setValue(rec.addresses[0].state);
			this.cotForm2.controls['near_by_location'].setValue(rec.addresses[0].near_by_location);
			this.cotForm2.controls['geocoordinates'].setValue(rec.addresses[0].geocoordinates);
		}
		this.visible = true;
	}

	fetchData(): void {
		this.apiService.apiRequestWithToken('webapi/getAdminUsers', {}).subscribe((data: any) => {
			this.users = data;
			this.usersBack = this.users;
			this.isLoading = false;
		});
	}

	submitForm(): void {

		this.isLoading = true;

		let postData: any = {
			first_name: this.cotForm.value.first_name,
			last_name: this.cotForm.value.last_name,
			email: this.cotForm.value.email,
			cnic_no: this.cotForm.value.cnic_no,
			age: this.cotForm.value.age,
			phone_primary: this.cotForm.value.phone_primary,
			phone_secondary: this.cotForm.value.phone_secondary,
			gender: this.cotForm.value.gender,
			password: this.cotForm.value.password,
			is_active: this.cotForm.value.is_active,
			addresses : [{
				address_line_1: this.cotForm.value.address_line_1,
				address_line_2: this.cotForm.value.address_line_2,
				address_line_3: this.cotForm.value.address_line_3,
				area: this.cotForm.value.area,
				city: this.cotForm.value.city,
				country: this.cotForm.value.country,
				geocoordinates: this.cotForm.value.geocoordinates,
				near_by_location: this.cotForm.value.near_by_location,
				state: this.cotForm.value.state
			}]
		};

		this.apiService.apiRequestPostWithToken('api/createAdmin', postData).subscribe((resp) => {
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

		let id = this.cotForm2.value.id;
		var postData: any = {
			first_name: this.cotForm2.value.first_name,
			last_name: this.cotForm2.value.last_name,
			email: this.cotForm2.value.email,
			cnic_no: this.cotForm2.value.cnic_no,
			age: this.cotForm2.value.age,
			phone_primary: this.cotForm2.value.phone_primary,
			phone_secondary: this.cotForm2.value.phone_secondary,
			gender: this.cotForm2.value.gender,
			password: this.cotForm2.value.password,
			is_active: this.cotForm2.value.is_active,
			addresses : [{
				address_line_1: this.cotForm2.value.address_line_1,
				address_line_2: this.cotForm2.value.address_line_2,
				address_line_3: this.cotForm2.value.address_line_3,
				area: this.cotForm2.value.area,
				city: this.cotForm2.value.city,
				country: this.cotForm2.value.country,
				geocoordinates: this.cotForm2.value.geocoordinates,
				near_by_location: this.cotForm2.value.near_by_location,
				state: this.cotForm2.value.state
			}]
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
