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

The Web Crypto API provides a set of low-level interfaces to block ciphers, hash functions, and use of key material. This review is a follow-up to collaborative work with the Web Crypto WG over the past year, including prototyping of Promise-based APIs and direct engagement regarding API style and idioms.

The API in question is explicitly designed to be low-level. Other drafts are aimed at [higher-level use-cases](https://dvcs.w3.org/hg/webcrypto-highlevel/raw-file/tip/Overview.html). The difficulty in correctly and securely using low-level cryptographic primitives is acknowledged in the API; largely through the addition of the `crypto.subtle.*` family of methods. These primitives allow direct encryption, decryption, signing, and key operations using a family of recommended (but not required) algorithms.

The explicit choice to avoid demanding algorithms or creating a closed set of them is motivated by the reality that the API is likely to survive longer than the algorithms. In the past decade, many weaknesses have been found in previously-considered-secure algorithms and modes, in addition to the reletless increase in available CPU and GPU computation power for the marginal dollar. Further, the advent of quantum computers ensures likely change in algorithm recommendations.

A further challenge exists to secure usage: currently known-insecure algorithms are inputs to beleived-secure modes and composite algorithms. This necessitates exposing beleived-insecure algorithms in a low-level API. Further, it's likely that clients will need to continue to support insecure modes durring transition periods for conent to secure modes. All of this argues in favor of flexibility in the set of algorithms the the spec recommends and which conforming clients implement.

The WG faces considerable challenges in defining scope, particularly around provisioning and ownership of key material. This will become apparent as we discuss what APIs are and aren't made avaialble later on.

## API Hygiene

### ISSUE: ...

## Layering Considerations

Crypto algorithms are "just math". As such, nearly all commonly-used ciphers and modes can be implemented (perhaps inefficiently) in JavaScript. [asm.js](http://asmjs.org/spec/latest/) even brings JavaScript performance into line with other commonly used languages, enabling a straight de-sugaring of the recommended algorithms.

Such a reference-implementation of the recommended algorithms is absent from the Web Cyrpto API. This seems a distinct oversight and something we recommend the WG look at for a next version.

The execution context of algorithm execution is un-specified. This goes hand-in-hand with a lack of constructors/methods for individual algorithms, but points to a larger concern: should users of the API expect that crypto operations are happening in secure memory? If not, are there situations or use-cases that demand these constraints? If so, how can an API consumer know that they're being accomidated or not?

Doing the exercise of defining how crytpo operations actually work seems useful. Options might include specifying new options on Web Workers that would enable the promise-based API to be de-sugared.


## Other Considerations

...

## End Notes

...
