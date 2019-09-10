import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSpouseComponent } from './update-spouse.component';

describe('UpdateSpouseComponent', () => {
  let component: UpdateSpouseComponent;
  let fixture: ComponentFixture<UpdateSpouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSpouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSpouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
