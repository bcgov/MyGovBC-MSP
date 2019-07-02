import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MspFullNameComponent } from './full-name.component';

describe('MspFullNameComponent', () => {
  let component: MspFullNameComponent;
  let fixture: ComponentFixture<MspFullNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MspFullNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MspFullNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
