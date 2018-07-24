# Defining a Token

The payment token can be generated for payment cards or bank accounts. Each method supports different fields that are not shared. This information is described in the [Rebilly API spec](https://rebilly.github.io/RebillyAPI/).

The library requires you to define the payment instrument and billing address entities within the payment token. The `method` field is optional and can be detected from the contents of the payment instrument values.

## HTML vs Object Literal

You can specify the contents of the payment token using either an HTML form element or an object literal. The former is parsed automatically by the library when you pass a `form` as the first parameter to `createToken`. The later requires you to manually define the object as you will see in the examples below.

> See [Rebilly.createToken][goto-create] for more details.

When using a form element, simply define input fields with a `data-rebilly` attribute and the value of said field should be the name of one of the fields listed for each payment method.

**Example**

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

```js
var form = document.getElementsByName('form')[0];
Rebilly.createToken(form, callback);
```

Using the form above the library will detect a payment card.

## Fields

| Field | Type | Attribute | Description | 
| ----- | ---- | -------- | ----------- |
| method | string | Optional | Defines the payment method used for the token. The value specified influences the requirements of the fields within the payment instrument. Can be either `payment-card` or `ach` (bank account). |
| paymentInstrument| object | Required | Contains the payment instrument fields. The value defined for `method` commands which values must be provided.
| billingAddress | object | Required | Contains customer information related to the address. |

**Example**

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
// using an object literal we will create the token
Rebilly.createToken(payload, callback);
```

### Billing Address

<p>Please note that the <code>firstName</code> and <code>lastName</code> values are required to create a payment token. Any other billing address fields are optional.</p>

<table>
    <thead>
        <tr>
            <th>Field</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="vertical-align:top">
                firstName<br><sub>required</sub>
            </td>
            <td>The customer's first name. This field is required to generate a payment token.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                lastName<br><sub>required</sub>
            </td>
            <td>The customer's last name. This field is required to generate a payment token.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                organization
            </td>
            <td>The customer's organization value.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                address
            </td>
            <td>The main address field.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                address2
            </td>
            <td>The secondary address field.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                city
            </td>
            <td>The customer's city.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                region
            </td>
            <td>The customer's province or region.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                country
            </td>
            <td>The customer's country. This value is a ISO two-letter code format. e.g. <code>US</code>, <code>CA</code></td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                postalCode
            </td>
            <td>The customer's ZIP or postal code.</td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                phoneNumbers
            </td>
            <td>An array of objects representing phone numbers. Each item must include a <code>label</code> and <code>value</code></td>
        </tr>
        <tr>
            <td style="vertical-align:top">
                emails
            </td>
            <td>An array of objects representing emails. Each item must include a <code>label</code> and <code>value</code></td>
        </tr>
    </tbody>
</table>

## Methods

The two supported payment methods require different fields to be valid. The fields listed below are **not optional**.

### Payment Card
An object representing the payment card data.

| Field | Description | 
| ----- | ----------- |
| pan | The payment card's number. |
| expYear | The year the card will expire on. |
| expMonth | The month the card will expire on. |
| cvv | The three to four digit code on the back of the card. |

**Example**

```js
paymentInstrument: {
    pan: '4111111111111111',
    expYear: '2019',
    expMonth: '12',
    cvv: '123'
},
```


### Bank Account (ACH)
An object representing the bank account data.

| Field | Description | 
| ----- | ----------- |
| routingNumber | The routing number associated to the bank account. |
| accountNumber | The account's number |
| accountType | The account type. E.g. checking or savings. |
| bankName | The name of the bank with which the account is registered. |

**Example**

```js
paymentInstrument: {
    routingNumber: '12345678',
    accountNumber: '12345678',
    accountType: 'savings',
    bankName: 'Dominion Bank'
},
```

[goto-create]: methods/#createtoken
