import { browser, element, by } from 'protractor';
import { SpouseInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - End-to-End', () => {
    const data = new FakeDataEnrolment();

    beforeEach(() => {
        data.setSeed();
    });

    it('01. should be able to navigate from end to end by filling out required fields', () => {

    });

});
