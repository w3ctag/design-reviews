# TAG Review Feedback for File URI Spec (Work in Progress)

Version under review:
https://tools.ietf.org/html/draft-ietf-appsawg-file-scheme-02

## General comments

There hasn’t been – to this point – a document that describes how the `file://` scheme works, and for that reason this is a good document. We are glad to see that the document specifies how to convert between file URIs and OS-dependent system filepaths.

### Limitations

Regarding the use of `file://` URIs on the web, there are a few issues that
need to be resolved for interoperability:

1. How does `file://` fit into the web's origin model?
2. How does retrieval of file URIs fit into
   [Fetch](https://fetch.spec.whatwg.org/)?

This document does not address any of these issues, so we hope to see future
work that does.
