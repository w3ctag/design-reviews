= CSS Regions Review

<a href="http://www.w3.org/TR/2014/WD-css-regions-1-20141009/">Draft under discussion</a>

== API Field of Application

REQUEST: Use Cases

One of the most important questions about a spec is ‘what use cases does it cover’. CSS Regions spec definitely lacks answer to this question. As we could deduce from <a href="http://www.hongkiat.com/blog/css3-regions/">older</a> <a href="http://webplatform.adobe.com/regions/">articles</a> and <a href="http://webplatform.adobe.com/css-regions-polyfill/examples/index.html">examples</a> the intended usage of CSS Regions is a way far broader than ‘examples’ section of the spec states. We would appreciate some formal or informal description of actual use cases.

ISSUE: Extensibility

Spec states that ‘Breaking a named flow across a region chain is similar to breaking a document’s content across pages or a multi-column element’s content across column boxes’. So, in fact, CSS Regions broaden existing platform functionality (splitting content into several columns) allowing splitting content into several DOM Elements.

From the Extensible Web point of view such extensive broadening of web platform functionality by creating new high-level APIs is undesirable. Better way is defining low-level primitives to implement all three content splitting use-cases (page breaks, multi-column layouts and ‘regioned’ layouts) over it. In other words, explaining some unexposed platform magic (how content is breaking) would provide a lot of useful capabilities — making custom flows being one of them.

Our recommendation here is to think about low-level API to explain existing magical behavior, not to add another one.

ISSUE: Polyfills

At its present state the spec is not polyfillable because of abovementioned reasons. <a href="http://webplatform.adobe.com/css-regions-polyfill/">Existing polyfill</a>, in fact, covers just simpliest cases and is not applicable to any layout more complex then just a mix of paragraphs and images.

Since there is no obvious way to have ‘regioned’ layout perform well if CSS Regions functionality is absent, we highly recommend to redesign the spec in a polyfillable manner.

ISSUE: Semantic Purity

One of the major driving forces behind HTML5 development was a desire to keep HTML code as semantically clean as possible. CSS Regions effectively break this principle. In a CSS Regions terminology now ‘named flow’, not elements it comprises, is a semantic unit. Furthermore, elements of the flow now indicate position on page, not a meaning of content.

We would prefer to have this functionality designed in a manner that HTML code does not reflect page layout at eny extent.
