import * as faker from 'faker';

export class FakeDataEnrolment {

    private static seedVal: number = Math.floor(Math.random() * Math.floor(1000));

    contactInfo(): ContactPageTest {
        return {
            country: faker.address.country(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            postal: faker.address.zipCode('?#? #?#'),
            mobile: faker.phone.phoneNumberFormat(2)
        };
    }

    personalInfo(): PersonalInfoPageTest {
        return {
            birthDate: faker.date.past(),
            province: faker.address.state(),
            arrivalDateBC:  faker.date.past(),
            arrivalDateCAN: Math.random() > 0.5 ? faker.date.past() : undefined,
            healthNum: faker.random.number()
        }
    }

    getSeed() {
        return FakeDataEnrolment.seedVal;
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
    birthDate: Date;
    province?: string;
    arrivalDateBC: Date;
    arrivalDateCAN: Date;
    healthNum: number;
}
