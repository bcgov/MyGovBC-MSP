// File contains constants used for address
import { ProvinceList, CountryList, BRITISH_COLUMBIA, PROVINCE_LIST } from 'moh-common-lib';

export class MspAddressConstants {

   static provList( exceptBC: boolean = false ): ProvinceList[] {

    if (!exceptBC) {
      return PROVINCE_LIST;
    }
    return PROVINCE_LIST.map( x => {
      if ( x.provinceCode !== BRITISH_COLUMBIA ) {
        return x;
      }
    }).filter( x => x );
  }
}
