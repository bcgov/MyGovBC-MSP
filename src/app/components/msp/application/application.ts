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
class MspApplication {
  private _applicant: Person = new Person('Yourself');
  
  private _children: Array<Person>  = [];
  private _spouse: Person;

  get applicant(): Person {
    return this._applicant;
  }
  get spouse(): Person {
    return this._spouse;
  }

  get children(): Array<Person> {
    return this._children;
  }

  addSpouse(): void{
    if(!this._spouse){
      this._spouse = new Person('Spouse');
      console.log('spouse added: ' + JSON.stringify(this._spouse));
    }else{
      console.log('spouse already added to your coverage.');
    }
  }

  addChild(): void {
    let c = new Person('Child')
    this._children.length < 30 ? this._children.push(c): console.log('No more than 30 chidren can be added to one application');
  }
  
  removeChild(idx: number):void {
    // console.log('removing child at index ' + idx);
    let removed = this._children.splice(idx,1);
  }

  removeSpouse(): void {
    // console.log('spouse removed from coverage');
    this._spouse = null;
  }
}

export {MspApplication, Person}