# Accessibility

This applications meets or exceeds the [World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.0](https://www.w3.org/TR/WCAG20/).

## Tested Assistive Technologies

The following technologies have been test with this application, chosen because of their popularity and coverage using data from http://webaim.org/projects/screenreadersurvey6/:

1. JAWS IE 11 on Windows 10
2. NVDA Firefox (evergreen) on Windows 10 
3. VoiceOver on Mac OS (should get iOS coverage)

## Implementation Patterns

### Tab Indexing
TODO: Yiling to write

### Dynamically Displayed Content

Screen readers need to be notified when new content/forms are dynamically displayed:

1. (AngularJS) Avoid `[hidden]="expression"` use `*ngIf="expression"` instead.  Screen readers tend to read hidden elements.
2. For errors, announce revealed content with `role="alert" aria-live="assertive"`
3. If revealing new for element use  `role="dialogue"`

### Radio Buttons

1. Use `<label for="">` for the first radio control
2. Use a hidden label `<label class="hidden" for="">` for the second and so on controls 