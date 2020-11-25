import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-logs',
	templateUrl: './lookups.component.html',
	styleUrls: ['./lookups.component.scss']
})
export class LookupsComponent implements OnInit {

	isLoading: boolean = true;
	lookups: any[];
	lookupsBack: any[];
	searchValue: string = '';

	/* Drawer Config */
	visible = false;
	formTitle: string = 'Add New Lookup';
	formAction: string = 'add';

	cotForm: FormGroup;
	cotForm2: FormGroup;

	active_states = [{'label':'Yes', 'value':true}, {'label':'No', 'value':false}]

	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) { 
		this.helperService.setTitle('Data lookups');

		this.fetchData();
		this.cotForm = this.fb.group({
			lookup_label: ['', [Validators.required]],
			lookup_name: ['', [Validators.required]],
			lookup_slug: ['', [Validators.required]],
			lookup_type: ['', [Validators.required]],
			parent_id: ['', []],
			is_active: ['', [Validators.required]]
		});

		this.cotForm2 = this.fb.group({
			id: ['', [Validators.required]],
			lookup_label: ['', [Validators.required]],
			lookup_name: ['', [Validators.required]],
			lookup_slug: ['', [Validators.required]],
			lookup_type: ['', [Validators.required]],
			parent_id: ['', []],
			is_active: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
	}

	fetchData(): void {
		this.apiService.apiRequestWithToken('api/lookup', {}).subscribe((data: any) => {
			this.lookups = data;
			this.lookupsBack = this.lookups;
			this.isLoading = false;
		});
	}

	submitForm(): void {

		this.isLoading = true;

		let postData: any = {
			lookup_label: this.cotForm.value.lookup_label,
			lookup_name: this.cotForm.value.lookup_name,
			lookup_slug: this.cotForm.value.lookup_slug,
			lookup_type: this.cotForm.value.lookup_type,
			parent_id: (this.cotForm.value.parent_id != '') ? this.cotForm.value.parent_id:undefined,
			is_active: this.cotForm.value.is_active,
		};

		this.apiService.apiRequestPostWithToken('api/lookup', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Lookup has been created');
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
			lookup_label: this.cotForm2.value.lookup_label,
			lookup_name: this.cotForm2.value.lookup_name,
			lookup_slug: this.cotForm2.value.lookup_slug,
			lookup_type: this.cotForm2.value.lookup_type,
			parent_id: this.cotForm2.value.parent_id,
			is_active: this.cotForm2.value.is_active,
		};

		this.apiService.apiRequestPostWithToken('api/lookup/'+id, postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Lookup has been updated');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
			this.isLoading = false;
		})
	}

	delete(rec: any): void {
		this.isLoading = true;
		this.apiService.apiRequestPostWithToken('api/lookup/delete/'+rec.id,{deleted:true}).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Lookup has been deleted');
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
			this.formTitle = 'Add New Lookup';
			this.formAction = 'add';

			this.cotForm.controls['lookup_label'].setValue('');
			this.cotForm.controls['lookup_name'].setValue('');
			this.cotForm.controls['lookup_slug'].setValue('');
			this.cotForm.controls['lookup_type'].setValue('');
			this.cotForm.controls['parent_id'].setValue('');
			this.cotForm.controls['is_active'].setValue('');
		} else {
			this.formTitle = 'Edit Lookup';
			this.formAction = 'edit';
			this.cotForm2.controls['id'].setValue(rec.id);
			this.cotForm2.controls['lookup_label'].setValue(rec.lookup_label);
			this.cotForm2.controls['lookup_name'].setValue(rec.lookup_name);
			this.cotForm2.controls['lookup_slug'].setValue(rec.lookup_slug);
			this.cotForm2.controls['lookup_type'].setValue(rec.lookup_type);
			this.cotForm2.controls['parent_id'].setValue(rec.parent_id);
			this.cotForm2.controls['is_active'].setValue(rec.is_active);

		}
		this.visible = true;
	}
	
	search(): void {
		let data = this.lookups.filter((lkp) => {
			return lkp.lookup_slug.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
		})
		this.lookups = data;
	}

	reset(): void {
		this.lookups = this.lookupsBack;
		this.searchValue = '';
	}


}
