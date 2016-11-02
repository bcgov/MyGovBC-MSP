class Person {
  firstname: string;
  lastname: string;
  middlename: string;
  gender: string
  dob_day: number;
  dob_month: number;
  dob_year: number;
  previous_phn: string;

  constructor(){
    this.firstname = 'John';
    this.lastname = 'Smith';
  }
}

/**
 * Primary applicant for msp appication
 */
class Applicant extends Person {
  constructor(){
    super();
  }
}

class Spouse extends Person {

}

class Child extends Person {

}

class MspApplicantioin {
  private _applicant: Applicant = new Applicant();
  spouse: Spouse;

  constructor(){
    
  }
  addSpouse(spouse: Spouse) {

  }

  get applicant(){
    console.log('applicant firstname: ' + this._applicant.firstname);
    return this._applicant;
  }
}


export {MspApplicantioin, Applicant, Spouse, Child}