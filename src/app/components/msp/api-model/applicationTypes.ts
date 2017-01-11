import * as Primitive from './xml-primitives';
import * as at from './assistanceTypes';
import * as et from './enrolmentTypes';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/ApplicationTypes.xsd


interface BaseType {
	_exists: boolean;
	_namespace: string;
}
interface _ApplicationType extends BaseType {
	assistanceApplication: at.AssistanceApplicationType;
	attachments: AttachmentsType;
	comment?: string;
	enrolmentApplication: et.EnrolmentApplicationType;
	uuid: string;
}
export interface ApplicationType extends _ApplicationType { constructor: { new(): ApplicationType }; }

interface _AttachmentsType extends BaseType {
	attachment?: AttachmentType[];
}
export interface AttachmentsType extends _AttachmentsType { constructor: { new(): AttachmentsType }; }

interface _AttachmentType extends BaseType {
	attachmentDocumentType: string;
	attachmentUuid: string;
	contentType: ContentType;
	description?: string;
}
export interface AttachmentType extends _AttachmentType { constructor: { new(): AttachmentType }; }

export type ContentType = ("image/jpeg" | "application/pdf");
interface _ContentType extends Primitive._string { content: ContentType; }

export interface document extends BaseType {
	application: ApplicationType;
}

export const _ApplicationTypeNameSpace = "http://www.gov.bc.ca/hibc/applicationTypes";