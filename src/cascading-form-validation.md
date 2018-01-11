# Cascading Form Validation

## Set up each component to broadcast its validity status

### @Output() isFormValid on each component

*. Each component should declare an output property `isFormValid`. It is through this output property that 
the component can bubble up its form state to its parent, from parent to grandparent all the way
up to the component that is linked to a route.
```
  @Output() isFormValid = new EventEmitter<boolean>();

```

*. For component that is at the bottom of the hierarchy, which means it does not have any custom
components in its template, its broadcasts form validity status via 
```
    this.form.valueChanges.subscribe(
      (values) => {
        this.isFormValid.emit(this.form.valid);
      }
    );
```
in `ngOnInit()`

*. For component that does have custom components in its template, it should report a rolled up status - a status
that include itself and its child components.


## Set up parent-child component communication
A component can play the role of both child and parent component or just a parent component; each component 
must implement functions listed below that is applicable to its role.

## Use ViewChild
When a parent always include a child component (no conditional inclusion), then we can use ViewChild or ViewChildren 

## Use registration

### Child component: @Output() registerXXXComponent() function 
For each component that need to report its status to a parent, it must provide this function to register itself to the parent.
The component must call this function and emit itself in its own `ngOnInit` function.

```
  @Output() registerXXXComponent = new EventEmitter<MspXXXComponent>();

```
Calling in from `ngOnInit` in child component to register itself. (very first line in ngOnInit)
```
    this.registerXXXComponent.emit(this);
```

### Parent component: onRegisterXXXComponent function
For components that play parent component role, it must provide one or multiple onRegisterXXXComponent functions to build
list of child components that it need to collect form validation status from.

### Parent component: HTML template update

Hook up child component registerXXXComponent function with parent onRegisterXXXComponent in parent component template file.

## Parent component: updateSubscription() function and calling it from ngOnInit
Each component provides `updateSubscription` function to combine all observables from 
children and itself into one stream and calcuate one final boolean value to indicate if
all children and this component are valid.

User can only continue when the final boolean value is true.

`updateSubscription` must be called from ngOnInit for each component

## Parent and Child component: Track fields on its own template form 
```
    let curFormValidation:Observable<boolean> = this.form.valueChanges.map(
      function(values){
        return this.form.valid;
      }
    );

```

## Parent component: ngOnDestroy() 
Unsubcribe the subcription to avoid memory leak.

## Aggregate the form validation state on nested components



```
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


```