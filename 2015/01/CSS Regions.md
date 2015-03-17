# CSS Regions Review

<a href="http://www.w3.org/TR/2014/WD-css-regions-1-20141009/">Draft under discussion</a>

## API Field of Application

### REQUEST: Use Cases

One of the most important questions about a spec is ‘what use cases does it cover’. Unfortunately, CSS Regions spec lacks answer to this question. As we could deduce from <a href="http://www.hongkiat.com/blog/css3-regions/">older</a> <a href="http://webplatform.adobe.com/regions/">articles</a> and <a href="http://webplatform.adobe.com/css-regions-polyfill/examples/index.html">examples</a> the intended usage of CSS Regions is a way far broader than ‘examples’ section of the spec states. We would appreciate some formal or informal description of actual use cases.

### Extensibility

Spec states that ‘Breaking a named flow across a region chain is similar to breaking a document’s content across pages or a multi-column element’s content across column boxes’. So, in fact, CSS Regions broaden existing platform functionality (splitting content into several columns) allowing splitting content into several DOM Elements.

From the Extensible Web point of view such extensive broadening of web platform functionality by creating new high-level APIs isn't the best practice. Better way is defining low-level primitives to implement all three content splitting use-cases (page breaks, multi-column layouts and ‘regioned’ layouts) over it.

We would prefer to have ‘CSS Region’ concept defined in a manner which (a) explain existing phenomena — e.g. allow to talk about multi-columns as a sequence of Regions; (b) provide possibility to manipulate Regions.

We expect that providing low-level primitives will allow complicated flows to be used by developers in a manner they want to, even define high-level named flow sequences as current spec does.

### Polyfills

At its present state the spec is not polyfillable because of abovementioned reasons. <a href="http://webplatform.adobe.com/css-regions-polyfill/">Existing polyfill</a> (a) covers just simpliest cases; (b) does nasty things effectively changing markup and its semantics.

We understand that CSS features are not polyfillable in general, and that CSS Regions require exposing very basical hidden aspects of platform like font properties and box tree rendering. We don't ask editors to solve these tasks on their own, but to join <a href="https://wiki.css-houdini.org/">Houdini effort</a> to provide suggestions what interfaces should be defined to develop a polyfill to CSS Regions.

### ISSUE: Semantic Purity

Though we appreciate group effort to <a href="http://lists.w3.org/Archives/Public/www-style/2014Jan/0456.html">provide guidance on semantic use of named flows</a>, we would prefer to have spec designed in a manner which introduces strict markup semantics. Multi-column layouts don't require developer to specify several content blocks, and CSS Regions should at least provide an option to define regioned layout without content splitting.
