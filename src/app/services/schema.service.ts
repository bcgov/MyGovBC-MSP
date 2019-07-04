import { Injectable } from '@angular/core';
import * as Ajv from 'ajv';
import { defaultSchema } from 'app/models/schema';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  ajv = new Ajv();
  constructor() {
    console.log(this.ajv);
  }

  validate() {
    const validate = this.ajv.compile(defaultSchema);
    const valid = validate('abcdef');
    console.log(validate);
    console.log('valid', valid);
  }
}
