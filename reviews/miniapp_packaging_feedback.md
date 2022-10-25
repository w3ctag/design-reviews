# MiniApp TAG Feedback Doc - 29 September 2022

## Background

In July 2020, the W3C TAG issued [a statement](https://github.com/w3ctag/design-reviews/blob/main/reviews/miniapps_feedback.md) regarding 3 TAG reviews submitted by the W3C MiniApp community. These were [MiniApp URI Scheme](https://github.com/w3ctag/design-reviews/issues/478), [MiniApp Manifest](https://github.com/w3ctag/design-reviews/issues/524) and [MiniApp LifeCycle](https://github.com/w3ctag/design-reviews/issues/523).  The TAG issued feedback on all three of these reviews and feedback on URI Scheme and Manifest resulted in substantive changes to those specifications which allowed us to close those reviews with a positive outcome. We were pleased to see MiniApp proposals converging with other W3C work in these areas - which serves the goal of building “one web”.

The TAG's review feedback on the Lifecycle document hasn't yet been similarly actioned. And more recently we have received a review request for MiniApp Packaging which fits together with Lifecycle in that they both specify how a (web) MiniApp is brought to a device, installed and run by the end user.

The TAG's view is that the web security model helps to underpin a safe and secure platform for all web users, including safeguarding user privacy and attacks by bad actors.  As the web becomes ubiquitous in people's lives, and as the number of APIs and features of the web increases the surface area of attack, these attacks and threats are on an increase.  

As a recent example, we would like to draw the MiniApp community's attention to recent discussions around the security model of apps embedding a webview component, like [Inject custom JS scripts](https://github.com/WebView-CG/usage-and-challenges/issues/36) and [Apps can use WebViews to bypass web security standards, privacy standards, and user choice](https://github.com/WebView-CG/usage-and-challenges/issues/36) that are happening in the WebView Community Group. 

The web security model is based on the concept of origin, which is a key architectural plank of the web.  As the web becomes more powerful, it has become increasingly important for these powerful features to operate in a secure context - that is, delivered over `https` with a clear crypographic chain of provenance (the certificate authority chain).  Any web packaging solution must therefore preserve mechanisms of origin and secure context so that from the web application's perspective it is operating in a trusted environment.

Furthermore the TAG has concerns regarding the efficiency of the zip format for this use.

The TAG notes that the work on [HTTP signed exchanges](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html) and [web bundles](https://wicg.github.io/webpackage/draft-yasskin-wpack-bundled-exchanges.html) provide one approach which is currently being worked on [in the WICG community group](https://github.com/WICG/webpackage). The TAG has [positively reviewed](https://github.com/w3ctag/design-reviews/issues/235) this work earlier in its lifecycle and we would encourage the miniapp group to engage here to see if bundles could provide an alternative to the proposed solution which addresses the issues described above.

## Proposal

Specific recommendation: Miniapp community should examine making use of a packaging solution that preserves the origin model. Regarding lifecycle: miniapp apps should operate within that security model as well, preserving all the security benefits of the web while also enabling the use cases that the miniapp community envisions.  Bundling & signed exchanges provide a promising path towards this outcome. There may be other solutions in the market which can also play this role.

## References:
* [Minutes from discussion with Fuqiao](https://github.com/w3ctag/meetings/blob/gh-pages/2022/telcons/08-29-minutes.md#second-half--mini-app-discussion-with-guests-1)
* [Lifecycle](https://github.com/w3ctag/design-reviews/issues/523)
* [Packaging](https://github.com/w3ctag/design-reviews/issues/762)
* [2020 Miniapp feedback](https://github.com/w3ctag/design-reviews/blob/main/reviews/miniapps_feedback.md)
