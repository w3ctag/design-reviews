# Quota Management API Review

[Draft under discussion](https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html) — 2014-02-04 version

In our view, this specification does not meet its goals or satisfy any compelling use cases. The overall model proposed is underspecified with regard to current storage models, and does not provide appropriate future extensibility. Furthermore, it continues down the path of infobar fatigue, which we want to avoid.

## The Overall Model

The model presented here is an incremental evolution of the platform's existing capabilities, but is not a forward-thinking way to deal with the platform's storage APIs, and does not even provide that much value for those that already exist.

For example, the distinction between "temporary" and "persistent" is underspecified. What is the actionable difference between temporary and persistent storage? Can apps rely on persistent storage being there forever, no matter how much space they use up? How ephemeral is temporary storage—could it be evicted at any time, without warning? Besides which, the only possibly-persistent storage on the platform currently is the filesystem API, which is only implemented in one browser engine. It seems strange that there's no way for an app to say "this IndexedDB database is really important." As a consequence, this distinction isn't useful to web authors.

The current model provides ways to query the total amount of space used, in aggregate, by each storage type—but no way of knowing how much space the app is using on any given data. What happens if an app is denied access to more storage? As-is, it must simply guess at what items are most profitable to delete, in order to free up space, and then try again. And there's no way to know how much space something will take up before storing it. In summary, the ability to make decisions about what to store and what to delete must be largely based on trial and error.

The idea of requesting more storage is yet another example of "infobar fatigue," asking users questions which they may not be able to answer intelligently. Boris Smus describes this problem in his post, ["Installable Webapps: Extend the Sandbox"](http://smus.com/installable-webapps/). Modern specifications need to empower the user agent to make more intelligent decisions on behalf of the user, but this specification's model of simply requesting more space almost inevitably requires infobars or similar UI.

## Proposed Use Cases, Requirements, and Constraints

Given the above critique, we can ask, what are the base-level assumptions that a quota management API should be considering? Some are implicit in the current spec which might not be the most accurate; the above feedback, coming from a different direction, contains a few others.

We'd love to work with the editors on identifying these in detail to help drive future revisions of the API. Off the cuff, a few come to mind:

- **Use case**: React to space pressure in the environment to delete caches or other unnecessary data
- **Use case**: Ensure enough space will be available to store the result of a potentially-expensive computation or download, before performing that computation or download
- **Requirement**: Be able to measure the space taken up by various storage artifacts
- **Requirement**: Allow applications to choose the relative importance of keeping storage artifacts without regard for their storage medium (i.e. allow keeping important data in IndexedDB or unimportant caches in the filesystem)
- **Requirement**: Give apps enough information to notify the user about evicted storage artifacts (e.g. removing the "downloaded" checkmark from a video that was removed in response to space pressure)
- **Constraint**: Minimize user interaction ("infobars") except when unavoidable, e.g. for resolving a conflict between space pressure and an app's desire to keep a certain storage artifact inviolate
- **Constraint**: Any APIs specified must be flexible enough that it is clear how to extend them to future storage types, e.g. ServiceWorker caches

## Idiomatic JavaScript Critiques

Although we recognize that the above discussion of the overall model might make much of the below obsolete, we hope this can still be useful feedback for how to build more idiomatic JavaScript APIs.

### Promises should be rejected with `Error` instances

As per our [guidance on writing promise-using specifications](https://github.com/w3ctag/promises-guide), promises should always be rejected with objects that are `instanceof Error`. Notably, `DOMError` does *not* meet this criterion, whereas `DOMException` does.

### Time intervals should be in milliseconds, not seconds

The `StorageWatcher`'s `rate` parameter is currently given in seconds, but most times in JavaScript—as seen e.g. in `setTimeout`, `setInterval`, or `Date.now()`—are represented in milliseconds.

### `supportedTypes` should be a frozen array

The specification doesn't make it precisely clear, but we assume that `supportedTypes` cannot change during runtime. If that is the case, it should be represented as a *frozen array object*. (Furthermore, it should be the same frozen array object each time, so that `navigator.storageQuota.supportedTypes === navigator.storageQuota.supportedTypes`.) In JavaScript, the most idiomatic representation would be as

```js
Object.defineProperty(navigator.storageQuota, "supportedTypes", {
    configurable: true,
    value: Object.freeze(["temporary", "persistent"])
});
```

Note here that `navigator.storageQuota.supportedTypes` is a non-writable data property. WebIDL does not allow expressing such things, so at the cost of some idiomaticness, it would have to probably be a getter:

```js
var supportedTypes = Object.freeze(["temporary", "persistent"]);
Object.defineProperty(navigator.storageQuota, "supportedTypes", {
    configurable: true,
    get: function () { return supportedTypes; }
});
```

which, using the terminology of [bug 23682](https://www.w3.org/Bugs/Public/show_bug.cgi?id=23682), translates to the WebIDL of

```webidl
[SameObject] readonly attribute frozen array<StorageType> supportedTypes;
```

### Use dictionaries instead of non-constructible classes

`StorageInfo` is specified as a `[NoInterfaceObject]` class (WebIDL "interface"), with no constructor. The idea of a constructor-less class in JavaScript is fairly nonsensical (in JS a class is literally the same thing as a constructor). In this particular case, it makes no sense for `StorageInfo` to be a class, with the `StorageInfo.prototype` that comes along with it, containing the two getters `usage` and `quota`.

In JavaScript, we would instead represent such an object as simply an object literal, e.g. `{ usage: 5, quota: 10 }`. This is not an instance of any class, and especially not of a non-constructible one that somehow springs into life without ever being `new`ed. It has `Object.prototype` as its prototype, and has no getters, simply properties. In WebIDL, this would be represented with a dictionary type:

```webidl
dictionary StorageInfo {
    unsigned long long usage;
    unsigned long long quota;
}
```

### Don't use non-constructible classes as namespaces

This is essentially the same issue as the previous one, but in this case we are discussing `StorageQuota`. Again, `navigator.storageQuota` has somehow sprung into being as the only instance of a class `StorageQuota`, which it is not possible to actually construct an instance of since it has no constructor. In JavaScript, you would set up `navigator.storageQuota` as a simple "namespace object," again with no specially-crafted prototype chain, simply though something like

```js
navigator.storageQuota = {
    supportedTypes: Object.freeze(["temporary", "persistent"]),
    queryInfo: function (type) { ... },
    requestPersistentQuota: function (newQuota) { ... }
};

// Now correct the access modifiers
Object.defineProperties(navigator.storageQuota, {
    supportedTypes: { writable: false },
    queryInfo: { enumerable: false },
    requestPersistentQuota: { enumerable: false }
});
```

I think that a WebIDL dictionary would probably again be the best way to express this in that language.
