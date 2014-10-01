# Web Audio Draft Feedback

[Draft under discussion.](https://dvcs.w3.org/hg/audio/raw-file/28a38310adae/webaudio/specification.html)

We extracted the IDL and example code from the draft in question using a snippet run at the developer tool command line:

```js
Array.prototype.slice.call(
  document.querySelectorAll(".idl,.es-code")
).map(function(n) { return n.innerText; }).join("\n\n\n");
```

This is visible in [`webaudio.idl`](webaudio.idl) and [`webaudio_examples.js`](webaudio_examples.js) in the current directory.

## General Discussion

The Web Audio API presents an architecture for low-latency audio processing and playback. It does this by creating _sources_ and _destinations_. Processing nodes may be placed between these sources and destinations to modify the audio. Many of the most commonly used types of processing elements in audio engineering are required by the spec. This rich library of audio processing primitives combined with an architecture that ensures they can be run off of the main thread ensures the architecture presented by the API can map efficiently to many forms of hardware and, in general, that it will pose few hazards to portions of the web platform which are in contention for main-thread (JS, rendering) resources.

In addition to the library of "canned" node types, Web Audio specifies a `ScriptProcessorNode` type that enables processing of samples in script.

We note that the detailed attention given to low-latency processing and performance in a contended environment is emblematic of skilled design sense. We hold great hope that this API will bring the best of what modern audio hardware has to offer to the web platform and, if we may editorialize a bit, could not be more elated to see it progress. The following feedback is not meant to detract from the positive accomplishments that this design has achieved. They are offered in a spirit of collaboration and from a perspective of experience with the particulars web platform APIs.

## API Hygiene

### ISSUE: Duplicate Normative API

*RESOLVED* by [changes that moved the duplicate names](https://dvcs.w3.org/hg/audio/rev/51bdf2d4e69c) to an [_informative_ section of the spec](https://dvcs.w3.org/hg/audio/raw-file/28a38310adae/webaudio/specification.html#OldNames)!

Only listed here for completeness as it was  raised in our [F2F meeting](http://www.w3.org/2001/tag/2013/05/30-minutes#item05) with Olivier Thereaux. Massive thanks to the authors and editors for re-considering their previous stance and bravely taking the opportunity attempt to sunset cruft. Nobody knows if it'll work in practice, but we want to be on record as vocally supporting your efforts here, and should it not work, in taking the appropriate share of the blame.

### ISSUE: Constructibility & De-sugaring of static methods

The current API defines 26 interfaces:

```
$ cat webaudio.idl | grep -i interface | cut -d " " -f 2
AudioContext
OfflineAudioContext
OfflineAudioCompletionEvent
AudioNode
AudioDestinationNode
AudioParam
GainNode
DelayNode
AudioBuffer
AudioBufferSourceNode
MediaElementAudioSourceNode
ScriptProcessorNode
AudioProcessingEvent
PannerNode
AudioListener
ConvolverNode
AnalyserNode
ChannelSplitterNode
ChannelMergerNode
DynamicsCompressorNode
BiquadFilterNode
WaveShaperNode
OscillatorNode
PeriodicWave
MediaStreamAudioSourceNode
MediaStreamAudioDestinationNode
```

Of these, only two are marked constructible:

```
$ cat webaudio.idl | grep -A 1 -i constructor | grep interface | cut -d " " -f 2
AudioContext
OfflineAudioContext
```

Most of the types represented by the non-constructable interfaces _are_ visible in the API through normal use. For instance, to get a `PannerNode` instance a developer currently uses:

```
var panner = context.createPanner();
```

Where `context` is an instance of `AudioContext`  (or one of its subclasses). Prickly questions arise from this arrangement:

 1. Assuming that the static methods on the `context` are desirable shortcuts for wiring up the context of a `Node` instance to the `context` against which it runs, _how_ does that context get set in a way that would allow pure JS objects to describe it?
 2. By what privileged mechanism does the system create instances of these types if they do not have constructors?
 3. Are these types in any way subclassable? If not, why not?
 4. If the intent is to mirror other DOM APIs, it's curious to have `create*()` methods but no factory (e.g.: `createElement("tagname")`)

Adding constructors and context-setting methods (or constructor params) for most of the interfaces that lack them would answer #'s 1 and 2 and largely obviate 4. E.g.:

```js
// A possible de-sugaring for createPanner() when ctors are defined:
AudioContext.prototype.createPanner = function() {
	var p = new PannerNode();
	p.context = this;
	return p;	
};

// An alternative that provides the context via the PannerNode ctor:
AudioContext.prototype.createPanner = function() {
	return new PannerNode({ context: this });
};

// An alternative that uses a positional context param:
AudioContext.prototype.createPanner = function(attributes) {
  return new PannerNode(this, attributes);
};
```

Either constructor style allows these `AudioNode` types to conceptually be modeled more cleanly as JS objects which could self-host.

Of course, this requires answering the follow-on questions "what happens if the context is invalid, changes, or is never set?", but those are reasonable to ask and their answers don't need to be complicated (certainly not for v1).

An alternative design might locate the constructors on the context directly, but this seems to create as many problems as it solves.

Using the constructor style from the last variant, we can re-work one of the examples from Section 7:

```js
...
var context = new AudioContext();
...

function playSound() {
    var oneShotSound = context.createBufferSource();
    oneShotSound.buffer = dogBarkingBuffer;

    // Create a filter, panner, and gain node. 
    
    var lowpass = context.createBiquadFilter();

    var panner = context.createPanner();
    panner.panningModel = "equalpower";
    panner.distanceModel = "linear";

    var gainNode2 = context.createGain();
    

    // Make connections 
    oneShotSound.connect(lowpass);
    lowpass.connect(panner);
    panner.connect(gainNode2);
    gainNode2.connect(compressor);

    oneShotSound.start(context.currentTime + 0.75);
}
```

to:

```js
...
var context = new AudioContext();
...

function playSound() {
    var oneShotSound = new BufferSource(context, { buffer: dogBarkingBuffer });

    // Create a filter, panner, and gain node. 
    var lowpass = new BiquadFilterNode(context);
    var panner = new PannerNode(context, { 
      panningModel: "equalpower",
      distanceModel: "linear"
    });
    var gainNode2 = new GainNode(context);

    // Make connections 
    oneShotSound.connect(lowpass);
    lowpass.connect(panner);
    panner.connect(gainNode2);
    gainNode2.connect(compressor);

    oneShotSound.start(context.currentTime + 0.75);
}
```

### ISSUE: Subclassing

Related to a lack of constructors, but worth calling out independently, it's not currently possible to meaningfully compose node types, either through mixins or through subclassing. In JS, this sort of "is a" relationship is usually set up through the subclassing pattern:

```js
var SubNodeType = function() {
  SuperNodeType.call(this);
};
SubNodeType.prototype = Object.create(SuperNodeType.prototype);
SubNodeType.prototype.constructor = SubNodeType;
// ...
```

There doesn't seem to be any way in the current design to enable this sort of composition. This is deeply unfortunate.

### ISSUE: Callbacks without Promises

A few of the APIs specified use a callback system which can be made Promise-compatible in a straightforward way. For instance, the current definition of `AudioContext::decodeAudioData` is given by:

```
void decodeAudioData(ArrayBuffer audioData,
                     DecodeSuccessCallback successCallback,
                     optional DecodeErrorCallback errorCallback);

```

This can be extended to be Promise-compatible by simply changing the return type:

```
Promise decodeAudioData(ArrayBuffer audioData,
                        optional DecodeSuccessCallback successCallback,
                        optional DecodeErrorCallback errorCallback);

```

This will allow users of these APIs to rely on the same uniform promise interface across this API and many others without changes to the callback style you currently employ. As an implementation detail, the existing success and error callbacks can be recast as though an internal method generated a promise and adds them to the list of listeners:

```
AudioContext.prototype.decodeAudioData = function(data, success, error) {
	var p = __internalDecode(data);
	if (success) {
		p.then(success, error);	
	}	
	return p;
};
```

Note the `successCallback` parameter is now optional.

What's the effect of this? Code can now be written like:

```js
// Wait for 3 samples to decode and then play them simultaneously:
Promise.every(
  ctx.decodeAudioData(buffer1),
  ctx.decodeAudioData(buffer2),
  ctx.decodeAudioData(buffer3)
).then(function(samples) {
  samples.forEach(function(buffer) {
    (new BufferSource(ctx, { buffer: buffer })).start();
  });  
});
```

`OfflineAudioContext` can be similarly improved by vending a `Promise` from `startRendering()` which resolves when `oncomplete`:

```js
offlineContext.startRendering().then(function(renderedBuffer) {
  // ...
});
```

This is both terser and more composable than the current system.

### ISSUE: `ScriptProcessorNode` is Unfit For Purpose (Section 15)

We harbor deep concerns about `ScriptProcessorNode` as currently defined. Notably:

 * As currently defined, these nodes _must_ run on the UI thread -- giving rise, it seems, to many of the admonitions not to use them in Section 15.3.*. This is deeply at odds with the rest of the architecture which seeks to keep processing _off_ of the main thread to ensure low-latency.
 * Since these functions run on the main thread, it's impossible to set execution constraints that might help reduce jitter; e.g., a different GC strategy or tight constraints on execution time slicing.

This can be repaired. Here's a stab at it:

```
[Constructor(DOMString scriptURL, optional unsigned long bufferSize)]
interface AudioWorker : Worker {

};

interface AudioProcessingEvent : Event {

    readonly attribute double playbackTime;

    transferrable attribute AudioBuffer buffer;

};

interface AudioWorkerGlobalScope : DedicatedWorkerGlobalScope {

  attribute EventHandler onaudioprocess;

};

interface ScriptProcessorNode : AudioNode {

  attribute EventHandler onaudioprocess;

  readonly attribute long bufferSize;

};

partial interface AudioContext {

  ScriptProcessorNode createScriptProcessor(
  	DOMString scriptURL,
    optional unsigned long bufferSize = 0,
    optional unsigned long numberOfInputChannels = 2,
    optional unsigned long numberOfOutputChannels = 2);

}
```

The idea here is that to ensure low-latency processing, no copying of resulting buffers is done (using the Worker's [Transferrable](https://plus.sandbox.google.com/114636678211810483111/posts/isYunS2B6os) mechanism).

Scripts are loaded from external URLs and can control their inbound/outbound buffering with a constructor arguments.

Under this arrangement it's possible for the system to start to change the constraints that these scripts run under. GC can be turned off, runtime can be tightly controlled, and these scripts can even be run on the (higher priority) audio-processing thread.

All of this is necessary to ensure that scripts are not second-class citizens in the architecture; attractive nuisances which can't actually be used in the real world due to their predictable down-sides.

### ISSUE: Explaining ("De-sugaring") the `*Node` Types

On the back of a repaired `ScriptProcessorNode` definition, the spec should contain tight descriptions of the built-in library of the `AudioNode` subclasses; preferably in the form of script which could be executed in a `ScriptProcessorNode`.

*Obviously* we do not recommend that implementations lean on this sort of self-hosting for production systems. It is, however, clear that without such a detailed description of the expected algorithms, compatibility between implementations cannot be guaranteed, nor can conformance with the spec be meaningfully measured. This de-sugaring-as-spec-exercise would be helpful for the testing of the system and for users who will at a later time want to know _exactly_ what the system is expected to be doing for them.

We imagine an appendix of the current spec that includes such de-sugarings and test suites built on them.

### ISSUE: Visible [Data Races](http://blog.regehr.org/archives/490)

This topic has been debated on the [`public-audio` mailing list](http://lists.w3.org/Archives/Public/public-audio/2013JulSep/0162.html) and in [blogs](http://robert.ocallahan.org/2013/07/avoiding-copies-in-web-apis.html).

It's reasonable to suggest that de-sugaring into a style that transfers ownership of buffers to nodes during processing is sufficient to close much of the problem down, but whatever the solution, we wish to be on the record as saying clearly that it is impermissible for Web Audio to unilaterally add visible data races to the JavaScript execution model.

The Web Audio group is best suited to solve this issue, but we insist that no API be allowed to create visible data races from the perspective of linearly-executing JavaScript code.

### ISSUE: Lack of Serialization Primitives & Introspection

The IDL for the Web Audio node graph from any `AudioContext` doesn't define a serialization and there's no other way of easily cloning/walking an `AudioNode` graph. This lack of reflective API makes it deeply unlikely that systems can easily share graphs. This seems like a real drag on developer productivity. It also makes it difficult to clone some graph of processing from an `OfflineAudioContext` to a real-time context or vice-versa.

A `toString()` or `toJSON()` method on `AudioContext` combined with a reflection API over the node graph would solve the issue.

## Layering Considerations

Web Audio is very low-level and this is a virtue. By describing a graph that operates in terms of samples of bytes, it enables developers to tightly control the behavior of processing and ensure low-latency delivery of results.

Today's Web Audio spec is an island: connected to its surroundings via loose ties, not integrated into the fabric of the platform as the natural basis and explanation of all audio processing -- despite being incredibly fit for that purpose.

Perhaps the most striking example of this comes from the presence in the platform of both Web Audio and the `<audio>` element. Given that the `<audio>` element is incredibly high-level, providing automation for loading, decoding, playback and UI to control these processes, it would appear that Web Audio lives at an all-together lower place in the conceptual stack. A natural consequence of this might be to re-interpret the `<audio>` element's playback functions _in terms of_ Web Audio. Similar descriptions can happen of the UI _in terms of_ Shadow DOM and the loading of audio data via XHR or the upcoming `fetch()` API. It's not necessary to re-interpret everything all at once, however.

Web Audio acknowledges that the `<audio>` element performs valuable audio loading work today by allowing the creation of `SourceNode` instances from them:

```js
/***********************************
  * 4.11 The MediaElementAudioSourceNode Interface
  **/ 
var mediaElement = document.getElementById('mediaElementID');
var sourceNode = context.createMediaElementSource(mediaElement);
sourceNode.connect(filterNode);
````

Lots of questions arise, particularly if we think of media element audio playback _as though_ it's low-level aspects were described in terms of Web Audio:

 * Can a media element be connected to multiple `AudioContext`s at the same time?
 * Does `ctx.createMediaElementSource(n)` disconnect the output from the default context?
 * If a second context calls `ctx2.createMediaElementSource(n)` on the same media element, is it disconnected from the first?
 * Assuming it's possible to connect a media element to two contexts, effectively "wiring up" the output from one bit of processing to the other, is it possible to wire up the output of one context to another?
 * Why are there both `MedaiaStreamAudioSourceNode` and `MediaElementAudioSourceNode` in the spec? What makes them different, particularly given that neither appear to have properties or methods and do nothing but inherit from `AudioNode`?

All of this seems to indicate some confusion in, at a minimum, the types used in the design. For instance, we could answer a few of the questions if we:

 * Eliminate `MediaElementAudioSourceNode` and instead re-cast media elements as possessing `MediaStream audioStream` attributes which can be connected to `AudioContext`s
 * Remove `createMediaElementSource()` in favor of `createMediaStreamSource()`
 * Add constructors for all of these generated types; this would force explanation of how things are connected.

That leaves a few open issues for which we don't currently have suggestions but believe the WG should address:

 * What `AudioContext` do media elements use by default?
 * Is that context available to script? Is there such a thing as a "default context"? 
 * What does it mean to have multiple `AudioContext` instances for the same hardware device? Chris Wilson advises that they are simply sum'd, but how is _that_ described?
 * By what mechanism is an `AudioContext` attached to hardware? If I have multiple contexts corresponding to independent bits of hardware...how does that even happen? `AudioContext` doesn't seem to support any parameters and there aren't any statics defined for "default" audio contexts corresponding to attached hardware (or methods for getting them).

## Other Considerations

Several questions arise in reading the examples:

 * Why doesn't `AudioNode::connect()` return the passed `AudioNode destination`? It would enable a much terser chained style in some cases. Janessa Det provides the example of:

  ```js
  oneShotSound.connect(lowpass);
  lowpass.connect(panner);
  panner.connect(gainNode2);
  gainNode2.connect(compressor);
  compressor.connect(destination);
  ```

  becoming:

  ```js
  oneShotSound
      .connect(lowpass)
      .connect(panner)
      .connect(gainNode2)
      .connect(compressor)
      .connect(destination);
  ```

 * Where does `param` come from in example 4.5.4? It's not marked constructable as per 4.5 and there doesn't appear to be a `create()` method for it documented anywhere. It's a ghost ;-)
 * What language are the examples in Section 11 written in? Can it be executed?
 * `OfflineAudioContext` is terribly named. In a browser, "offline" means something very different. `BulkProcessingContext` might be better.

## End Notes

Lest the above be taken in a harsh light, we want to once again congratulate the Web Audio WG on delivering a high-quality design for a fundamental new capability that has been missing from the web. Nothing above is meant to subtract from that achievement; only to help cement the gains that Web Audio represents for the long-haul.
