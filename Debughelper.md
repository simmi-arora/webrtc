#getusermedia Exceptions

Cases when user deosnt have ir isnt able to acces his audio/video devices due of any of reasons such as 
- user has no webcam or microphone
- intentioanlly/accidentally denied access to the webcam
- plugs in the webcam/microphone after getUserMedia() code has initialized
- device is already used by another app on Windows
- user dismisses the privacy dialog

Rejections of the returned promise are made by passing a DOMException error object to the promise's failure handler. 
The DOMException interface represents an abnormal event 

Possible errors are:

```
openrmc.webrtc.Errors = {
    NOT_SUPPORTED : 'NOT_SUPPORTED',
    CONSTRAINTS_REQUIRED : 'CONSTRAINTS_REQUIRED',
    AUDIO_NOT_AVAILABLE : 'AUDIO_NOT_AVAILABLE',
    VIDEO_NOT_AVAILABLE : 'VIDEO_NOT_AVAILABLE',
    AV_NOT_AVAILABLE : 'AV_NOT_AVAILABLE'
} ;
```

* AbortError - Although the user and operating system both granted access to the hardware device, and no hardware issues occurred that would cause a NotReadableError, some problem occurred which prevented the device from being used.

* NotAllowedError - One or more of the requested source devices cannot be used at this time. This will happen if the browsing context is insecure (that is, the page was loaded using HTTP rather than HTTPS). It also happens if the user has specified that the current browsing instance is not permitted access to the device, the user has denied access for the current session, or the user has denied all access to user media devices globally. On browsers that support managing media permissions with Feature Policy, this error is returned if Feature Policy is not configured to allow access to the input source(s).
Older versions of the specification used SecurityError for this instead; SecurityError has taken on a new meaning.

* NotFoundError - No media tracks of the type specified were found that satisfy the given constraints.
NotReadableError
Although the user granted permission to use the matching devices, a hardware error occurred at the operating system, browser, or Web page level which prevented access to the device.

* OverconstrainedError - The specified constraints resulted in no candidate devices which met the criteria requested. The error is an object of type OverconstrainedError, and has a constraint property whose string value is the name of a constraint which was impossible to meet, and a message property containing a human-readable string explaining the problem.
Because this error can occur even when the user has not yet granted permission to use the underlying device, it can potentially be used as a fingerprinting surface.

* SecurityError - User media support is disabled on the Document on which getUserMedia() was called. The mechanism by which user media support is enabled and disabled is left up to the individual user agent.

* TypeError - The list of constraints specified is empty, or has all constraints set to false. This can also happen if you try to call getUserMedia() in an insecure context, since navigator.mediaDevices is undefined in an insecure context.

ref : https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
