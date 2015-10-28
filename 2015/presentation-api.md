Presentation API Review
=====
**DRAFT**

Spec: http://w3c.github.io/presentation-api/

Use cases: 
* Shared poker game; large TV used to show the shared game state--individuals view their own hand.
* Projection of a slide presentation to a large screen

The Presentation API provides a technique for web applications to:
* monitor and discover "second screen" class devices.
* launch new browsing contexts on these second screens (to arbitrary URLs)
* establish a message-passing communications protocol to the browsing context on the 
  second screen by way of a shared session object.
* join pre-existing presentation sessions.

This proposal breaks new ground in that (outside of web driver) this API has the capability of launching new browsing context sessions on potentially physically remote devices. The proposal does not attempt to define any of the transport layer functionality that would make these connections interoperable, such that we can only assume that the feature can only be supported by different instances of the same user agent running on both the "controlling" device and the "presenting" device. (However, the spec does allow for scenarios where the user may wish to present to a second screen that is physicaly connected to the same device.)

Many of the user-interaction details are left to the user agent, as is traditional. These include a permissions UX for enabling discovery of "second screen" devices, as well as a "picker" for identifying specific "second screens" that the user agent is aware of as well as the naming of these screens. 

The Presentation API provides one bit of fingerprinting surface, which is documented in the spec--the presence/absense of second screen information which is discoverable via the PresentationAvailability object.

Comparison to know platform features
-------

The API has crossover with several different existing web technologies.

1. It allows for launching new browsing contexts (potentially to different origins). The analog is ```window.open()```, which launches and maintains an object reference to the foreign browsing context. The communications protocol between the opener and openee is currently restricted by the same-origin policy which outright blocks most direct communication between opener and openee. Notably, ```postMessage()``` is allowed with specific origin targets. In the Presentation API, a similar message passing protocol is available, called ```send()``` which appears similar to ```postMessage()``` but more restrictive. It is unclear why the ```send``` API is more restrictive, and why it is limited to particular data types. In practice, I see no harm in simply adopting traditional cross-origin ```postMessage``` instead of ```send```, as it has greater developer familiarity, conveys async intent, and does not introduce a new concept. It also allows the message passing protocol to be somewhat simplified.

2. The act of presenting to a second screen seems very similar in principle to the ability for a particular element to ```requestFullscreen```. The same security and privacy concerns related to the Fullscreen API likely apply to the Presentation API (such as restricting ```<iframe>``` content from starting a new presentation session unless granted explicit permission). While element-level presentation may not be desireable, the ability to "cast" content to a second screen does seem congruent with the Presentation API's [use cases](https://github.com/w3c/presentation-api/blob/gh-pages/uc-req.md).

3. The concept of connecting to a shared session object had parallels to the ```SharedWorker``` object. The ```SharedWorker``` is established by the first party making a connection to it, then it becomes available to any requesting parties, provided they are within the same-origin. It's lifetime terminates when the last document connected to it terminates. In the Presentation API, the spawned presentation browsing context has a lifetime that is potentially longer-lived than the ```SharedWorker``` meaning that if no existing connection calls the session's ```stop()``` API it could potentially live indefinately. This could become a problem as it leaves the lifetime of a presentation explicitly up to well-behaved JavaScript management. In the web platform, we'd generally like to avoid these type of mananagement problems, espeically when the "second screen" may not have a user-interaction input modality. 

API Asthetic
----

In general, the technique for monitoring sessions and connecting/starting a new session seemed overly complex with layers of objects used for tracking state. There is opportunity to simplify if desired. The message-passing model, if converted to ```postMessage``` as noted previously, is sufficiently generic to handle most communication needs between the presentation screen and the controller.

Open questions:

Ownership of the presentation session was somewhat unclear. Does dedicated ownership change to joint shared ownership when second and third user agents participate in the second screen sharing experience?

Specific question requested in https://lists.w3.org/Archives/Public/www-tag/2015Jul/0001.html

**1. Security requirements for the messaging channel**

> The Presentation API is agnostic of the protocol used for the messaging channel as long as it is capable of carrying DOMString payloads in a reliable and in-order fashion. A user agent could perhaps communicate with the second device using the WebSockets protocol or a WebRTC data channel.

> However, when the controlling page is loaded in a secure context, the spec should set some guarantees of message confidentiality and authenticity ("only secure WebSockets"). Do you have suggestions on ways to specify security requirements in a generic manner?

The spec describes launching a new browsing context to the presentation display. Given the spec as written, it does not appear as if this is a client/server channel, but rather a client/client (peer) channel. The back-channel, maintained by the user agent for client/client browsing context communications (like those of ```window.open```) is currently not defined other than to say that a message passing system (like ```postMessage```) must guarantee in-order delivery. If the presentation on the second screen communicates with its server (it is loaded via the ```presentationURL```), then the ```send()``` API is unnecessary to the feature, as pre-existing client/server communication API fill this gap (```WebSocket```, ```XMLHttpRequest```, etc.)

**2. Private mode browsing for the presenting context**

> While the controlling device will be a "private" device, the presenting device will often be a "shared" device, perhaps a TV set or HDMI dongle in a household, or a remote screen in a meeting room. To protect the controlling user's privacy, the group would like to require the presenting user agent to load the presentation URL in private mode.

> The group notes the work done by the TAG to define Private Mode Browsing [3]. Would private mode browsing be an appropriate requirement for the Presentation API? What is the status and plan for the TAG's draft? In particular, can the group reference it from the Presentation API specification?

To my knowledge we don't have a concrete plan for the Private Mode Browsing release. In general a "private mode" would seek to limit the amount of fingerprinting and or state that is maintained between and during navigations. Several aspects of the Presentation API require presentation session objects to be consistent on return from a navigation, and a private browsing mode might of necessity destroy the consistency between these sessions for privacy reasons. It might also chose to limit the ability to launch new browsing sessions. In general, we cannot clearly define what the private browsing mode will do at this time, but requiring it as a prerequisit or dependency to the availablility of the presentation API seems to be a non-starter.

**3. Fingerprinting and screen availability monitoring**

> There is no good fallback for the Presentation API in the case when there are no screens available. To ensure a good user experience, a web page must be able to tell whether a request to "startSession" is likely going to succeed before it offers the user the choice to present. That is the role of the "getAvailability" function.

The need to avoid or show in-page UI to the user depending on whether a feature may or may not be available to use, is the use-case of the [Permissions API](http://www.w3.org/TR/permissions/). It seems like integration of presentation API into permissions is prudent.

> Without parameter, this function de facto reveals one bit of information on the user's context that could be used for fingerprinting, although this information will change depending on the user's context (on the go, with TV on/off, etc.).

> The group notes that a generic true/false is not enough in many situations where the URL to present may require additional capabilities. That is the reason why the "getAvailability" function takes the URL to present as parameter, to allow the user agent to filter screens.

[see TAG finding on unsanctioned tracking](http://www.w3.org/2001/tag/doc/unsanctioned-tracking/) Indeed there may be more information that is necessary to reveal in order to negotiate a connection. We ask that any such information that may lead to fingerprinting be associated with a user-controllable mechanism to purge/clear this data to avoid unwanted residual fingerprinting.

**4. Dealing with legacy content**

> One use case for the API is when a video/slideshow player embedded in an iframe wants to project the content to a second screen. The group explored to possibility to add an "allowpresentation" attribute to ```<iframe>``` in a similar vein as for the FullScreen API. However, this would de facto require millions of existing page that embed such players to update.

> The group now wonders whether it could rather extend the semantics of the "allowfullscreen" attribute or leave it up to the user agent to ask for user's consent.

As currently specified, the presentation API is sufficiently different than the Fullscreen API that it would be unwise to piggy-back on the existing "allowFullscreen" attribute.

**5. Presenting the content of an ```<audio>``` or ```<video>``` element**

> This is more FYI than a real question. A main use case that the group is to enable is the presentation of audio/video content on a second screen. The group thinks that the Presentation API is not a good fit for that use case, as a communication channel between a presenting context and a video does not mean anything.

> Instead, the group proposes to extend the HTMLMediaElement interface with a "remote" attribute. The main benefit of this approach is that application developers can then reuse the usual methods and properties exposed by the local HTMLMediaElement interface to control the video playback (play, pause, currentTime, playbackRate, etc.) on the remote screen.

It would make more more sense to "cast" a HTMLVideoElement to a second screen if the ergonomics of the presentation API more closely matched the fullScreen spec--which is something that could be considered.

Today, I see conflating the notion of a "remote control" browsing context (this specification), with the idea of pure presentation of an element (fullscreen API + casting). Both scenarios seem to have merit, but I agree that they tend to get muddied--even in the use-case document.

**6. Security and privacy considerations**

> The group would also like to draw the TAG's attention to the overall security and privacy considerations section in the spec, noting for instance that the API will not in itself allow the presenting page to identify the provenance and origin of incoming messages (no "origin" in a cross-device situation) and that the API will allow multiple controlling pages to connect to a single presenting context.

