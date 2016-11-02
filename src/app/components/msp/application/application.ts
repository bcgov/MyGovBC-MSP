class Applicantioin {
  applicant: IApplicant;
  spouse: ISpouse;

  addSpouse(spouse: ISpouse) {

  }
}

interface IApplication {
  
}

/**
 * Primary applicant for msp appication
 */
interface IApplicant extends IPerson {

}

interface ISpouse extends IPerson {

}

interface IChild extends IPerson {

}

interface IPerson {
  firstname: string;
  lastname: string;
  middlename: string;
  gender: string
  dob_day: number;
  dob_month: number;
  dob_year: number;
}