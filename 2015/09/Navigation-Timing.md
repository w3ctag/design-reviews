# [DRAFT] Navigation Timing 2 Feedback


[Draft under discussion.](https://w3c.github.io/navigation-timing/) ([At this revision](https://github.com/w3c/navigation-timing/tree/0e76372c20e97131133c78bd885d031778755e8b))

We extracted IDL and example code from the draft in question using a snippet run at the developer tool command line:

```js
Array.prototype.slice.call(
  document.querySelectorAll(".idl,.es-code")
).map(function(n) { return n.innerText; }).join("\n\n\n");
```

The IDL is as follows:

```
interface PerformanceNavigationTiming : PerformanceEntry {
    readonly    attribute DOMHighResTimeStamp unloadEventStart;
    readonly    attribute DOMHighResTimeStamp unloadEventEnd;
    readonly    attribute DOMHighResTimeStamp workerStart;
    readonly    attribute DOMHighResTimeStamp redirectStart;
    readonly    attribute DOMHighResTimeStamp redirectEnd;
    readonly    attribute DOMHighResTimeStamp fetchStart;
    readonly    attribute DOMHighResTimeStamp domainLookupStart;
    readonly    attribute DOMHighResTimeStamp domainLookupEnd;
    readonly    attribute DOMHighResTimeStamp connectStart;
    readonly    attribute DOMHighResTimeStamp connectEnd;
    readonly    attribute DOMHighResTimeStamp secureConnectionStart;
    readonly    attribute DOMHighResTimeStamp requestStart;
    readonly    attribute DOMHighResTimeStamp responseStart;
    readonly    attribute DOMHighResTimeStamp responseEnd;
    readonly    attribute DOMHighResTimeStamp domLoading;
    readonly    attribute DOMHighResTimeStamp domInteractive;
    readonly    attribute DOMHighResTimeStamp domContentLoadedEventStart;
    readonly    attribute DOMHighResTimeStamp domContentLoadedEventEnd;
    readonly    attribute DOMHighResTimeStamp domComplete;
    readonly    attribute DOMHighResTimeStamp loadEventStart;
    readonly    attribute DOMHighResTimeStamp loadEventEnd;
    readonly    attribute DOMHighResTimeStamp prerenderSwitch;
    readonly    attribute NavigationType      type;
    readonly    attribute DOMString           nextHopProtocol;
    readonly    attribute unsigned short      redirectCount;
    readonly    attribute unsigned short      transferSize;
    readonly    attribute unsigned short      encodedBodySize;
    readonly    attribute unsigned short      decodedBodySize;
    serializer = {inherit, attribute};
};


enum NavigationType {
    "navigate",
    "reload",
    "back_forward",
    "prerender"
};


[Exposed=Window]
interface PerformanceTiming {
    readonly    attribute unsigned long long navigationStart;
    readonly    attribute unsigned long long unloadEventStart;
    readonly    attribute unsigned long long unloadEventEnd;
    readonly    attribute unsigned long long redirectStart;
    readonly    attribute unsigned long long redirectEnd;
    readonly    attribute unsigned long long fetchStart;
    readonly    attribute unsigned long long domainLookupStart;
    readonly    attribute unsigned long long domainLookupEnd;
    readonly    attribute unsigned long long connectStart;
    readonly    attribute unsigned long long connectEnd;
    readonly    attribute unsigned long long secureConnectionStart;
    readonly    attribute unsigned long long requestStart;
    readonly    attribute unsigned long long responseStart;
    readonly    attribute unsigned long long responseEnd;
    readonly    attribute unsigned long long domLoading;
    readonly    attribute unsigned long long domInteractive;
    readonly    attribute unsigned long long domContentLoadedEventStart;
    readonly    attribute unsigned long long domContentLoadedEventEnd;
    readonly    attribute unsigned long long domComplete;
    readonly    attribute unsigned long long loadEventStart;
    readonly    attribute unsigned long long loadEventEnd;
    serializer = {attribute};
};


[Exposed=Window]
interface PerformanceNavigation {
    const unsigned short TYPE_NAVIGATE = 0;
    const unsigned short TYPE_RELOAD = 1;
    const unsigned short TYPE_BACK_FORWARD = 2;
    const unsigned short TYPE_RESERVED = 255;
    readonly    attribute unsigned short type;
    readonly    attribute unsigned short redirectCount;
    serializer = {attribute};
};


[Exposed=Window]
partial interface Performance {
    [SameObject]
    readonly    attribute PerformanceTiming     timing;
    [SameObject]
    readonly    attribute PerformanceNavigation navigation;
};
```

## General Discussion

This API, along with the related [Resource Timing API](https://w3c.github.io/resource-timing/), is relatively stable with [many shipping implementations](http://caniuse.com/#feat=nav-timing) of Navigation Timing v1. We recognize that the scope for changes and review is somewhat limited. As a result this document focuses on API style and potential options for compatibly evolving the system.

The TAG notes that we're grateful that Navigation Timing, Resource Timing, and related specs are providing low-level information to developers about how their systems perform in the wild. This data has, until the advent of these APIs, been difficult or impossible to gather. Further, the addition of `window.performance.now()` has been a boon to framework authors in general. Kudos to the Web Performance Working Group on their success.

It seems strange that Navigation Timing and Resource Timing continue to be evolved separately, though. Is there consensus that this split is valuable?

### ISSUE: `PerformanceNavigation` Integer Enum

The `PerformanceNavigation` interface uses integer-style enumeration values which, while usable, aren't particularly idiomatic to JavaScript usage. This is a holdover from Navigation Timing 1, so we understand that a change might not be feasible and that a better API might require duplication.

### ISSUE: Navigations In The Log: In Spec But Not Impls?

Readers of the spec who have browsers that support Navigation Timing might find it odd that `performance.getEntriesByType("navigation")` doesn't appear to work in Firefox and Chrome. Alternatively, Safari doesn't appear to support `getEntries` but _does_ support `window.performance.timing` for access to overall document metrics. This isn't a spec issue per sae, but it may indicate a need for the WG to host discussions among implementers about their future plans regarding conformance.

### ISSUE: Difficulty In Attribution

This is more of a [Resource Timing](https://w3c.github.io/resource-timing/) issue than anything to do with Navigation Timing, but as they are frequently used together, it seems apropos to mention that it seems difficult to attribute log entries to DOM elements. For example, to understand what's in the critical path in loading an image, it's necessary to query the timeline for resources, filter by type, and attempt to match up known URLs. This makes it difficult to attribute, e.g., background image loads from CSS or reflect font loading to specific DOM elements which trigger recalc that cause loads.

This might warrant a higher-level API (a theoretical `window.performance.getEntriesByElement(...)`?) and perhaps it's worth waiting to see if libraries emerge to handle this. We encourage the WG to continue to work to understand the library landscape to see where API extensions might be warranted.

On a more speculative note, has consideration been given to attributing the documented created by Shadow DOM with the performance timline or the Navigation Timing interfaces?

## End Notes

Navigation Timing 2's support for various views of transfer size, pre-rendering naviations, and redirect counts all seems like great improvements. We're excited to see this low-level API continue to move forward and look forward to seeing how it'll be built upon and extended with high-level features in the future.
