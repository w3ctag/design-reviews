# Quota Management API Review

[Draft under discussion](https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html) — 2014-02-04 version

In general this is a nice specification: simple, largely idiomatic, and easy to read and use. We have two categories of feedback: one on the overall model, and one on some minor ways in which the API could be more idiomatic to JavaScript.

## The Overall Model

We're concerned that the model presented here, while a natural evolution of the platform's existing capabilities, is not a forward-thinking way to deal with the platform's storage APIs.

For example, the distinction between "temporary" and "persistent" is not very useful, as it stands. What is the actionable difference between temporary and persistent storage? Can apps rely on persistent storage being there forever, no matter how much space they use up? How ephemeral is temporary storage—could it be evicted at any time, without warning? Besides which, the only possibly-persistent storage on the platform currently is the filesystem API, which is only implemented in one browser engine. It seems strange that there's no way for an app to say "this IndexedDB database is really important."

The current model provides ways to query the total amount of space used, in aggregate, by each storage type—but no way of knowing how much space the app is using on any given data. What happens if an app is denied access to more storage? As-is, it must simply guess at what items are most profitable to delete, in order to free up space.

The idea of requesting more storage is yet another example of "infobar fatigue," asking users questions which they may not be able to answer intelligently.

### A Proposal

One model which might serve better would be something like the following.

Instead of apps asking for space, they are able to take up as much space as they want. However, when the user agent starts feeling space pressure, it can start the process of "evicting" storage from applications.

When a user agent begins evicting storage from an application, it sends an event to the application—probably to its [Service Worker](https://github.com/slightlyoff/ServiceWorker), since that will be able to be run independently of the app's "tab" being open. This **eviction event** tells the application how much space the user agent is demanding be reclaimed.

It is then the application's job to intelligently prioritize and decide how to free up that much space. If it cannot do so, then the user agent is within rights to start removing storage until the desired amount of space is freed up.

To make this work, **new APIs will be necessary for determining how much space storage takes**. Without such APIs, an application cannot be expected to make decisions about which storages to remove when an eviction event comes up. Reviewing the list of storages currently encompassed by the Quota Management API, IndexedDB is probably the most important to provide this for, since it is the only cross-platform API besides Application Cache, which is not scriptable. Service worker's various caches will also likely want such features.

### Features of this Proposal

We believe this proposal is general and flexible enough to encompass the needs of web storage management, by allowing user agents to manage the details of eviction events. Most obviously, a user agent could respond to OS-level space pressure. But also, for example, if an application is rapidly filling up the hard disk, an eviction event can be fired before the write successfully completes, demanding that some of the filled-up space be given back immediately, and suspending all future writes until that eviction event is resolved.

The order in which a user agent evicts storage from applications can be left up to the user agent as well. For example, "bookmarked" or "kept" applications could be told to evict storage last, only after apps that the user visited once two years ago are told to do their eviction. Frequently-visited, but non-bookmarked, applications could then be somewhere in the middle. If enough bookmarked applications are occupying storage, the user could even be presented with a choice as to which of them should be prioritized for eviction. The key thing is that, through this eviction event idea, the interface presented to each application is the same. Applications can be coded flexibly, as they must be, to react to the environment and user.

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

`StorageInfo` is specified as a `[NoInterfaceObject]` class (WebIDL "interface"), with no constructor. The idea of a constructor-less class in JavaScript is fairly nonsensical. In this particular case, it makes no sense for `StorageInfo` to be a class, with the `StorageInfo.prototype` that comes along with it, containing the two getters `usage` and `quota`.

In JavaScript, we would instead represent such an object as simply an object literal, e.g. `{ usage: 5, quota: 10 }`. This is not an instance of any class, and especially not of a non-constructible one that somehow springs into life without ever being `new`ed. It has `Object.prototype` as its prototype, and has no getters, simply properties. In WebIDL, this would be represented with a dictionary type:

```webidl
dictionary StorageInfo {
    unsigned long long usage;
    unsigned long long quota;
}
```

### Don't use non-constructible classes as namespaces

This is essentially the same issue as the previous one, but in this case we are discussing `StorageQuota`. Again, `navigator.storageQuota` has somehow sprung into being as the only instance of a class `StorageQuota`, which it is not possible to actually construct an instance of since it has no constructor. In JavaScript, you would set up `navigator.storageQuota` as a simple "namespace object," again with no prototype chain, simply though something like

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
