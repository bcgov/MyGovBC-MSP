import { Person, CommonImage, SimpleDate } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';
import { Gender } from './gender.enum';
import { SupportDocuments } from '../modules/msp-core/models/support-documents.model';
import * as moment from 'moment';

export class BasePerson extends Person {

  // Person has name, dob, and dob format

  readonly uuid = UUID.UUID();
  gender: Gender;
  documents: SupportDocuments = new SupportDocuments();

  // Personal information component requires PHN
  phn: string;

  constructor() {
    super();
    this.dobFormat = 'MMMM D, YYYY';
  }

  convertToDate( dt: SimpleDate ): Date {
    const hasSimpleDt = Object.keys(dt).map( x => dt[x] === null || dt[x] === undefined )
                        .filter( itm => itm === true )
                        .length === 0;
    if ( hasSimpleDt ) {
      return moment({
        year: dt.year,
        month: dt.month - 1,
        day: dt.day
      }).toDate();
    }
    return undefined;
  }

  convertToSimpleDt( dt: Date ) {
    if ( dt ) {
      const obj = moment( dt ).toObject();
      return {
        year: obj.years,
        month: obj.months + 1,
        day: obj.date
      };
    }
    return { year: null, month: null, day: null };
  }
}


export default class BasePersonDto {

  // Names
  firstName: string;
  middleName: string;
  lastName: string;

  dateOfBirth: Date;

  gender: Gender;

  // documents
  documents: SupportDocuments = new SupportDocuments();

  // Personal information component requires PHN
  phn: string;
}
