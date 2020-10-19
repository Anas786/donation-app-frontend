import { Component, OnInit } from '@angular/core';
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

	options = {
		fieldSeparator: ',',
		quoteStrings: '"',
		decimalseparator: '.',
		// showLabels: false,
		headers: [],
		showTitle: true,
		title: 'Data lookups',
		useBom: false,
		removeNewLines: true,
	};

	constructor(private helperService: HelperService, private apiService: ApiService) { 
		this.helperService.setTitle('Data lookups');

		this.fetchData();
	}

	ngOnInit(): void {
	}

	fetchData(): void {
		this.apiService.apiRequestWithToken('api/lookup', {}).subscribe((data: any) => {
			this.lookups = data;
			this.isLoading = false;
		});
	}

	update(type: string, id: string): void {

		let postData: any = {
			logId: id
		}

		if( type == 'approve' ) {
			postData.isApproved = true;
		} else if( type == 'reject' ) {
			postData.isRejected = true;
		}

		this.apiService.apiRequestPostWithToken('logs/updateLog', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Log has been updated');
			this.fetchData();
		}, (err) => {
			this.helperService.presentMessage('error', err.error.errors[0].messages[0]);
		})
	}

}
