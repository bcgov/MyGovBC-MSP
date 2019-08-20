import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreContactInfoComponent } from './core-contact-info.component';

describe('CoreContactInfoComponent', () => {
  let component: CoreContactInfoComponent;
  let fixture: ComponentFixture<CoreContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreContactInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
