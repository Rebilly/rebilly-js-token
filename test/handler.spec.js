import chai from 'chai';
import Handler from '../src/handler';
import {version} from '../package.json';

const expect = chai.expect;

describe('when creating a handler', () => {
    const url = 'test-url';
    const handler = new Handler({endpoint: url, modules: []});

    it('should set the correct default values', () => {
        expect(handler.endpoint).to.be.equal(url);
        expect(handler.modules).to.be.deep.equal([]);
    });

    it('should allow the endpoint to be modified', () => {
        const url = 'new-url';
        handler.setEndpoint('new-url');
        expect(handler.endpoint).to.be.equal(url);
    });

    it('should allow the authorization to be modified', () => {
        const auth = '1234567890';
        handler.setAuth(auth);
        expect(handler.authorization).to.be.equal(auth);
    });

    it('should generate the XHR configuration object', () => {
        const data = {hello: 'world'};
        const config = handler.getConfig(data);

        expect(config.uri).to.be.equal(handler.endpoint);
        expect(config.headers['reb-auth']).to.be.equal(handler.authorization);
        expect(config.headers['reb-api-consumer']).to.be.equal(`RebillySDK/JS-Token ${version}`);
        expect(config.body).to.be.equal(JSON.stringify(data));
    });

    it('handle the XHR response', () => {
        const errorHandler = handler.handleResponse((data) => {
            expect(data.error).to.be.equal(true);
            expect(data.data).to.be.equal(null);
        });
        errorHandler({message: 'error'}, {rawRequest: 123, statusCode: 422}, null);
        const successHandler = handler.handleResponse((data) => {
            expect(data.error).to.be.equal(false);
            expect(data.data).to.be.deep.equal({hello: 'world'});
        });
        successHandler(null, {rawRequest: 123, statusCode: 201}, JSON.stringify({hello: 'world'}));
    });

    it('should convert legacy methods to their new equivalents', () => {
        const data = {method: 'bank_account'};
        handler.convertLegacyMethods(data);
        expect(data.method).to.be.equal('ach');
        data.method = 'payment_card';
        handler.convertLegacyMethods(data);
        expect(data.method).to.be.equal('payment-card');
    });

    it('should detect the correct payment method from the payment instrument fields if missing', () => {
        const data = {
            paymentInstrument: {
                pan: '4111111111111111'
            }
        };
        handler.detectMethod(data);
        expect(data.method).to.be.equal('payment-card');
        data.paymentInstrument = {routingNumber: '12345678'};
        data.method = null;
        handler.detectMethod(data);
        expect(data.method).to.be.equal('ach');
        data.paymentInstrument = {foo: 'bar'};
        data.method = null;
        handler.detectMethod(data);
        expect(data.method).to.be.null;
    });

    it('should process modules and combine their results', async () => {
        const modules = [
            () => ({foo: 'bar'}),
            () => new Promise((resolve) => {
                setTimeout(() => resolve({hello: 'world'}), 100);
            })
        ];
        const handler = new Handler({modules, endpoint: url});
        const data = await handler.processModules();
        expect(data.foo).to.be.equal('bar');
        expect(data.hello).to.be.equal('world');
    });

    it('should not create a token if the authorization is missing', async () => {
        handler.setAuth(null);
        await handler.createToken({}, (data) => {
            // callback should not run
            expect(true).to.be.equal(false);
        });
        expect(true).to.be.equal(true);
    });

    it('should not create a token if the payload is missing data', async () => {
        handler.setAuth('123456789');
        await handler.createToken({bad: 'data'}, () => {
            // callback should not run
            expect(true).to.be.equal(false);
        });
        expect(true).to.be.equal(true);
    });
});
