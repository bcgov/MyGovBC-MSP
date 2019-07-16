import * as faker from 'faker';

export class FakeDataRetroPA {

    private static seedVal: number = Math.floor(Math.random() * Math.floor(1000));

    personalInfo(): PersonalInfoPageTest {
        return {
            firstName: faker.name.firstName(),
            middleName: Math.random() > 0.5 ? faker.name.firstName() : undefined,
            lastName: faker.name.lastName(),
            birthDate: faker.date.past()
        }
    }

    contactInfo(): ContactInfoPageTest {
        return {
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            country: faker.address.country(),
            province: faker.address.state(),
            postal: faker.address.zipCode('?#? #?#'),
            mobile: faker.phone.phoneNumberFormat(2)
        };
    }

    getSeed() {
        return FakeDataRetroPA.seedVal;
    }

    setSeed(seed = this.getSeed()) {
        faker.seed(seed);
    }
}

export interface PersonalInfoPageTest {
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    PHN?: number;
    SIN?: number;
}

export interface ContactInfoPageTest {
    streetAddress: string;
    city: string;
    country: string;
    province: string;
    postal: string;
    mobile: string;
}