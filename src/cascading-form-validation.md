# Cascading Form Validation

## Set up each component to broadcast its validity status

### @Output() isFormValid on each component

*. Each component should declare an output property `isFormValid`. It is throught this output property that 
the component can bubble up its form state to its parent, then the parent to grandparent all the way
up to the component that is linked to a route.
```
  @Output() isFormValid = new EventEmitter<boolean>();

```

*. Every form broadcast form validity status via 
```
    this.form.valueChanges.subscribe(
      (values) => {
        this.isFormValid.emit(this.form.valid);
      }
    );
```
in `ngOnInit()`


## Set up parent-child component communication
A component can play the role of both child and parent component or just a parent component; each component 
must implement functions listed below that is applicable to its role.

### @Output() registerXXXComponent() Function on each child component
For each component that need to report its status to a parent, it must provide this function to register itself to the parent.
The component must call this function and emit itself in its own `ngOnInit` function.

```
  @Output() registerXXXComponent = new EventEmitter<MspXXXComponent>();

```
Calling in from `ngOnInit` in child component to register itself. (very first line in ngOnInit)
```
    this.registerXXXComponent.emit(this);
```

### onRegisterXXXComponent Function on each parent component
For components that play parent component role, it must provide one or multiple onRegisterXXXComponent functions to build
list of child components that it need to collect form validation status from.

### Parent component: HTML template update

Hook up child component registerXXXComponent function with parent onRegisterXXXComponent in parent component template file.

## updateSubscription() Function and calling it from ngOnInit in parent component
Each component provides `updateSubscription` function to combine all observables from 
children and itself into one stream and calcuate one final boolean value to indicate if
all children and this component are valid.

User can only continue when the final boolean value is true.

`updateSubscription` must be called from ngOnInit for each component

## ngOnDestroy() for each parent component
Unsubcribe the subcription to avoid memory leak.

