import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDonorComponent } from './users_donor.component';

describe('UsersDonorComponent', () => {
  let component: UsersDonorComponent;
  let fixture: ComponentFixture<UsersDonorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDonorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
