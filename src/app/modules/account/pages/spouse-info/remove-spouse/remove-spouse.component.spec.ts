import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSpouseComponent } from './remove-spouse.component';

describe('RemoveSpouseComponent', () => {
  let component: RemoveSpouseComponent;
  let fixture: ComponentFixture<RemoveSpouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveSpouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveSpouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
