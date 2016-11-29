import {TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Mod11CheckValidator} from './phn.validator';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

describe('PHN Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Mod11CheckValidator],
      imports: [BrowserModule,
        CommonModule,
        FormsModule]
    })
  });
  it('should validate PHN properly', () => {
    let fixture = new Mod11CheckValidator();

    expect(fixture.isValid("")).toBe(false, 'empty value should not pass');
    expect(fixture.isValid(null)).toBe(false, 'null should not pass');
    expect(fixture.isValid("A")).toBe(false, 'a letter should not pass');
    expect(fixture.isValid(" A ")).toBe(false, 'a letter should not pass');
    expect(fixture.isValid("0009012372173")).toBe(true, 'padding should be allowed');
    expect(fixture.isValid("009012372173")).toBe(true, 'padding should be allowed');
    expect(fixture.isValid("09012372173")).toBe(true, 'padding should be allowed');
    expect(fixture.isValid("9012372173")).toBe(true, 'padding should not catch interior 0s');
    expect(fixture.isValid("9A00072173")).toBe(false, 'letters should not be allowed');

  });
})
