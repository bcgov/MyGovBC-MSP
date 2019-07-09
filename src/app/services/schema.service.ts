import { Injectable } from '@angular/core';
import * as Ajv from 'ajv';
import { defaultSchema } from 'app/models/schema';
import { MSPApplicationSchema } from 'app/modules/msp-core/interfaces/i-api';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  ajv = new Ajv({ schemaId: 'id', allErrors: true });
  constructor() {}

  async validate(app: MSPApplicationSchema) {
    const validate = this.ajv.compile(defaultSchema);
    try {
      const valid = await validate(app);
      // console.log('valid', valid);
      if (!valid) console.log('errors', validate.errors);
      return valid;
    } catch (err) {
      console.error;
    }
  }
}
