class Address {
  // Street number, name and suffix
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;

  // City
  city: string;

  // Two letter code
  province: string;

  // canadian postal code
  private _postal: string;

  // postal accessors
  get postal(): string {
    return this._postal;
  }
  set postal(value: string) {
    this._postal = value.toUpperCase();
  }

  // Full english spelling of country
  country: string;

  get hasValue(): boolean {
    return (this.addressLine1 != null);
  }

  constructor(){
  }

}

export {Address};