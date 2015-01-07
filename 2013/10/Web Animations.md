# Web Animations 1.0 Draft Feedback

[Draft under discussion](http://dev.w3.org/fxtf/web-animations/)

## API Field of Application

### REQUEST: Backwards Compatibility
Specification says that CSS3 Transitions, CSS3 Animations and SVG animations "can be defined in terms of this model without any observable change", but does not provide any further information. Having an algorithm for describing those animations in terms of Web Animations would be very helpful.

We understand, that Chrome team implemented those animations with Web Animations without breaking backwards compatibility, but it doesn't automatically implies that other teams will be able to do so, since Chrome model may differ with other browsers models and, in fact, actual specs.

### REQUEST: Computed Values
Though specification describes computing animation values in details, API has no method of accessing computed values, except for calling getComputedStyle or accessing `.value` attributes; there is also no way to get current time fraction unless you use `effectCallback`. It seems wrong since low-level spec should provide such a basic thing.

### ISSUE: Statement needs clarification
<blockquote>Changes to specified style, specified attribute values, and the state of the Web Animations model made within the same execution block must be synchronized when rendering such that the whole set of changes is rendered together.</blockquote>
Exact meaning of that phrase isn't clear. Rendering process isn't exposed in JavaScript, so it seems meaningless to set such a restriction in the spec. Furthermore, current implementations *do* render certain properties (e.g. width, margin) changes immediately after change is made, and some webapps rely on that fact.
Also, term "execution block" needs to be defined (probably, in terms of <a href="http://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts">execution contexts</a>).

### ISSUE: Web Animations and requestAnimationFrame
Specification doesn't mention requestAnimationFrame API at all, so it's totally unclear how Web Animations sampling algorithm relates to requestAnimationFrame one and how to use both of them in one webapp. It seems like, basically, Web Animations sampling does the same as rAF, i.e. executes callback at proper periods of time. Looks like rAF API can be built on top of Web Animations model.

### ISSUE: Constructability, cloneability, serializability
Some basic objects (notably `AnimationPlayer` and `TimedItem`) are marked as non-constructable with no visible reasons.
Some objects (notably `Animation`) have "clone" method while others have not; reasons remain unclear.
There are no serialize/unserialize methods at all, though they seem useful in some cases.

## API Levels of Abstraction

### ISSUE: Wrong leveling
Relations between `AnimationPlayer`, `TimedItem` and `Timing` interfaces present very uncommon patterns: copying writable attributes from `Timing` to associated `TimedItem` as read-only attributes, setter on `AnimationPlayer.source` which calls methods, etc.

It seems like a design problem. Representing "computed" timing should be separated from grouping functionality and delegated to some kind of dependent entity (like `getComputedStyle` in CSS is separated from `.style` property).

## API Objects' Responsibilities

### ISSUE: `play` method
`AnimationTimeline.play` method does two separate things: (a) create `AnimationPlayer` instance, (b) play this instance. Furthermore, the very name `play` is misleading, since `timeline.play` doesn't start playing `timeline` (compare with `element.animate`, which actually animates `element`). Probably, method should be renamed to `startAnimationPlayer`, and `AnimationPlayer` should be made constructable.

## API Objects' Interfaces

### ISSUE: Inconsistent naming
`TimedItem` and `TimedGroup` provide some methods similar to DOM ones, but names don't fully match:
  * DOM ParentNode: firstElementChild, lastElementChild, childElementCount
  * WA AnimationGroup: firstChild, lastChild, no "count" property

### REQUEST: A `finished` promise for `AnimationPlayer`

The `"finish"` event for `AnimationPlayer` is a perfect candidate for our newly-minted [use promises for state transitions](https://github.com/w3ctag/promises-guide#more-general-state-transitions) guidance. The TAG is interested in encouraging the introduction of promises for such cases across a wide variety of specs, as it has many authoring benefits, and as more and more async operations transition to using promises, network effects will multiply their usefulness. But even restricting ourselves to the web animations API alone, it would enable code like:

```js
ap1.play();
ap2.play();
ap3.play();
Promise.all([ap1.finished, ap2.finished]).then(() => {
    setUpUINowThat1And2HaveStoppedMovingAround();
    ap3.finished.then(() => {
        completeAllUISetupNowThatEverythingIsStill();
    });
});
```

This could be made even more convenient if `play` returned that same promise, so that the code could become

```js
ap3.play();
Promise.all([ap1.play(), ap2.play()]).then(() => {
    setUpUINowThat1And2HaveStoppedMovingAround();
    ap3.finished.then(() => {
        completeAllUISetupNowThatEverythingIsStill();
    });
});
```

We realize the proposed name of `finished` clashes with the existing boolean property, and are happy to discuss alternatives. (Our first thought is to coalesce the booleans `paused` and `finished` into a single `state` enumeration.) Additionally, we are of mixed opinions as to whether the `"finish"` event should be kept alongside the promise.

If this sounds intriguing, we will be happy to lend our help on promisifying the API, as we have done in the past [for web audio](https://github.com/WebAudio/web-audio-api/issues/252).
