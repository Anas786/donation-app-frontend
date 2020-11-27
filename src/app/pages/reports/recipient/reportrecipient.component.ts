import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../../shared/services/helper.service';
import { ApiService } from '../../../shared/services/api.service';

@Component({
	selector: 'app-users',
	templateUrl: './reportrecipient.component.html',
	styleUrls: ['./reportrecipient.component.scss']
})
export class ReportRecipientComponent implements OnInit {

	isLoading: boolean = true;
	users: any[];
	recipients: any[];
	usersBack: any[];
	rangePicker:any[] = [];
  	tempPass = "";

	/* Drawer Config */
	visible = false;

	searchForm: FormGroup;

	genders = ['Male', 'Female'];
	selectedGender: any;

	isModalVisible: boolean = false;
	isSpinning: boolean = false;

	searchValue: string = '';

	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) {
		this.helperService.setTitle('Users List');

		this.fetchData();

		this.searchForm = this.fb.group({
			rangePicker: ['', [Validators.required]],
			recipient: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
	}


	fetchData(): void {
		this.apiService.apiRequestWithToken('webapi/getRecipientUsers', {}).subscribe((data: any) => {
			this.recipients = data;
			this.isLoading = false;
		});
		// this.apiService.apiRequestPostWithToken('webapi/dealerTransactions', {}).subscribe((data: any) => {
		// 	this.users = data;
		// 	this.usersBack = this.users;
		// 	this.isLoading = false;
		// });
	}

	submitSearch(): void {

		// this.isLoading = true;

		let postData: any = {
			rangePicker: this.searchForm.value.rangePicker,
			recipient: this.searchForm.value.recipient
		};
		console.log(postData);

		this.apiService.apiRequestPostWithToken('webapi/recipientReport', postData).subscribe((data: any) => {
			this.users = data;
			// this.helperService.presentMessage('success', 'User has been created');
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
			this.isLoading = false;
		})

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
