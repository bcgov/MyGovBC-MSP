import { AccountPersonalInformationComponent, IPersonalInformation } from './personal-information.component';
import { Gender } from '../../../../models/gender.enum';
import { Relationship } from '../../../../models/relationship.enum';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { createTestingModule } from '../../../../_developmentHelpers/test-helpers';
import { ComponentFixture, fakeAsync } from '@angular/core/testing';

class Person1 implements IPersonalInformation {

  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: Relationship;
}
@Component({
  template: ``,
})
// tslint:disable-next-line: component-class-suffix
class PersonalInfo {

  @ViewChildren(AccountPersonalInformationComponent) personalInfo: QueryList<AccountPersonalInformationComponent<Person1>>;

  applicant1: Person1 = new Person1();

  sectionTitle: string = 'Personal Information';
  sectionInstructions: string = 'Enter your legal name and gender.';
}

describe('PersonalInformationComponent', () => {

  describe('Mandatory fields (no properities set)', () => {

    let component: PersonalInfo;
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      fixture = createTestingModule( PersonalInfo,
         `<account-personal-information [(person)]="applicant1">
            <div sectionTitleInfo>
              <h2>{{sectionTitle}}</h2>
              <p class="border-bottom">
                {{sectionInstructions}}
              </p>
            </div>
          </account-personal-information>`,
          AccountPersonalInformationComponent
      );
      component = fixture.componentInstance;
    });

    it('should create (mandatory fields)', () => {
      const el = fixture.nativeElement;
      expect( component ).toBeTruthy();

      expect( el.querySelector( 'h2' ).textContent).toMatch( component.sectionTitle );
      expect( el.querySelector( 'p' ).textContent ).toMatch( component.sectionInstructions );
      expect( el.querySelectorAll( 'common-name' ).length ).toBe( 3 ); // First, Middle, Last name inputs - mandatory
      expect( el.querySelectorAll( 'common-date' ).length ).toBe( 1 ); // DOB input - mandatory
    });
  });
});
