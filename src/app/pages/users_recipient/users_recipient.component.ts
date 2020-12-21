import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

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
	locations: any[];
	lookups:{};
	lookupTree:any[];


	/* Drawer Config */
	visible = false;
	formTitle: string = 'Add New User';
	formAction: string = 'add';

	cotForm: FormGroup;
	cotForm2: FormGroup;

	genders = ['Male', 'Female'];
	selectedGender: any;
	active_states = [{'label':'Yes', 'value':true}, {'label':'No', 'value':false}]


	isModalVisible: boolean = false;
	isSpinning: boolean = false;

	searchValue: string = '';
	avatarUrl?: string;
	imageUploadURL?: string;

	previewImage: string | undefined = '';
	previewVisible = false;
	otherLookups:any[];

	lookupModal:boolean = false;
	lookupAction:string = 'edit';
	lookupData:any;

	fileList: NzUploadFile[] = []
	uploadedFileIds:any = []


	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService, private msg: NzMessageService) {
		this.helperService.setTitle('Users List');
		this.imageUploadURL= apiService.prepareApiLink('api/fileUpload');

		this.fetchData();

		this.cotForm2 = this.fb.group({
			id: ['', [Validators.required]],
			first_name: ['', [Validators.required]],
			last_name: ['', [Validators.required]],
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
			categories: [[], []]
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

		if( action == 'lookup' ) {
			this.formTitle = 'Enable Lookup';
			this.formAction = action;
			this.lookupData = rec;
		} else {
			let geocords = JSON.parse(rec.addresses[0].geocoordinates);
			this.formTitle = 'Edit User';
			this.formAction = action;
			this.cotForm2.controls['id'].setValue(rec.id);
			this.cotForm2.controls['first_name'].setValue(rec.first_name);
			this.cotForm2.controls['last_name'].setValue(rec.last_name);
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
			this.cotForm2.controls['categories'].setValue(rec.categories);
			this.avatarUrl = rec.profile_image;

			var categories = rec.categories;
			var otherLookups = this.lookupTree;
			for (const olkp in otherLookups){
				for(const lkp in categories){
					otherLookups = otherLookups.filter( h => h.id !== categories[lkp].lookup_parent); 
				}
			} 
			this.otherLookups = otherLookups;

		}
		this.visible = true;
	}

	fetchData(): void {
		this.apiService.apiRequestWithToken('webapi/getRecipientUsers', {}).subscribe((data: any) => {
			this.users = data;
			this.usersBack = this.users;
			this.isLoading = false;
		});
		this.apiService.apiRequestWithToken('api/location', {}).subscribe((data: any) => {
			this.locations = data;
		});
		this.apiService.apiRequestWithToken('api/lookup', {}).subscribe((data: any) => {
			var lookup_obj = {};
			for(let k in data){
				lookup_obj[data[k].id] = data[k].lookup_label;
			}
			this.lookups = lookup_obj;
		});
		this.apiService.apiRequestWithToken('api/lookupTree', {}).subscribe((data: any) => {
			this.lookupTree = data;
			this.lookupTree = this.lookupTree.filter( h => h.lookup_type == 'CATEGORY_LOOKUP');
		});

	}

	editUser(): void {

		this.isLoading = true;

		let id = this.cotForm2.value.id;
		var postData: any = {
			first_name: this.cotForm2.value.first_name,
			last_name: this.cotForm2.value.last_name,
			age: this.cotForm2.value.age,
			phone_secondary: this.cotForm2.value.phone_secondary,
			gender: this.cotForm2.value.gender,
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

		this.apiService.apiRequestPutWithToken('api/updateRecipient/'+id, postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'User has been updated');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			for (const key in err.error) {
				this.helperService.presentMessage('error', key+ ": "+err.error[key][0]);
			}
			this.isLoading = false;
		})

	}

	editLookup(user_id:string, lkp:any): void{
		this.previewVisible = false;
		this.lookupModal = true;
		this.lookupAction = 'edit';
		this.lookupData = {lkp:lkp, user_id:user_id};
	}

	enableLookup(user_id:string, lkp:any): void{
		this.previewVisible = false;
		this.lookupModal = true;
		this.lookupAction = 'add';
		this.lookupData = {lkp:lkp, user_id:user_id};
	}

	deleteLookup(lookupData:any): void {
		this.isLoading = true;
		this.apiService.apiRequestDeleteWithToken('api/deleteUserLookup/'+lookupData.user_id+'/'+lookupData.lkp.lookup_parent).subscribe((resp) => {
			this.helperService.presentMessage('success', 'User category removed');
			this.fetchData();
			this.isLoading = false;
			this.lookupModal = false;
			this.cotForm2.value.categories
			var index = this.cotForm2.value.categories.indexOf(lookupData.lkp);
			this.cotForm2.value.categories.splice(index, 1);     
			let categories = this.cotForm2.value.categories;     
			var otherLookups = this.lookupTree;
			for (const olkp in otherLookups){
				for(const lkp in categories){
					otherLookups = otherLookups.filter( h => h.id !== categories[lkp].lookup_parent); 
				}
			} 
			this.otherLookups = otherLookups;

		}, (err) => {
			for (const key in err.error) {
				this.helperService.presentMessage('error', key+ ": "+err.error[key][0]);
			}
		})
	}

	handleOk(): void {
		this.isLoading = true;
		if (this.lookupAction == 'add'){

		} else if (this.lookupAction == 'edit'){
			this.apiService.apiRequestPutWithToken('api/updateUserLookup',this.lookupData).subscribe((resp) => {
				this.helperService.presentMessage('success', 'Lookup has been updated');
				this.isLoading = false;
				this.lookupModal = false;
			}, (err) => {
				for (const key in err.error) {
					this.helperService.presentMessage('error', key+ ": "+err.error[key][0]);
				}
				this.isLoading = false;
			})
		}

	}

	handleCancel(): void {
	}


	delete(rec: any): void {
		this.isLoading = true;
		this.apiService.apiRequestDeleteWithToken('api/recipient/'+rec.id).subscribe((resp) => {
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

	search(): void {
		let data = this.users.filter((user) => {
			return user.cnic_no.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
		})
		this.users = data;
	}

	reset(): void {
		this.fetchData();
		this.searchValue = '';
	}

	viewImage(imgUrl: string): void {
		this.previewImage = imgUrl;
		this.lookupModal = false;
		this.previewVisible = true;
	}

	uploadProfileCategory = () => {
		return {category:"profile_recipient"};
	}
	uploadLookupCategory = () => {
		return {category:"attachements"};
	}

	beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[])  => {
		console.log("File Uploading...");
		return new Observable((observer: Observer<boolean>) => {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
			  this.msg.error('You can only upload JPG/PNG file!');
			  observer.complete();
			  return;
			}
			const isLt2M = file.size! / 1024 / 1024 < 2;
			if (!isLt2M) {
			  this.msg.error('Image must smaller than 2MB!');
			  observer.complete();
			  return;
			}
			observer.next(isJpgOrPng && isLt2M);
			observer.complete();
		  });
	};

	handleChange(info: { file: NzUploadFile }): void {
		
		switch (info.file.status) {
		  case 'uploading':
			this.isLoading = true;
			break;
		  case 'done':
			// Get this url from response in real world.
			this.avatarUrl = info.file!.response!.image_url;
			if (this.formAction == 'add') {
				this.cotForm.controls['profile_image'].setValue(info.file!.response!.id);
			} else {
				this.cotForm2.controls['profile_image'].setValue(info.file!.response!.id);
			}
			this.isLoading = false;
			break;
		  case 'error':
			this.msg.error('Network error');
			this.isLoading = false;
			break;
		}
	}

	submitLookupEnableForm(): void {
		this.isLoading = true;
		this.uploadedFileIds = [];
		for (const key in this.fileList) {
			this.uploadedFileIds.push(this.fileList[key].response.id);
		}
		let user_id = this.cotForm2.value.id;
		var lookup_options = this.lookupData.options;
		for (const opt in lookup_options){
			if (lookup_options[opt].lookup_slug == 'ATTACHMENT'){
				lookup_options[opt]['value'] = this.uploadedFileIds;
			}
		}
		this.apiService.apiRequestPostWithToken('api/enableUserLookup', {user_id:user_id, lookup_options:lookup_options}).subscribe((data: any) => {
			this.fetchData();
			this.closeDrawer();
			this.isLoading = false;
		});
	}

}
