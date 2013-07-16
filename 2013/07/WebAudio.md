# Web Audio Draft Feedback

[Draft under discussion.](https://dvcs.w3.org/hg/audio/raw-file/28a38310adae/webaudio/specification.html)

## General Discussion

The Web Audio API presents an architecture for low-latency audio processing and playback. It does this by creating _source_ and _destinations_. Processing nodes may be placed between these sources and destinations to modify the audio. Many of the most commonly used types of processing elements in audio engineering are required by the spec. This rich library of audio processing primitives combined with an architecture that ensures they can be run off of the main thread ensures the architecture presented by the API can map efficiently to many forms of hardware and, in general, that it will pose few hazards to portions of the web platform which are in contention for main-thread (JS, rendering) resources.

In addition to the library of "canned" node types, Web Audio specifies a `ScriptProcessorNode` type that enables processing of samples in script.

We note that the detailed attention given to low-latency processing and performance in a contended environment is emblematic of skilled design sense. We hold great hope that this API will bring the best of what modern audio hardware has to offer to the web platform and, if we may editorialize a bit, could not be more elated to see it progress. The following feedback is not meant to detract from the positive accomplishments that this design has achieved. They are offered in a spirit of collaboration and from a perspective of experience with the particulars web platform APIs.

## API Hygiene

We extracted the IDL and example code from the draft in question using a snippet run at the developer tool command line:

```js
Array.prototype.slice.call(
  document.querySelectorAll(".idl,.es-code")
).map(function(n) { return n.innerText; }).join("\n\n\n");
```

This is visible in [`webaudio.idl`](webaudio.idl) and [`webaudio_examples.js`](webaudio_examples.js) in the current directory.

### ISSUE: Duplicate Normative API

*RESOLVED* by [changes that moved the duplicate names](https://dvcs.w3.org/hg/audio/rev/51bdf2d4e69c) to an [_informative_ section of the spec](https://dvcs.w3.org/hg/audio/raw-file/28a38310adae/webaudio/specification.html#OldNames)!

Only listed here for completeness as it was  raised in our F2F meeting with Olivier Thereaux. Massive thanks to the authors and editors for re-considering their previous stance and bravely taking the opportunity attempt to sunset cruft. Nobody knows if it'll work in practice, but we want to be on record as vocally supporting your efforts here, and should it not work, in taking the appropriate share of the blame.

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

Most of the types represented by these interfaces _are_ visible in the API through normal use. For instance, to get a `PannerNode` instance a developer currently uses:

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
```

Either constructor style allows these `AudioNode` types to conceptually be modeled more cleanly as JS objects which could self-host.

Of course, this requires answering the follow-on questions "what happens if the context is invalid, changes, or is never set?", but those are reasonable to ask and their answers don't need to be complicated (certainly not for v1).

An alternative design might locate the constructors on the context directly, but this seems to create as many problems as it solves.

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

## Layering Considerations

TODO(slightlyoff)

### High/Low-level Connectedness

TODO(slightlyoff)

## Other Architectural Issues

TODO(slightlyoff)
