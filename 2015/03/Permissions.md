# Permissions API Draft Feedback

A previous version of this feedback, covering an [earlier version of the spec](https://github.com/w3c/permissions/tree/8aad19292c5218fb0411c090a9dfde022828cf96), is available [here](https://github.com/w3ctag/spec-reviews/blob/b7bc0e355fcffba11e1f1de30194d4eacffab187/2015/03/Permissions.md)


[Draft under discussion.](https://w3c.github.io/permissions/) ([At this revision](https://github.com/w3c/permissions/tree/35ad98421a96b32aa22ec79b74064e9e8fc03d0d))

We extracted IDL and example code from the draft in question using a snippet run at the developer tool command line:

```js
Array.prototype.slice.call(
  document.querySelectorAll(".idl,.es-code")
).map(function(n) { return n.innerText; }).join("\n\n\n");
```

The IDL is relatively terse, so we replicate it here for clarity:

```
dictionary PermissionDescriptor {
    required PermissionName name;
};

enum PermissionName {
    "geolocation",
    "notifications",
    "push",
    "midi"
};

dictionary PushPermissionDescriptor : PermissionDescriptor {
    boolean userVisible = false;
};

dictionary MidiPermissionDescriptor : PermissionDescriptor {
    boolean sysex = false;
};

enum PermissionState {
    "granted",
    "denied",
    "prompt"
};

[Exposed=(Window,Worker)]
interface PermissionStatus : EventTarget {
    readonly    attribute PermissionState status;
                attribute EventHandler    onchange;
};

[Exposed=(Window)]
partial interface Navigator {
    readonly    attribute Permissions permissions;;
};

[Exposed=(Worker)]
partial interface WorkerNavigator {
    readonly    attribute Permissions permissions;;
};

[Exposed=(Window,Worker)]
interface Permissions {
    Promise<PermissionStatus> query (PermissionDescriptor permission);
};
```

The example code is similarly short:

```js
// Example 1
navigator.permissions.query({name:'geolocation'}).then(function(result) {
  if (result.status == 'granted') {
    showLocalNewsWithGeolocation();
  } else if (result.status == 'prompt') {
    showButtonToEnableLocalNews();
  }
  // Don't do anything if the permission was denied.
});


// Example 2
function updateNotificationButton(status) {
  document.getElementById('chat-notification-button').disabled = (status == 'denied');
}

navigator.permissions.query({name:'notifications'}).then(function(result) {
  updateNotificationButton(result.status);

  result.addEventListener('change', function() {
    updateNotificationButton(this.status);
  });
});
```

## General Discussion

The document hast evolved considerably since we began to engage with the Editor (and others). A subset of comments in a [previous draft](https://github.com/w3ctag/spec-reviews/blob/b7bc0e355fcffba11e1f1de30194d4eacffab187/2015/03/Permissions.md)of our review have been addressed _very_ quickly. The TAG is incredibly grateful for the willingness to collaborate and hope the API will continue to evolve.

We're _deeply_ gratified to see a plan for extensiblity outlined in a [separate document](https://github.com/w3c/permissions/blob/gh-pages/extensibility.md). We'd like to see an explainer that outlines use-cases and would love to see examples appear at the top of the spec as well.

In general, there appears to be a lot right with the API, but major sections appear to be missing. This is to be expected in some measure for a work-in-progress draft.

Mounir Lamouri was kind enough to provide insight in a call with the TAG regarding some of the history and use-cases.

The Permissions API could serve as both as of the existing ad-hoc, promise-unfriendly, haphazard system and a cure to many of those problems. Given the wealth of new APIs being proposed, it is also timely. Even the current permissions-gated API surface are is confusing to developers and users [as demonstrated to the TAG by Dominique Hazael-Massieux](https://github.com/dontcallmedom/web-permissions-req). We support a solution which unifies the surface area and conventions the various permission-requesting APIs in today's web platform; much as we have supported retrofitting APIs to use Promises.

We're further convinced by the argument regarding a semantic gap between APIs. Mounir identified this -- specifically the inability to determine if a request for a permission will cause UI to be shown in certain circumstances thanks to a lack of corresponding API surface area -- as an important and a valuable problem to solve.

We are deeply concerned, however, that the draft as currently proposed is a small fraction of what is necessary to meet the (to us) obvious goal of replacing ad-hoc APIs with a more-extensible, more comprehensible, more unified approach to permissions on the web.

### ISSUE: Low Sights

The current API represents less than half of the scope and capability we hoped for in an API named the "Permissions API".

We had expected a unification and normalization framework for permissions the web platform. A glance at the [original proposal](https://lists.w3.org/Archives/Public/public-webapps/2014JulSep/0389.html) and [associated documents](https://docs.google.com/document/d/12xnZ_8P6rTpcGxBHiDPPCe7AUyCar-ndg8lh2KwMYkM/preview) shows that, while the designers may have hopes of adding features in the future, at no time has a more capable version actually been proposed. Discussions [have flagged the lack of capability as an issue](https://lists.w3.org/Archives/Public/public-webapps/2014JulSep/0399.html), which to date remain unaddressed.

####  Insufficient Reflection

The Permissions API does not currently model all of the permissions in the the web platform. These include

  - [Geolocation](http://dev.w3.org/geo/api/spec-source.html)
  - [Push](https://w3c.github.io/push-api/)
  - [Notifications](https://notifications.spec.whatwg.org/)
  - [Background Notifications](https://gauntface.com/blog/2014/12/15/push-notifications-service-worker)
  - [Storage Quota API](http://www.w3.org/TR/quota-api/)
  - [Fullscreen](http://www.w3.org/TR/fullscreen/)
  - [MIDI devices](http://www.w3.org/TR/webmidi/) and [System Exclusive device support](http://www.w3.org/TR/webmidi/#requesting-access-to-the-midi-system-with-system-exclusive-support)
  - [Camera and Microphone access](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia)
  - [Popup window creation (e.g., `window.open()`)](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
  - Gamepad access

Other recently contentious APIs (battery status, CPU core count) might also merit representation via this API as well.

Taking just the example of the [Geolocation API](http://dev.w3.org/geo/api/spec-source.html) (which is ostensibly reflected by this API), it isn't possible to formulate a request to `navigator.permissions.query()` that will determine if a request for [high-accuracy locations will show a prompt](http://dev.w3.org/geo/api/spec-source.html#high-accuracy). Same for repeated permission updates with [`watchPosition()`](http://dev.w3.org/geo/api/spec-source.html#watch-position).

We expected to be able to formulate a request using the same vocabulary as the geolocation APIs's permission request function; e.g.:

```js
naviator.permissions.query({ name: "geolocation", enableHighAccuracy: true })
  .then(/*...*/);
```

Similar problems exist for notifications: there's affordance for `notifications` and `push`. There isn't a way to reflect on generic background-context notifications. Perhaps an extension to the `notifications` query would allow this?

```js
naviator.permissions.query({ "notifications", background: true })
  .then(/*...*/);
```

The current solution -- the `userVisible` parameter flag in `PushPermissionsDescriptor` -- is perhaps useful, but it doesn't model the (logically independent) ability to show Notifications from the background context. That certain runtimes may fuse these concepts today doesn't seem to have bearing on the design question.

We're grateful to see permission descriptors added since our last review, as they provide a path towards extensible queries, e.g. for understanding how much quota is avaialble, however the return value (`PermissionState`) lacks all such nuance and remains a deep concern. It likely needs to be converted into a similarly extensible object; e.g.:

```js
{ "status": "granted", /* additional state here */ }
```

####  Reflection _Only_

The existing web platform APIs for requesting permissions are haphazard. This has lead to [work suggesting unified patterns, which the TAG supports](https://gist.github.com/slightlyoff/43cd8c2f64a0719358fe).

Looking at just the previously-discussed APIs (Geolocation and [Push/Notifications](http://updates.html5rocks.com/2015/03/push-notificatons-on-the-open-web)) we see distinct API styles that are calling out for unification and reform:

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
var notificationOptions = {
  name: "notifications",
  // other options go here, e.g.:
  background: true
};

document.querySelector("#enableNotificationToggle").onclick =
  function(e) {
    var options = {/* notification permission options here */};
    permissions.query(notificationOptions).then(function(state) {
      if (state == "prompt") {
        // The inside of a click handler for a toggle is a respectful place to
        // ask for the permission if it isn't already granted.
        permissions.request(notificationOptions).then(
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

On a related note, the addition of a design guide for permissions seems like a good future goal for this effort and something the TAG would happily collaborate on.

### ISSUE: Registry Maintenance

The spec defines a registry, but as long experience has shown, the W3C process is ill-suited to maintenance of living registries, particularly those that live hard-coded in specs.

We would like to see a plan outlined by the editors of the spec for dealing with this very-real problem.

## API Hygiene

### ISSUE: Symmetry

RESOLVED: this issue was resolved in an update to the API

### ISSUE: API Location

RESOLVED: this issue was resolved in an update to the API

### ISSUE: `prompt` Is Inappropriate & Inadequate

RESOLVED: this issue was resolved in discussion with the editor

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

RESOLVED: this issue was resolved in an update to the API

### ISSUE: Constructibility

TODO(slightlyoff)

### ISSUE: Subclassing

TODO(slightlyoff)

### ISSUE: Extensibility & Persistence

PATIALLY RESOLVED: this issue was partially resolved by the [addition of an extensibility discussion document](https://github.com/w3c/permissions/blob/gh-pages/extensibility.md)

## Layering Considerations

TODO(slightlyoff, diracdeltas)

## Other Considerations

TODO(slightlyoff, diracdeltas)

## End Notes

TODO(slightlyoff, diracdeltas)
