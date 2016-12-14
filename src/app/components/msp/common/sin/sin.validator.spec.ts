import {TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {SinCheckValidator} from './sin.validator';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

describe('SIN Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinCheckValidator],
      imports: [BrowserModule,
        CommonModule,
        FormsModule]
    })
  });
  it('should validate SIN properly', () => {
    let fixture = new SinCheckValidator();

    expect(fixture.isValid("")).toBe(false, 'empty value should not pass');
    expect(fixture.isValid(null)).toBe(false, 'null should not pass');
    expect(fixture.isValid("A")).toBe(false, 'a letter should not pass');
    expect(fixture.isValid(" A ")).toBe(false, 'a letter should not pass');
    expect(fixture.isValid("123456789")).toBe(false, 'not a good sin number');
    expect(fixture.isValid("046454286")).toBe(true, 'a good sin number');
    expect(fixture.isValid("046 454 286")).toBe(true, 'a good sin number with spacing');
  });
})
