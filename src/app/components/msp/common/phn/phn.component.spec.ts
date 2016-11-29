import {TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MspPhnComponent} from './phn.component';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

describe('PHN Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPhnComponent],
      imports: [BrowserModule,
        CommonModule,
        FormsModule]
    })
  })
  it('should work', () => {
    let fixture = TestBed.createComponent(MspPhnComponent);
    expect(fixture.componentInstance instanceof MspPhnComponent).toBe(true, 'should create MspPhnComponent');
  });
  it('should validate PHN properly', () => {
    let fixture = TestBed.createComponent(MspPhnComponent);

    fixture.componentInstance.phn = "";
    expect(fixture.componentInstance.mod11Check()).toBe(false, 'empty value should not pass');

    fixture.componentInstance.phn = null;
    expect(fixture.componentInstance.mod11Check()).toBe(false, 'null should not pass');

    fixture.componentInstance.phn = "A";
    expect(fixture.componentInstance.mod11Check()).toBe(false, 'a letter should not pass');

    fixture.componentInstance.phn = " A ";
    expect(fixture.componentInstance.mod11Check()).toBe(false, 'a letter should not pass');

    fixture.componentInstance.phn = "0009012372173";
    expect(fixture.componentInstance.mod11Check()).toBe(true, 'padding should be allowed');

    fixture.componentInstance.phn = "009012372173";
    expect(fixture.componentInstance.mod11Check()).toBe(true, 'padding should be allowed');

    fixture.componentInstance.phn = "09012372173";
    expect(fixture.componentInstance.mod11Check()).toBe(true, 'padding should be allowed');

    fixture.componentInstance.phn = "9012372173";
    expect(fixture.componentInstance.mod11Check()).toBe(true, 'padding should not catch interior 0s');

    fixture.componentInstance.phn = "9A00072173";
    expect(fixture.componentInstance.mod11Check()).toBe(false, 'letters should not be allowed');

  });
})
