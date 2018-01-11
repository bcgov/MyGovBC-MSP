import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleDate } from './simple-date.interface';
import { SimpleDateTools } from './simple-date.tools';

describe('SimpleDateTools', () => {

    it('should convert SimpleDate to Moment', () => {
        let date: SimpleDate = {day: 11, month: 6, year: 1991};
        let x: any = SimpleDateTools(date).toMoment();

        //Ideally we shouldn't be testing against a dependencies private variables, but this one is stable and very easy to test.
        expect(x._isAMomentObject).toBe(true);
    });

    it('should be able to string format a SimpleDate object', () => {
        let date: SimpleDate = {day: 11, month: 6, year: 1991};
        let formatted: String = SimpleDateTools(date).toMoment().format("MMMM Do, YYYY");
        expect(formatted).toBe("June 11th, 1991");
    });

});
