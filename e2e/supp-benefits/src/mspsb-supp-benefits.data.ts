import * as faker from 'faker';

export class FakeDataSupplementaryBenefits {

    private static seedVal: number = Math.floor(Math.random() * Math.floor(1000));

    personalInfo(): PersonalInfoPageTest {
        return {
            firstName: faker.name.firstName(),
            middleName: Math.random() > 0.5 ? faker.name.firstName() : undefined,
            lastName: faker.name.lastName(),
            birthDate: faker.date.past(),
            PHN: 9999999998,
            SIN: 999999998
        }
    }

    personalInfoMax(): PersonalInfoPageTest {
        return {
            firstName: 'Loremipsumdolorsitametonsectet',
            middleName: 'Loremipsumdolorsitametonsectet',
            lastName: 'Loremipsumdolorsitametonsectet',
            birthDate: faker.date.past(),
            PHN: 9999999998,
            SIN: 999999998
        }
    }

    contactInfo(): ContactInfoPageTest {
        return {
            country: faker.address.country(),
            province: faker.address.state(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            postal: faker.address.zipCode('?#? #?#'),
            mobile: '2501234567'
        };
    }

    getSeed() {
        return FakeDataSupplementaryBenefits.seedVal;
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
    PHN: number;
    SIN: number;
}

export interface ContactInfoPageTest {
    country: string;
    province: string;
    address: string;
    city: string;
    postal: string;
    mobile: string;
}
