import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanadianStatusComponent, ICanadianStatus } from './canadian-status.component';
import { SharedCoreModule } from 'moh-common-lib';

describe('CanadianStatusComponent', () => {
  let component: CanadianStatusComponent<ICanadianStatus>;
  let fixture: ComponentFixture<CanadianStatusComponent<ICanadianStatus>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanadianStatusComponent ],
      imports: [SharedCoreModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanadianStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
