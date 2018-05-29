# Methods

Other than [validation tools][goto-validation], the library exposes key methods required to create a payment token.

## setPublishableKey
<div class="method"><code><strong>setPublishableKey</strong>(<span class="prop">publishableKey</span>)</code></div>

Set the authentication for all API requests using your publishable API key. This is required to run before `createToken`. Visit [Rebilly's page for adding API keys][1]{: target="_blank"} to create a publishable key.

> See [Generating a publishable API key][goto-generate] for more details.

**Example**

```js
Rebilly.setPublishableKey('pk_live_...');
```

## createToken
<div class="method"><code><strong>createToken</strong>(<span class="prop">payload</span>, <span class="prop">callback</span>)</code></div>

Trigger an API call to Rebilly that will generate a token for the payment instrument information provided in the `payload`. Once the request completes, the `callback` function is called with the response. 


**Example**

<h5>Using a form as the payload</h5>

```js
var form = document.getElementsByName('form')[0];
Rebilly.createToken(form, callback);
```

<h5>Using an object literal</h5>

```js
var payload = {
    method: 'payment-card' // entirely optional
    paymentInstrument: {
        pan: '4111111111111111',
        expYear: '2019',
        expMonth: '12',
        cvv: '123'
    },
    billingAddress: {
        firstName: 'John',
        lastName: 'Doe'
    }
};

Rebilly.createToken(payload, callback);
```

<h5>Callback function</h5>
The function receives the `:::js response` as its only argument. The `response.error` property returns true if there was an error before or after the request.

| Property | Type | Description |
| -------- | ---- | ----------- |
| error | boolean | Defines whether there was an error before or after the API request. Use this property to handle errors in conjunction with `response.message` and `response.data`. |
| message | string | Returns `success` when the API request completes successfully or the error message returned by the server. |
| data | Object&nbsp;\|&nbsp;Null | Contains the data returned by the API when successful or the error details when validation fails. If there was no response data the value returned will be `null`.  <br>On success the <strong>payment token value</strong> can be accessed as `reponse.data.id`. |
| status | number | The status code returned by the API request. When successful the status will be `201`. |
| xhr | Object | An instance of the `XMLHttpRequest` used to complete the request. Can be used for debugging purposes and verifying the payload is being sent correctly. |

```js
var callback = function(response) {
    //check for errors
    if (response.error) {
        //there was a validation or request error
        console.error(response.message);
        //previously we disabled the submit button to 
        //prevent multiple clicks
        button.removeAttribute('disabled');
    }
    else {
        // create a hidden input field
        var tokenField = document.createElement('input');
        tokenField.setAttribute('type', 'hidden');
        tokenField.setAttribute('name', 'payment-token');
        var token = response.data.id;
        //set the token as the value
        tokenField.value = token;
        // append to the form and submit to the server
        form.appendChild(tokenField);
        form.submit();                  
    }
};
```

[goto-validation]: validation-tools.md
[goto-generate]: generating-api-key.md
[1]: https://app.rebilly.com/api-keys/add
