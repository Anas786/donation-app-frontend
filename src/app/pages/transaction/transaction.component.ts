import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
	return new Promise((resolve, reject) => {
	  const reader = new FileReader();
	  reader.readAsDataURL(file);
	  reader.onload = () => resolve(reader.result);
	  reader.onerror = error => reject(error);
	});
  }

@Component({
	selector: 'app-users',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

	isLoading: boolean = true;
	users: any[];
	dealers: any[];
	usersBack: any[];
	rangePicker:any[] = [];
	tempPass = "";
	
	formTitle: string = 'Payment Entry';
	formAction: string = 'pay';
	formWidth: any = 500;
  

	/* Drawer Config */
	visible = false;

	searchForm: FormGroup;
	cotForm: FormGroup;

	genders = ['Male', 'Female'];
	selectedGender: any;

	isModalVisible: boolean = false;
	isSpinning: boolean = false;

	searchValue: string = '';
	modalTitle:string = '';
	avatarUrl?: string;
	imageUploadURL?: string;
	userData: any;
	isUserVisible: boolean = false;
	fileList: NzUploadFile[] = []

	uploadedFileIds:any = []


	previewImage: string | undefined = '';
	previewVisible = false;

	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService, private msg: NzMessageService) {
		this.helperService.setTitle('Users List');
		this.imageUploadURL= apiService.prepareApiLink('api/fileUpload');


		this.fetchData();
		this.cotForm = this.fb.group({
			amount: ['', [Validators.required]],
			dealer_id: ['', [Validators.required]],
			payment_slot: ['', [Validators.required]],
			dealer_payment: ['', [Validators.required]],
		});



		this.searchForm = this.fb.group({
			rangePicker: ['', [Validators.required]],
			dealer: ['', []]
		});
	}

	handlePreview = async (file: NzUploadFile) => {
		if (!file.url && !file.preview) {
		  file.preview = await getBase64(file.originFileObj!);
		}
		this.previewImage = file.url || file.preview;
		this.previewVisible = true;
	};

	ngOnInit(): void {
	}


	fetchData(): void {
		this.apiService.apiRequestWithToken('webapi/getDealerUsers', {}).subscribe((data: any) => {
			this.dealers = data;
			this.isLoading = false;
		});
		this.apiService.apiRequestWithToken('webapi/dealerTransactions', {}).subscribe((data: any) => {
			this.users = data;
			this.usersBack = this.users;
			this.isLoading = false;
		});
	}

	submitSearch(): void {

		this.isLoading = true;

		let postData: any = {
			rangePicker: this.searchForm.value.rangePicker,
			dealer: this.searchForm.value.dealer
		};
		this.apiService.apiRequestPostWithToken('webapi/dealerTransactions', postData).subscribe((data: any) => {
			this.users = data;
			this.usersBack = this.users;
			this.isLoading = false;
		});

	}

	submitForm(): void {

		this.isLoading = true;
		this.uploadedFileIds = [];
		for (const key in this.fileList) {
			this.uploadedFileIds.push(this.fileList[key].response.id);
		}

		let postData: any = {
			amount: this.cotForm.value.amount,
			payment_slot: this.cotForm.value.payment_slot,
			attachements: JSON.stringify(this.uploadedFileIds),
			dealer_id: this.cotForm.value.dealer_id,
		};
		this.apiService.apiRequestPostWithToken('webapi/dealerPayment', postData).subscribe((data: any) => {
			this.fetchData();
			this.closeDrawer();
			this.isLoading = false;
		});

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

	openDrawer(action: string, rec?: any): void {
		
		if( action == 'pay' ) {
			this.formTitle = 'Payment Entry';
			this.formAction = 'pay';
			this.formWidth = 500;

			this.cotForm.controls['amount'].setValue(rec.amount);
			this.cotForm.controls['dealer_id'].setValue(rec.dealer_id);
			this.cotForm.controls['payment_slot'].setValue(rec.slot);
		}
		if( action == 'view' ) {
			this.formTitle = 'Transaction Records';
			this.formWidth = 800;
		}
		this.visible = true;
	}
	closeDrawer(): void {
		this.visible = false;
		this.cotForm.reset();
	}

	uploadProfileCategory = () => {
		return {category:"dealer_payment"};
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
			if (this.formAction == 'pay') {
				this.cotForm.controls['dealer_payment'].setValue(this.fileList);
				// this.cotForm.controls['dealer_payment'].setValue(info.file!.response!.id);
			}
			this.isLoading = false;
			break;
		  case 'error':
			this.msg.error('Network error');
			this.isLoading = false;
			break;
		}
	}

	openUserModal(rec:string):void {
		this.modalTitle = 'Transaction History';
		this.apiService.apiRequestPostWithToken('webapi/dealerTransactionsDetails', rec).subscribe((data: any) => {
			this.userData = data;
			this.isLoading = false;
			this.isUserVisible = true
		});
	}

	handleCancel(): void {
		this.isUserVisible = false
	}


}
