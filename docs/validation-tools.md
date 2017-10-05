# Validation Tools
The JS library comes with a set of validation tools that can be used to verify the payment card and customer data. They can be accessed via the `:::js Rebilly.validate` namespace.

!!! info "Opt-In"
    Validation is not used automatically on the client-side and is provided as an opt-in feature. 

## Payment Card
Credit card validation functions are found in the `:::js Rebilly.validate.card` namespace. All functions return booleans.

### Luhn Algorithm

The Luhn Algorithm `is a simple checksum formula used to validate a variety of identification numbers`. This function expects only digits.

```js
Rebilly.validate.card.luhn('1131313'); // false
Rebilly.validate.card.luhn('4000111122223333'); // false

Rebilly.validate.card.luhn('4601398104203552'); // true
Rebilly.validate.card.luhn('4494590804949548'); // true

// the function will not strip dashes and spaces
// and otherwise valid numbers will fail if passed with them
Rebilly.validate.card.luhn('5349-2077-8395-2559'); // false
Rebilly.validate.card.luhn('5349207783952559'); // true
```

### Card Number
Ensures the card number is valid by checking the length and Luhn algorithm result. Spaces and dashes are ignored and can be passed along with the card number.

```js
Rebilly.validate.card.cardNumber('4601398104203552'); // true
Rebilly.validate.card.cardNumber('4494590804949548'); // true

// with spaces and dashes
Rebilly.validate.card.cardNumber('4494 5908 0494 9548'); // true
Rebilly.validate.card.cardNumber('4494-5908-0494-9548'); // true
Rebilly.validate.card.cardNumber('43-57-45-59-57-71-61-42'); // true

// illegal characters
Rebilly.validate.card.cardNumber('4357455AD#EE8&EEAG'); // false
Rebilly.validate.card.cardNumber('4838.2379.4185.1360'); // false
```

### Card Expiry
Validates the card's expiry month (mm) and year (yyyy). Only accepts digits as integers or strings.

```js
// invalid year format
Rebilly.validate.card.expiry('01','15'); // false
// digits only
Rebilly.validate.card.expiry('jan', 2014); // false
// invalid month
Rebilly.validate.card.expiry(22, 2022); // false
// card expired
Rebilly.validate.card.expiry(11, 2001); // false

// digit as strings
Rebilly.validate.card.expiry('01','2035'); // true
// digits as integers
Rebilly.validate.card.expiry(1, 2033); // true
// mix of string and integer
Rebilly.validate.card.expiry('04', 2031); // true
```

### CVV
Validates the card's CVV number and length. Only accepts digits as integer or string.

```js
// digits only
Rebilly.validate.card.cvv('1 2 3'); // false
Rebilly.validate.card.cvv('1a3'); // false
// invalid length
Rebilly.validate.card.cvv(11111); // false

// digit as string
Rebilly.validate.card.cvv('011'); // true
// digits as integers
Rebilly.validate.card.cvv(123); // true
```

## Customer (Billing Address)
Customer data validation functions are found in the `:::js Rebilly.validate.customer` namespace. All functions will return a boolean. 
Length restrictions are based on the Rebilly API specifications for each field.

!!! info "Unicode"
    All address related validation functions (firstName, lastName, address, city, region) are Unicode compatible.
    
### First Name

Validates the firstName field. Maximum length of 45 unicode characters. Commas, periods, single quotes and dashes `, . ' -` are allowed. Digits are not allowed.

```js
Rebilly.validate.customer.firstName('Andrei Theodorescu'); //true
//unicode
Rebilly.validate.customer.firstName('カウボーイビバップ'); //true

//invalid characters
Rebilly.validate.customer.firstName('Robert * Cloud'); //false
Rebilly.validate.customer.firstName('Jebediah_Morrisson'); //false
```

### Last Name

Validates the lastName field. Maximum length of 45 unicode characters. Commas, periods, single quotes and dashes `, . ' -` are allowed.

```js
//unicode
Rebilly.validate.customer.lastName('훈민정음 訓民正音'); //true
Rebilly.validate.customer.lastName('здраво збогум'); //true

//with digits
Rebilly.validate.customer.lastName('De 08 Laurentiis'); //true

//invalid characters
Rebilly.validate.customer.lastName('De;Laurentiis'); //false
```


### Address

Can be used to validate address and address2 fields. Maximum length of 60 unicode characters. 
Commas, periods, single quotes, dashes, hash signs, forward slashes and backslashes `, . ' - / \` are allowed.

```js
Rebilly.validate.customer.address('6745 Rue De Carufel'); // true
// unicode
Rebilly.validate.customer.address('012 Brunnenstraße'); // true
Rebilly.validate.customer.address('環七通り/都道318号線'); // true

// invalid characters
Rebilly.validate.customer.address('012 Brunnenstraße $*$&*'); // false
Rebilly.validate.customer.address('Aftcastle, Berlin = 09:339:1'); // false
```


### City

Validates the city field. Maximum length of 45 unicode characters. Commas, periods, single quotes and dashes `, . ' -` are allowed.

```js
Rebilly.validate.customer.city('Pozdravljeni adijo'); // true
// invalid characters
Rebilly.validate.customer.city('Pozdravljeni ++ adijo'); // false
```

### Region

Validates the region field. Maximum length of 45 unicode characters. Commas, periods, single quotes and dashes `, . ' -` are allowed.

```js
Rebilly.validate.customer.region('Pozdravljeni adijo'); // true
// invalid characters
Rebilly.validate.customer.region('Pozdravljeni ++ adijo'); // false
```


### Postal Code

Validates the postalCode field. Maximum length of 10 characters. Only letters, digits, spaces and dashes are allowed.

```js
Rebilly.validate.customer.postalCode('h1n1n1'); // true
Rebilly.validate.customer.postalCode('h1n-1n1'); // true
Rebilly.validate.customer.postalCode('h2b 4g6'); // true

// invalid characters
Rebilly.validate.customer.postalCode('h1n+1n1'); // false
```

### Phone Number

Validates the phoneNumber field. Maximum length of 20 characters. Only digits, parentheses, spaces and dashes are allowed. The international call prefix `+` can also be used.

```js
// string
Rebilly.validate.customer.phoneNumber('(514) 321-7654'); // true
// integer - not recommended
Rebilly.validate.customer.phoneNumber(5143217654); // true
// international call prefix
Rebilly.validate.customer.phoneNumber('+01-800-4536'); // true

// invalid characters
Rebilly.validate.customer.phoneNumber('[514]-321-7654'); // false
Rebilly.validate.customer.phoneNumber('1-800-CALL'); // false
```
