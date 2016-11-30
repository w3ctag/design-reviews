# WebVR API Draft Feedback

[Draft under discussion](https://w3c.github.io/webvr/) at [this revision](https://github.com/w3c/webvr/commit/201b8451c05e25d0bced4af9b7e5f20c48b20898)

We extracted IDL and example code from the draft in question using a snippet run at the developer tool command line:

```js
Array.prototype.slice.call(
  document.querySelectorAll(".idl,.es-code")
).map(function(n) { return n.innerText; }).join("\n\n\n");
```

IDL replicated here for clarity:

```
interface VRDisplay : EventTarget {
  readonly attribute boolean isConnected;
  readonly attribute boolean isPresenting;


  /**
   * Dictionary of capabilities describing the VRDisplay.
   */
  [SameObject] readonly attribute VRDisplayCapabilities capabilities;


  /**
   * If this VRDisplay supports room-scale experiences, the optional
   * stage attribute contains details on the room-scale parameters.
   * The stageParameters attribute can not change between null
   * and non-null once the VRDisplay is enumerated; however,
   * the values within VRStageParameters may change after
   * any call to VRDisplay.submitFrame as the user may re-configure
   * their environment at any time.
   */
  readonly attribute VRStageParameters? stageParameters;


  /**
   * Return the current VREyeParameters for the given eye.
   */
  VREyeParameters getEyeParameters(VREye whichEye);


  /**
   * An identifier for this distinct VRDisplay. Used as an
   * association point in the Gamepad API.
   */
  readonly attribute unsigned long displayId;


  /**
   * A display name, a user-readable name identifying it.
   */
  readonly attribute DOMString displayName;


  /**
   * Populates the passed VRFrameData with the information required to render
   * the current frame.
   */
  boolean getFrameData(VRFrameData frameData);


  /**
   * Return a VRPose containing the future predicted pose of the VRDisplay
   * when the current frame will be presented. The value returned will not
   * change until JavaScript has returned control to the browser.
   *
   * The VRPose will contain the position, orientation, velocity,
   * and acceleration of each of these properties.
   */
  [NewObject] VRPose getPose();


  /**
   * Reset the pose for this display, treating its current position and
   * orientation as the "origin/zero" values. VRPose.position,
   * VRPose.orientation, and VRStageParameters.sittingToStandingTransform may be
   * updated when calling resetPose(). This should be called in only
   * sitting-space experiences.
   */
  void resetPose();


  /**
   * z-depth defining the near plane of the eye view frustum
   * enables mapping of values in the render target depth
   * attachment to scene coordinates. Initially set to 0.01.
   */
  attribute double depthNear;


  /**
   * z-depth defining the far plane of the eye view frustum
   * enables mapping of values in the render target depth
   * attachment to scene coordinates. Initially set to 10000.0.
   */
  attribute double depthFar;


  /**
   * The callback passed to `requestAnimationFrame` will be called
   * any time a new frame should be rendered. When the VRDisplay is
   * presenting the callback will be called at the native refresh
   * rate of the HMD. When not presenting this function acts
   * identically to how window.requestAnimationFrame acts. Content should
   * make no assumptions of frame rate or vsync behavior as the HMD runs
   * asynchronously from other displays and at differing refresh rates.
   */
  long requestAnimationFrame(FrameRequestCallback callback);


  /**
   * Passing the value returned by `requestAnimationFrame` to
   * `cancelAnimationFrame` will unregister the callback.
   */
  void cancelAnimationFrame(long handle);


  /**
   * Begin presenting to the VRDisplay. Must be called in response to a user gesture.
   * Repeat calls while already presenting will update the VRLayers being displayed.
   * If the number of values in the leftBounds/rightBounds arrays is not 0 or 4 for any of the passed layers the promise is rejected
   * If the source of any of the layers is not present (null), the promise is rejected.
   */
  Promise<void> requestPresent(sequence<VRLayerInit> layers);


  /**
   * Stops presenting to the VRDisplay.
   */
  Promise<void> exitPresent();


  /**
   * Get the layers currently being presented.
   */
  sequence<VRLayer> getLayers();


  /**
   * The VRLayer provided to the VRDisplay will be captured and presented
   * in the HMD. Calling this function has the same effect on the source
   * canvas as any other operation that uses its source image, and canvases
   * created without preserveDrawingBuffer set to true will be cleared.
   */
  void submitFrame();
};


typedef (HTMLCanvasElement or
         OffscreenCanvas) VRSource;


[Constructor(optional VRLayerInit layer)]
interface VRLayer {
  readonly attribute VRSource? source;


  readonly attribute sequence<float> leftBounds;
  readonly attribute sequence<float> rightBounds;
};


dictionary VRLayerInit {
  VRSource? source = null;


  sequence<float> leftBounds = [ ];
  sequence<float> rightBounds = [ ];
};


interface VRDisplayCapabilities {
  readonly attribute boolean hasPosition;
  readonly attribute boolean hasOrientation;
  readonly attribute boolean hasExternalDisplay;
  readonly attribute boolean canPresent;
  readonly attribute unsigned long maxLayers;
};


enum VREye {
  "left",
  "right"
};


interface VRFieldOfView {
  readonly attribute double upDegrees;
  readonly attribute double rightDegrees;
  readonly attribute double downDegrees;
  readonly attribute double leftDegrees;
};


interface VRPose {
  readonly attribute Float32Array? position;
  readonly attribute Float32Array? linearVelocity;
  readonly attribute Float32Array? linearAcceleration;


  readonly attribute Float32Array? orientation;
  readonly attribute Float32Array? angularVelocity;
  readonly attribute Float32Array? angularAcceleration;
};


[Constructor]
interface VRFrameData {
  readonly attribute DOMHighResTimeStamp timestamp;


  readonly attribute Float32Array leftProjectionMatrix;
  readonly attribute Float32Array leftViewMatrix;


  readonly attribute Float32Array rightProjectionMatrix;
  readonly attribute Float32Array rightViewMatrix;


  readonly attribute VRPose pose;
};


interface VREyeParameters {
  readonly attribute Float32Array offset;


  [SameObject] readonly attribute VRFieldOfView fieldOfView;


  readonly attribute unsigned long renderWidth;
  readonly attribute unsigned long renderHeight;
};


interface VRStageParameters {
  readonly attribute Float32Array sittingToStandingTransform;


  readonly attribute float sizeX;
  readonly attribute float sizeZ;
};


partial interface Navigator {
  Promise<sequence<VRDisplay>> getVRDisplays();
  readonly attribute FrozenArray<VRDisplay> activeVRDisplays;
  readonly attribute boolean vrEnabled;
};


enum VRDisplayEventReason {
  "mounted",
  "navigation",
  "requested",
  "unmounted"
};


[Constructor(DOMString type, VRDisplayEventInit eventInitDict)]
interface VRDisplayEvent : Event {
  readonly attribute VRDisplay display;
  readonly attribute VRDisplayEventReason? reason;
};


dictionary VRDisplayEventInit : EventInit {
  required VRDisplay display;
  VRDisplayEventReason reason;
};


partial interface Window {
  attribute EventHandler onvrdisplayconnect;
  attribute EventHandler onvrdisplaydisconnect;
  attribute EventHandler onvrdisplayactivate;
  attribute EventHandler onvrdisplaydeactivate;
  attribute EventHandler onvrdisplayblur;
  attribute EventHandler onvrdisplayfocus;
  attribute EventHandler onvrdisplaypresentchange;
};


partial interface HTMLIFrameElement {
  attribute boolean allowvr;
};


partial interface Gamepad {
  readonly attribute unsigned long displayId;
};
```

## General Discussion

Thanks to @toji and the editors for adding a thorough [explainer doc](https://github.com/w3c/webvr/blob/master/explainer.md). Seeing explicit goals and non-goals is great. It's also great to see so much demo & sample code at https://webvr.info/samples/

There are a few concerns that come up when reading the spec:

 - As a meta-point about the overall design, the current model of `submitFrame()` and the `VRDisplay::requestAnimationFrame()` is very clunky and it's unclear how input processing that needs to route through the main thread will be compatible with higher refresh rates. We recently reviewed the Offscreen Canvas proposal and noted that it's got major issues in terms of getting a rAF pumped to it. Coordinating input, audio, video, and other main-thread/DOM types is a challenge and it seems as though this sort of synchronization is key to delivering a good experience in VR. We'd like to see a coherent end-to-end story about working at higher-than-default-display refresh rates and how a separate context (iframe, worker, etc.) can be used to effectively drive a VR experience without exposure to the slower refresh of the main thread (and potential main-document content jankiness).

 - The `has*` properties of `VRDisplayCapabilities` smells wrong. In general, we've seen a lot of systems attempt to provide "compatibility" flags (e.g. [`CSS.supports()`](http://caniuse.com/#feat=css-supports-api) and similar past APIs for SVG features) and developers eventually come to rely on feature detection based on calling APIs (or using them) to get a less buggy read on the feature support situation. We'd like to see the API designed to accommodate this instead.

 - `VRLayer` needs a constructor and probably a supertype if you're going to be adding more layer types in the future.

 - Should the upcoming [Permission Delegation API](https://noncombatant.github.io/permission-delegation-api/) or an attribute for [`<iframe sandbox="...">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) be used instead of a new `allowvr` attribute?

 - `submitFrame()` doesn’t seem to be needed in an initial API, instead can the implicit capturing of the canvas can be used? It seems odd to have two separate modes of capture (implicit and explicit) living on the same object with the difference between them being only which display is rendered with which content. If `submitFrame()` is added for VR displays, should it not also be added for main display drawing?

 - `VRDisplay` seems to be part of a stunted hierarchy. Is there a common supertype that also explains the main document's implicit Display and a type that represents it?

 - `requestPresent()` API only takes a single VRLayer at the moment. What happens when a web developer wants to switch a layer or add a layer (assuming that multiple layer types are going to be added in the future)?

 - Moving the global event handlers and methods under `navigator.vr` is great in https://github.com/w3c/webvr/pull/116

 - `getFrameData()` populating an in-param is very strange. One supposes this is the ["bring your own buffer" analogue from the Streams API](https://streams.spec.whatwg.org/#byob-readers), but it's odd that this is not similarly low-level. If this is about binary packed data, why not take a buffer? And if it's not about packed binary data, what possible reason is there to design around the JS object model (instead of, e.g., improving GC heuristics about specific object types as we have seen, e.g., for short-lived "enum" style objects and Promises).

 - Can `resetPose()` fail? If so, should it return a promise or potentially throw an exception?

 - Can `stageParameters` change? If so, how will the developer be informed? At first glance there doesn't seem to be an event for this.

 - GamepadPose and VRPose have a lot of the same attributes, should they inherit from a superclass?

 - `VREyeParameters.renderWidth` - what does the `render` indicate? Could it just be `width`?
