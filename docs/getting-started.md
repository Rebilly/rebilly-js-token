# Getting Started

The library must be inserted in the page you will use to handle payment instrument data for either payment cards or bank accounts. 

!!! note "Server-side SDK"
    You must use one of the official Rebilly server-side SDKs to generate a public signature from your secret API key. See [Authentication][goto-auth] for more details.

## Including Rebilly.js

Add Rebilly.js to your page using the following CDN provider, preferably at the bottom before the `</body>`.

> Always use `HTTPS` when including the library.

*Rebilly CDN*

```html
<script src="https://cdn.rebilly.com/rebilly-js-token@1.2.1/rebilly.js"></script>
```

The library is then available in the global scope as `:::js Rebilly`.

## Authentication
Once included in your checkout page, authenticate your token requests using a publishable API key [generated in Rebilly][1]{: target="_blank"}.

```js
Rebilly.setPublishableKey('pk_live_...');
```

> See [Generating a publishable API key][goto-generate] for more details.

## Creating a token
To create a token you must provide two parameters: the form or object literal with the payment instrument data (payment card or bank account) and a callback function that will receive the resulting token from the Rebilly API.

!!! tip "Form Submission"
    When creating a token, prevent the default submission of the form until a value is returned by the API and injected into your page.

```js
Rebilly.createToken(Node|Object, Function)
```

### Building the payment instrument data
The first parameter will be the payment instrument data. You can use either a form node in your page or a plain object literal.

**Parse a form for the payment instrument**

The library can look for field with the `data-rebilly` attribute and compile the data from your form directly. Specify the field name associated in Rebilly as `data-rebilly="fieldName"`.

You can omit providing a `method` field, the library will detect it based on which fields you specified.

!!! warning "PCI Compliance"
    Never define `name` attributes for the payment card fields in your form. This will prevent field data from showing up in your server logs.

```html
<form>
    <input data-rebilly="pan">
    <input type="number" data-rebilly="expYear">
    <input type="number" data-rebilly="expMonth">
    <input type="number" data-rebilly="cvv">
</form>
```

Using the form above the library will detect a payment card.

```js
var form = document.getElementsByTagName('form')[0];
Rebilly.createToken(form, callback);
```

**Use an object literal**

Alternatively use an object literal built following the API specification for defining a payment instrument. The accepted `method` values are `payment-card` and `ach` (bank account).
```js
var payload = {
    method: 'payment-card',
    paymentInstrument: {
        pan: '4111111111111111',
        expYear: '2022',
        expMonth: '12',
        cvv: '123'
    },
    // the first/last name is required
    billingAddress: {
        firstName: 'John',
        lastName: 'Doe'
    }
};
Rebilly.createToken(payload, callback);
```

### Minimal Requirements

To create a payment token you must supply Rebilly with a minimal amount of fields. This applies to both methods of building the payment instrument data.

**Billing Address**

The billing address requires `firstName` and `lastName`.

**Payment Instrument**

The payment instrument requires different fields based on the `method` defined. 

- For method `payment-card`: `pan`, `expYear`, `expMonth` and `cvv`
- For method `ach`: `routingNumber`, `accountNumber`, `accountType` and `bankName`

> See [Token Fields][goto-fields] for more details.

### Defining the callback
The callback function should be used to inject the token returned by the API into your form. Once submitted, use the value in conjunction with one of the server-side SDKs to create the customer.

```js
// the token is returned as response.data.id
var callback = function (response) {
    // create a hidden input field
    var tokenField = document.createElement('input');
    tokenField.setAttribute('type', 'hidden');
    tokenField.setAttribute('name', 'payment-token');
    tokenField.value = response.data.id;
    // append to the form and submit to the server
    form.appendChild(tokenField);
    form.submit();
};

Rebilly.createToken(form, callback);
```

**Callback Argument**

The argument received by the callback contains additional information on the API request and can be used to detect validation errors.

| Property | Type | Description |
| -------- | ---- | ----------- |
| error | boolean | Defines whether there was an error with the request or not. |
| message | string | The response message. Returns `success` if there was no errors, or the error message. |
| status | number | The status code returned by the response. |
| data | Object | The response data as returned by the API. The token is exposed as `data.id`. |
| xhr | Object | The raw XHR request object. |

## Changing the endpoint
You can change the default production endpoint URL for testing purposes via `:::js Rebilly.setEndpoint`. This must be done before the token is created to apply.

```js
// using the sandbox endpoint
Rebilly.setEndpoint('https://api-sandbox.rebilly.com/v2.1/tokens');
```


## Example Form
When combined together the most basic version of the page would look like the following example:
<script src="https://gist.github.com/Teknologica/6d814f041428e5255df07cd2c60d1334.js"></script>

[goto-auth]: #Authentication
[goto-generate]: generating-api-key.md
[goto-fields]: token-fields.md
[1]: https://app.rebilly.com/api-keys/add
