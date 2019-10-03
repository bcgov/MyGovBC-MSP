import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BenefitSpouseInfoComponent } from './spouse-info.component';


describe('SpouseInfoComponent', () => {
  let component: BenefitSpouseInfoComponent;
  let fixture: ComponentFixture<BenefitSpouseInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitSpouseInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitSpouseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
