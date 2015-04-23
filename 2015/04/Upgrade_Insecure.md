# Upgrade Insecure Requests Draft Feedback

[Draft under discussion.](https://w3c.github.io/webappsec/specs/upgrade/) ([At this revision](https://github.com/w3c/webappsec/tree/f3ef3fb43394d57fa3ff9f93f22f3b057f7551be/specs/upgrade))

## General Discussion

This draft defines a new Content Security Policy header for a page to assert
that subresources should be automatically upgraded to their secure version. We
think this is a great step towards reducing barriers that website publishers
face when transitioning from plaintext HTTP to secure connections.

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

### ISSUE: Same-Origin vs Cross-Origin Behavior Unclear in Examples

Talking to other TAG members about the spec, it became apparent that some of us
thought the spec only applied upgrades to same-origin requests. I attribute
most of my confusion to the examples in Section 1.2. Example #1 uses the
example of `<img src="http://example.com/image.png">` being upgraded on
`https://example.com` and Example #2 explicitly says that `<a
href="http://not-example.com/">Home</a>` will *not* be upgraded on
`https://example.com`. It would be better if Example #1 explicitly said that
a third-party origin like `not-example.com` is upgradeable in that context, so
that readers don't generalize Example #2 to all requests.

### CLARIFICATION: Wording in Terminology

The wording "depend on the upgrade-insecure-requests mechanism" in Section 2 is
unclear. It seems to mean something like, "the same with and without
upgrade-insecure-requests" from context, but I'm not sure.

### COMMENT: +1 for Issue #184

https://github.com/w3c/webappsec/issues/184 seems like a good thing for
improving the smoothness of the HTTP to HTTPS transition.

### ISSUE: Need Example for Upgrade Insecure Navigations Set

It would be nice to have an example of a CSP directive with an upgrade insecure
navigations set in the draft.

### ISSUE: Upgrade All Navigations

Is there a way to specify that all navigations should be upgraded? That seems
useful if a webmaster doesn't want to change their header every time they add
a link and are confident all their links will support HTTPS.

### ISSUE: Inconsistent Wording in 4.1?

Section 4.1:
> We will not upgrade cross-origin navigational requests, with the exception of
> form submissions

I'm confused now because the document otherwise states that cross-origin
navigational requests will be upgraded if they are in the "upgrade insecure
navigations set" for a context.

### CLARIFICATION: Violation Reports for Inherited Policy

As mentioned in 6.2, there is a security issue if a document is able to get
violation reports for cross-origin nested documents (iframes, etc.) which
inherit upgrade policy. So if a nested document does not specify its reporting
endpoint, do all reports from the nested document get blocked?

### IDEA: Cache/Pin Successful Upgrades

Thinking about the broader goal of encrypting the web, it would be nice if
user agents could remember which subresources have been successfully upgraded
through this mechanism. That way, on a page that has not set the CSP header,
the known-upgradeable subresources could be upgraded anyway.

### IDEA: Allow Sites to Signal That They Are Upgradeable Resources

One downside of fetch (and Firefox/Chrome's implementation of mixed content
blocking) is that HSTS is applied after mixed content blocking has happened. So
sites that are known to support HTTPS are *still* blocked.

This spec allows a site to indicate that its subresouces should be upgraded.
However, there is still no way for a site to say, "Upgrade me when I am
a subresource, because I know I support HTTPS."

## End Notes

This draft is a very welcome move towards better handling of mixed content
blocking. However, in its current form, it entirely depends on the *embedding*
site setting the CSP header. We would like to see ways for the *embedded* sites
to assert that they must be upgraded and explore allowing user agents to
remember which sites have been successfully upgraded for future reference.
Whether this is within the scope of this draft is up for debate.
