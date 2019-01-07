import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificMemberComponent } from './specific-member.component';

describe('SpecificMemberComponent', () => {
  let component: SpecificMemberComponent;
  let fixture: ComponentFixture<SpecificMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
