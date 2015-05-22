# TAG Feedback on Fingerprinting Guidance for Web Authors [DRAFT]

Version reviewed: [24 February 2015](https://w3c.github.io/fingerprinting-guidance/)


## Fingerprinting *is* a Lost Cause

The TAG believes there is a reasonably strong consensus in the industry that, against a determined attacker, combatting fingerprinting *is* a lost cause. As such, while the document does attempt to explain this, we believe it should do so more clearly and up front.

In particular, the content in Section 4 should be moved into Section 1, and rewritten to fully explain why fingerprinting is not possible to prevent when faced with a determined attacker.


## Establishing a W3C Position on Fingerprinting

While fingerprinting against a determined attacker may be a "lost cause," it should not become "business as usual" on the Web -- i.e., used as a matter of course by everyday Web sites or ads on them to identify users (noting that there are a few legitimate uses for fingerprinting, such as to combat DDoS attacks).

We believe that fingerprinting should be clearly condemned by the W3C as hostile to the Web -- in a manner similar to [Pervasive Monitoring was declared an attack by the IETF](http://tools.ietf.org/html/rfc7258), in that it is using the technology against the interests of its users.

As such, we are considering publishing a TAG Finding to this effect, and would appreciate feedback and input.

We currently envision such a document being used to clearly explain to end users what fingerprinting is and why it is difficult to "fix," and to encourage industry associations, legislators and regulators to create barriers to fingerprinting.

That document could also include advice to specification authors, and if the Privacy Interest Group would like to combine efforts to do so, we would welcome it.


## Hooks for Mitigating Fingerprinting

One significant thing that specification authors could do to improve the situation would be to not only flag features as fingerprinting-sensitive (as per [Best Practice 3](https://w3c.github.io/fingerprinting-guidance/#mark-fingerprinting)), but also by providing explicit hooks (e.g., API flags) to disable them, so that privacy-sensitive users can use an extension that does so, and so that specialist browsers (like [TorBrowser](https://www.torproject.org/projects/torbrowser.html.en)) can more easily adapt their behaviour.

For example, while not designed specifically for this purpose, the Canvas API in HTML5 exposes the [origin-clean flag](http://www.w3.org/TR/html5/scripting-1.html#security-with-canvas-elements) which allows control over whether a canvas can be read (a significant source of fingerprinting 
attacks).


## Types of Fingerprinting

"Active" fingerprinting is defined as that which requires running code on the client. We wonder how useful this distinction is; it might be better to map it to that which is detectable by observing server behaviour -- including when the server probes various parts of the JavaScript API surface, but also when the server sets local state, etc.

Likewise, we wonder whether including "cookie-like" state as a type of fingerprinting is useful, since the mitigation strategies are so fundamentally different. It might be better to move the definition and mitigations to a distinct part of the document; e.g., "Local State and Fingerprinting."


## Section 2.1.1 - "Identify a user"

This seems more like a consequence of unexpected correlation of browsing activity (2.1.2) than a genuinely separate privacy impact. We suggest removing this section.


## Section 2.1.3 - "Inferences about a user"

[This section](https://w3c.github.io/fingerprinting-guidance/#inferences-about-a-user) contains a note asking whether it is in scope for the document. We believe it is not, and could be removed; while it's an interesting point, a shorter, focused document would serve its purpose better.


## Section 5.1 - Feature detection

This section starts by recommending that feature detection exposes fingerprinting surface, and therefore should be avoided where possible. This is not a realistic position to take on the modern Web platform; the benefits of feature detection for progressive enhancement are well-known, and the fact that browsers are moving to an "evergreen" model means that the amount of entropy exposed will be low (since each browser will effectively have a consistent signature).

We suggest removing this text.

## Best Practices

[Best Practice 1](https://w3c.github.io/fingerprinting-guidance/#avoid-passive-increases) is unrealistic; we suggest changing "any" to "unnecessary".

[Best Practice 2](https://w3c.github.io/fingerprinting-guidance/#avoid-active-increases) is worded as:

    Prefer functionally-comparable designs that don't increase the surface for active fingerprinting
    
This isn't clear; what are we to prefer it in comparison to? A casual reading would be that we prefer designs that increase the surface area for passive fingerprinting over that which would increase active fingerprinting, and that is clearly counter-productive.

We'd suggest re-wording this practice as:

    When increasing fingerprinting surface is unavoidable, prefer designs that make it detectable.

... keeping in mind that both "active" and "cookie-like" mechanisms are detectable.

[Best Practice 4](https://w3c.github.io/fingerprinting-guidance/#specify-ordering) is unlikely to realistically mitigate fingerprinting, both because so many APIs are already existent, and because so much relevant behaviour relies upon much lower-level constructs (usually JavaScript itself).

We suggest removing this practice.

[Best Practice 5](https://w3c.github.io/fingerprinting-guidance/#api-minimization) is extremely vague. If an example can't be found, we'd suggest removing it (since arguably it is covered by the other best practices).

[Best Practice 7]() should be modified to start "Avoid unnecessary new cookie-like..."


## Miscellaneous Content Suggestions

Overall, the document would benefit from more examples. 

Section 6, "Research" seems incidental to the draft; while it's important background information, it may be better collected in an appendix, or a reference to a separate document. 

Section 5.5 "Do Not Track" doesn't contain concrete advice for specification authors, and so seems extraneous. We suggest either making it more concrete, or removing it. 

