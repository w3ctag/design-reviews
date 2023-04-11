**_This draft has been moved to [its own repo](https://github.com/w3ctag/web-without-3p-cookies) and will no longer be updated here._**

# Improving the web platform without third party cookies

Many browsers are restricting or completely [deprecating the use of of third-party cookies](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/). The TAG supports efforts to deprecate third-party cookies, as this provides an opportunity to further improve the privacy preserving features of the web platform.

Removing third-party cookies from the web platform is not without complications. There are use cases for third-party cookies that need to be preserved, and pitfalls we need to be careful to avoid while doing so. This document sets out some things that specification editors and implementors should be aware of in order to make sure we ultimately [leave the web better than we found it](https://www.w3.org/TR/design-principles/#leave-the-web-better) after third-party cookies are deprecated.

## Why restrict third party cookies?

Cookies were [originally designed](https://www.rfc-editor.org/rfc/rfc2109.html) for recognising repeat visitors to a website, but they were soon repurposed for third parties (someone other than the website being used) for use cases like: login and single sign-on; tracking state (like putting shopping choices into a cart); tracking to better target advertising, detecting fraud, measurement and attribution of ad clicks. This increase in data collection and sharing about people using the web - often in a way that is opaque or incomprehensible to a web user - results in decreased individual and collective privacy.

[Third-party cookies](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-11#name-third-party-cookies) in particular are a key technology supporting tracking networks, which have been identified as a major threat to privacy. These tracking networks entail concentrating data in the hands of - and thus giving greater power to - intermediaries with a presence across many sites, away from the individual sites a person is actually visiting. This centralising effect has repercussions on innovation and accountability, beyond what is in scope for discussion here.

We maintain that [security and privacy are essential](https://w3ctag.github.io/ethical-web-principles/#privacy) on an ethical web; a reduction in privacy also has implications for [freedom of expression](https://w3ctag.github.io/ethical-web-principles/#expression), [supporting healthy communities](https://w3ctag.github.io/ethical-web-principles/#community) and the [enhancement of individual control and power](https://w3ctag.github.io/ethical-web-principles/#control). 

We consider privacy a [core design principle](https://www.w3.org/2001/tag/doc/unsanctioned-tracking/), and [differentiator](https://www.w3.org/2001/tag/doc/private-browsing-modes/) for the web platform.

## Use cases previously met by third-party cookies

Some features of the web that people have come to expect, and which greatly improve user experience, currently depend on third-party cookies, and continuing to support these use cases is important. It is better to approach this with replacement technologies that are designed-for-purpose and built to respect user privacy. We discourage more general replacements, which are at risk of recreating the same issues caused by third-party cookies in the first place.

Some recent good examples of the designed-for-purpose approach include:

* [FedCM](https://github.com/w3ctag/design-reviews/issues/718). Third-party cookies have been used to support single sign-on. FedCM is a set of technologies built to support single sign-on and identity federation, without replicating all functionality of third-party cookies.
* [CHIPS](https://github.com/w3ctag/design-reviews/issues/654). The goal of CHIPS is to allow state, without supporting correlation or tracking between web sites which don't know they are collaborating, for example, when embedding third-party services like customer service webchat.
* [Fenced Frames](https://github.com/w3ctag/design-reviews/issues/735). This provides a new top-level browsing context which enables content from multiple parties to be embedded on a page, without the embedding site being able to communicate with the embedded site. 

In all cases, it is important to continually review how such proposals might interact with other emerging or proposed APIs. Be aware that a set of new technologies which carry minimal risk individually, could be used in combination for tracking or profiling of web users.

## Leaving the web better than we found it

We are strongly in favour of innovations to build sustainable business models on the web platform, but an in-depth discussion of the various possibilities are outside of the scope of this document. From an architectural standpoint, web standards should avoid compelling user agents to constrain the business models, including encoding particular advertising models, that are available to authors, publishers, and web content creators.

The TAG considers each new technology proposal *both* individually, *and* as they fit together with the web platform as a whole. The web must be cross-platform, so multi-stakeholder (in particular, multi-browser) support for privacy-related specifications is essential if they are going to achieve the goal of increasing privacy on the web. When we consider whether something makes the web platform better, we should be explicit about what the baseline for comparison is. Is a proposal better for privacy when compared to usage of third-party cookies? Or when compared with a web free from third-party cookies altogether? What about when some user agents restrict third-party cookies, but others do not?

We urge that the deprecation of third-party cookies continues across the web platform irrespective of the progress of proposals which seek to replace some of the functionality of third-party cookies.
Many varied proposals are being incubated in W3C Community Groups (eg. [WICG](https://wicg.io/), [PATCG](https://patcg.github.io/)) as well as outside (eg. [Privacy Sandbox](https://www.privacysandbox.com/)), and in these incubation stages multi-stakeholder support, consensus, and possible timelines for standardisation are uncertain, and far from guaranteed. 
We are also wary of new approaches being introduced while third-party cookies are still available to authors, as this comes with a risk that more, parallel channels for privacy invasion become possible, rather than fewer. 
Thus, the deprecation of third-party cookies should not be dependent upon the standardisation of replacement technologies.

All proposers of new web platform technologies are expected to be able to explain and justify the benefits and trade-offs of their proposal. It is particularly important that proposals which aim to fill gaps left by the removal of third-party cookies provide clear and concrete evidence that individual and collective privacy is still preserved; especially proposals which involve profiling, cross-context recognition, or otherwise aggregating or sharing of web user data between parties. We encourage that proposals claiming to improve privacy on the web platform undergo independent review and analysis; the burden of proof is on the proposers, not reviewers, to justify additions and changes to the web platform. The benefits to web platform users of the removal of third-party cookies must not be undermined by user agents or site authors in other ways.

In conclusion, when accommodating changes caused by the deprecation of third-party cookies, we should avoid introducing new technologies that, when deployed either individually or in combination, effectively preserve the status quo of harmful tracking and surveillance on the web.
