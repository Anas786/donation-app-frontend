import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../../shared/services/helper.service';
import { ApiService } from '../../../shared/services/api.service';

@Component({
	selector: 'app-users',
	templateUrl: './transactiondealer.component.html',
	styleUrls: ['./transactiondealer.component.scss']
})
export class TransactionDealerComponent implements OnInit {

	isLoading: boolean = true;
	users: any[];
	dealers: any[];
	usersBack: any[];
  	tempPass = "";

	/* Drawer Config */
	visible = false;

	searchForm: FormGroup;

	genders = ['Male', 'Female'];
	selectedGender: any;

	isModalVisible: boolean = false;
	isSpinning: boolean = false;

	searchValue: string = '';

	previewImage: string | undefined = '';
	previewVisible = false;


	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) {
		this.helperService.setTitle('Users List');

		this.fetchData();

		this.searchForm = this.fb.group({
			dealer: ['', []]
		});
	}

	viewImage(imgUrl: string): void {
		this.previewImage = imgUrl;
		this.previewVisible = true;
	}

	ngOnInit(): void {
	}


	fetchData(): void {		
		this.apiService.apiRequestPostWithToken('api/dealerPaymentHistory', {}).subscribe((data: any) => {
			this.users = data;
			this.isLoading = false;
		});
		this.apiService.apiRequestWithToken('webapi/getDealerUsers', {}).subscribe((data: any) => {
			this.dealers = data;
			this.isLoading = false;
		});
	}

	submitSearch(): void {

		this.isLoading = true;

		let postData: any = {
			dealer_id: this.searchForm.value.dealer
		};

		this.apiService.apiRequestPostWithToken('api/dealerPaymentHistory', postData).subscribe((data: any) => {
			this.users = data;
			this.isLoading = false;
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
