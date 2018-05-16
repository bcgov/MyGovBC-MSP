import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { CaptchaDataService } from './captcha-data.service';

import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CaptchaComponent
      ],

      imports: [
        HttpModule,
        FormsModule
      ],
      
      providers: [
        CaptchaDataService
      ]      
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('BC Gov. CAPTCHA Widget Source Code and Demo');
  }));
});
