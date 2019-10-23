export class AddressDto {
  // Street number, name and suffix
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;

  // City
  city: string;

  // Two letter code if BC, otherwise string 25 characters
  province: string;

  // canadian postal code, unless it's a mailing address
  postal: string;

  // Full english spelling of country
  country: string;
}
