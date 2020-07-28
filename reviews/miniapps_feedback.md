# TAG Review / Statement on MiniApp Specs

This document is in reference to 3 TAG review requests from the MiniApps community group:

*   [MiniApp URI Scheme](https://github.com/w3ctag/design-reviews/issues/478) #478
*   [MiniApp Manifest](https://github.com/w3ctag/design-reviews/issues/524) #524
*   [MiniApp LifeCycle](https://github.com/w3ctag/design-reviews/issues/523) #523

We welcome these review requests. The TAG wants to play a positive role here.

In addition, the TAG are concerned with the overall security model of the web and we want to ensure that any work on miniapps takes full advantage of the work done in w3c and elsewhere to create this robust model.

In reviewing these requests and also reviewing some of the additional work of the MiniApp CG, the TAG has become concerned with the direction this work is taking.


# The Goal of One Web

We believe that there are clear benefits to all members of the global web community to having one web platform. This platform needs to take into account the needs and requirements of all participants. Some of these benefits include code reuse, applicability of developer skills and similar expectations from end users about what the web platform is and how it works. Additionally we can be sure to take advantage of all of the value that has been built up in ensuring the web platform is secure. Finally, developers will be able to take advantage of the robust documentation available on the web platform, such as exists on [MDN](https://developer.mozilla.org/) (which W3C is a partner of via its participation in the MDN Product Advisory Board).

One way the TAG has sought to document the principles behind the web is through the [Ethical Web Principles](https://www.w3.org/2001/tag/doc/ethical-web-principles/) document. This document helps us to understand what differentiates the web from other platforms and supports the design principles we have put in place in the [Web Platform Design Principles](https://w3ctag.github.io/design-principles/) document.

The TAG Ethical Web Principles document [states](https://www.w3.org/2001/tag/doc/ethical-web-principles/#oneweb) that:

_When we are adding new web technologies and platforms, we will build them to cross regional and national boundaries. People in one location should be able to view web pages from anywhere that is connected to the web._

Another meaning of “one web” is that “[The web is multi-browser, multi-OS and multi-device](https://www.w3.org/2001/tag/doc/ethical-web-principles/#multi)”:

_We will not create web technologies that encourage the creation of websites that work only in one browser. We expect that content provided by accessing a URL should yield a thematically consistent experience when the user is accessing it from different devices. The constant competition and variety of choices for our users that come from having multiple interoperable implementations means the web ecosystem is constantly improving._

Even if a technology stack needs to support native OS features that are not (yet) in the standard web platform interfaces, it is worthwhile to integrate with as much of the web platform as is feasible. This achieves the benefit of developer skill re-use as well as technology re-use 

We should be aiming for one technology stack which supports the needs of web application developers everywhere and is interoperable across implementations and devices. This is the promise of one web.


# Feedback on MiniApps Design Reviews


### At TPAC 2019, the TAG gave some feedback on the creation of a miniapp activity at W3C, with the intention of ensuring that any such activity would be aligned with other similar work items in W3C, and therefore aligned with this “one web” vision. That feedback is provided as an annex at the bottom of this document. One of the clear pieces of feedback we delivered was that the MiniApps work should work to align with existing web technologies where possible rather than creating new technologies – and we specifically listed the Manifest file as an example of this.


### Context:

The W3C community has learned through years of platform evolution that integrating new technologies and platforms into the web can be very difficult. We have gone through many iterations of attempting to integrate mobile applications with the web platform, starting with XHTML-basic and XHTML/SVG Compound Document Format (CDF) and progressing to Joint Innovation Lab (JIL - a joining venture between Vodafone and China Mobile) and Wholesale Applications Community (WAC). Many of these were developed with W3C technologies or alongside W3C technologies but did not sufficiently integrate with the whole web platform.

At Fukuoka, we specifically talked about the manifest file as one of the points of integration. Our Design Principles document [explicitly states that](https://w3ctag.github.io/design-principles/#extend-manifests) spect developers should not create new types of manifest.


### New feedback

Since this initial feedback, the MiniApp CG has written a number of draft specifications and has recently requested TAG review in 3 areas: Miniapps URL, MiniApps Manifest and Miniapps Lifecycle. We would like to see these documents express use cases and requirements, and offer pointers to other components of the web platform that might be responsive. The TAG advises that Minapps work should build on other web platform specifications that share its needs or technical design, and not diverge from the web platform with a set of parallel web technologies. We therefore recommend that a series of cross-group task forces be created to ensure that the requirements and use cases identified by the MiniApp CG are adequately represented and merged with the relevant web platform specifications. We will also work with the W3C Team and appropriate working group contacts to help ensure that those groups are receptive to these incoming requirements. We strongly feel that the miniapps work should not fork existing web technologies. If any deliverables have been identified by the CG which cannot be mapped onto existing web technologies then there may be scope for opening up a working group, however that group should be chartered with distinct deliverables only for those additional technologies; in other instances, it should coordinate to send requirements, feedback, or potential extensions to the groups where relevant technology is being developed.


### Miniapps Manifest



1. Our position is that canonically for this purpose there should only be one manifest - webapp manifest.
2. The proposed manifest, as specified, is incompatible with the existing manifest but we believe this incompatibility can be fixed.
3. We need to extend the WebApp manifest for features that are necessary for miniapps - this is in line with [our TAG guidance on manifest files.](https://w3ctag.github.io/design-principles/#extend-manifests)
4. A task force between the MiniApp CG and webapps working group should map MiniApps features into WebApp manifest. If this presents issues because of CSP then we need to example what the rationale is for not wanting CSP. If there is a good rationale then it might be necessary to make a modification to the webapp manifest to accommodate this.


### Miniapps URL



1. Inventing a new URI is a really bad idea, we’ve made these mistakes in the past
2. Especially given that this URI is destined to be casted to a web URL
3. At most this should be a templated URL.


### Miniapps Lifecycle



1. This work overlaps with [Page Lifecycle](https://wicg.github.io/page-lifecycle/) in WICG
2. There is also overlap with the PWA lifecycle which is less well defined. Any document which defines the web application lifecycle should encompass both progressive web apps, miniapps and other types of web applications rather than being specific to miniapps.


### Miniapps Packaging

Once again, there is an existing set of work around web packaging which has been developed from the original [Web Packaging](https://www.w3.org/TR/2015/WD-web-packaging-20150115) specification and more recently the [signed exchanges](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html) and bundling work. There is also some new work on [light-weight packaging](https://www.w3.org/TR/lpf/).


### Closing Comments

There are very clear benefits to the web platform and to the future of the miniapp platform through the standardization of miniapps in w3c. This means not only building standards for miniapps using w3c process but also requires existing w3c standards efforts to accommodate miniapps requirements. We have very strong concerns about the current approach. The proposed solutions currently do not seem to have integration points into the common web platform, and many of the proposals heavily overlap with current work that is happening in the organization. It would be an unfortunate outcome that we produce divergent specifications, which by principle is against [the mission and vision we share](https://www.w3.org/2001/tag/doc/evergreen-web/).

While multiple technical proposals are healthy for the advancement of technology, some of the existing standards MiniApps competes with have been extensively reviewed and engineered by multiple entities, and can be considered mature. We would like to see the work happen as part of the web platform, rather than as a parallel web platform.


### Specific Recommendation

* Start discussions between MiniApp CG and WebApps WG to bring Manifest requirements into WebApps to cover MinIApps use cases. **W3C Team** should facilitate.

### Annex: 2019 TPAC TAG Feedback on Miniapps


_The TAG has been asked for feedback on miniapps. If you were in the minitapps session you heard some of my feedback already which reflects the discussions in the TAG._

_There have been multiple efforts to sets of specifications and bring them to W3C for standardization. In many cases these have not integrated well with the web platform as a whole. A technical review from the TAG left us with the impression that the activities for miniapps have the potential risk of repeating these past mistakes. And we would like to help miniapps avoid this. Conversely, the current work on web apps are a good example of how requirements that come from a number of sources can converge on a platform that then becomes widely implemented (webapp manifest and service workers are good examples of this)._

_There have been significant amounts of work we as a web have put in to make it a powerful, secure, private, and user friendly environment. The outcome of this effort includes webapp manifest, permissions, packaging, and many other features which are now in wide use. It would be extremely useful if the miniapps community would bring their requirements and efforts to existing specifications where those exist. We would like to see a path forward where this community actively engages with the rest of the community and become a first-class citizen of the platform, even if it takes more time. These requirements need to be taken seriously by existing parties in W3C in order for this to work. Both parties need to engage._

_A CG or a task force with the WebApps group seem appropriate. It would not be a good idea for there to be a working group with the charter reflecting exclusively the needs of mini-apps because that would create a parallel webapps in w3c that is not part of web architecture. However a new working group for items that are not currently being worked on in w3c may be appropriate - as long as there is a strong connection to webapps and other appropriate group. The TAG commits to help guide this convergence effort._
