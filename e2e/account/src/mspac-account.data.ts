import * as faker from "faker";

export class FakeDataAccountChange {
  private static seedVal: number = Math.floor(Math.random() * Math.floor(1000));

  contactInfo(): ContactPageTest {
    return {
      country: faker.address.country(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      postal: 'V7V7V7',
      mobile: faker.phone.phoneNumberFormat(2),
    };
  }

  personalInfo(): PersonalInfoPageTest {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthDate: new Date("1990-03-25T12:00:00-06:30"),
      province: faker.address.state(),
      arrivalDateBC: new Date("2008-05-11T12:00:00-06:30"),
      arrivalDateCAN: new Date("2008-05-11T12:00:00-06:30"),
      healthNum: '9999999998',
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
  healthNum: string;
}
