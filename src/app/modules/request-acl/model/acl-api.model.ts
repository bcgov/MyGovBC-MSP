export interface AclApiPayLoad {
  aclTransactionId: string;
  referenceNumber: string;
  dberrorMessage: string;
  rapidResponse: string;
  dberrorCode: string;
}


export interface AclApiRequest extends AclApiPayLoad {
  requesterPHN: string;
  requesterBirthdate: string;
  // No spaces eg. V9B9B9
  requesterPostalCode: string;

  // A, M, S
  letterSelection: string;

  // empty if no specifc member PHN
  specificPHN: string;
}
