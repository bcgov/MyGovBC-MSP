# Accessibility

This applications meets or exceeds the [World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.0](https://www.w3.org/TR/WCAG20/).

## Tested Assistive Technologies

The following technologies have been test with this application, chosen because of their popularity and coverage using data from http://webaim.org/projects/screenreadersurvey6/:

1. TODO: JAWS IE 11?
2. TODO: NVDA Firefox?
3. TODO: VoiceOver iOS?

## AngularJS 2 Implementation Patterns

### Tab Indexing

1. Assign tabindex to "0" for controls that needs to be included in tab index.
1. Assign tabindex to "-1" for controls that needs to be excluded from tab index.
1. Use native html controls whenever possible

### Dynamically Displayed Content

Screen readers need to be notified when new content/forms are dynamically displayed:

1. Avoid `[hidden]="expression"` use `*ngIf="expression"` instead.  Screen readers tend to read hidden elements.
2. For errors, announce revealed content with `role="alert" aria-live="assertive"`
3. If revealing new for element use  `role="dialogue"`

