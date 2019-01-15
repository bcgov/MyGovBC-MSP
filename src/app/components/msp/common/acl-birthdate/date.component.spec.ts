import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CalendarFutureDatesDirective } from '../date/calendar-future-dates.validator';
import * as moment from 'moment';
import { FPCareDateComponent } from './date.component';
import { CalendarFieldFormatterDirective } from './calendar-field-formatter.directive';
import { CalendarDayValidatorDirective } from './calendar-day.validator';


describe('FPCareDateComponent', () => {
  let component: FPCareDateComponent;
  let fixture: ComponentFixture<FPCareDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FPCareDateComponent, CalendarFieldFormatterDirective, CalendarFutureDatesDirective, CalendarDayValidatorDirective],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FPCareDateComponent);
    component = fixture.componentInstance;
    component.date = {day: null, month: null, year: null};
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

   it('should be required by default', () => {
    expect(component.required).toBe(true);
  });

  it('should detect incomplete dates', () => {
    expect(component.isValid()).toBe(false);
    component.setDayValueOnModel('1');
    fixture.detectChanges();
    component.setMonthValueOnModel('1');
    expect(component.isValid()).toBe(false);
  });

  it('should pass validation when completely empty if not required', () => {
    component.required = false;
    expect(component.isValid()).toBe(true);
    component.setDayValueOnModel('1');
    expect(component.isValid()).toBe(false);
  });

  it('should be valid when setting current date', () => {
    component.setToToday();
    expect(component.isValid()).toBe(true);
    expect(component.date.month).toEqual(moment().month() + 1);
    expect(component.date.year).toEqual(moment().year());
    expect(component.date.day).toEqual(moment().date());
  });

  it('should accept future dates when restricted to future dates', async(() => {
    component.restrictDate = 'future';
    component.setToToday();
    component.setYearValueOnModel(component.date.year + 1 + '');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(true);
    });

  }));

  it('should reject past dates when restricted to future dates', async(() => {
    component.restrictDate = 'future';
    component.setToToday();
    component.setYearValueOnModel(component.date.year - 10 + '');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(false);
    });

  }));

  it('should reject future dates when restricted to past dates', async(() => {
    component.restrictDate = 'past';
    component.setToToday();
    component.setYearValueOnModel(component.date.year + 1 + '');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(false);
    });
  }));

  it('should accept past dates when restricted to past dates.', async(() => {
    component.restrictDate = 'past';
    component.setToToday();
    component.setYearValueOnModel(component.date.year - 10 + '');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(true);
    });
  }));


  it('should accept todays date when restricted to future dates', async(() => {
    component.restrictDate = 'future';
    component.setToToday();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(true);
    });
  }));

  it('should reject todays date when restricted to past dates', async(() => {
    component.restrictDate = 'past';
    component.setToToday();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isValid()).toBe(false);
    });
  }));

  it('should display text for component', () => {
    component.label = 'This a test';
    fixture.detectChanges();

    const legendText = fixture.nativeElement.querySelector('legend');
    expect( legendText.textContent).toContain('This a test');
  });

});
