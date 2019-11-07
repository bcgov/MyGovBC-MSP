import { PersonalInformationComponent, IPersonalInformation } from './personal-information.component';
import { Gender } from '../../../../models/gender.enum';
import { Relationship } from '../../../../models/relationship.enum';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { createTestingModule } from '../../../../_developmentHelpers/test-helpers';

class Person1 implements IPersonalInformation {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  relationship: Relationship;
}

@Component({
  template: `
    <msp-personal-information [(person)]="applicant">
      <div sectionTitleInfo>
        <h2>Personal Information</h2>
        <p class="border-bottom">
          Enter your legal name and gender.
        </p>
      </div>
    </msp-personal-information>`,
})
// tslint:disable-next-line: component-class-suffix
class PersonalInfo {

  @ViewChildren(PersonalInformationComponent) personalInfo: QueryList<PersonalInformationComponent<Person1>>;

  applicant: Person1 = new Person1();

}



describe('PersonalInformationComponent', () => {

  describe('Component with optional Gender field', () => {
    let component: PersonalInfo;
    let fixture;


    beforeEach(() => {
      fixture = createTestingModule( PersonalInfo, PersonalInformationComponent );
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect( component ).toBeTruthy();
    });
  });

  /*
  describe('Component with optional PHN & SIN fields', () => {
    let component: PersonalInformationComponent<Person2>;
    let fixture: ComponentFixture<PersonalInformationComponent<Person2>>;
  }
*/


  /*
  it('should create', fakeAsync(() => {
    const fixture = createTestingModule( RadioTestComponent,
      `<form>
        <common-radio name='radioBtn1' [(ngModel)]='radio1'
                      label='{{radioLabel1}}'></common-radio>
        </form>`
    );
    const component = fixture.componentInstance;
    tickAndDetectChanges( fixture );
    expect( component.radioComponent ).toBeTruthy();
    expect( getLegendContext( fixture ) ).toBe( component.radioLabel1 );
    expect( component.radioComponent.first.controlDir.hasError( 'required' ) ).toBeFalsy();
  }));
  */
});
