import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDonorComponent } from './reportdonor.component';

describe('ReportDonorComponent', () => {
  let component: ReportDonorComponent;
  let fixture: ComponentFixture<ReportDonorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDonorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
