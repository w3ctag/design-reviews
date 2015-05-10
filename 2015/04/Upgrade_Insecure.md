# Upgrade Insecure Requests Draft Feedback

[Draft under discussion.](https://w3c.github.io/webappsec/specs/upgrade/) ([At this revision](https://github.com/w3c/webappsec/tree/f3ef3fb43394d57fa3ff9f93f22f3b057f7551be/specs/upgrade))

## General Discussion

This draft defines a new Content Security Policy header for a page to assert
that subresources and navigations should be automatically upgraded to their secure version. We think this is a great step towards reducing barriers that website publishers
face when transitioning from plaintext HTTP to secure connections.

Most of the issues raised below were very promptly resolved by Mike West.

### ISSUE: Goal 1 Unclear

Section 1.1, Goal 1:

> Authors should be able to ensure that all content requested by a given page
> loads successfully, and securely. Mixed content blocking should not break
> pages as a result of migrating to a secure origin.

This seems somewhat too ambitious for the spec. If third-party content on
a page does not support HTTPS or stops supporting HTTPS, the page author cannot
ensure that the content is loaded securely or at all. Inevitably, moving to
a secure origin causes problems with mixed content blocking if the page has
third party content that doesn't yet support HTTPS, a problem which the spec
does not address.

RESOLVED:
https://github.com/w3c/webappsec/commit/0c0a5f5c0c78016104a1d0ce81a647923387eb9e

### ISSUE: Same-Origin vs Cross-Origin Behavior Unclear in Examples

Talking to other TAG members about the spec, it became apparent that some of us
thought the spec only applied upgrades to same-origin requests. I (Yan) attribute
most of my confusion to the examples in Section 1.2. Example #1 uses the
example of `<img src="http://example.com/image.png">` being upgraded on
`https://example.com` and Example #2 explicitly says that `<a
href="http://not-example.com/">Home</a>` will *not* be upgraded on
`https://example.com`. It would be better if Example #1 explicitly said that
a third-party origin like `not-example.com` is upgradeable in that context, so
that readers don't generalize Example #2 to all requests.

RESOLVED: https://github.com/w3c/webappsec/issues/301

### CLARIFICATION: Wording in Terminology

The wording "depend on the upgrade-insecure-requests mechanism" in Section 2 is
unclear. It seems to mean something like, "the same with and without
upgrade-insecure-requests" from context, but I'm not sure.

RESOLVED:
https://github.com/w3c/webappsec/commit/7deb537c8d855ab561c2adbeca66b4b6d9576c25#diff-917460852b1399c109de636d4062669d

### COMMENT: +1 for Issue #184

https://github.com/w3c/webappsec/issues/184 seems like a good thing for
improving the smoothness of the HTTP to HTTPS transition. I am weakly in favor
of separate whitelists for navigation and subresource requests because it seems
that site operators may want to take less risks with navigation upgrades.

### ISSUE: Need Example for Upgrade Insecure Navigations Set

It would be nice to have an example of a CSP directive with an upgrade insecure
navigations set in the draft.

RESOLVED: https://github.com/w3c/webappsec/issues/295

### ISSUE: Upgrade All Navigations

Is there a way to specify that all navigations should be upgraded? That seems
useful if a webmaster doesn't want to change their header every time they add
a link and are confident all their links will support HTTPS.

PARTIALLY RESOLVED: From talking to Mike West, it seems this might come naturally from Issue #184 without the need for a separate directive to upgrade all navigations.

### ISSUE: Inconsistent Wording in 4.1?

Section 4.1:
> We will not upgrade cross-origin navigational requests, with the exception of
> form submissions

I'm confused now because the document otherwise states that cross-origin
navigational requests will be upgraded if they are in the "upgrade insecure
navigations set" for a context.

PARTIALLY RESOLVED: This will be reworded to "with the exception of form
submissions, and ancestor frames which themselves have opted-into the upgrade
mechanism."

### CLARIFICATION: Violation Reports for Inherited Policy

As mentioned in 6.2, there is a security issue if a document is able to get
violation reports for cross-origin nested documents (iframes, etc.) which
inherit upgrade policy. So if a nested document does not specify its reporting
endpoint, do all reports from the nested document get blocked?

RESOLVED: Yes, reports are not sent.

### IDEA: Cache/Pin Successful Upgrades

Thinking about the broader goal of encrypting the web, it would be nice if
user agents could remember which subresources have been successfully upgraded
through this mechanism. That way, on a page that has not set the CSP header,
the known-upgradeable subresources could be upgraded anyway.

This might be addressible via [CSP Pinning](http://w3c.github.io/webappsec/specs/csp-pinning/). However, CSP Pinning is scoped to a host (modulo include-subdomains), whereas in theory a resource could be safely upgraded on any host once the user agent has noted it is upgradeable. Unfortunately, this would cause non-deterministic behavior with mixed content blocking depending on a user's browsing history.

## End Notes

This draft is a very welcome move towards better handling of mixed content
blocking. However, in its current form, it entirely depends on the *embedding*
site setting the CSP header. It is worth exploring ways for the upgrades to be
even more automatic, such as by auto-upgrading requests that would be blocked
as active mixed content or by pinning known upgradeable resources.
Whether this is within the scope of this draft is up for debate.
