export interface AccountMaintenanceApiResponse {
    op_return_code: 'SUCCESS' | 'FAILURE';
    op_technical_error: null | string;
    dbErrorMessage: null | string;
    op_reference_number: string;
    req_num: string;
}