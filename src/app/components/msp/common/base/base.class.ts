import { UUID } from 'angular2-uuid';
export abstract class Base {

  /**
   * An identifier for parents to keep track of components
   * @type {string}
   */
  objectId: string = UUID.UUID().toString();

  constructor() { }

}