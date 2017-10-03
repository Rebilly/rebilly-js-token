import xhr from 'xhr';

/**
 * Handler for the creation of a payment token using the Rebilly API.
 */
export default class Handler {
    attrKey = 'data-rebilly';
    endpoint = null;
    authorization = null;
    modules = [];

    constructor({modules, endpoint}) {
        this.modules = modules;
        this.endpoint = endpoint;
    }

    /**
     * Process all existing modules and reduce their results into a single object literal.
     * @returns {Promise.<*>}
     */
    async processModules() {
        const promises = this.modules.map(module => module());
        const results = await Promise.all(promises);
        return results.reduce((result, value) => {
            result = {...result, ...value};
            return result;
        }, {});
    }

    /**
     * Overwrite the default endpoint URL with another value.
     * @param url {string}
     */
    setEndpoint(url = null) {
        this.endpoint = url;
    }

    /**
     * Set the authorization value to authenticate the API request used to generate the payment token.
     * @param signature {string}
     */
    setAuth(signature = null) {
        this.authorization = signature;
    }

    /**
     * Create the token and return its value via the callback provided.
     * @param payload {Object|Node}
     * @param callback {}
     * @returns {Promise.<void>}
     */
    createToken(payload, callback) {
        if (this.authorization === null) {
            throw new Error('Missing Rebilly authorization value');
        }
        let data = {};
        // check whether we are handling a form node or an
        // object literal
        if (Object.prototype.isPrototypeOf(payload)) {
            data = {...payload};
        }
        else {
            data = this.serializeForm(payload);
        }
        const moduleData = (async () => await this.processModules())();
        data = {...data, ...moduleData};
        // convert legacy method values if present
        if (data.method) {
            this.convertLegacyMethods(data);
        }
        // or detect the method when not defined
        else if (data.paymentInstrument) {
            this.detectMethod(data);
        }
        else {
            throw new Error('Missing method and payment instrument data');
        }
        xhr(this.getConfig(data), this.handleResponse(callback))
    }

    /**
     * Serialize the content of the form's Rebilly fields into an object literal.
     * @param form {Node}
     * @returns {Object}
     */
    serializeForm(form) {
        const instrumentFields = [
            // payment card
            'pan', 'expMonth', 'expYear', 'cvv',
            // ach
            'routingNumber', 'accountNumber', 'accountType'
        ];
        const fields = form.getElementsByTagName('input');
        const paymentInstrument = {};
        const billingAddress = {};
        fields.forEach(field => {
            if (field.hasAttribute(this.attrKey)) {
                const prop = field.getAttribute(this.attrKey);
                if (prop !== null && prop !== '') {
                    if (instrumentFields.includes(prop)) {
                        paymentInstrument[prop] = field.value;
                    }
                    else {
                        billingAddress[prop] = field.value;
                    }
                }
            }
        });
        return {paymentInstrument, billingAddress};
    }

    /**
     * Generate the configuration data required for the XHR request.
     * @param data {Object}
     * @returns {Object}
     */
    getConfig(data) {
        return {
            method: 'post',
            body: JSON.stringify(data),
            uri: this.endpoint,
            json: true,
            headers: {
                'reb-auth': this.authorization
            }
        };
    }

    /**
     * Handle the response of the XHR request.
     * @param callback {Function}
     * @returns {Object}
     */
    handleResponse(callback) {
        return (error, response, body) => {
            let params = {
                xhr: response.rawRequest,
                status: response.statusCode,
                error: false,
                data: null,
                message: 'success'
            };
            if (error) {
                params.error = true;
                params.message = error.message;
            }
            else {
                params.data = body;
            }
            callback(params);
        }
    }

    /**
     * Convert legacy payment method values to their current equivalents.
     * @param data {Object}
     */
    convertLegacyMethods(data) {
        const map = {
            'payment_card': 'payment-card',
            'bank_account': 'ach'
        };
        Object.keys(map).forEach(key => {
            if (data.method === key) {
                data.method = map[key];
            }
        });
    }

    /**
     * Detect the payment method when missing from the data payload.
     * @param data {Object}
     */
    detectMethod(data) {
        const map = {
            'payment-card': ['pan', 'expMonth', 'expYear', 'cvv'],
            'ach': ['routingNumber', 'accountNumber', 'accountType']
        };
        const fields = Object.keys(data.paymentInstrument);
        Object.keys(map).forEach(method => {
            const match = fields.some(field => map[method].includes(field));
            if (match && !data.method) {
                data.method = method;
                console.log(`Rebilly detected "${method}" payment method`);
            }
        });
    }
}
