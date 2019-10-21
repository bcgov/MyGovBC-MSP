import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { AclApiPayLoad } from '../modules/request-acl/model/acl-api.model';
import { ApiResponse } from '../models/api-response.interface';


@Injectable({
  providedIn: 'root'
})
export class FakeBackendService {

  constructor() {}

  getAclResponse( request: HttpRequest<any> ): AclApiPayLoad {

    return {
      aclTransactionId: request.body.aclTransactionId,
      referenceNumber: '1535785',
      dberrorMessage: null,
      rapidResponse: 'Y',
      dberrorCode: 'Y'
    };
  }


  getAttachementResponse( request: HttpRequest<any> ): ApiResponse {

    return {
      op_return_code: 'SUCCESS',
      op_technical_error: null,
      dbErrorMessage: null,
      op_reference_number: '',
      req_num: ''
    };
  }

  getSubmitApplicationResponse( request: HttpRequest<any> ): ApiResponse {
    const referenceNo = String( Math.random() * 9999999 );
    const size = 7 - referenceNo.length;

    return {
      op_return_code: 'SUCCESS',
      op_technical_error: null,
      dbErrorMessage: null,
      op_reference_number: '',
      req_num: String('0').repeat( size ) + referenceNo
    };
  }
}
