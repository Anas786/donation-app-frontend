import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDealerComponent } from './reportdealer.component';

describe('ReportDealerComponent', () => {
  let component: ReportDealerComponent;
  let fixture: ComponentFixture<ReportDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
