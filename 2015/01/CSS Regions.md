# CSS Regions Review

<a href="http://www.w3.org/TR/2014/WD-css-regions-1-20141009/">Draft under discussion</a>

## General Comments

The TAG is aware of, and a supporter of, the [Houdini efforts](https://wiki.css-houdini.org/) and wants to emphasise that the feedback here is meant to help clarify that work and is not meant as critique of the Regions effort in particular.

Instead, we'd like to emphasize that the Houdini effort should have explaining how Regions works as a goal. That is to say, a strong test of Houdini's efforts should be the ability to polyfill Regions using JS/CSSOM + Houdini deliverables in an efficient way. Current polyfills pay an enormous runtime tax. Houdini should make it possible to implement Regions with high fidelity and low overhead.

### Polyfills

At its present state the spec is not polyfillable because of abovementioned reasons. <a href="http://webplatform.adobe.com/css-regions-polyfill/">Existing polyfill</a> (a) covers just simpliest cases; (b) does nasty things effectively changing markup and its semantics.

We understand that CSS features are not polyfillable in general, and that CSS Regions require exposing aspects of platform like font properties and box tree rendering. We don't ask editors to solve these tasks on their own, but to join <a href="https://wiki.css-houdini.org/">Houdini effort</a> to provide suggestions what interfaces should be defined to develop a polyfill to CSS Regions.

As the Houdini efforts become more real, we'd like to see the maintainers of the Regions spec and the Houdini engineers work towards a consensus about how each Regions feature can be efficiently implemented in terms of lower-level primitives. In fact, this is an area that we'd like to follow up with both groups about.

Areas that seem necessary to extend the system include:

 - Sytactic extension of CSS; custom properties and efficient notification of CSS changes seem a must
 - The ability to know a pass of layout has completed and react to overflow by generating boxes and requesting more layout is a must
 - Outlining the data structures for the overflowed ranges (for breaking purposes)
 - An ability to do efficient line breaking

### REQUEST: Use Cases

One of the most important questions about a spec is ‘what use cases does it cover’. Unfortunately, CSS Regions spec lacks answer to this question. As we could deduce from <a href="http://www.hongkiat.com/blog/css3-regions/">older</a> <a href="http://webplatform.adobe.com/regions/">articles</a> and <a href="http://webplatform.adobe.com/css-regions-polyfill/examples/index.html">examples</a> the intended usage of CSS Regions is a way far broader than ‘examples’ section of the spec states. We would appreciate some formal or informal description of actual use cases.
