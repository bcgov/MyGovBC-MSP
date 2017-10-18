import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AddRemoveDependentComponent } from './add-remove-dependents.component';
import { ToggleComponent } from '../../common/toggle/toggle.component';
import { StatusInCanadaRadioComponent } from '../../common/status-in-canada-radio/status-in-canada-radio.component';
import { MspDateComponent } from '../../common/date/date.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component'

import { CalendarYearValidator } from '../../common/calendar/calendar-year.validator';
import { CalendarMonthValidator } from '../../common/calendar/calendar-month.validator';
import { CalendarDayValidator } from '../../common/calendar/calendar-day.validator';
import { CalendarYearFormatter } from '../../common/calendar/calendar-year-formatter.component';

describe('AddRemoveDependentsComponent', () => {
  let component: AddRemoveDependentComponent;
  let fixture: ComponentFixture<AddRemoveDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddRemoveDependentComponent, ToggleComponent, StatusInCanadaRadioComponent, MspDateComponent, AccountPersonalDetailsComponent, CalendarYearValidator, CalendarMonthValidator, CalendarDayValidator, CalendarYearFormatter],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
