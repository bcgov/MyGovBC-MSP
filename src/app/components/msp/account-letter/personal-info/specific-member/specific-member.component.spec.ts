import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificMemberComponent } from './specific-member.component';

import {MspPhnComponent} from '../../../common/phn/phn.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ProcessService } from '../../../service/process.service';
import { MspACLService } from '../../../service/msp-acl-api.service';
import { MspDataService } from '../../../service/msp-data.service';
import { MspLogService } from '../../../service/log.service';
import {Mod11CheckValidator} from '../../../common/phn/phn.validator';
import {TextMaskModule} from 'angular2-text-mask';


describe('SpecificMemberComponent', () => {
  let component: SpecificMemberComponent;
  let fixture: ComponentFixture<SpecificMemberComponent>;
  
  let validator: Mod11CheckValidator;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mod11CheckValidator, SpecificMemberComponent, MspPhnComponent ],
      imports: [FormsModule, RouterTestingModule, TextMaskModule],
      providers: [MspDataService, MspLogService, ProcessService, MspACLService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
