# CSS Font-Display Draft Feedback


[Draft under discussion.](http://tabatkins.github.io/specs/css-font-display/) ([At this revision](https://github.com/tabatkins/specs/tree/93e6da3ebe7c6a8ac37cf2c54f3c638fa799e22d/css-font-display))

There is no IDL or example code to extract from the document.

## General Discussion

While this draft is early, it looks positive and we generally support the capability.

### ISSUE: Normative Introduction Text

The spec doesn't list the introduction section as being non-normative. This is a small oversight, but should be repaired.

### ISSUE: No Explainer, Not Leading With Examples

This spec doesn't have an associated explainer doc, nor are there substantive examples. We'd like to see both, although the examples could form the backbone of the explainer and don't necessarily need to be non-normative spec text.

### ISSUE: Script Access?

It isn't clear how to get the current value of the system. One assumes it's reflected in the CSS OM, but it might be instructive to have an exmaple of determining the loading state for a font that applies to a specific element in a document at a point in time. This would also highlight the next issue.

### ISSUE: Events?

If one is able to determine the current state, is it also possible to be informed if a swap happens? Are there use-cases for an event that gets sent when a font is loaded, swapped, or abandoned?

## Layering Considerations

How does this API interact with the CSS Font Loading API? It's difficult to tell if the behaviors specified by this value pair match the Loader API semantics and/or can be expressed as desugaring to that system.

If desguaring is conceptually possible, it'd be nice to see that outlied. If it's not, it'd be nice to understand why. A section that outlines the relationship to Font Loading (as non-normative text in the spec or as a section in an explaier) might be helpful.

## End Notes

This API looks like a promising, useful, and support it moving forward as a valuable contribution to improving web performance.