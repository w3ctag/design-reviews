# Permissions API Draft Feedback

[Draft under discussion.](https://w3c.github.io/permissions/) ([At this revision](https://github.com/w3c/permissions/tree/8aad19292c5218fb0411c090a9dfde022828cf96))

We extracted the IDL and example code from the draft in question using a snippet run at the developer tool command line:

```js
Array.prototype.slice.call(
  document.querySelectorAll(".idl,.es-code")
).map(function(n) { return n.innerText; }).join("\n\n\n");
```

There isn't much of it, so we replicate it here:

```
geolocation
notifications
push-notifications
midi-sysex

required PermissionName name

granted
denied
prompt

readonly attribute Permission permission
readonly attribute PermissionState status
attribute EventHandler onchange

static Promise<PermissionStatus> query((Permission or PermissionName) permission)
```

## General Discussion

The document is currently, at best, confusing. This is to be expected in some measure for a work-in-progress draft.

Mounir Lamouri was kind enough to provide insight in a call with the TAG regarding some of the history and use-cases that the current draft addresses and we agree that there is some value; but that comes with major caveats. Particularly as Mounir pointed out that Chrome is rushing to ship a subset of this API in short order.

In particular, we believe that the Permissions API as critique of the existing ad-hoc, promise-unfriendly, haphazard system is timely, [as demonstrated to the TAG masterfully by Dominique Hazael-Massieux](https://github.com/dontcallmedom/web-permissions-req). We also wish there to be a solution for developers and users which unifies the confusing surface area of the various permission-requesting APIs in today's web platform.

Further, we have reason to believe that the semantic gap identified by Mounir in conversation -- specifically the inability to determine if a request for a permission will cause UI to be shown in certain circumstances thanks to a lack of corresponding API surface area -- is important and a valuable semantic contribution of the current draft.

We are deeply concerned, however, that the draft as currently proposed (which cannot be stressed enough; we hope for improvements and do not seek to stall or delay progress) is a small fraction of what is necessary to meet the (to us) obvious goal of replacing the ad-hoc API surface area with a more-extensible, more comprehensible, more unified approach to permissions on the web.

### ISSUE: Low Sights

It's difficult to come out and say it so bluntly, but we must: this API has less than half of the scope and capability we hoped for in an API named the "Permissions API".


We had expected a unification and normalization framework for permissions on the web platform. Instead, what we see in this draft is an API that has never aimed for this. A glance at the [original proposal](https://lists.w3.org/Archives/Public/public-webapps/2014JulSep/0389.html) and [associated document](https://docs.google.com/document/d/12xnZ_8P6rTpcGxBHiDPPCe7AUyCar-ndg8lh2KwMYkM/preview) show that, while the designers may have hopes of adding features in the future, at no time has a more capable version actually been proposed, however discussions [have flagged the lack of capability as an issue](https://lists.w3.org/Archives/Public/public-webapps/2014JulSep/0399.html), which to date seems unaddressed.

####  Insufficient Reflection

It is frankly surprising that the Permissions API is missing the ability to model all of the permissions states of existing permission-granting APIs in the web platform. These include:

    - [Geolocation](http://dev.w3.org/geo/api/spec-source.html).
    - [Push](https://w3c.github.io/push-api/).
    - [Notifications](https://notifications.spec.whatwg.org/).
    - [Background Notifications](https://gauntface.com/blog/2014/12/15/push-notifications-service-worker).
    - [Storage Quota API](http://www.w3.org/TR/quota-api/).
    - [Fullscreen](http://www.w3.org/TR/fullscreen/).
    - [MIDI devices](http://www.w3.org/TR/webmidi/) and [System Exclusive device support](http://www.w3.org/TR/webmidi/#requesting-access-to-the-midi-system-with-system-exclusive-support).
    - [Camera and Microphone access](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia).
    - [Popup window creation (e.g., `window.open()`)](https://developer.mozilla.org/en-US/docs/Web/API/Window/open).
    - Gamepad access.

Other recently contentious APIs (battery status, CPU core count) might also merit representation via this API to provide a transition path to guarding state/permission requests with Promises should vendors change their minds.

The `PermissionStatus` object is particularly problematic. The spec doesn't provide full IDL or JS to describe the behavior, but the overall design seems to suggest that a fixed list of states is appropriate to cover the permissions needs of the web platform. They are currently outlined as:

```
granted
denied
prompt
```

Taking just the example of the [Geolocation API](http://dev.w3.org/geo/api/spec-source.html) (which is ostensibly reflected by this API), it isn't possible to formulate a request to `Permissions.query()` that will determine if a request for [high-accuracy locations will show a prompt](http://dev.w3.org/geo/api/spec-source.html#high-accuracy). Same for repeated permission updates with [`watchPosition()`](http://dev.w3.org/geo/api/spec-source.html#watch-position).

The stated value of the Permissions API -- to help a developer determine if UI would be shown before a request for a permission is issued -- doesn't appear to be provided here.

Similar problems exist for notifications: there's affordance for `notifications` and `push-notifications` (which we understand to be delivery of Push messages which require attendant Notifications to be shown). There isn't, however, an attendant reflection on generic background-context notifications. As `push-notifications` is perhaps the only system that allows background notifications today, that seems explainable, but charting the path from the current states to more atomic sets with overlap is...unclear...in the current API.

Extrapolating to APIs not currently covered, such as Quota, the 3-state values do not appear sufficient to model their behavior. This is worrying.

####  Reflection _Only_

The existing web platform APIs for requesting permissions are haphazard. This has lead to [work towards suggesting unified patterns which the TAG can get behind](https://gist.github.com/slightlyoff/43cd8c2f64a0719358fe).

Looking at just the previously-discussed APIs (Geolocation and Notifications) we see distinct API styles that are calling out for unification and reform:

##### Requesting the Notification Permission

The Notification API has a lot of legacy, and retrofitting it to handle [background notifications](http://updates.html5rocks.com/2015/03/push-notificatons-on-the-open-web) has clearly been a challenge. The current approaches make it possible to understand the state of the system before making requests for permission, however, which is laudable:

```js
// Check the state of the Notifications permission
switch (Notification.permission) {
  case "denied":
    console.log("! (^⊙︿⊙^)~");
    break;
  case "granted":
    new Notification("\\o/");
    break;
  case "default":
    console.log("¯\\_(シ)_/¯");

    // Request to show a notification.
    // Uses callbacks and not Promises; clearly a bug.
    Notification.requestPermission(function(result) {
      if (result == "granted") {
        new Notification("\\o/");
      } else {
        console.log("Denied! (^⊙︿⊙^)~");
      }
    });
    break;
}
```

##### Requesting the Geolocation Permission

There is currently no Geolocation API for determining permission state before use, so developers must grin-and-bear-it, able only to detect if use has been denied and respond. Combine with a lack of Promise-friendly API, Geolocation seems a system-out-of-time:

```js
var onsuccess = console.log.bind(console, "\\o/");
var onfailure = console.log.bind(console, "(^⊙︿⊙^)~"");
// Note: does not return a Promise. Clear bug.
navigator.geolocation.getCurrentPosition(onsuccess, onfailure,
                                        { maximumAge: 600000,
                                          timeout: 10000,
                                          enableHighAccuracy: false });
```

##### Requesting the WebMIDI Sysex Permission

WebMIDI's style is more modern; it provides a [Promise-based API for requesting permissions](http://webaudio.github.io/web-midi-api/#requestmidiaccess), but like Geolocation [lacks a `hasPermission()` style API](http://webaudio.github.io/web-midi-api/) that would allow a developer to understand the latent state of the system without possibly prompting users for a permission out-of-context:

```js
var onsuccess = console.log.bind(console, "\\o/");
var onrejection = console.log.bind(console, "(^⊙︿⊙^)~"");
navigator.requestMIDIAccess({ sysex: true }).then(onsuccess, onfailure);
```

Succinct but not ideal.

##### What Better Might Look Like

The proposed Permissions API could potentially help ease the challenge of understanding the effects of a permission request for MIDI and Geolocation, but it doesn't heal the lack of promise style for _requesting_ permissions. This seems strange.

We might imagine a different API that allows both query and request, and perhaps one that allows us to compose queries:

```js
var onsuccess = console.log.bind(console, "\\o/");
var onfailure = console.log.bind(console, "(^⊙︿⊙^)~"");

var permissions = navigator.permissions;

document.querySelector("#enableNotificationToggle").onclick =
  function(e) {
    var options = {/* notification permission options here */};
    permissions.query("notification", options).then(function(state) {
      // Note "default" and not "prompt", see below.
      if (state == "default") {
        // The inside of a click handler for a toggle is a respectful place to
        // ask for the permission if it isn't already granted.
        permissions.request("notification", options).then(
          onsuccess,
          onfailure
        );
      }
    });
  };
```

Given that these sorts of permissions are rarely used in isolation to each other (WebMIDI apps may want expanded storage, etc.), we'd also like to see a stronger group-query and group-requeset API, but we leave the need for this to the WG/editors to research.

### ISSUE: No Explainer, Not Leading With Examples

For maximum clarity, we'd like to see the Examples section move to front-matter. It is clarifying to nearly everyone reading a spec to understand what problems a design will solve (or not) and frequently code is the tersest way to demonstrate that.

If that's not plausible, an attendant "explainer" document (e.g., [Service Workers](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md), [Web Components](http://www.w3.org/TR/2013/WD-components-intro-20130606/)) can do a great deal to help the casual observer understand (non-normatively) the value of a proposal.

Given the WIP (and lacking, see above) status of this document, an explainer or expanded set of examples seems in-order.

### ISSUE: Registry Maintenance

The spec defines a registry, but as long experience has shown, the W3C process is ill-suited to maintenance of living registries, particularly those that live hard-coded in specs.

We would like to see a plan outlined by the editors of the spec for dealing with this very-real problem.

## API Hygiene

### ISSUE: Symmetry

As covered previously, the lack of symmetry between the capabilities that can be requested (independently of each other) and those modeled by the Permissions API is concerning.

For instance, UAs may manage `highAccuracy` Geolocation requests independently from low-accuracy requests. This might imply entirely different management UI, request-time UI, etc.

That the Permissions API does not model all of the available states, even for APIs it covers, is nearly-fatal to the current draft.

### ISSUE: API Location

Static methods that operate on a conceptual collection of (stored) permissions, but which are located on a global `Permission` object, are weird to say the least.

A better design would be to keep the `Permission` interface, make it constructible, but locate the collection and operations over the collection at a different place in the namespace. E.g. `navigator.permissions.query()` (etc.)

### ISSUE: `prompt` Is Inappropriate & Inadequate

UAs are free to mediate permissions in whatever way they choose. We can imagine a Bizarro Browser that never asks users about permissions but instead exercises independent judgment about what to do in all cases.

Web APIs must anticipate changes in form-factor, extra-API UI, and may play host to a legitimate diversity of views about what is in user's interests. This has happened many times already in the web's evolution and so the implications of name `"prompt"` for an intermediate state between `"granted"` and `"denied"` is difficult.

It seems useful to be able to ask the UA if it _will_ prompt a user if a request for permission were made, but this is independent of the semantic about being in an undecided state. We therefore recommend that the the API be re-designed to separate these concerns.


### ISSUE: Inability to Enumerate

There's no API for enumerating the currently available list of APIs which can be managed using this API. At the limit, this should be possible as a way to feature-test for a particular permission-needing API.

The `query()` method doesn't seem to take any sort of wildcard or enable any sort of group query, and the normative text doesn't indicate a behavior to default to when a permission isn't supported by the system, leading to a situation where polyfills and feature detection cannot be based on the Permissions API but instead must use their own hardcoded list of permissions.

### ISSUE: `onchange` Only Available Per-Permission; Why?

Assuming the API location changes (see above), we'd very much like to see a simpler way to listen for global permission state changes; e.g.:

```js
// Using an event-oriented style, one event per change:
navigator.permissions.onchange = function(e) { /* ... */ };

// Or in an Object.observe() style with synthetic change records:
Object.observe(navigator.permissions, function(changes) {
  console.log(changes);
});
```

### ISSUE: Visibility Unclear

One assumes this API will be made available from both documents and Worker contexts, but this is not clear from the IDL in the spec. We'd expect to see a line like this preceding interface definitions:

```
[Exposed=(Window,Worker)]
...
```

### ISSUE: Constructibility

TODO(slightlyoff)

### ISSUE: Subclassing

TODO(slightlyoff)

### ISSUE: Extensibility & Persistence

TODO(slightlyoff, diracdeltas)

## Layering Considerations

TODO(slightlyoff, diracdeltas)

## Other Considerations

TODO(slightlyoff, diracdeltas)

## End Notes

TODO(slightlyoff, diracdeltas)
