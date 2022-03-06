/**
 * Constructs a new Drupal.Error object with the given code and message.
 */
export class DrupalError extends Error {

  /**
   * Error code indicating some error other than those enumerated here.
   */
  public static readonly UNDEFINED: number = -1;

  /**
   * Error code indicating that something has gone wrong with the server.
   */
  public static readonly INTERNAL_SERVER_ERROR: number = 1;

  /**
   * Error code indicating the sdk has encountered a missing implementation.
   */
  public static readonly MISSING_IMPLEMENTATION_ERROR: number = 42;

  /**
   * Error code indicating the connection to the Drupal server failed.
   */
  public static readonly CONNECTION_FAILED: number = 100;

  /**
   * Error code indicating the specified object doesn't exist.
   */
  public static readonly OBJECT_NOT_FOUND: number = 101;

  /**
   * Error code indicating you tried to query with a datatype that doesn't
   * support it, like exact matching an array or object.
   */
  public static readonly INVALID_QUERY: number = 102;

  /**
   * Error code indicating a missing or invalid classname. Classnames are
   * case-sensitive. They must start with a letter, and a-zA-Z0-9_ are the
   * only valid characters.
   */
  public static readonly INVALID_CLASS_NAME: number = 103;

  /**
   * Error code indicating an unspecified object id.
   */
  public static readonly MISSING_OBJECT_ID: number = 104;

  /**
   * Error code indicating an invalid key name. Keys are case-sensitive. They
   * must start with a letter, and a-zA-Z0-9_ are the only valid characters.
   */
  public static readonly INVALID_KEY_NAME: number = 105;

  /**
   * Error code indicating a malformed pointer. You should not see this unless
   * you have been mucking about changing internal Drupal code.
   */
  public static readonly INVALID_POINTER: number = 106;

  /**
   * Error code indicating that badly formed JSON was received upstream. This
   * either indicates you have done something unusual with modifying how
   * things encode to JSON, or the network is failing badly.
   */
  public static readonly INVALID_JSON: number = 107;

  /**
   * Error code indicating that the feature you tried to access is only
   * available internally for testing purposes.
   */
  public static readonly COMMAND_UNAVAILABLE: number = 108;

  /**
   * You must call Drupal.initialize before using the Drupal library.
   */
  public static readonly NOT_INITIALIZED: number = 109;

  /**
   * Error code indicating that a field was set to an inconsistent type.
   */
  public static readonly INCORRECT_TYPE: number = 111;

  /**
   * Error code indicating an invalid channel name. A channel name is either
   * an empty string (the broadcast channel) or contains only a-zA-Z0-9_
   * characters and starts with a letter.
   */
  public static readonly INVALID_CHANNEL_NAME: number = 112;

  /**
   * Error code indicating that push is misconfigured.
   */
  public static readonly PUSH_MISCONFIGURED: number = 115;

  /**
   * Error code indicating that the object is too large.
   */
  public static readonly OBJECT_TOO_LARGE: number = 116;

  /**
   * Error code indicating that the operation isn't allowed for clients.
   */
  public static readonly OPERATION_FORBIDDEN: number = 119;

  /**
   * Error code indicating the result was not found in the cache.
   */
  public static readonly CACHE_MISS: number = 120;

  /**
   * Error code indicating that an invalid key was used in a nested
   * JSONObject.
   */
  public static readonly INVALID_NESTED_KEY: number = 121;

  /**
   * Error code indicating that an invalid filename was used for DrupalFile.
   * A valid file name contains only a-zA-Z0-9_. characters and is between 1
   * and 128 characters.
   */
  public static readonly INVALID_FILE_NAME: number = 122;

  /**
   * Error code indicating an invalid ACL was provided.
   */
  public static readonly INVALID_ACL: number = 123;

  /**
   * Error code indicating that the request timed out on the server. Typically
   * this indicates that the request is too expensive to run.
   */
  public static readonly TIMEOUT: number = 124;

  /**
   * Error code indicating that the email address was invalid.
   */
  public static readonly INVALID_EMAIL_ADDRESS: number = 125;

  /**
   * Error code indicating a missing content type.
   */
  public static readonly MISSING_CONTENT_TYPE: number = 126;

  /**
   * Error code indicating a missing content length.
   */
  public static readonly MISSING_CONTENT_LENGTH: number = 127;

  /**
   * Error code indicating an invalid content length.
   */
  public static readonly INVALID_CONTENT_LENGTH: number = 128;

  /**
   * Error code indicating a file that was too large.
   */
  public static readonly FILE_TOO_LARGE: number = 129;

  /**
   * Error code indicating an error saving a file.
   */
  public static readonly FILE_SAVE_ERROR: number = 130;

  /**
   * Error code indicating that a unique field was given a value that is
   * already taken.
   */
  public static readonly DUPLICATE_VALUE: number = 137;

  /**
   * Error code indicating that a role's name is invalid.
   */
  public static readonly INVALID_ROLE_NAME: number = 139;

  /**
   * Error code indicating that an application quota was exceeded.  Upgrade to
   * resolve.
   */
  public static readonly EXCEEDED_QUOTA: number = 140;

  /**
   * Error code indicating that a Cloud Code script failed.
   */
  public static readonly SCRIPT_FAILED: number = 141;

  /**
   * Error code indicating that a Cloud Code validation failed.
   */
  public static readonly VALIDATION_ERROR: number = 142;

  /**
   * Error code indicating that invalid image data was provided.
   */
  public static readonly INVALID_IMAGE_DATA: number = 143;

  /**
   * Error code indicating an unsaved file.
   */
  public static readonly UNSAVED_FILE_ERROR: number = 151;

  /**
   * Error code indicating an invalid push time.
   */
  public static readonly INVALID_PUSH_TIME_ERROR: number = 152;

  /**
   * Error code indicating an error deleting a file.
   */
  public static readonly FILE_DELETE_ERROR: number = 153;

  /**
   * Error code indicating an error deleting an unnamed file.
   */
  public static readonly FILE_DELETE_UNNAMED_ERROR: number = 161;

  /**
   * Error code indicating that the application has exceeded its request
   * limit.
   */
  public static readonly REQUEST_LIMIT_EXCEEDED: number = 155;

  /**
   * Error code indicating that the request was a duplicate and has been discarded due to
   * idempotency rules.
   */
  public static readonly DUPLICATE_REQUEST: number = 159;

  /**
   * Error code indicating an invalid event name.
   */
  public static readonly INVALID_EVENT_NAME: number = 160;

  /**
   * Error code indicating that a field had an invalid value.
   */
  public static readonly INVALID_VALUE: number = 162;

  /**
   * Error code indicating that the username is missing or empty.
   */
  public static readonly USERNAME_MISSING: number = 200;

  /**
   * Error code indicating that the password is missing or empty.
   */
  public static readonly PASSWORD_MISSING: number = 201;

  /**
   * Error code indicating that the username has already been taken.
   */
  public static readonly USERNAME_TAKEN: number = 202;

  /**
   * Error code indicating that the email has already been taken.
   */
  public static readonly EMAIL_TAKEN: number = 203;

  /**
   * Error code indicating that the email is missing, but must be specified.
   */
  public static readonly EMAIL_MISSING: number = 204;

  /**
   * Error code indicating that a user with the specified email was not found.
   */
  public static readonly EMAIL_NOT_FOUND: number = 205;

  /**
   * Error code indicating that a user object without a valid session could
   * not be altered.
   */
  public static readonly SESSION_MISSING: number = 206;

  /**
   * Error code indicating that a user can only be created through signup.
   */
  public static readonly MUST_CREATE_USER_THROUGH_SIGNUP: number = 207;

  /**
   * Error code indicating that an an account being linked is already linked
   * to another user.
   */
  public static readonly ACCOUNT_ALREADY_LINKED: number = 208;

  /**
   * Error code indicating that the current session token is invalid.
   */
  public static readonly INVALID_SESSION_TOKEN: number = 209;

  /**
   * Error code indicating an error enabling or verifying MFA
   */
  public static readonly MFA_ERROR: number = 210;

  /**
   * Error code indicating that a valid MFA token must be provided
   */
  public static readonly MFA_TOKEN_REQUIRED: number = 211;

  /**
   * Error code indicating that a user cannot be linked to an account because
   * that account's id could not be found.
   */
  public static readonly LINKED_ID_MISSING: number = 250;

  /**
   * Error code indicating that a user with a linked (e.g. Facebook) account
   * has an invalid session.
   */
  public static readonly INVALID_LINKED_SESSION: number = 251;

  /**
   * Error code indicating that a service being linked (e.g. Facebook or
   * Twitter) is unsupported.
   */
  public static readonly UNSUPPORTED_SERVICE: number = 252;

  /**
   * Error code indicating an invalid operation occured on schema
   */
  public static readonly INVALID_SCHEMA_OPERATION: number = 255;

  /**
   * Error code indicating that there were multiple errors. Aggregate errors
   * have an "errors" property, which is an array of error objects with more
   * detail about each error that occurred.
   */
  public static readonly AGGREGATE_ERROR: number = 600;

  /**
   * Error code indicating the client was unable to read an input file.
   */
  public static readonly FILE_READ_ERROR: number = 601;

  /**
   * Error code indicating a real error code is unavailable because
   * we had to use an XDomainRequest object to allow CORS requests in
   * Internet Explorer, which strips the body from HTTP responses that have
   * a non-2XX status code.
   */
  public static readonly X_DOMAIN_REQUEST: number = 602;

  /**
   * Error code indicating in memory storage failure.
   */
  public static readonly STORAGE_IN_MEMORY_FAIL: number = 700;

  /**
   * Error code indicating in web storage failure.
   */
   public static readonly STORAGE_IN_WEB_FAIL: number = 701;

  /**
   * An error code from <code>Drupal.Error</code>.
   */
  code: number;


  /**
   * @param {number} code An error code constant from <code>Drupal.Error</code>.
   * @param {string} message A detailed description of the error.
   */
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    Object.defineProperty(this, 'message', {
      enumerable: true,
      value: message,
    });
  }

  /**
   * Get the error code.
   * @returns error code.
   */
  getErrorCode(): number {
    return this.code;
  }

  /**
   * Drupal error message.
   * @returns Error message.
   */
  toString(): string {
    return `DrupalError: ${this.code} ${this.message}`;
  }
}
