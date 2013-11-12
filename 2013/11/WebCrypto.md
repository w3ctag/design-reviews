# Web Crypto Draft Feedback

[Draft under discussion.](https://dvcs.w3.org/hg/webcrypto-api/file/dffe14c6052a/spec/Overview.html)

We extracted the IDL and example code from the draft in question using a snippet run at the developer tool command line:

```js
Array.prototype.slice.call(
  document.querySelectorAll(".idl,.es-code")
).map(function(n) { return n.innerText; }).join("\n\n\n");
```

This is visible in [`WebCyrpto.idl`](WebCrypto.idl) and [`WebCrypto_examples.js`](WebCrypto_examples.js) in the current directory.

## General Discussion

...

## API Hygiene

### ISSUE: ...

## Layering Considerations

...


## Other Considerations

...

## End Notes

...
