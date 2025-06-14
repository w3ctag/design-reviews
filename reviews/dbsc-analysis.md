# Device-Bound Session Credentials: Analysis and Alternative

Issue: https://github.com/w3ctag/design-reviews/issues/1052
Explainer: https://github.com/w3c/webappsec-dbsc/blob/main/README.md
Specification: https://w3c.github.io/webappsec-dbsc/

The purpose of this feature is to bind active sessions with websites
to an asymmetric key pair that is stored by the browser.
The expectation is that this makes it harder for an attacker to move sessions.

This is a reasonable goal.
The end-user benefit is less vulnerability to cookie theft.
Other benefits are somewhat uncertain, as we aren’t sure if this will change how sites ask people to re-authenticate.

The high-level approach seems generally in the right direction,
but we think that this could be made more consistent with existing cookie-handling.

## Overview

This is based on the idea that stealing a key pair —
especially one that can be saved in a trusted platform module (TPM) —
is much harder than stealing cookies.
Cookies are necessarily sent between client and server all the time,
whereas private keys never need to move.

This does not use WebAuthn for storing keys, but rather depends on an unspecified key storage location.
This is primarily due to some inherent inflexibility in WebAuthn
around how tokens require user interaction for enrollment and (sometimes) usage.
The goal is to make keys available for use transparently,
so that sites can activate the feature without any additional user interaction.

Part of the reason for this feature is to allow sites to extend login times,
so that people that visit sites need to reauthenticate less often.
Short cookie lifetimes are often driven by a desire to manage the risk of cookie theft.
The need to refresh logins on sites is not the only reason that sites time sessions out,
but it is a major factor driving the need to enter passwords.
This would not guarantee that sites would ask for passwords less often, but it would be good if it had that effect.

There are two major parts to the design of this feature: enrollment and usage.
This document will first look at usage, because that is the part that could be simplest.

## Restatement of the webappsec-dbsc Proposal

Preconditions for usage of this feature are that:

 1. the browser has generated a key pair for an origin and
 2. the origin knows that public key.

The goal is to have the browser regularly prove to the site that it continues to be able to access the secret key.

### Usage

In the proposed design, the browser is given three things during enrollment:

* the URL of a [resource](https://httpwg.org/specs/rfc9110.html#resources) representing a “session”,
  that it can use for protocol interactions,
* a way of identifying which resources use cookies that are provided using the protocol, plus
* the names of the cookies that can be produced.

The site is given the public key from the site-specific key pair that the browser holds.

In the proposed design,
the browser understands that when it makes a request to one of the resources that participates in the protocol,
it is expected to hold refreshed versions of the identified cookies.

These cookies are expected to have very short validity periods.
The browser is able to refresh those cookies automatically by interacting with the session resource.
The main part of the protocol is the interactions between the browser and that session resource.

Interactions with the session resource are a two-step process.
The first is a simple request that retrieves a fresh challenge.
The second posts a signature from the secret key over that challenge,
thereby proving to the server that the browser still has access to the key pair.
The response to the second request refreshes any of the affected cookies.

This adds two round trips of latency every time that a cookie refresh is needed.

We have an alternative below that doesn't require an interactive exchange.
However, given that TPMs generally don't have a clock,
you can't use the clock to ensure freshness.
A non-interactive exchange might have been pre-generated by an attacker
who temporarily had access to the TPM, unless it contains fresh entropy from the server.
That's something we address in more detail in the alternative design below,
noting that the alternative offers servers more options to combine requests to reduce latency,
where the proposal cannot.

The proposal includes a new session identifier field in requests.
That new field could be replaced either with a per-account resource-URL
parameter or a non-DBSC cookie.

The alternative also provides the server better control over when the browser supplies signatures.
The current design relies on expiring cookies to trigger signatures.

The proposed design refreshes signatures when the identified cookies expire.
This relies on the client clock to trigger the use of signatures,
which can be unreliable because client clocks are notoriously inconsistent.
Sites then have to deal with uncertainty about when a refresh will happen.
That lack of control over when the process is initiated can mean a latency hit
at inconvenient time as the browser refreshes cookies.
This is addressed in the design by limiting scoping,
where only critical resources and named cookies need coverage.

Providing explicit server control over when to sign provides more certainty
and involves less overall complexity as it is left to servers to decide when signing is needed.
That comes with a potential latency penalty, which is discussed below.


### Enrollment

The design proposes the use of a new HTTP header field.
If a server ever sent this field, in an HTTP response, that would initiate the enrollment process.

This new field identifies the session resource.
It also includes a challenge that needs to be signed to complete enrollment.
The server also lists the types of keys it supports.

To complete enrollment, the browser needs to:

* generate a key pair,
* sign the challenge, and
* post the signature to the session resource.

The content of that response is a JSON document that describes the rest of the protocol:
which resources and cookies are governed by this resource.


### Complexity

Overall, this creates a new set of interaction paradigms between the browser and websites.
We think that there are easier ways to achieve the same basic goals
without too much disruption to the existing cookie handling arrangements.
That design is sketched below.

## An Alternative Design

This is a sketch of an alternative approach that is closer to how the web platform currently handles cookies.

The core requirement for the usage part is that the site is able to
regularly request that the browser demonstrate that it has access to the private key
that was registered through the enrollment process.
Ideally, that access is not required for most interactions,
because generating and validating a digital signature is somewhat expensive for both client and server,
especially, for the client, if the key is stored in a TPM.

Justin Richer hinted at an alternative pattern that is worth exploring
in [issue 112](https://github.com/w3c/webappsec-dbsc/issues/112).
[HTTP Message Signatures](https://datatracker.ietf.org/doc/html/rfc9421) is not a directly usable standard,
but more of a framework for applying signatures to content.
A signature that covered cookies, URL, date, and other information might be the core of a more complete design.

### Signed Cookies

That design might include a new `Signed` parameter for cookies in `Set-Cookie`.
That attribute would request that, whenever the cookie is sent to the server,
the client would cover that cookie with a signature.

The use of the `Path` cookie parameter would ensure that
`Signed` cookies are only sent when requests are made to specific resources.
That would allow servers to limit how often they ask clients to generate signatures
by limiting how often the client requests the identified resources.
Those requests could be initiated through a redirect, fetch, or any other request, as needed.

The choice of what fields to include under the signature is very important.
It is not likely to be sufficient to just cover `Cookie` in the list of signed content in `Signature-Input`.
Including a date (the `created` parameter), the method (`@method`), and the URL (`@target-uri`)
seem to be the minimum set of things that will prevent the signature from being reused.
It's possible that a more thorough security analysis will identify other fields that need to be covered.


### Handling Common Scenarios

A potential challenge then is coordinating those requests so that different origins within the site,
which might be only loosely coordinated through a central authentication/authorization system,
don’t generate requests for signatures too often.
That can be managed by directing refresh requests to a resource on that system
that does not have `Signed` cookies associated with it.
That resource can coordinate any cookie refreshes,
forwarding requests to the affected path as necessary.

Another challenge is in demonstrating liveness for the signature.
TPMs don’t generally have clocks,
so if a device is compromised so that an attacker gains access to the TPM,
the attacker could generate an arbitrary number of signatures for future use.
However, this requires that the attacker predict the times any URLs where those signatures would be needed.
This suggests a similar pattern to solve that potential problem also:
the server redirects to a new endpoint with fresh randomness in the URL for signing.


#### Complete Example

The complete set of requirements could be addressed as shown below.
This example is expanded to include the maximum number of exchanges possible
to fully illustrate all of the capabilities.
A discussion of how to reduce or hide latency is included below.

```http
GET /some/resource
Cookie: login=expired
```

Which results in a redirection to a login endpoint,
as would be part of a normal centralized login flow
(i.e., this would be a perfectly normal part of refreshing cookies):

```http
303 See Other
Location: /login?r=/some/resource
```

Consequently, the client follows the redirect.

```http
GET /login?r=/some/resource
Cookie: login=expired
```

This resource then makes a call about the freshness of the login cookies and determines that a signature is needed.
The server initiates another redirect,
including fresh entropy in the URL to guarantee that the client has live TPM access.

```http
303 See Other
Location: /login/sign/1EU9jsh07pci6Cgk9Bh0?r=/some/resource
```

After a request that includes the signed cookie,
which is bound to a `Path` prefix of `/login/sign`:

```http
GET /login/sign/1EU9jsh07pci6Cgk9Bh0?r=/some/resource
Cookie: login=expired; signed=ok
Signature-Input: (...)
Signature: :...:
```

That resource then can validate the signature and produce an updated cookie.
And then redirect back to the original resource.

```http
303 See Other
Location: /some/resource
Set-Cookie: login=refreshed; Secure; HttpOnly; etc=etc
```

Note that the server does not need to refresh the signed cookie.
That cookie could be a stub that only exists to elicit a signature, so it could have a very long lifetime.


#### Reducing Latency

The need to manage liveness,
centralize the management of login refreshing,
and provide the server with control over when signatures occur
each potentially add latency.

In the original proposal, reliance on the client clock potentially removed one round trip,
that being the first in the example above.

The first way to reduce latency is to have all resources be able to redirect
to the high entropy resource that requires a signature.
That is, the server redirects directly from `/some/resource` to `/login/sign/...`.
That optimization “only” requires coordination in the server,
to ensure that redirects are not triggered by multiple fetches.

The scoping arrangement in the JSON session description potentially gave servers
the option to make a cookie that triggered a signature refresh on some requests and not others,
though this is inflexible due to overlap between the scoping in that session description and in cookies.
That is, the session description could ask that cookies with a
[`Path`](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.4) of `/foo`
be refreshed using a request to `/foo/bar`.

That arrangement can be used to hide latency.
Consider that a site could serve up HTML for `/foo/page.html`,
which might be able to recognize that the cookie is due for a refresh.
The response could forcibly expire the cookie
and force a fetch for a resource at `/foo/bar` in the background.
That fetch would cause the session refresh to occur,
without necessarily delaying the page load.

A similar approach is possible under the alternative design.
Any resource could accept a cookie that the server wants to refresh
if that resource is less critical to protect.
This is more flexible because it is not tied to specific path prefixes.
It could instead be for other reasons,
such as whether the request is for protected information or actions.
Resources can then trigger asynchronous fetches to refresh cookies,
ahead of when any critical resources need to be fetched.

#### Clearing State

The explainer suggests that `Clear-Site-Data`
with either the `cookies` or `storage` tokens
causes the session to terminate.
We think that if this is logically a cookie,
then only the `cookies` token needs to act on that state.

It might be reasonable to specify a new token for clearing the signature key,
so that cookies might be cleared independently.
As the original proposal didn't include that option, we haven't either.
We can see how the DBSC(E) extension —
which has a more complex enrollment process —
might benefit from key retention.


### Communicating Keys

Enrollment can almost be a side effect of creating and first use of a `Signed` cookie.
The only requirement here is that the browser learns what types of keys are acceptable to the server
and that the server learns the public key that the client uses.

Any `Set-Cookie` header that establishes a `Signed` cookie could list the key types in the `Signed` attribute,
but the [`Accept-Signature` field](https://www.rfc-editor.org/rfc/rfc9421.html#name-requesting-signatures)
exists for negotiating the use of signature keys.
The server should therefore use `Accept-Signature`.

The `Cookie` header that the browser subsequently sends will be signed.
That same message can include the public key from the key pair.
That’s usually not something that can be included in the signature as defined in the current RFC.

For that, we might define a new `Signature-Public-Key` field to carry the necessary information.
That would be a new piece of specification, but a simple one.
Something like the following would probably suffice:

```http
Signature-Public-Key: keyid="whatever", alg=ed25519, pubkey=:mc7Fpqi1aY/6...:
```

A possible alternative is to define a new `Signature` field parameter,
but that could be confused with `keyid`.

One nice thing about this is that the server can choose the `keyid` value
that is used when it sends `Accept-Signature`,
which provides the server with certainty about how keys are identified.
That key identifier is a form of cookie also;
or an extension to the information stored for the `Signed` cookie.
That means it needs to be cleared along with the cookie if someone asks the browser to clear state.
Of course, state clearing already requires that the key pair also be cleared.

The only thing remaining is to maybe avoid sending the public key
when the browser sends a `Signed` cookie subsequent to enrollment.
This can be as simple as remembering the last request that was made with that cookie.
If the cookie has changed, or the last request made with that cookie received a 4xx
HTTP status code in response, the browser can add the public key to the next request.
Of course, this doesn’t matter for some signature schemes as much as others.
A browser might choose to send an Ed25519 or P-256 ECDSA public key with every request
because the cost of those bytes is far outweighed by the cost of computing the signature itself;
that obviously changes significantly with post-quantum signature algorithms, which are much larger.

## The “Enterprise” Edition

We only looked briefly at the “enterprise” extension to this feature, DBSC(E).
These extensions to the enrollment process increase the overall complexity considerably.
This includes several new actors,
device-level attestation, and
adds the requirement to have keys held by a specialized service that replaces the TPM.

We believe that these same basic approaches can be handled in our alternative design,
as they only relate to the enrollment process and which key pairs the server is willing to accept.
A more involved enrollment process can easily be substituted for the simple one we describe.
That makes the attestations and key management functions largely separable from the protocol operation.

We have not explored this process in any more detail.
