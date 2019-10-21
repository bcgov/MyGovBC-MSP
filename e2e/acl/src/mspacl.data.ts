import * as faker from 'faker';

export class FakeDataACL {

    private static seedVal: number = Math.floor(Math.random() * Math.floor(1000));

    personalInfo(): PersonalInfoPageTest {
        return {
            PHN: 9999999998,
            birthDate: faker.date.past(),
            postal: faker.address.zipCode('?#? #?#')
        }
    }

    getSeed() {
        return FakeDataACL.seedVal;
    }

    setSeed(seed = this.getSeed()) {
        faker.seed(seed);
    }
}

export interface PersonalInfoPageTest {
    PHN: number;
    birthDate: Date;
    postal: string
}
