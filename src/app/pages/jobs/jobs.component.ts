import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HelperService } from '../../shared/services/helper.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
	selector: 'app-jobs',
	templateUrl: './jobs.component.html',
	styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

	isLoading: boolean = true;
	jobs: any[];
  jobsBack: any[];
  isVisible = false;
  isOkLoading = false;

	/* Drawer Config */
  visible = false;
  jobID : string;
	formTitle: string = 'Add New Job Collection';
	formAction: string = 'add';

	cotForm: FormGroup;
	cotForm2: FormGroup;
	cotForm3: FormGroup;

	searchValue = '';

	dataCapturer: any[];
	superCapturer: any[];

	constructor(private fb: FormBuilder, private helperService: HelperService, private apiService: ApiService) {
		this.helperService.setTitle('Data Collection Jobs');

		this.fetchData();

		this.cotForm = this.fb.group({
			collectionName: ['', [Validators.required]],
			description: ['', [Validators.required]],
			rangePicker: [[], [Validators.required]],
			lead: [null, [Validators.required]],
			formTargets: [null],
			geopointTargets: [null],
			audioTargets: [null],
			imageTargets: [null],
			videoTargets: [null],
		});

		this.cotForm2 = this.fb.group({
			jobId: ['', [Validators.required]],
			userId: ['', [Validators.required]],
			formTargets: [null],
			geopointTargets: [null],
			audioTargets: [null],
			imageTargets: [null],
			videoTargets: [null],
    });

    this.cotForm3 = this.fb.group({
      jobId: ['', [Validators.required]],
      collectionName: ['', [Validators.required]],
      description: ['', [Validators.required]],
			rangePicker: [[], [Validators.required]],
      lead: [null, [Validators.required]],
      formTargets: [null],
			geopointTargets: [null],
			audioTargets: [null],
			imageTargets: [null],
			videoTargets: [null],
    });

	}

	ngOnInit(): void {
	}

	closeDrawer(): void {
		this.visible = false;
		this.cotForm.reset();
		this.cotForm2.reset();
		this.cotForm3.reset();
	}

	openDrawer(action: string, data?: any): void {

		if( action == 'add' ) {
			this.formTitle = 'Add New Job';
			this.formAction = 'add';
			this.cotForm.controls['collectionName'].setValue('');
			this.cotForm.controls['description'].setValue('');
			this.cotForm.controls['rangePicker'].setValue([]);
			this.cotForm.controls['lead'].setValue('');
			this.cotForm.controls['formTargets'].setValue('');
			this.cotForm.controls['geopointTargets'].setValue('');
			this.cotForm.controls['audioTargets'].setValue('');
			this.cotForm.controls['imageTargets'].setValue('');
			this.cotForm.controls['videoTargets'].setValue('');

		} else if (action == 'add_member' ){
			this.formTitle = 'Add Member';
			this.formAction = 'add_member';
			this.cotForm2.controls['jobId'].setValue(data._id);
			this.cotForm2.controls['userId'].setValue('');
			this.cotForm2.controls['formTargets'].setValue('');
			this.cotForm2.controls['geopointTargets'].setValue('');
			this.cotForm2.controls['audioTargets'].setValue('');
			this.cotForm2.controls['imageTargets'].setValue('');
			this.cotForm2.controls['videoTargets'].setValue('');

		} else {
      this.formTitle = 'Edit Job';
      this.formAction = 'edit_job';
      this.cotForm3.controls['jobId'].setValue(data._id);
      this.cotForm3.controls['collectionName'].setValue(data.collectionName);
      this.cotForm3.controls['description'].setValue(data.description);
      this.cotForm3.controls['rangePicker'].setValue([data.startDate,data.endDate]);
      this.cotForm3.controls['lead'].setValue(data.lead._id);
      this.cotForm3.controls['formTargets'].setValue('');
      this.cotForm3.controls['geopointTargets'].setValue('');
      this.cotForm3.controls['audioTargets'].setValue('');
      this.cotForm3.controls['imageTargets'].setValue('');
      this.cotForm3.controls['videoTargets'].setValue('');
      if(data.targets.length > 0){
        this.populateTargets(data.targets)
      }
    }
		this.visible = true;
  }

  populateTargets(targets): void{
    targets.forEach(target => {
      switch(target.type) {
        case "0":
          this.cotForm3.controls['formTargets'].setValue(target.totalTarget);
          break;
        case "1":
          this.cotForm3.controls['geopointTargets'].setValue(target.totalTarget);
          break;
        case "2":
          this.cotForm3.controls['imageTargets'].setValue(target.totalTarget);
          break;
        case "3":
          this.cotForm3.controls['audioTargets'].setValue(target.totalTarget);
          break;
        case "4":
          this.cotForm3.controls['videoTargets'].setValue(target.totalTarget);
          break;
        default:
          // code block
      }
    });
  }

	fetchData(): void {
		this.apiService.apiRequestWithToken('user/getAllDataCapturer', {}).subscribe((data: any) => {
			this.dataCapturer = data.dataCapturer;
		});

		this.apiService.apiRequestWithToken('user/getAllSuperCapturer', {}).subscribe((data: any) => {
			this.superCapturer = data.superCapturer;
		});

		this.apiService.apiRequestPostWithToken('job/getAllJob', {}).subscribe((data: any) => {
			this.jobs = data.jobs;
			this.jobsBack = this.jobs;
			this.isLoading = false;
		});
	}

	submitForm(): void {

		this.isLoading = true;

		let targets = [];
		targets[0] = { type: 3, total: this.cotForm.value.audioTargets };
		targets[1] = { type: 0, total: this.cotForm.value.formTargets };
		targets[2] = { type: 2, total: this.cotForm.value.imageTargets };
		targets[3] = { type: 1, total: this.cotForm.value.geopointTargets };
		targets[4] = { type: 4, total: this.cotForm.value.videoTargets };

		let postData: any = {
			collectionName: this.cotForm.value.collectionName,
			description: this.cotForm.value.description,
			lead: this.cotForm.value.lead,
			startDate: this.cotForm.value.rangePicker[0],
			endDate: this.cotForm.value.rangePicker[1],
			target: targets
		};

		this.apiService.apiRequestPostWithToken('job/createJob', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Job has been created');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('danger', 'Job could not be created');
		})

  }

  editJob(): void {

    this.isLoading = true;

    let targets = [];
		targets[0] = { type: 3, total: this.cotForm3.value.audioTargets };
		targets[1] = { type: 0, total: this.cotForm3.value.formTargets };
		targets[2] = { type: 2, total: this.cotForm3.value.imageTargets };
		targets[3] = { type: 1, total: this.cotForm3.value.geopointTargets };
    targets[4] = { type: 4, total: this.cotForm3.value.videoTargets };

    let jobData : any = {
      jobId: this.cotForm3.value.jobId,
			collectionName: this.cotForm3.value.collectionName,
			description: this.cotForm3.value.description,
			lead: this.cotForm3.value.lead,
			startDate: this.cotForm3.value.rangePicker[0],
      endDate: this.cotForm3.value.rangePicker[1],
    };

    let postData: any = {
      job: jobData,
      targets: targets
    };
    console.log(JSON.stringify(postData));
    this.apiService.apiRequestPostWithToken('job/updateJob', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Job has been updated');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('danger', 'Job could not be updated');
		})

  }

	addMember(): void {

		this.isLoading = true;

		let targets = [];
		targets[0] = { type: 3, total: this.cotForm2.value.audioTargets };
		targets[1] = { type: 0, total: this.cotForm2.value.formTargets };
		targets[2] = { type: 2, total: this.cotForm2.value.imageTargets };
		targets[3] = { type: 1, total: this.cotForm2.value.geopointTargets };
		targets[4] = { type: 4, total: this.cotForm2.value.videoTargets };

		let postData: any = {
			jobId: this.cotForm2.value.jobId,
			userId: this.cotForm2.value.userId,
			target: targets,
		};

		this.apiService.apiRequestPostWithToken('job/addMembers', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Member has been added');
			this.fetchData();
			this.closeDrawer();
		}, (err) => {
			this.helperService.presentMessage('danger', 'Member could not be added');
		})

	}

	search(): void {
		let data = this.jobs.filter((job) => {
			if( job.collectionName )
				return job?.collectionName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
		})
		this.jobs = data;
  }

  showModal(data): void {
    this.jobID = data._id
    console.log(this.jobID);
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isOkLoading = true;
    let postData: any = {
			jobId: this.jobID,
		};
		this.apiService.apiRequestPostWithToken('job/deleteJob', postData).subscribe((resp) => {
			this.helperService.presentMessage('success', 'Job has been deleted');
			this.fetchData();
      this.isVisible = false;
      this.isOkLoading = false;
		}, (err) => {
			this.helperService.presentMessage('danger', 'Job could not be deleted');
		})
  }

	reset(): void {
		this.jobs = this.jobsBack;
		this.searchValue = '';
	}

}
