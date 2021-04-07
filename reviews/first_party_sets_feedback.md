# TAG Review Feedback on First Party Sets

This document is written in reference to a TAG [review request](https://github.com/w3ctag/design-reviews/issues/342) for the First Party Sets proposal. It has been reviewed by the TAG and represents a consensus view.

## Origin and the Security Model of the Web

The web's security model is based on origin. Origin - which is built on top of DNS - is a clearly understood world-wide system which underpins the Internet as a whole. It's not perfect, but it works. And lots of web technologies depend on a stable concept of origin in order to make sense and mesh well, particularly when it comes to safeguarding users' security and privacy. 8 out of 18 questions in the security & privacy self-check specifically mention origin and one of the mitigation solutions proposed there is to explicitly limit features to "[first party origins](https://w3ctag.github.io/security-questionnaire/#restrict-to-first-party)". 

The "Security on the Web" TAG draft from 2011 goes over some of the history of how cookies became bound to origin:

> “In order to ensure that a cookie was sent only to the originating domain, the browser needed to be able to determine the domain associated with a document - and thus, the "origin" was born - scheme, host and port defining a unique origin. The same-origin policy states that a document from one unique origin may only load resources from the origin from which the document was loaded.” 
> 
> https://www.w3.org/2001/tag/2011/02/security-web.html

Although the web has moved on in many respects since 2011, it's worth noting that the architectural plank of the origin has remained relatively steady. We, the web standards community, should therefore be especially careful before weakening or loosening how the concept of origin works and how it is applied. If, for example, the proposal were tightening the same-origin restriction on cookies, our concern would primarily be pragmatic—about the compatibility impact of the change—and not architectural.

The First Party Sets proposal has the potential to expand the scope of an origin to cover multiple origins. Given some of the [comments](https://github.com/w3ctag/design-reviews/issues/342#issuecomment-799709089) on our issue, we are concerned that this proposal weakens the concept of origin without considering the full implications of this action.

## Vagueness of Scope

There is a lot of vagueness in the explainer in terms of scope. This vagueness is also aided by the broad name of the spec itself. First Party Sets indicates an intention to group parties together as "first party" in multiple contexts (for example, permissions). However, the scope appears to be limited to cookies (with some language indicating that it may be desirable to expand this scope). This vagueness is alarming because it invites mission creep.

The “Goals” in the explainer notes:

* Allow related domain names to declare themselves as the same first-party.
* Define a framework for browser policy on which declared names will be treated as the same site in privacy mechanisms.

However, the explainer also notes:

> Web platform features should not use first-party sets to make one origin's state directly accessible to another origin in the set. First-party sets should only control when embedded content can access its own state. That is, if a.example and b.example are in the same first-party set, the same-origin policy should still prevent `https://a.example` from accessing `https://b.example`'s IndexedDB databases. However, it may be reasonable to allow a `https://b.example` iframe within `https://a.example` to access the `https://b.example` databases.

The use of the term "privacy mechanism" is concerning as it's already vague. The explainer does not include detailed use cases that can only be solved by related domains declaring themselves as the same first-party, which is also a concern.

We think the proposal would benefit from more well defined scope, including more use case definitions, especially those that benefit the user (articulating user need). If this is about specific privacy mechanism(s), then the proposal should explicitly limit the scope to a list of mechanisms, including in the name of the document itself. Otherwise, the broad and vague scope could lend itself to overreach into unintended areas, with negative consequences for user privacy. For example, [we asked](https://github.com/w3ctag/design-reviews/issues/342#issuecomment-801189542) about whether FPS applies to permissions - the answer given was no, but this is not made clear enough in the document. Expansion of FPS into permissions could lead to unintended privacy issues such as camera access being allowed for participating sites even if the user has not specifically allowed this.

The explainer states that “Information exchange between unrelated sites for ad targeting or conversion measurement” is a non-goal. The use of the term "unrelated" is not well qualified here. Also, this statement implies that serving advertising use cases is consequently a non-goal. However it seems clear, since the scope includes cookies, and cookies are heavily used by advertising networks, that the scope is at least [related to advertising](https://github.com/w3c/web-advertising#ideas-and-proposals-links-outside-this-repo). This should be made clear.

Because same origin policy is such a fundamental part of web architecture, the scope of this proposal should ideally be small and precisely defined with explicit identification of all use cases.

## Governance

The proposed governance model for first party sets involves browser-curated allow lists. This model puts the browser-maker at the center of how information is shared across origins, and introduces another point of variance about how the web can be expected to work across different browsers. This could lead to more application developers targetting specific browsers and writing web apps that only work (or are limited to) those browsers, which is not a desirable outcome. See [the web is multi-browser, multi-OS and multi-device](https://www.w3.org/2001/tag/doc/ethical-web-principles/#multi) and [Support the full range of devices and platforms (Media Independence)](https://w3ctag.github.io/design-principles/#devices-platforms). Furthemore, this would require each organisation which seeks to make use of First Party Sets to ensure their set is accepted into each supporting browser's allow list – the mechanism for which is unclear – and that the browsers would be responsible for vetting whether members of the set are actually part of the same organisation.

The proposers have pointed out that other user agents already have curated allow and block lists and that this proposal only seeks to standardize that. Our view is that these existing implementations are a work-around in the context of limiting third-party cookies and that this pattern should not be uplifted through a standard into the web platform.

The proposers [have](https://github.com/w3ctag/design-reviews/issues/342#issuecomment-799709089) [said](https://github.com/w3ctag/design-reviews/issues/342#issuecomment-801491303) that UA policy (which sets are allowed) should be a separate discussion. However, we note that the question of UA policy is fundamental to how this technology would work in practice, so we question whether you can really separate UA policy from the technical details of how a set is composed.

## Redefining Third Party Cookies

The First Party Sets proprosal is part of a raft of privacy-related proposals from Google which are collectively branded the ["Privacy Sandbox"](https://www.privacysandbox.com/). The TAG notes that there is an ecosystem of privacy-focused organisations, web browsers, privacy-enabling technology companies, industry experts and academics all working on issues related the privacy on the web, and that the topic of web privacy has gained a serious momentum in the mainstream of web users. It's good to see that First Party Sets is among the concrete privacy proposals being discussed as work items in the W3C Privacy Community Group, which can be one forum for focusing the power of this ecosystem.

The "Privacy Sandbox" initiative proposes (among other things) to restrict "third-party cookies", which would align with other browsers and with general industry trends. However, this proposal seeks to redefine what it means to be a third-party cookie. In that context, the efficacy of the "Privacy Sandbox" initiative is thrown into question.

## Web User Agents Put Web Users First

When people use the web they expect the user agent (browser) to not take away their choices due to commercial considerations. As currently designed, First Party Sets could let a user agent or browser approve sites as a set in the interest of those sites or cookie-issuers (like advertisers), rather than in the interest of the user. If a user agent were to have a financial interest in either the sites or cookie issuers, we are concerned that this proposal would leave users at a disadvantage. While we don’t see evidence of this happening right now, this proposal would make that abuse possible. As is outlined in the W3C TAG’s Design Principles, the web should serve users first.

This proposal is concerning because an important role of the user agent is to represent the user, and to protect the user from any malicious activity on the web. This guarantee is written into the TAG's design principles – see [Put user needs first (Priority of Constituencies)](https://www.w3.org/TR/design-principles/#priority-of-constituencies) and [It should be safe to visit a web page](https://www.w3.org/TR/design-principles/#safe-to-browse). The web security model, based on origin, is key to enforcing this guarantee.

Again, the same origin policy keeps users safe even if they do not trust the content provider - or the browser provider.

This proposal potentially undermines that trust model by making additional decisions on the user's behalf which are not auditable by the user.

## Permission & Consent

When a user is intentionally visiting a first party - where the user is intending to interact - the proposed solution to making the user aware of the members of a First Party Set via the browser UI (eg. to put the info on the set in a page info bubble) is not sufficient. Considering that users ignore, or accept without reading, alerts like the EU cookie warning, it's unlikely that this approach could constitute meaningfully informed consent; see [Ask users for meaningful consent when appropriate](https://w3ctag.github.io/design-principles/#consent). Furthermore, the proposal does not propose a way for users to audit or have any insight into how their data being shared with other members of a First Party Set.

This is a departure from how the web has worked for years from a user perspective. It's difficult to imagine that most users will be able to understand how this changes their web experience, making it hard for them to understand what they are consenting to.

## Adding Complexity to the Web

This proposal adds a complex configuration layer to the web - over and above what currently existing systems (e.g. privacy-enabling extensions) require. Does it provide enough value for users or web developers to justify this additional complexity? At this time, the TAG consensus is that there is not sufficient evidence for the need of this technology to warrant the additional complexity.

## Is this Harmful to the Web?

For the reasons outlined here, we consider the First Party Sets proposal harmful to the web in its current form. This proposal undermines the concept of origin, and we see origin as a load-bearing structural pillar of web architecture. There are strong objections by other implementers. See https://github.com/mozilla/standards-positions/issues/350 / [Mozilla standards position](https://mozilla.github.io/standards-positions/#first-party-sets) and [Webkit-dev position](https://lists.webkit.org/pipermail/webkit-dev/2020-May/031222.html). Without strong multi-implementer consensus, we think making such a change to a piece of fundamental web architecture will additionally fragment the web platform.

We believe the pushback from other implementors is a strong message that reinforces our concerns that this proposal can result in detrimental effects to the greater web ecosystem. It is likely that this proposal only benefits powerful, large entities that control both an implementation and services.

Our challenge to the proposers is: can the use cases (the problems you are trying to solve) be addressed in a way that respects the current definition of origin?

## Dependencies on First Party Sets

We note that the TAG have already received one review request for a new web technology with a dependency on First Party Sets: [Same Party Cookies](https://github.com/w3ctag/design-reviews/issues/595). Whilst we encourage layering, we advise caution when advancing new features that depend on First Party Sets at this stage. It would be beneficial to wait until First Party Sets has broader consensus before depending too heavily on it as a foundational layer. It may be worth considering whether these proposals could be decoupled and advanced independently.
