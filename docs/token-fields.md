# Token Properties

The payment token can be generated for payment cards or bank accounts. Each method supports different fields that are not shared. This information is described in the [Rebilly API spec](https://rebilly.github.io/RebillyAPI/).

The library requires you to define the payment instrument and billing address entities within the payment token. The `method` field is optional and can be detected from the contents of the payment instrument values.

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


### Bank Account (ACH)
An object representing the bank account data.

| Field | Description | 
| ----- | ----------- |
| routingNumber | The routing number associated to the bank account. |
| accountNumber | The account's number |
| accountType | The account type. E.g. checking or savings. |
| bankName | The name of the bank with which the account is registered. |
