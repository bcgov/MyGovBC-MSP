import * as faker from "faker";

export class FakeDataAccountChange {
  private static seedVal: number = Math.floor(Math.random() * Math.floor(1000));

  contactInfo(): ContactPageTest {
    return {
      country: faker.address.country(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      postal: faker.address.zipCode("?#? #?#"),
      mobile: faker.phone.phoneNumberFormat(2),
    };
  }

  personalInfo(): PersonalInfoPageTest {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthDate: faker.date.past(),
      province: faker.address.state(),
      arrivalDateBC: faker.date.past(),
      arrivalDateCAN: Math.random() > 0.5 ? faker.date.past() : undefined,
      healthNum: faker.random.number(),
    };
  }

  getSeed() {
    return FakeDataAccountChange.seedVal;
  }

  setSeed(seed = this.getSeed()) {
    faker.seed(seed);
  }
}

export interface ContactPageTest {
  country: string;
  address: string;
  city: string;
  postal: string;
  mobile: string;
  province?: string;
}

export interface PersonalInfoPageTest {
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: Date;
  province?: string;
  arrivalDateBC: Date;
  arrivalDateCAN: Date;
  healthNum: number;
}
