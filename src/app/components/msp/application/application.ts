class Person {
  relationship: string;
  firstname: string;
  lastname: string;
  middlename: string;
  gender: string
  dob_day: number;
  dob_month: number;
  dob_year: number;
  previous_phn: string;

  constructor(rel: string){
    this.relationship = rel;
  }
}

/**
 * Primary applicant for msp appication
 */
class Applicant extends Person {
  private _children: Array<Person>  = [];
  private _spouse: Person;
  constructor(){
    super('Yourself');
  }

  addSpouse(): void{
    console.log('add spouse..');
    if(!this._spouse){
      this._spouse = new Person('Spouse');
    }
  }

  addChild(): void {
    let c = new Person('Child')
    this._children.length < 30 ? this._children.push(c): console.log('No more than 30 chidren can be added to one application');
  }
  
  get spouse(): Person {
    return this._spouse;
  }

  get children(): Array<Person> {
    return this._children;
  }
}

class MspApplicantioin {
  private _applicant: Applicant = new Applicant();

  constructor(){
    
  }
  addSpouse(): void {
    this._applicant.addSpouse();
  }

  addChild(): void {
    this._applicant.addChild();
  }

  get applicant(){
    // console.log('applicant firstname: ' + this._applicant.firstname);
    return this._applicant;
  }

  get spouse(): Person {
    return this._applicant.spouse;
  }

  get children(): Array<Person> {
    return this._applicant.children;
  }
}


export {MspApplicantioin, Applicant, Person}