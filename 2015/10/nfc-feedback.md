# DRAFT TAG Review of the NFC API #
## 14 October, 2015

### NFC is "near-field communication" ###

## Background ##

The [NFC Working Group](http://www.w3.org/2012/nfc/) produced a WD document, last updated and published as a [Note](http://www.w3.org/TR/nfc/) in June 2015. The NFC Working Group charter expired in April 2015, and the group lives on as a [Community Group](https://www.w3.org/community/web-nfc/).

Draft API spec now on Github: https://w3c.github.io/web-nfc/

Comments directed to:  public-web-nfc@w3.org

Issues can be logged/tracked on Github.

## Stated goal ##

Quoting from the Community Group homepage: The Web NFC Community Group will create a Near Field Communication API that is browser-friendly and adheres to the Web's security model. We believe that means the API **will not expose full, low level NFC functionality**, but rather a higher level subset that is **safe for Web pages**, **protects user privacy**, and does not annoy users with **unnecessary or complex permission requests**. (emphasis mine)

Sounds nice! :)

## Opportunities for Coordination ##

* Handover scenarios from Web NFC to another stack is out of scope, but something to be potentially coordinated with the [Web BlueTooth spec](https://www.w3.org/community/web-bluetooth/)
* Payment scenarios are not in scope--but this might be re-considered in light of new work on Payments.
  * Card integration is not supported.

## General Thoughts ##

Integrates well with the rest of the web platform! e.g., plugs into the Permissions API with "nfc" as the name.

Spec appears well-advanced for a community group. Lots of good detail, security and privacy conditions reviewed, and scoped down to enable a next level of functionality to be layered on top.

Lots of protocol detail explaining how "Web" NFC messages interoperate with standard NFC protocols (The NFC standards include ISO/IEC 18092[5] and those defined by the NFC Forum. See https://www.nfc-forum.org/specs/spec_list/ for a complete listing.)

Great security consideration section:
* Only in a secure context (recognizes and uses this new concept!)
* Only for browsing contexts that are active and in focus
  * Scenarios assume a web sites must be open and active when using the NFC API (e.g., no ServerWorker-like wake-up)
* Web origin model integrated into the protocol (can only read/write same-origin without permission; other cross-origin exchanges require permission)

```NFCRecord``` and related low-level structures seems very integrated with NFC low-level protocols which they abstract. Not super "webby", but they do allow interop with existing NFC protcols and payloads not previously exposed via the web (in other words, there are some constraints). Even so, my feedback would be around potentially abstracting the payload contents a bit more from the NDEF records and from the Web NFC Records (while preserving the well-defined mapping that exists in the spec).

The filtering (in ```watch```) seems hard to reason about as a web developer. How is one to know what to expect when starting to watch for messages, which message type/kind will be relevant unless there is already a relationship established with the other NFC party as to what NFC Record fields it will use. I'm not certain how relevant it is to expose these extra filtering options unless they are particularly relevant.

## Specific Feedback ##

The ```NFCRecord.type``` : this is the IANA media type, should jive with other uses of ```"mimeType"``` instead for clarity.

```NFCRecord.kind``` : this should likely be "type" instead.

The NFC adapter is two-levels away from the navigator object. Given that the NFC container object only has the single method, this could be collapsed a level to avoid extra verbosity, and to avoid use of the word "Adapter" (which felt foreign to me).  Suggestion:
```navigator.requestNFC()``` --- instead of ```navigator.nfc.requestAdapter()```

```pushMessage``` is highly structured (```sequence<NFCRecord>```). Why is it pushing a list? Shouldn't it push just one thing at a time? Is the grouping significant to the protocol? Can this be abstracted away?

```pushMessage``` reminds me of ```postMessage```. Given there is little similarity, perhaps a rename to ```push``` (simpler, shorter, no resemblance to ```postMessage```).

```NFCPushTarget``` -- given the format is the same, why is the push target (```"peer"``` or ```"tag"```) a necessary thing? Should this dictionary member be ```required```?

By convention, the ```watch``` API should have the options dictionary as a second parameter (not vice-versa). This will also allow the dictionary to be optional, which it is already setup for.

```NFCWatchOptions``` -- values are single strings. If filtering is desired, can multiple match options be possible (e.g., a variety of ```type```s or ```kind```s?) If so, this should likely be an array of strings, e.g., like ```MutationObserverOptions```:```attributeFilter```.

```pushMessage``` can only have two active pushes happening at once--one for tags, the other for peers. Is this a list expected to expand? If this is a fixed set of things, then could the API be simplifid by having separate ```pushToTag()``` and ```pushToPeer()``` APIs? (Not sure if this would be a good thing.)

