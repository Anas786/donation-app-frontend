import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDonorComponent } from './transactiondonor.component';

describe('TransactionDonorComponent', () => {
  let component: TransactionDonorComponent;
  let fixture: ComponentFixture<TransactionDonorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDonorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
