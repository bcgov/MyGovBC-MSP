import { Injectable } from '@angular/core';
import * as Ajv from 'ajv';
import { defaultSchema } from 'app/models/schema';
import { MSPApplicationSchema } from 'app/modules/msp-core/interfaces/i-api';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  ajv = new Ajv({ schemaId: '$id', allErrors: true });
  constructor() {}

  async validate(app: MSPApplicationSchema) {
    const validate = this.ajv.compile(defaultSchema);
    try {
      const valid = await validate(app);
      if (!valid) console.log('errors', validate.errors);
      return validate;
    } catch (err) {
      console.error;
    }
  }
}
