import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificMemberComponent } from './specific-member.component';
import {
  MSPEnrollementMember
} from '../../../../../models/status-activities-documents';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MspACLService } from '../../../services/msp-acl-api.service';
import { MspDataService } from '../../../../../services/msp-data.service';
import { MspLogService } from '../../../../../services/log.service';
import { TextMaskModule } from 'angular2-text-mask';

describe('SpecificMemberComponent', () => {
  let component: SpecificMemberComponent;
  let fixture: ComponentFixture<SpecificMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificMemberComponent],
      imports: [FormsModule, RouterTestingModule, TextMaskModule],
      providers: [MspDataService, MspLogService, MspACLService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificMemberComponent);
    component = fixture.componentInstance;
    // component.person = new Person(Relationship.AllAgeApplicant);
    component.person.enrollmentMember = MSPEnrollementMember.AllMembers.toString();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
