import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';
import { log } from 'ng-zorro-antd';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	isLoading: boolean = true;
	dashStats: any[] = [];

	public barChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels = ['Geopoint Logs', 'Form Logs', 'Audio Logs', 'Image Logs', 'Other'];
	public barChartColors = ['#333333', '#333333', '#666666', '#333333', '#777777'];
	public barChartType = 'bar';
	public barChartLegend = true;
	public barChartData = [
		{ data: [0, 0, 0, 0, 0], label: 'pv', backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#cc65fe',
            '#ffce56',
            '#52c41a'
        ] }
	];

	lat = -30.3170061;
	lng = 22.1261093;

	tableData: any[];
	logRequests: any[];

	logs: any[];

	modal1: boolean = false;
	modal2: boolean = false;
	modal3: boolean = false;
	modal4: boolean = false;
	isVisible: boolean = false;
	isUserVisible: boolean = false;
	modalTitle: string = '';
	modalData: any[];
	userData: any[];

	constructor(private helperService: HelperService, private apiService: ApiService) {
		this.helperService.setTitle('Dashboard');
	}

	ngOnInit(): void {
		this.apiService.apiRequestWithToken('webapi/getDashboardStats', {}).subscribe((data: any) => {

			this.isLoading = false;

			this.dashStats = data.stats;

			// let chartData =  [];
			// let chartLabels = [];
			// data.dashboardStatistics.widget2Histo.forEach((element: any) => {
			// 	chartData.push(element.pv);
			// 	chartLabels.push(element.name);
			// });
			// this.barChartLabels = chartLabels;
			// this.barChartData[0].data = chartData;

			// this.tableData = data.dashboardStatistics.widget4;

			// this.logRequests = data.dashboardStatistics.widget5.slice(0, 4);

		});

	// 	this.apiService.apiRequestWithToken('logs/getAllLogs', {}).subscribe((data: any) => {
    //   this.logs = data.logs;
    //   this.logs.forEach(log => {
    //     if(log['logType'] == 1){
    //       log['pin'] = './assets/imgs/form-log.png'
    //     } else if(log['logType'] == 2){
    //       log['pin'] = './assets/imgs/geopoint-log.png'
    //     }else if(log['logType'] == 3){
    //       log['pin'] = './assets/imgs/image-log.png'
    //     }else if(log['logType'] == 4){
    //       log['pin'] = './assets/imgs/audio-log.png'
    //     }else {
    //       log['pin'] = './assets/imgs/other-log.png'
    //     }
    //   });
	// 	});
	}

// 	openModal(modal: string): void {
// 		this.modal1 = this.modal2 = this.modal3 = this.modal4 = false;
//     if( modal == 'modal1' ) {
// 			this.modalData = this.dashStats[0]?.data;
// 			this.modal2 = this.modal3 = this.modal4 = false;
// 			this.modal1 = true;
// 		} else if( modal == 'modal2' ) {
// 			this.modalData = this.dashStats[1]?.data;
// 			this.modal1 = this.modal3 = this.modal4 = false;
// 			this.modal2 = true;
// 		} else if( modal == 'modal3' ) {
// 			this.modalData = this.dashStats[2]?.data;
// 			this.modal1 = this.modal2 = this.modal4 = false;
// 			this.modal3 = true;
// 		} else if( modal == 'modal4' ) {
// 			this.modalData = this.dashStats[3]?.data;
// 			this.modal1 = this.modal3 = this.modal2 = false;
// 			this.modal4 = true;
// 		}
// 		this.isVisible = true;
// 		this.isUserVisible = false;
//   }

  openUserModal(){
    this.userData = this.dashStats[0]?.data;
    this.modal2 = this.modal3 = this.modal4 = false;
    this.modal1 = true;
    this.isUserVisible = true
    this.isVisible = false
  }

	handleCancel(): void {
    this.isVisible = false;
    this.isUserVisible = false;
		this.modal1 = this.modal2 = this.modal3 = this.modal4 = false;
	}

	handleOk(): void {
    this.isUserVisible = false;
		this.isVisible = false;
		this.modal1 = this.modal2 = this.modal3 = this.modal4 = false;
	}

}
