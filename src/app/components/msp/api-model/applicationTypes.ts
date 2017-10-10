import * as Primitive from './xml-primitives';
import * as at from './assistanceTypes';
import * as et from './enrolmentTypes';
import * as ac from './accountChangeTypes';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/ApplicationTypes.xsd


interface BaseType {
  _exists: boolean;
  _namespace: string;
  _sequence:Array<string>
}
interface _ApplicationType extends BaseType {
  assistanceApplication: at.AssistanceApplicationType;
  enrolmentApplication: et.EnrolmentApplicationType;
  accountChangeApplication: ac.AccountChangeApplicationType;
  uuid: string;
  attachments: AttachmentsType;
  comment?: string;
  $xmlns: string;
}
export interface ApplicationType extends _ApplicationType {
  constructor: {
    new(): ApplicationType
  };
}
export class ApplicationTypeFactory {
  static make(): ApplicationType {
    let instance = <ApplicationType>{};
    instance._sequence = ["assistanceApplication", "enrolmentApplication", "accountChangeApplication", "uuid", "attachments", "comment"];
    //instance.$xmlns = _ApplicationTypeNameSpace;
    return instance;
  }
}

interface _AttachmentsType extends BaseType {
  attachment?: AttachmentType[];
}
export interface AttachmentsType extends _AttachmentsType { constructor: {new(): AttachmentsType};
}
export class AttachmentsTypeFactory {
  static make(): AttachmentsType {
    let instance = <AttachmentsType>{};
    instance._sequence = ["attachment"];
    return instance;
  }
}

interface _AttachmentType extends BaseType {
  attachmentDocumentType: string;
  attachmentUuid: string;
  contentType: ContentType;
  description?: string;
}
export interface AttachmentType extends _AttachmentType { constructor: {new(): AttachmentType};
}
export class AttachmentTypeFactory {
  static make(): AttachmentType {
    let instance = <AttachmentType>{};
    instance._sequence = ["contentType", "attachmentDocumentType", "attachmentUuid", "description"];
    return instance;
  }
}

export type ContentType = ("image/jpeg" | "application/pdf");
interface _ContentType extends Primitive._string { content: ContentType;
}

export interface document extends BaseType {
  application: ApplicationType;
  $xmlns: string;
}
export class DocumentFactory {
  static make(): document {
    let instance = <document>{};
    instance._sequence = ["application"];
    return instance;
  }
}

export const _ApplicationTypeNameSpace = "http://www.gov.bc.ca/hibc/applicationTypes";