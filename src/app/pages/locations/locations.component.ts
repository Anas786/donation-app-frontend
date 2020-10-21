import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-logs',
	templateUrl: './locations.component.html',
	styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

	isLoading: boolean = true;
	locations: any[];
	lookups: any[];
	locationsBack: any[];
	searchValue: string = '';

	/* Drawer Config */
	visible = false;
	formTitle: string = 'Add New Location';
	formAction: string = 'add';

	cotForm: FormGroup;
	cotForm2: FormGroup;

	active_states = [{'label':'Yes', 'value':true}, {'label':'No', 'value':false}]

	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) { 
		this.helperService.setTitle('Data Locations');

		this.fetchData();
		this.cotForm = this.fb.group({
			name: ['', [Validators.required]],
			slug: ['', [Validators.required]],
			type_lookup_id: ['', [Validators.required]],
			parent_id: ['', []],
			is_active: ['', [Validators.required]]
		});

		this.cotForm2 = this.fb.group({
			id: ['', [Validators.required]],
			name: ['', [Validators.required]],
			slug: ['', [Validators.required]],
			type_lookup_id: ['', [Validators.required]],
			parent_id: ['', []],
			is_active: ['', [Validators.required]]
		});
	}


	ngOnInit(): void {
	}

	fetchData(): void {
		this.apiService.apiRequestWithToken('api/location', {}).subscribe((data: any) => {
			this.locations = data;
			this.locationsBack = this.locations;
			this.isLoading = false;
		});
		this.apiService.apiRequestWithToken('api/lookup', {}).subscribe((data: any) => {
			this.lookups = data;
			this.isLoading = false;
		});
	}

	submitForm(): void {

		this.isLoading = true;

		let postData: any = {
			name: this.cotForm.value.name,
			slug: this.cotForm.value.slug,
			type_lookup_id: this.cotForm.value.type_lookup_id,
			parent_id: this.cotForm.value.parent_id,
			is_active: this.cotForm.value.is_active,
		};

		this.apiService.apiRequestPostWithToken('api/location', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Location has been created');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
			this.isLoading = false;
		})
	}


	update(): void {

		this.isLoading = true;
		let id = this.cotForm2.value.id;

		let postData: any = {
			name: this.cotForm2.value.name,
			slug: this.cotForm2.value.slug,
			type_lookup_id: this.cotForm2.value.type_lookup_id,
			parent_id: this.cotForm2.value.parent_id,
			is_active: this.cotForm2.value.is_active,
		};

		this.apiService.apiRequestPostWithToken('api/location/'+id, postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Location has been updated');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
			this.isLoading = false;
		})
	}

	delete(rec: any): void {
		this.isLoading = true;
		this.apiService.apiRequestPostWithToken('api/location/delete/'+rec.id,{deleted:true}).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Location has been deleted');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
		})
	}

	closeDrawer(): void {
		this.visible = false;
		this.cotForm.reset();
		this.cotForm2.reset();
	}


	openDrawer(action: string, rec?: any): void {

		if( action == 'add' ) {
			this.formTitle = 'Add New Location';
			this.formAction = 'add';

			this.cotForm.controls['name'].setValue('');
			this.cotForm.controls['slug'].setValue('');
			this.cotForm.controls['type_lookup_id'].setValue('');
			this.cotForm.controls['parent_id'].setValue('');
			this.cotForm.controls['is_active'].setValue('');
		} else {
			this.formTitle = 'Edit Location';
			this.formAction = 'edit';
			this.cotForm2.controls['id'].setValue(rec.id);
			this.cotForm2.controls['name'].setValue(rec.name);
			this.cotForm2.controls['slug'].setValue(rec.slug);
			this.cotForm2.controls['type_lookup_id'].setValue(rec.type_lookup_id)
			this.cotForm2.controls['parent_id'].setValue(rec.parent_id);
			this.cotForm2.controls['is_active'].setValue(rec.is_active);
		}
		this.visible = true;

	}
	search(): void {
		let data = this.locations.filter((location) => {
			return location.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
		})
		this.locations = data;
	}

	reset(): void {
		this.locations = this.locationsBack;
		this.searchValue = '';
	}

}
