# HTTP 209

*This is an unofficial draft review, written by Jeni Tennison after discussion at the W3C TAG April 2014 F2F, of "[The Hypertext Transfer Protocol (HTTP) Status Code 209 (Contents of Related)](http://www.w3.org/2014/02/2xx/draft-prudhommeaux-http-status-209)" draft.*

## Overview

The proposed `2NN Contents of Related` status code indicates that the server is providing a representation of a related resource rather than a representation of the requested resource. It can be described as a shorthand of a `303 See Other` response followed by a `200 OK` response on the redirection target.

The main advantages of introducing this status code are:

  * that it avoids at least one additional HTTP request and response, reducing latency
  * that it retains the original URL in the browser bar

## Suggested Improvements

1. The current draft is sadly not visible in some browsers (notably Chrome). While not a bug with the draft, we recommend providing an HTML version of the draft, rather than relying on XML+XSLT, to increase its general accessibility.

1. The current draft states that the status code is `209`. The [HTTPbis specification states](http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-26#section-8.2)

    > Proposals for new status codes that are not yet widely deployed ought
   to avoid allocating a specific number for the code until there is
   clear consensus that it will be registered; instead, early drafts can
   use a notation such as "4NN", or "3N0" .. "3N9", to indicate the
   class of the proposed status code(s) without consuming a number
   prematurely.

    We suggest that this convention is followed in the draft to avoid premature implementation.

1. The current draft states that a `2NN Contents of Related` response should use a `Location` header to indicate the location of the related resource for which the contents are being provided. We think it would be better to use the `Content-Location` header for this purpose. The `Location` header is used for redirection whereas the `Content-Location` header is used to indicate a location that would provide the entity body provided in the response, which is the correct semantics in this case.

1. We have discussed another use case, not mentioned by the current draft, that we think fits into the general pattern supported by `2NN Contents of Related`, namely the use of packages of content. When a web application is requested, we think it would be useful for a `2NN Contents of Related` response to be able to point to a packaged version of that web application. For example, a request for `http://app.example.com/` would respond with a `2NN Contents of Related` whose content was a package including the HTML, images, CSS, Javascript and data for the web application. We are currently working on defining this behaviour, and would like to ensure that there is consistency in approach across that definition and the definition of the behaviour of `2NN Contents of Related`.

1. Regarding the interpretation of the HTTP headers in the `2NN Contents of Related` response, the specification of the `2NN Contents of Related` status code should make clear how the HTTP headers are interpreted. We recommend that they are interpreted as specified in the HTTPbis Internet Draft and related specifications, so that these do not have to be changed. For some headers this entails that they relate to the effective request URL. (This includes, for example, the default context IRI for the `Link` header as specified in [RFC 5988](http://tools.ietf.org/html/rfc5988#section-5.2).) Other headers, specifically those that provide [representation metadata](http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-26#section-3.1), obviously relate to the content. It would be good to make this explicit, possibly with an example, in particular with respect to caching and the interpretation of `Link` headers.

1. Given that the response's content is that of a related resource, it would be good to include a recommendation that the response headers include a `Link` header that indicates the relationship between the resource at the effective request URL (which is the default context IRI for the `Link` header) and the resource at the related URL (ie that given in the `Content-Location` header). For example, if the representation provided is one that *describes* the resource at the effective request URL, then the response might look like:

        HTTP/1.1 2NN Contents of Related
        Content-Location: http://example.com/meta
        Link: <http://example.com/meta>; rel=describedby

1. Regarding caching the provided content against the related URL, the [definition of `Content-Location` in HTTPbis](http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-26#section-3.1.4.2) says (our emphasis):

    > If Content-Location is included in a 2xx (Successful) response message and its field-value refers to a URI that differs from the effective request URI, then the origin server claims that the URI is an identifier for a different resource corresponding to the enclosed representation.  **Such a claim can only be trusted if both identifiers share the same resource owner, which cannot be programmatically determined via HTTP.**

    Whether or not the `Content-Location` header is used, the same argument about the cachability of the content at the related URL applies here. There is no viable scope (eg same-origin) that in fact guarantees that the effective request URL has the same resource owner as the related URL. Therefore we do not think it is advisable to extend the caching semantics to include the caching of the response content to be associated with the related URL. As well as being a security risk, it would be inappropriate to apply the same cache-controlling HTTP headers to both cache entries, and there is no mechanism to separate those headers.
    
    We do not think that the lack of cachability of the response associated with the `Content-Location` URL undermines the value of a `2NN Contents of Related` status code.

1. The current draft for `2NN Contents of Related` says:

    > However, some conventional clients may not be specifically programmed to accept content accompanying a 2xx response other than 200. Therefore, initial use of status code 2NN will be restricted to cases where the server has sufficient confidence in the clients understanding the new code.
    
    We do not think it is a good idea for servers to guess about whether clients can understand a `2NN Contents of Related` response. We think it would be better for servers to only respond with a `2NN Contents of Related` if the client has explicitly indicated that it can accept a related response.
    
    We therefore suggest, alongside the definition of the `2NN Contents of Related` status code, also defining an `Accept-Related` header that enables clients to indicate which relations they are prepared to accept. For example, a client that understood how to properly handle `describedby` and `provenance` related content might use:
    
        Accept-Related: describedby, provenance
    
    The server could use this to determine whether it should respond with a `2NN Contents of Related` response or a `303 See Other` response, using the other `Accept-*` headers to perform other types of content negotiation (around formats and languages) as usual. We note that this should be specified with attention to the [HTTPbis specification's requirements for new HTTP headers](http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-26#section-8.3.1).

1. It would be useful to explicitly state, at some point in the draft, how the `2NN Contents of Related` response applies in the context of different HTTP methods.

1. We note that the references into HTTPbis are pointing to old versions of the Internet Drafts, and it would be a good idea to point to the most recent versions and update the text accordingly.

## Other Notes

### Should this be a new status code?

We discussed whether it is appropriate to introduce a new status code for this behaviour. We are in agreement that there should be a high bar for the creation of new HTTP status codes, and that other mechanisms, such as headers, may be an appropriate alternative in some cases.

We do think that `2NN Contents of Related` is semantically distinct from `200 OK`, where a `GET` on the URL is defined as:

    GET  a representation of the target resource
    
which is plainly not the case here. We also think that `2NN Contents of Related` satisfies the conditions described for new status codes in [the HTTPbis messaging semantics Internet Draft](http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-26#section-8.2), namely:

  * it is potentially applicable to any type of resource, as any type of resource can be related to other resources in any type of way
  * it falls under an existing category for HTTP responses
  * it allows for a payload

However, our opinion was that if the `2NN Contents of Related` response could be interpreted as a `200 OK` without consequence, then there was no need for the separate status code. The statement in the draft that this was an acceptable fallback therefore caused us to question its requirement.

This is the underlying reason for suggesting the definition of an `Accept-Related` header to flag to the server that a `2NN Contents of Related` response will be correctly understood by the client, avoiding the situation where such a response is incorrectly interpreted as a `200 OK`.

### Should this be a 3NN status code?

We discussed whether a `3NN Contents of Related` response with a `Location` header providing the related URL would be more appropriate than a `2NN Contents of Related` response with a `Content-Location` header. This would cause fallback to `300 Multiple Choices` which would give a more appropriate fallback behaviour than `200 OK` (ie displaying the content of the response and potentially redirecting to the related URL).

This option is moot if our recommendation to use an `Accept-Related` header is followed. We note it purely in case there are unforeseen consequences and objections to introducing that header.

### Shouldn't people just link to the related URL directly?

We note [Mark Nottingham's point](http://lists.w3.org/Archives/Public/www-tag/2014Mar/0021.html), specifically in the context of a paging scenario, that websites may/should link to the first page of a listing rather than to a URL for "the entire list" that then needs to be distinguished from "the first page".

We note that in practice, GitHub (as used in the example given in the email referenced above) links to "the entire list" of issues, eg:

    https://github.com/w3c/web-platform-tests/issues

which in fact provides the content for only a filtered version of the first page of issues, which is also available at:

    https://github.com/w3c/web-platform-tests/issues?page=1&state=open

This appears to be common practice on the web for the pagination scenario. It is usual in Atom, for example, for the URL for a "logical feed" (in [RFC 5005 terminology](https://tools.ietf.org/html/rfc5005#section-1.2)) be the same as the URL for the "current" feed document.

So we do not agree that people do or should point to the first page of a longer listing within their web pages.

### Can't you just use a `200 OK` response with a `Content-Location` header?

In the [same email](http://lists.w3.org/Archives/Public/www-tag/2014Mar/0021.html), Mark Nottingham also discusses simply providing a `200 OK` response with a `Content-Location` header. We agree with Mark that in a paging scenario we would usually expect a request like:

    GET /w3c/web-platform-tests/issues HTTP/1.1
    Host: github.com

to have a response like:

    HTTP/1.1 200 OK
    Content-Location: /w3c/web-platform-tests/issues?page=1&state=open
    Link: </w3c/web-platform-tests/issues?page=1&state=open>; rel=first

(We note that `rel=first` does not have the correct semantics for "the first page of this collection" as it is [defined in RFC 5005](https://tools.ietf.org/html/rfc5005#section-3) as "A URI that refers to the furthest preceding document in a series of documents." but we are not aware of a more appropriate link relation between a collection and the first page of a collection.)

We think this is acceptable practice because the `200 OK` response is providing "a representation of the target resource". It is common for representations of a target resource to be partial representations &mdash; to not include all the properties of the resource that could possibly be included &mdash; so this pattern seems both semantically acceptable and common practice.

However, this line of argument does not diminish the value of the `2NN Contents of Related` in other cases, where the provided content is not a partial representation of the requested resource. In particular, the same argument does not apply when the relationship is `rel=describedby` or our soon-to-be-proposed `rel=package`, where (as discussed above) the `200 OK` semantic is not applicable.

### Can't you just wait for HTTP/2?

A final point that Mark makes in [his email](http://lists.w3.org/Archives/Public/www-tag/2014Mar/0021.html) is that if the sole reason for `2NN Contents of Related` is to reduce the number of round trips for performance reasons, then HTTP/2 Server Push satisfies that requirement.

We agree that HTTP/2 Server Push addresses the same issues. However, we are not convinced that HTTP/2 will see widespread adoption in the long tail of websites. HTTP/2 Server Push will remain outside the reach of many publishers for a long time.

We accept that the ability to change an HTTP status code is similarly outside the reach of many publishers, but we think it is more attainable, in both the short and medium term, than using HTTP/2. In particular we note that there exists a community of developers of Linked Data Platform servers and clients who could implement and take advantage of this status code quickly.

As a general point, we would encourage developers of web-application-level protocols that operate over HTTP (such as the Linked Data Platform) to provide mechanisms that enable the protocol to operate in environments where publishers cannot change HTTP status codes or HTTP headers (such as publication through GitHub Pages or on a locked-down Apache server).