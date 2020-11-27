import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRecipientComponent } from './reportrecipient.component';

describe('ReportRecipientComponent', () => {
  let component: ReportRecipientComponent;
  let fixture: ComponentFixture<ReportRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
