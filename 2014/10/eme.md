# W3C TAG EME Spec Review

[Draft under discussion](https://dvcs.w3.org/hg/html-media/raw-file/tip/encrypted-media/encrypted-media.html)

Above all else, we believe EME should be a web platform API, and embody all that this means. It should not just be an API that exposes existing DRM systems to applications, similarly to how the media capture API is not simply an API that exposes existing webcam drivers to applications, or the Media Source Extensions does not simply expose existing video codecs. As a consequence, it should focus strongly on interoperability and standardized behavior, in the same fashion as all other existing web APIs do.

We understand that the historical way of designing a DRM system has involved requirements that are unlike those of most web APIs, and cause a tension with the usual way specifications are developed openly.  EME has chosen to address this via the idea of a CDM, which encapsulates unspecified behavior necessary for robustness. But just because the CDM’s behavior is undefined, does not mean that EME as a whole becomes a  free-for-all that can ignore how the web platform works.

Our concerns break down into three areas.

## Author-Facing Interoperability Between Key Systems

It should be possible for a single web application to support multiple key systems, without writing code specific to each one, in a similar fashion to a web application supporting multiple video or audio codecs. Like codecs, the details of implementing a given key system may be hidden or proprietary. But this remains an implementation detail from an author-facing perspective. Authors should not care about which key system is in use, and after selecting one, all code they write should be the same no matter which key system was selected.

As a consequence of this, the capabilities of a pre-existing DRM system are not useful for guiding discussion. The goal of EME should be a common-denominator API that can be used to interface with all DRM systems equally.

Although CDMs are necessarily underspecified for robustness reasons, this should not be used as a loophole to drive through vendor-specific behavior. Out-of-band communication (via the CDM or otherwise) should not be possible, nor should vendor-specific extensions or extension points be blessed into the spec. If a vendor is in favor of adding a given capability to EME---perhaps a feature their CDM supports---then they should not do so through a side-channel or extension point of the EME API, but instead through the normal standardization process for web platform features.

In general, given that CDMs are underspecified, their author-facing scope should be normatively limited as much as is possible while still giving the desired robustness guarantees.

## User-Facing Concerns

As part of interoperability, EME should not provide APIs that are designed to allow restriction of content to one platform and/or key system. A content provider may ask for a certain level of robustness and/or hardware support, but not for a concrete platform or CDM provider. The web’s platform-independence is its greatest strength, and EME should not provide a means for either content providers or authors to bypass it. While certain key systems may only be supported on certain platforms, and certain content may only be available with certain key systems, such restrictions should simply be features of the ecosystem and not sanctioned by EME. Similarly, when introducing features to EME (or to any web API), the extent to which they allow platform discrimination should be carefully considered.

As an analogy, different user agents support different cryptographic algorithms for TLS. However, from the perspctive of most users, authors, and server administrators, the exact algorithm used for a given secure connection is unimportant. The procedure of negotiating which algorithm to use is completely hidden, and the high-level API for making secure web requests (viz. `XMLHttpRequest`) does not force authors to consider these details.

We are also deeply concerned about the security and privacy implications of EME. The ability of the CDM to potentially run arbitrary code is a hole in the web platform’s security model. To the extent that privacy-invasive or security-compromising features can be normatively disallowed, EME should do so. To the extent that they cannot be, e.g. for robustness reasons, we should restrict access to those features such that they can only be used from secure origins, so as to make them less accessible to attackers.

Speaking to both of these areas, the way in which the CDM currently provides a potentially-permanent cryptographic identifier to identify the client or user is troubling. It can serve as an unspoofable user-agent string, with all of the attendant risks, and is a glaring privacy hole. Again, if nothing else, this kind of power should not be given to arbitrary coffee-shop attackers, and thus should be limited to secure origins.

Another attack we are concerned about is the possibility of proprietary/encrypted license formats to decieve the user. The user agent should be able to read license the response and present that information to the user.

Finally, we are concerned that encrypted media achieve the same level of accessibility as other media. This is partially a quality-of-implementation concern, but there may be ways the spec could normatively encourage it. Specific examples include ensuring the correct interaction with high-contrast mode and captioning systems.

## Platform Segmentation

We are concerned about segmentation of the platform between different user agents, content providers, and and authors. No existing web API relies upon those using it or implementing it to negotiate business deals, and we would prefer that EME is no different. To meet the normal bar for a web platform API:

- Independent content providers should be able to use EME to protect their content just as easily as large media companies.
- New browser vendors should be able to add EME support to their browser based on open standards, without needing to license technology. This should ideally be possible both for new desktop browsers and for new mobile browsers or new devices.
- New key systems should be able to join the EME ecosystem by implementing an open standard.
- Content providers should be able to implement and interface with multiple key systems via the same code, without dealing with inconsistency in feature sets or behaviors.

## Security

Although this is tangential to our technical review, we are concerned about the way that DRM systems are protected by anti-circumvention laws, which prohibit probing and penetration testing of DRM features. This principle impose considerable risks on web security specialists, and upon users in having to accept APIs that recieve less than the usual level of scrutiny. We do not expect the specification or implementers to solve this, but we have reached out to the Advisory Board to discuss ways the TAG and AB can collaborate to solve this problem, which is both technical and legal in nature.

## Closing Words

We recognize that many of our concerns are in conflict with conventional DRM systems. However, we are hopeful that they are not in conflict with EME, as an API that desires to bring DRM to the web platform. That is, we recognize that resolving them might not be possible as-is, but we still see them as goals to strive for.

The benefits of EME to content providers, user agents, and authors are clear: it allows a plug-in free way of distributing protected content, to the wide audience of web users. But like all other APIs that allow us to reach web users, that reach comes at a cost: the API must be interoperable, open, and both platform-independent and content-provider independent. Any DRM system that wants to be part of the open web platform needs to play by these rules, and the fact that existing solutions deployed on the web (e.g. NPAPI plugins) fail to do so is not an excuse for EME to hide behind.
