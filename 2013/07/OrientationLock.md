# Screen Orientation Lock - Draft Feedback

Spec: https://dvcs.w3.org/hg/screen-orientation/raw-file/tip/Overview.html

* the somewhat liberal use of SHOULD in that spec is going to lead to user
  agents doing bad things. It basically says that UAs are allowed to return
  bogus orientation values. This will lead to Device Orientation all over again
  (where UA's returned laughably different values depending on which way one
  rotates their phone).

* overloading the `lockOrientation()` method could just use the "or" operator
  in WebIDL.

* The `unlockOrientation()` and `lockOrientation()` methods do the same thing.
  The methods should be merged into a `setOrientation()` method. Setting the
  orientation to `null` or the empty string just returns it to its default.
  Could also add a "auto" orientation keyword.

* If the spec can be changed to 
  `setOrientation([TreatEmptyStringAs=null] Orientation value)`, 
  then it should vend a Promise. So then, for example:

```
setOrientation("portrait").then(showSplashScreen, fail);
setOrientation("landscape").then(showGameMenu, fail); 
//unlock it
setOrientation(null).then(whatever); 
```

 * The allowed orientation values need to be defined as an enum. 

 * The spec does not define which task queue to use.  

 * The spec treats Screen as extending EventTarget, but Screen is not an
   EventTarget. Either the spec needs to make Screen and EventTarget or CSSOM 
   View needs to be updated to be an EventTarget. 
