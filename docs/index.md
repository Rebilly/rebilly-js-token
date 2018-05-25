# Rebilly JS Token Library

Rebilly.js powers your checkout form and removes the need to send sensitive customer information directly to your servers. Use the library to generate payment tokens to reduce the scope of PCI DSS compliance.

[![npm](https://img.shields.io/npm/v/rebilly-js-token.svg)](https://www.npmjs.com/package/rebilly-js-token)
[![Build Status](https://travis-ci.org/Rebilly/rebilly-js-token.svg?branch=master)](https://travis-ci.org/Rebilly/rebilly-js-token)
[![devDependencies Status](https://david-dm.org/Rebilly/rebilly-js-token/dev-status.svg)](https://david-dm.org/Rebilly/rebilly-js-token?type=dev)

### Rebilly API Spec
The library uses the payment token endpoint from the Rebilly API. See the [Rebilly API spec](https://rebilly.github.io/RebillyAPI/) for more details. 

## Including Rebilly.js

Add Rebilly.js to your page using one of the following CDN providers, preferably at the bottom before the `</body>`. 

> Always use `HTTPS` when including the library.

*Rebilly CDN*

```html
<script src="https://cdn.rebilly.com/rebilly-js-token@1.1.6/rebilly.js"></script>
```

## Semver
The JS SDK is released following [Semver 2.0.0](http://semver.org/) guidelines. Each minor and patch version will be backward-compatible and incompatible changes will be introduced using major releases only.


