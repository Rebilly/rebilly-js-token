# Generating a Signature
To create a token you must first authenticate your requests using a signature. You can use one of the three official Rebilly SDKs to generate and inject it into the page containing the library.

## PHP SDK
The Rebilly SDK for PHP makes it easy for developers to access Rebilly REST APIs in their PHP code. You can get started in minutes by installing the SDK through Composer or by downloading a single zip file from the latest release.

> See the [Rebilly PHP SDK][goto-php-sdk]{: target="_blank"}

**Generate the signature**

```php
<?php
$signature = \Rebilly\Util\RebillySignature::generateSignature(
    $apiUser,
    $apiKey
);
```


## .NET SDK
The Rebilly NET SDK makes it easy for developers to access Rebilly REST APIs from their .NET code.

> See the [Rebilly .NET SDK][goto-dot-net-sdk]{: target="_blank"}

**Generate the signature**

```c#
using Rebilly;

var NewSignature = new Signature();
var SignatureText = NewSignature.Generate("apiUser", "apiKey");
```


## JS SDK (Node)
The Rebilly JS SDK library allows you to consume the Rebilly API using either Node or the browser.

!!! warning "Server-side Only"
    You should use the signature generation method only on the server-side as it will otherwise expose your secret `apiKey` to the browser.

> See the [Rebilly JS SDK][goto-js-sdk]{: target="_blank"}

**Generate the signature**

```js
const api = RebillyAPI({apiKey});
const signature = api.generateSignature({apiUser, apiKey}); 
```


[goto-php-sdk]: https://github.com/Rebilly/rebilly-php
[goto-dot-net-sdk]: https://github.com/Rebilly/Rebilly-NET-SDK
[goto-js-sdk]: https://github.com/Rebilly/rebilly-js-sdk
