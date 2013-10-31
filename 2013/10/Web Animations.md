# Web Animations 1.0 Draft Feedback

[Draft under discussion](http://dev.w3.org/fxtf/web-animations/)

## API Field of Application

REQUEST: Backwards Compatibility
Specification says that CSS3 Transitions, CSS3 Animations and SVG animations "can be defined in terms of this model without any observable change", but does not provide any further information. Having an algorithm for describing those animations in terms of Web Animations would be very helpful.

ISSUE: Web Animations and requestAnimationFrame
Specification doesn't mention requestAnimationFrame API at all, so it's totally unclear how Web Animations sampling algorithm relates to requestAnimationFrame one and how to use both of them in one webapp.

ISSUE: Constructability, cloneability, serializability
Some basic objects (notably Player and TimedItem) are marked as non-constructable with no visible reasons.
Some objects (notably Animation) have "clone" method while others have not; reasons remain unclear.
There are no serialize/unserialize methods at all, though they seem useful in some cases.

## API Levels of Abstraction

Relations between Player, TimedItem and Timing interfaces present very uncommon patterns: copying writable attributes from Timing to associated TimedItem as read-only attributes, setter on Player.source which calls methods, etc.

It seems like a design problem. Representing "computed" timing should be separated from grouping functionality and delegated to some kind of dependent entity (like getComputedStyle in CSS is separated from .style property). It would also solve an issue with string/integer representation of duration.

## API Objects' Responsibilities

ISSUE: Redundant Generalization
Animation constructor gets AnimationEffect or CustomEffect or OneOrMoreKeyframes as a second parameter and provides 'effect' field of type AnimationEffect or CustomEffect or KeyframeAnimationEffect. It is unclear why not split this interface into three different interfaces (for example, Animation, CustomAnimation and KeyframeAnimation) as they have just a 'clone' method and 'specified' attribute in common.
Also note errors in WebIDL for that interface: 'specified' property is missed; KeyframeAnimationEffect type for 'effect' property isn't mentioned.

ISSUE: Unreachable animations
'getCurrentAnimations' method doesn't return animations for PseudoElementReferences and active animations with backwards-working fill mode. There is no method to obtain those kind of animations and the reasoning after this behavior is doubtful.

## API Objects' Interfaces

ISSUE: Inconsistent naming
TimedItem and TimedGroup provide some methods similar to DOM Element ones, but names aren't fully match:
  * parent vs parentNode
  * children vs childNodes
  * before, after vs insertBefore, appendChild
  * replace vs replaceChild
  * remove bs removeChild

ISSUE: Bad naming
  * 'specified' and 'source' attribute names tell absolutely nothing of their contents; why not just 'timedItem' and 'timing'?
  * 'play' method of Timeline interface is in fact factory method for Player objects, so it should be named like 'createPlayer'
  * letter-saving in ParGroup and SeqGroup - why not ParallelGroup and SequenceGroup?
