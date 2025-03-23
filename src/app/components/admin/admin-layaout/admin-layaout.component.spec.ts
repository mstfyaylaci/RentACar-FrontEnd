import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayaoutComponent } from './admin-layaout.component';

describe('AdminLayaoutComponent', () => {
  let component: AdminLayaoutComponent;
  let fixture: ComponentFixture<AdminLayaoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLayaoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLayaoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
