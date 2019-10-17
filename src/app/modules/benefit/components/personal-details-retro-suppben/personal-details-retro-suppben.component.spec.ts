import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsRetroSuppbenComponent } from './personal-details-retro-suppben.component';

describe('PersonalDetailsRetroSuppbenComponent', () => {
  let component: PersonalDetailsRetroSuppbenComponent;
  let fixture: ComponentFixture<PersonalDetailsRetroSuppbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDetailsRetroSuppbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsRetroSuppbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
