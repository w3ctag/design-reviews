# Push API Draft Feedback

[Draft under discussion](https://dvcs.w3.org/hg/push/raw-file/tip/index.html)

## API Field of Application

### ISSUE: Concepts unclear

The Push API spec introduces a number of new concepts. In our view following terms and ideas should be explicitly defined in the document:

  * push service
  * invoking a non-active webapp
  * `pushRegistrationId` as a form of user identification

These concepts raise a lot of questions which should be clarified. For example:

  * why is push service needed? How should app server deal with push server knowing nothing except endpoint URL? What information is passing through push service and how is user-agent authenticated?
  * how are registrations preserved between sessions and different webapp instances? What is webapp in a sense of this spec? Do all same-origin webpages share the registrations?
  * how should user-agent invoke an inactive webapp? How to invoke a webapp requested using POST (or PUT, or DELETE) method? How to invoke a webapp that is using History API to manipulate page URLs?

### ISSUE: "Express permission" needs clarification

It is also unclear what "User agents must not provide Push API access to webapps without the express permission of the user" means. Either "express permission" definition should be clarified or "MUST NOT" statement should be excluded.

### ISSUE: `NoModificationAllowedError` needs clarification

Specification doesn't define when this error may occur and why webapp might be disallowed to unregister.

## API Objects' Responsibilities

### ISSUE: Access granting and push registering functionality stick together

`PushManager.register` provides two heterogeneous functions:

  * asking use permission,
  * registering push notifications.

This mixing leads to odd user agent behavior, i.e. push service failure forces webapp to ask permission again.

Suggestion: split the functionality and provide separate methods to ask user permission (check if permission has already being granted) and to register push notifications. Provide different sets of errors for those purposes.

## API Objects' Interfaces

### ISSUE: Indistinguishable registrations

`PushManager` provides mechanisms to register more than one push notifications request. It seems like useful functionality when webapp has different message streams or message sources. But neither user nor webapp cannot tell which registration belongs to which message stream. So user will be just confused if application would ask his permission to show push notifications several times in a row, and webapp would have to invent some mechanism to share "registrationId <-> message stream" relation between sessions and app instances.

Suggestion: allow webapp to provide (a) an alias for each registration, (b) some information for user regarding each registration.

### ISSUE: Bad names

`PushManager` is limited to dealing with registrations. Suggestion: `PushRegistrationManager`.

`navigator.push` as an object of PushManager type seems misleading per se and is inconsistent with `Array.prototype.push` method. Suggestion: `navigator.pushRegistrationManager`.

`PushManager.registrations` method seems inconsistent. Suggestion: `PushManager.getRegistrations`.

`AbortError` is raised when user doesn't grant permissions, not when registration is aborted. Suggestion: `PermissionDeniedError`.

`PushRegisterMessage` name is confusing as it really occurs when push service failed, not when new registration granted. Suggestion: `PushServiceFailure`.
