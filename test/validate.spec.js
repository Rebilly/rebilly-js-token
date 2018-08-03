import chai from 'chai';
import validate from '../src/validate';

const expect = chai.expect;

describe('when validating payment card data', () => {
    const futureYear = () => {
        return new Date().getFullYear() + Math.ceil(Math.random() * 10);
    };

    it('should validate the luhn algorithm', () => {
        expect(validate.card.luhn('1131313')).to.be.equal(false);
        expect(validate.card.luhn('4000111122223333')).to.be.equal(false);

        expect(validate.card.luhn('4601398104203552')).to.be.equal(true);
        expect(validate.card.luhn('4494590804949548')).to.be.equal(true);

        // the function will not strip dashes and spaces
        // and otherwise valid numbers will fail if passed with them
        expect(validate.card.luhn('5349-2077-8395-2559')).to.be.equal(false);
        expect(validate.card.luhn('5349207783952559')).to.be.equal(true);
    });

    it('should validate the card number', () => {
        expect(validate.card.cardNumber('4601398104203552')).to.be.equal(true);
        expect(validate.card.cardNumber('4494590804949548')).to.be.equal(true);

        // with spaces and dashes
        expect(validate.card.cardNumber('4494 5908 0494 9548')).to.be.equal(true);
        expect(validate.card.cardNumber('4494-5908-0494-9548')).to.be.equal(true);
        expect(validate.card.cardNumber('43-57-45-59-57-71-61-42')).to.be.equal(true);

        // illegal characters
        expect(validate.card.cardNumber('4357455AD#EE8&EEAG')).to.be.equal(false);
        expect(validate.card.cardNumber('4838.2379.4185.1360')).to.be.equal(false);
    });

    it('should validate the card expiry', () => {
        // invalid year format
        expect(validate.card.expiry('01', '15')).to.be.equal(false);
        // digits only
        expect(validate.card.expiry('jan', 2014)).to.be.equal(false);
        // invalid month
        expect(validate.card.expiry(22, 2022)).to.be.equal(false);
        // card expired
        expect(validate.card.expiry(11, 2001)).to.be.equal(false);

        // digit as strings
        expect(validate.card.expiry('01', `${futureYear()}`)).to.be.equal(true);
        // digits as integers
        expect(validate.card.expiry(1, futureYear())).to.be.equal(true);
        // mix of string and integer
        expect(validate.card.expiry('04', futureYear())).to.be.equal(true);
    });

    it('should validate the card CVV', () => {
        // wrong format
        expect(validate.card.cvv('1 2 3')).to.be.equal(false);
        // invalid character
        expect(validate.card.cvv('1a3')).to.be.equal(false);
        // invalid length
        expect(validate.card.cvv(11111)).to.be.equal(false);

        // digits as string
        expect(validate.card.cvv('011')).to.be.equal(true);
        // digits as integers
        expect(validate.card.cvv(123)).to.be.equal(true);
    });
});

describe('when validating billing address data', () => {
    it('should validate the first name', () => {
        expect(validate.customer.firstName('Andrei Theodorescu')).to.be.equal(true);
        // unicode
        expect(validate.customer.firstName('カウボーイビバップ')).to.be.equal(true);

        // invalid character
        expect(validate.customer.firstName('Robert * Cloud')).to.be.equal(false);
        expect(validate.customer.firstName('Jebediah_Morrisson')).to.be.equal(false);
    });

    it('should validate the last name', () => {
        expect(validate.customer.lastName('훈민정음 訓民正音')).to.be.equal(true);
        expect(validate.customer.lastName('здраво збогум')).to.be.equal(true);

        // with digits
        expect(validate.customer.lastName('De 08 Laurentiis')).to.be.equal(true);

        // invalid character
        expect(validate.customer.lastName('De;Laurentiis')).to.be.equal(false);
    });

    it('should validate the address', () => {
        expect(validate.customer.address('6745 Rue De Carufel')).to.be.equal(true);

        // unicode
        expect(validate.customer.address('012 Brunnenstraße')).to.be.equal(true);
        expect(validate.customer.address('環七通り/都道318号線')).to.be.equal(true);

        // invalid characters
        expect(validate.customer.address('012 Brunnenstraße $*$&*')).to.be.equal(false);
        expect(validate.customer.address('Aftcastle, Berlin = 09:339:1')).to.be.equal(false);
    });

    it('should validate the city', () => {
        expect(validate.customer.city('Pozdravljeni adijo')).to.be.equal(true);
        // invalid characters
        expect(validate.customer.city('Pozdravljeni ++ adijo')).to.be.equal(false);
    });

    it('should validate the region', () => {
        expect(validate.customer.region('Pozdravljeni adijo')).to.be.equal(true);
        // invalid characters
        expect(validate.customer.region('Pozdravljeni ++ adijo')).to.be.equal(false);
    });

    it('should validate the postal code', () => {
        expect(validate.customer.postalCode('h1n1n1')).to.be.equal(true);
        expect(validate.customer.postalCode('h1n-1n1')).to.be.equal(true);
        expect(validate.customer.postalCode('h2b 4g6')).to.be.equal(true);
        expect(validate.customer.postalCode('H1N 1n1')).to.be.equal(true);
        // invalid character
        expect(validate.customer.postalCode('h2b+4g6')).to.be.equal(false);
    });

    it('should validate the phone number', () => {
        // string
        expect(validate.customer.phoneNumber('(514) 321-7654')).to.be.equal(true);
        // integer - not recommended
        expect(validate.customer.phoneNumber(5143217654)).to.be.equal(true);
        // international call prefix
        expect(validate.customer.phoneNumber('+01-800-4536')).to.be.equal(true);
        // invalid character
        expect(validate.customer.phoneNumber('[514]-321-7654')).to.be.equal(false);
        expect(validate.customer.phoneNumber('1-800-CALL')).to.be.equal(false);
    });
});
