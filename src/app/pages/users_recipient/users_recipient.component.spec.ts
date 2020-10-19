import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRecipientComponent } from './users_recipient.component';

describe('UsersRecipientComponent', () => {
  let component: UsersRecipientComponent;
  let fixture: ComponentFixture<UsersRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
