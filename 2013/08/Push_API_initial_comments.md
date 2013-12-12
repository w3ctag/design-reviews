Dear Editors & Authors,

The TAG has been looking to do review of the [Push API draft](https://dvcs.w3.org/hg/push/raw-file/tip/index.html) but, having reviewed the current spec, feel that there are issues with the draft that probably need discussion before we're able to proceed in providing detailed technical feedback.

A few examples.

First, while the introduction of the draft outlines a few underlying technologies that might generate push messages, it's not clear that there's a strong method for binding documents/URL space to these message types in any meaningful way. The API leaves the entire concept of routing of messages as an exercise for developers to navigate. We'd like to understand why the API was developed this way.

Next, the idea of a message queue is useful, but the choice to use `hasPendingMessages()` and `setMessageHandler()` instead of the well-worn DOM event model or the message APIs that exist in the platform (Message Ports / `postMessage`/`onmessage`) is, at best, head-scratching. We'd like to understand the thinking behind it.

As a final example, it's unclear from the code examples how web apps are meant to be invoked (or if they are at all) when push messages are delivered to users. If the system provides UI for interacting with the message, how does it relate to the web app? And if the system doesn't create a mapping between the two at registration time, does that mean that messages are only ever delivered to apps when users open them? Doesn't that make web apps permanently second-class? We'd like to understand the thinking there.

We're optimistic that this is going to be an incredibly helpful API for apps and users and want to do what we can to help improve it. Thanks for your time and consideration.

Regards,

The TAG