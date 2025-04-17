import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLayaoutComponent } from './account-layaout.component';

describe('AccountLayaoutComponent', () => {
  let component: AccountLayaoutComponent;
  let fixture: ComponentFixture<AccountLayaoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountLayaoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountLayaoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
