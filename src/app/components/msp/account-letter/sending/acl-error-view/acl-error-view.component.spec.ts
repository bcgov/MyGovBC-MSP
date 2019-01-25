import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AclErrorViewComponent } from './acl-error-view.component';

describe('AclErrorViewComponent', () => {
  let component: AclErrorViewComponent;
  let fixture: ComponentFixture<AclErrorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AclErrorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclErrorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
