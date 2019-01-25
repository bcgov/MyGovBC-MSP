export interface RapidResponse {
    type: string;
    minLength: number;
    maxLength: number;
    required: boolean;
    description: string;
}

export interface DBErrorCode {
    type: string;
    maxLength: number;
    required: boolean;
    description: string;
}

export interface DBErrorMessage {
    type: string;
    maxLength: number;
    required: boolean;
    description: string;
}

export interface ReferenceNumber {
    type: string;
    required: boolean;
    description: string;
}

export interface AclTransactionId {
    type: string;
    pattern: string;
    required: boolean;
    description: string;
}

export interface Properties {
    /*rapidResponse: RapidResponse;
    dberrorCode: DBErrorCode;
    dberrorMessage: DBErrorMessage;
    referenceNumber: ReferenceNumber;
    aclTransactionId: AclTransactionId;*/
    referenceNumber: any;
    aclTransactionId: string;
    dberrorMessage: string;
    rapidResponse: string;
    dberrorCode: string;
}

export interface RootObject {
    $id: string;
    $schema: string;
    title: string;
    type: string;
    properties: Properties;
}



