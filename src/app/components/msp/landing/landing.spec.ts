import { TestBed } from '@angular/core/testing'
import { LandingComponent } from './landing.component'
describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [LandingComponent]})
  })
  it ('should work', () => {
    let fixture = TestBed.createComponent(LandingComponent)
    expect(fixture.componentInstance instanceof LandingComponent).toBe(true, 'should create LandingComponent')
  })
})
