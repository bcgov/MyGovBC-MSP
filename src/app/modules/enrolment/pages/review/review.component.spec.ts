import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { ReviewComponent } from './review.component';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  beforeEach(() => {
    const routerStub = () => ({});
    const pageStateServiceStub = () => ({});
    const enrolDataServiceStub = () => ({application: {}});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ReviewComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub }
      ],
      imports: [
        FormsModule
      ]
    });
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
