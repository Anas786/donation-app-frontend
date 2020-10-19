import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDealerComponent } from './users_dealer.component';

describe('UsersDealerComponent', () => {
  let component: UsersDealerComponent;
  let fixture: ComponentFixture<UsersDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
