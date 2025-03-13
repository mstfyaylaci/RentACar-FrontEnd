import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLayaoutComponent } from './home-layaout.component';

describe('HomeLayaoutComponent', () => {
  let component: HomeLayaoutComponent;
  let fixture: ComponentFixture<HomeLayaoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeLayaoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeLayaoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
