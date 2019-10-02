import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MovingInformationComponent } from './moving-information.component';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('MovingInformationComponent', () => {
  let component: MovingInformationComponent;
  let fixture: ComponentFixture<MovingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MovingInformationComponent
        ],
      imports: [
        FormsModule,
        SharedCoreModule,
        HttpClientTestingModule
      ],
      providers: [
        NgForm
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
