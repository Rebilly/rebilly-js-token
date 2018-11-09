# Common Errors
The Rebilly JS Token library uses [CORS][goto-cors]{: target='_blank'} for transmitting data from your form to the Rebilly API. This section lists the most common errors you might encounter while implementing it.

## Silent Error

Your endpoint URL is incorrect. See the [endpoint topic][goto-endpoint] on how to set a new endpoint. Contact us if you are unsure about which URL to use.
If the problem persists after changing the endpoint the error might be caused by [missing headers][goto-headers].

!!! warning "Console Warning"
    `URL IS NOT ALLOWED BY ACCESS-CONTROL-ALLOW-ORIGIN`

## 400 Bad Request

The server returned a network error. Check the server response for more information about the error. 

Most common cases:

- **Wrong endpoint/server:** the CORS call was accepted but not understood by the remote server.
- **Correct endpoint/server:** validation failed or a field is missing. Check response for details and see Handling Response topic for implementation.

## 401 Unauthorized

The server acknowledges the CORS transmission but the authorization key is incorrect. Verify the API User and API Secret Key match the values defined for your account and update the signature generation logic.

## Missing CORS Headers

Rarely CORS requests will fail with a generic `not allowed by Access-Control-Allow-Origin` error while your endpoint is correctly set. This can happen if the required CORS headers are missing in either direction. 

!!! warning "Firewalls"
    Some enterprise firewalls will strip incoming and outgoing headers that have not been whitelisted. 
    
The following headers must be supported over your network:
    
    Access-Control-Allow-Origin
    Access-Control-Allow-Headers
    Access-Control-Allow-Methods

[goto-cors]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
[goto-headers]: #missing-cors-headers
[goto-endpoint]: getting-started.md#changing-the-endpoint
