# Error Codes

The following is a list of all the error codes that can be returned by the Drupal Javascript SDK API. You may also refer to RFC2616 for a list of http error codes. Make sure to check the error message for more details.

::: danger ATTENTION
Not all error codes listed below are implemented. For now, this serves as a guide
for developers for implementing a standardised set of error codes.
:::

| CONSTANT | NUMERIC CODE | DESCRIPTION |
| -------- | ------------ | ----------- |
| UNDEFINED|-1 |Error code indicating some error other than those enumerated here.|
| INTERNAL_SERVER_ERROR|1 |Error code indicating that something has gone wrong with the server.|
| MISSING_IMPLEMENTATION_ERROR|42 |Error code indicating the sdk has encountered a missing implementation.|
| CONNECTION_FAILED|100 |Error code indicating the connection to the Drupal server failed.|
| OBJECT_NOT_FOUND|101 |Error code indicating the specified object doesn't exist.|
| INVALID_QUERY|102 |Error code indicating you tried to query with a datatype that doesn't|
| INVALID_CLASS_NAME|103 |Error code indicating a missing or invalid classname. Classnames are the only valid characters.|
| MISSING_OBJECT_ID|104 |Error code indicating an unspecified object id.|
| INVALID_KEY_NAME|105 |Error code indicating an invalid key name. Keys are case-sensitive. Theys.|
| INVALID_POINTER|106 |Error code indicating a malformed pointer. You should not see this unless|
| INVALID_JSON|107 |Error code indicating that badly formed JSON was received upstream. This things encode to JSON, or the network is failing badly.|
| COMMAND_UNAVAILABLE|108 |Error code indicating that the feature you tried to access is only|
| NOT_INITIALIZED|109 |You must call Drupal.initialize before using the Drupal library.|
| INCORRECT_TYPE|111 |Error code indicating that a field was set to an inconsistent type.|
| INVALID_CHANNEL_NAME|112 |Error code indicating an invalid channel name. A channel name is either characters and starts with a letter.|
| PUSH_MISCONFIGURED|115 |Error code indicating that push is misconfigured.|
| OBJECT_TOO_LARGE|116 |Error code indicating that the object is too large.|
| OPERATION_FORBIDDEN|119 |Error code indicating that the operation isn't allowed for clients.|
| CACHE_MISS|120 |Error code indicating the result was not found in the cache.|
| INVALID_NESTED_KEY|121 |Error code indicating that an invalid key was used in a nested|
| INVALID_FILE_NAME|122 |Error code indicating that an invalid filename was used for DrupalFile.n 1 and 128 characters.|
| INVALID_ACL|123 |Error code indicating an invalid ACL was provided.|
| TIMEOUT|124 |Error code indicating that the request timed out on the server. Typically|
| INVALID_EMAIL_ADDRESS|125 |Error code indicating that the email address was invalid.|
| MISSING_CONTENT_TYPE|126 |Error code indicating a missing content type.|
| MISSING_CONTENT_LENGTH|127 |Error code indicating a missing content length.|
| INVALID_CONTENT_LENGTH|128 |Error code indicating an invalid content length.|
| FILE_TOO_LARGE|129 |Error code indicating a file that was too large.|
| FILE_SAVE_ERROR|130 |Error code indicating an error saving a file.|
| DUPLICATE_VALUE|137 |Error code indicating that a unique field was given a value that is|
| INVALID_ROLE_NAME|139 |Error code indicating that a role's name is invalid.|
| EXCEEDED_QUOTA|140 |Error code indicating that an application quota was exceeded.  Upgrade to|
| SCRIPT_FAILED|141 |Error code indicating that a Cloud Code script failed.|
| VALIDATION_ERROR|142 |Error code indicating that a Cloud Code validation failed.|
| INVALID_IMAGE_DATA|143 |Error code indicating that invalid image data was provided.|
| UNSAVED_FILE_ERROR|151 |Error code indicating an unsaved file.|
| INVALID_PUSH_TIME_ERROR|152 |Error code indicating an invalid push time.|
| FILE_DELETE_ERROR|153 |Error code indicating an error deleting a file.|
| FILE_DELETE_UNNAMED_ERROR|161 |Error code indicating an error deleting an unnamed file.|
| REQUEST_LIMIT_EXCEEDED|155 |Error code indicating that the application has exceeded its request|
| DUPLICATE_REQUEST|159 |Error code indicating that the request was a duplicate and has been discarded due to|
| INVALID_EVENT_NAME|160 |Error code indicating an invalid event name.|
| INVALID_VALUE|162 |Error code indicating that a field had an invalid value.|
| USERNAME_MISSING|200 |Error code indicating that the username is missing or empty.|
| PASSWORD_MISSING|201 |Error code indicating that the password is missing or empty.|
| USERNAME_TAKEN|202 |Error code indicating that the username has already been taken.|
| EMAIL_TAKEN|203 |Error code indicating that the email has already been taken.|
| EMAIL_MISSING|204 |Error code indicating that the email is missing, but must be specified.|
| EMAIL_NOT_FOUND|205 |Error code indicating that a user with the specified email was not found.|
| SESSION_MISSING|206 |Error code indicating that a user object without a valid session could|
| MUST_CREATE_USER_THROUGH_SIGNUP|207 |Error code indicating that a user can only be created through signup.|
| ACCOUNT_ALREADY_LINKED|208 |Error code indicating that an an account being linked is already linked|
| INVALID_SESSION_TOKEN|209 |Error code indicating that the current session token is invalid.|
| MFA_ERROR|210 |Error code indicating an error enabling or verifying MFA|
| MFA_TOKEN_REQUIRED|211 |Error code indicating that a valid MFA token must be provided|
| LINKED_ID_MISSING|250 |Error code indicating that a user cannot be linked to an account because|
| INVALID_LINKED_SESSION|251 |Error code indicating that a user with a linked (e.g. Facebook) account|
| UNSUPPORTED_SERVICE|252 |Error code indicating that a service being linked (e.g. Facebook or|
| INVALID_SCHEMA_OPERATION|255 |Error code indicating an invalid operation occured on schema|
| AGGREGATE_ERROR|600 |Error code indicating that there were multiple errors. Aggregate errorsore detail about each error that occurred.|
| FILE_READ_ERROR|601 |Error code indicating the client was unable to read an input file.|
| X_DOMAIN_REQUEST|602 |Error code indicating a real error code is unavailable becausets in Internet Explorer, which strips the body from HTTP responses that have a non-2XX status code.|
| STORAGE_IN_MEMORY_FAIL|700 |Error code indicating in memory storage failure.|
| STORAGE_IN_WEB_FAIL|701 |Error code indicating in web storage failure.|

