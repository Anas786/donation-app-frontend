import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-users',
	templateUrl: './users_donor.component.html',
	styleUrls: ['./users_donor.component.scss']
})
export class UsersDonorComponent implements OnInit {

	isLoading: boolean = true;
	users: any[];
	usersBack: any[];
	locations: any[];
  	tempPass = "";

	/* Drawer Config */
	visible = false;
	formTitle: string = 'Add New User';
	formAction: string = 'add';

	cotForm: FormGroup;
	cotForm2: FormGroup;
	changePass: FormGroup;

	genders = ['Male','Female'];
	selectedGender: any;
	active_states = [{'label':'Yes', 'value':true}, {'label':'No', 'value':false}]

	isModalVisible: boolean = false;
	isSpinning: boolean = false;
	changePasswordModal = false;


	searchValue: string = '';
	avatarUrl?: string;
	imageUploadURL?: string;

	previewImage: string | undefined = '';
	previewVisible = false;


	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) {
		this.helperService.setTitle('Users List');
		this.imageUploadURL= apiService.prepareApiLink('api/fileUpload');

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
			location_id: ['', [Validators.required]],
			address_id: ['', [Validators.required]],
			address_line_1: ['', [Validators.required]],
			address_line_2: ['', []],
			address_line_3: ['', []],
			area: ['', [Validators.required]],
			city: ['', [Validators.required]],
			country: ['', [Validators.required]],
			lat: ['', [Validators.required]],
			lng: ['', [Validators.required]],
			near_by_location: ['', []],
			state: ['', [Validators.required]],
			profile_image: [0, []]
		});

		this.cotForm2 = this.fb.group({
			id: ['', [Validators.required]],
			first_name: ['', [Validators.required]],
			last_name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			cnic_no: ['', [Validators.required]],
			age: ['', [Validators.required]],
			phone_primary: ['', [Validators.required]],
			phone_secondary: ['', []],
			gender: ['', [Validators.required]],
			is_active: ['', [Validators.required]],
			location_id: ['', [Validators.required]],
			address_id: ['', [Validators.required]],
			address_line_1: ['', [Validators.required]],
			address_line_2: ['', []],
			address_line_3: ['', []],
			area: ['', [Validators.required]],
			city: ['', [Validators.required]],
			country: ['', [Validators.required]],
			lat: ['', [Validators.required]],
			lng: ['', [Validators.required]],
			near_by_location: ['', []],
			state: ['', [Validators.required]],
			profile_image: [0, []],
			stripe_cust_id: [0, []]
		});

		this.changePass = this.fb.group({
			user_id:['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(8)]],
		});

	}

	ngOnInit(): void {
	}

	closeDrawer(): void {
		this.visible = false;
		this.cotForm.reset();
		this.cotForm2.reset();
	}

	changeUserPass(user_id: any): void {
		this.changePass.controls['user_id'].setValue(user_id);
		this.changePass.controls['password'].setValue('');
		this.changePasswordModal = true;
	}

	changePassword(): void {
		this.isLoading = true;
		let user_id = this.changePass.value.user_id;
		this.apiService.apiRequestPostWithToken('webapi/changePassword/'+user_id, {'password':this.changePass.value.password}).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Password updated');
			this.changePasswordModal = false;
			this.isLoading = false;

		}, (err) => {
			for (const key in err.error) {
				this.helperService.presentMessage('error', key+ ": "+err.error[key][0]);
			}
			this.isLoading = false;
		})
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
			let geocords = JSON.parse(rec.addresses[0].geocoordinates);

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
			this.cotForm2.controls['location_id'].setValue(rec.location_ids[0]);
			this.cotForm2.controls['address_id'].setValue(rec.addresses[0].id);
			this.cotForm2.controls['address_line_1'].setValue(rec.addresses[0].address_line_1);
			this.cotForm2.controls['address_line_2'].setValue(rec.addresses[0].address_line_2);
			this.cotForm2.controls['address_line_3'].setValue(rec.addresses[0].address_line_3);
			this.cotForm2.controls['area'].setValue(rec.addresses[0].area);
			this.cotForm2.controls['city'].setValue(rec.addresses[0].city);
			this.cotForm2.controls['country'].setValue(rec.addresses[0].country);
			this.cotForm2.controls['state'].setValue(rec.addresses[0].state);
			this.cotForm2.controls['near_by_location'].setValue(rec.addresses[0].near_by_location);
			this.cotForm2.controls['lat'].setValue(geocords['lat']);
			this.cotForm2.controls['lng'].setValue(geocords['lng']);
			this.cotForm2.controls['profile_image'].setValue(rec.profile_image_id);
			this.cotForm2.controls['stripe_cust_id'].setValue(rec.stripe_cust_id);
			this.avatarUrl = rec.profile_image;

		}
		this.visible = true;
	}

	fetchData(): void {
		this.apiService.apiRequestWithToken('webapi/getDonorUsers', {}).subscribe((data: any) => {
			this.users = data;
			this.usersBack = this.users;
			this.isLoading = false;
		});
		this.apiService.apiRequestWithToken('api/location', {}).subscribe((data: any) => {
			this.locations = data;
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
			for (const key in err.error) {
				this.helperService.presentMessage('error', key+ ": "+err.error[key][0]);
			}
			this.isLoading = false;
		})

	}

	editUser(): void {

		this.isLoading = true;

		let id = this.cotForm2.value.id;
		var postData: any = {
			first_name: this.cotForm2.value.first_name,
			last_name: this.cotForm2.value.last_name,
			// email: this.cotForm2.value.email,
			// cnic_no: this.cotForm2.value.cnic_no,
			age: this.cotForm2.value.age,
			// phone_primary: this.cotForm2.value.phone_primary,
			phone_secondary: this.cotForm2.value.phone_secondary,
			gender: this.cotForm2.value.gender,
			// password: this.cotForm2.value.password,
			is_active: this.cotForm2.value.is_active,
			location_ids: [this.cotForm2.value.location_id],
			profile_image: this.cotForm2.value.profile_image,
			addresses : [{
				id: this.cotForm2.value.address_id,
				address_line_1: this.cotForm2.value.address_line_1,
				address_line_2: this.cotForm2.value.address_line_2,
				address_line_3: this.cotForm2.value.address_line_3,
				area: this.cotForm2.value.area,
				city: this.cotForm2.value.city,
				country: this.cotForm2.value.country,
				geocoordinates: JSON.stringify({"lat":this.cotForm2.value.lat,"lng":this.cotForm2.value.lng}),
				near_by_location: this.cotForm2.value.near_by_location,
				state: this.cotForm2.value.state
			}]
    	};

		this.apiService.apiRequestPutWithToken('api/updateDonor/'+id, postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'User has been updated');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			for (const key in err.error) {
				this.helperService.presentMessage('error', key+ ": "+err.error[key][0]);
			}
		})

	}

	delete(rec: any): void {
		this.isLoading = true;
		this.apiService.apiRequestDeleteWithToken('api/deleteDonor/'+rec.id).subscribe((resp) => {
			this.helperService.presentMessage('success', 'User has been deleted');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			for (const key in err.error) {
				this.helperService.presentMessage('error', key+ ": "+err.error[key][0]);
			}
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
	
	viewImage(imgUrl: string): void {
		this.previewImage = imgUrl;
		this.previewVisible = true;
	}

}
