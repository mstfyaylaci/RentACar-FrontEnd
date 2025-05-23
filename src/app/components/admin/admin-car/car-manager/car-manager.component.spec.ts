import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarManagerComponent } from './car-manager.component';

describe('CarManagerComponent', () => {
  let component: CarManagerComponent;
  let fixture: ComponentFixture<CarManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
