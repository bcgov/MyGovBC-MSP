import { PersonalInformationComponent, IPersonalInformation } from './personal-information.component';
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

class Person2 extends Person1 {
  readonly genderRequired: boolean = true;
  gender: Gender;
}

class Person3 extends Person1 {
  readonly phnRequired: boolean = true;
  phn: string;

  readonly sinRequired: boolean = true;
  sin: string;
}
@Component({
  template: ``,
})
// tslint:disable-next-line: component-class-suffix
class PersonalInfo {

  @ViewChildren(PersonalInformationComponent) personalInfo: QueryList<PersonalInformationComponent<Person1 | Person2>>;

  applicant1: Person1 = new Person1();
  applicant2: Person2 = new Person2();
  applicant3: Person3 = new Person3();

  sectionTitle: string = 'Personal Information';
  sectionInstructions: string = 'Enter your legal name and gender.';
}

describe('PersonalInformationComponent', () => {

  describe('Mandatory fields (no properities set)', () => {

    let component: PersonalInfo;
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      fixture = createTestingModule( PersonalInfo,
         `<msp-personal-information [(person)]="applicant1">
            <div sectionTitleInfo>
              <h2>{{sectionTitle}}</h2>
              <p class="border-bottom">
                {{sectionInstructions}}
              </p>
            </div>
          </msp-personal-information>`,
        PersonalInformationComponent
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
      expect( el.querySelectorAll( 'common-radio' ).length ).toBe( 0 ); // optional
      expect( el.querySelectorAll( 'common-phn' ).length ).toBe( 0 ); // optional
      expect( el.querySelectorAll( 'common-sin' ).length ).toBe( 0 ); // optional
    });
  });

  describe('Gender properity set',  () => {
    let component: PersonalInfo;
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      fixture = createTestingModule( PersonalInfo,
        `<msp-personal-information [(person)]="applicant2">
           <div sectionTitleInfo>
             <h2>{{sectionTitle}}</h2>
             <p class="border-bottom">
               {{sectionInstructions}}
             </p>
           </div>
         </msp-personal-information>`,
       PersonalInformationComponent
     );
      component = fixture.componentInstance;
    });

    it('should create with gender', () => {

      const el = fixture.nativeElement;
      expect( component ).toBeTruthy();

      expect( el.querySelector( 'h2' ).textContent).toMatch( component.sectionTitle );
      expect( el.querySelector( 'p' ).textContent ).toMatch( component.sectionInstructions );
      expect( el.querySelectorAll( 'common-name' ).length ).toBe( 3 ); // First, Middle, Last name inputs - mandatory
      expect( el.querySelectorAll( 'common-date' ).length ).toBe( 1 ); // DOB input - mandatory
      expect( el.querySelectorAll( 'common-radio' ).length ).toBe( 1 ); // optional - properity set to display field
      expect( el.querySelectorAll( 'common-phn' ).length ).toBe( 0 ); // optional
      expect( el.querySelectorAll( 'common-sin' ).length ).toBe( 0 ); // optional
    });
  });

  describe('SIN & PHN properities set',  () => {
    let component: PersonalInfo;
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      fixture = createTestingModule( PersonalInfo,
        `<msp-personal-information [(person)]="applicant3">
           <div sectionTitleInfo>
             <h2>{{sectionTitle}}</h2>
             <p class="border-bottom">
               {{sectionInstructions}}
             </p>
           </div>
         </msp-personal-information>`,
       PersonalInformationComponent
     );
      component = fixture.componentInstance;
    });

    it('should create with SIN and PHN', () => {

      const el = fixture.nativeElement;
      expect( component ).toBeTruthy();

      expect( el.querySelector( 'h2' ).textContent).toMatch( component.sectionTitle );
      expect( el.querySelector( 'p' ).textContent ).toMatch( component.sectionInstructions );
      expect( el.querySelectorAll( 'common-name' ).length ).toBe( 3 ); // First, Middle, Last name inputs - mandatory
      expect( el.querySelectorAll( 'common-date' ).length ).toBe( 1 ); // DOB input - mandatory
      expect( el.querySelectorAll( 'common-radio' ).length ).toBe( 0 ); // optional
      expect( el.querySelectorAll( 'common-phn' ).length ).toBe( 1 ); // optional - properity set to display field
      expect( el.querySelectorAll( 'common-sin' ).length ).toBe( 1 ); // optional - properity set to display field
    });
  });
});
