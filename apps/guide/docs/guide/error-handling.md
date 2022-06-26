# Error Handling

Most of SDK's functions report their success or failure using an object with callbacks. 


```js {8,11}
auth.passwordResetByMail('admin@example.com')
    .then(() => { 
        // This function will *not* be called in case of `Error`.
    })
    .catch((error) => {
        // This will be called.
        // error is an instance of DrupalError with details about the error.
        if (error.getErrorCode() === DrupalError.CONNECTION_FAILED) {
            alert("Uh oh, connection failed! please try again later.");
        }
        if (error.getErrorCode() === DrupalError.INVALID_JSON) {
            alert("Uh oh, recieved invalid response from server! \
            Please contact administrator.");
        }
    }) 
```

For a list of all possible DrupalError codes, check [Error Codes](/guide/error-codes), or see the DrupalError section of the JavaScript API DrupalError.