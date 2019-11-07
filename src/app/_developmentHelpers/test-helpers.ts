import { ComponentFixture, tick, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { Type } from '@angular/core';

// Helpers for unit tests

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}



// Create unit test module for testing component
export function createTestingModule<T>( cmp: Type<T>,
                                        template: string,
                                        ...directives: Type<any>[] ): ComponentFixture<T> {

  TestBed.configureTestingModule({
    declarations: [
      cmp,
      ...directives
    ],
    imports: [
      BrowserModule,
      FormsModule,
      SharedCoreModule
    ],
    providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true }
    ]
  }).overrideComponent(cmp, {
    set: {
      template: template
    }
});

TestBed.compileComponents();

  return TestBed.createComponent( cmp );
}
