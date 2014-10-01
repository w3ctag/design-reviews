# Push API Draft Feedback

[Draft under discussion](https://dvcs.w3.org/hg/push/raw-file/tip/index.html)

## Open questions

### Registration persistence

In its present state all acting parts (user agent, push server, app server) operate using formal identifiers (URLs, registrations ids) and every connection is reinstatable. The only major exception is "last mile" between user agent and app code: message routing there is bound to a temporary entity (function callback) which exists in runtime only. If runtime context is lost the connection cannot be reinstated.

We suggest to bind push messages to Service Workers. That would also resolve other questions, for example, what should happen when webapp calls window.location.reload().

### Push server <-> App server protocol

Spec neither specifies nor refers this protocol. From developer's point of view it's unknown how app server should communicate with push service having just endpoint URL and registration id.

### Private push servers

Do we allow user to change browser's default push server? If the answer is "yes", which spec covers push service interface?

### Managing registrations

Do we allow user to manage push registrations, i.e. view or delete registrations via user agent UI? In our view spec should recommend to implement such a possibility since currently we have to rely on webapp having some interface to unsubscribe.

## API Objects' Responsibilities

### ISSUE: Access granting and push registering functionality stick together

`PushManager.register` provides two heterogeneous functions:

  * asking use permission,
  * registering push notifications.

This mixing leads to odd user agent behavior, i.e. push service failure forces webapp to ask permission again.

Suggestion: split the functionality and provide separate methods to ask user permission (check if permission has already being granted) and to register push notifications. Provide different sets of errors for those purposes.

## API Objects' Interfaces

### ISSUE: Bad names

`PushManager` is limited to dealing with registrations. Suggestion: `PushRegistrationManager`.

`navigator.push` as an object of PushManager type seems misleading per se and is inconsistent with `Array.prototype.push` method. Suggestion: `navigator.pushRegistrationManager`.

`PushManager.registrations` method seems inconsistent. Suggestion: `PushManager.getRegistrations`.

`AbortError` is raised when user doesn't grant permissions, not when registration is aborted. Suggestion: `PermissionDeniedError`.

`PushRegisterMessage` name is confusing as it really occurs when push service failed, not when new registration granted. Suggestion: `PushServiceFailure`.

`NoModificationAllowedError` is in fact a technical (network) error, not disallowance.
