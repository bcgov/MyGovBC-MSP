import { Base } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';

/**
 * All applications have these fields
 */
export class BaseApplication extends Base {

  // Flag to indicate whether individual has read the collection agreement
  infoCollectionAgreement: boolean;

  // Token for all calls to backend
  authorizationToken: string;

  // Wrapper arount objectId so that we do not break applications that call this method
  get uuid(): string {
    return this.objectId;
  }

  // Regenerate the UUID
  regenUUID() {
    this.objectId = UUID.UUID();
  }
}
