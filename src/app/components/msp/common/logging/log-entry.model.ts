/**
 * 1. Application ID
 * 2. Attachment ID
 * 3. Status of Application
 * 4. Time Stamp
 * 5. Client IP Address
 * 6. Browser Type/Version
 * 7. Reference Number
 * 8. Header/Parameter Information
 * 9. Checksum and Image Size/Format Information
 * 10. Errors (technical only)
 */
export class LogEntry {
  timestamp:string;
  applicationId:string;
  attachmentId:string[];
  statusOfApplication?:string;
  ipAddress?:string;
  browserType?:string;
  refNumber?:string;
  /**
   * Optional 
   */
  applicationPhase?:string;
}