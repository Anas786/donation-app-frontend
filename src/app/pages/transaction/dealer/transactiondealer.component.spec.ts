import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDealerComponent } from './transactiondealer.component';

describe('TransactionDealerComponent', () => {
  let component: TransactionDealerComponent;
  let fixture: ComponentFixture<TransactionDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
