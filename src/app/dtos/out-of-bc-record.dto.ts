import { BaseDto } from './base.dto';

/**
 * Storage definition
 */
export class OutofBCRecordDto extends BaseDto {
  id: string;
  reason: string;
  location: string;
  departureDate: Date;
  returnDate: Date;
}
