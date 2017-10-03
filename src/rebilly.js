import xhr from 'xhr';

/**
 * Generate a payment token creation handler with a set of modules
 * @param modules {Function[]} A list of modules to run when creating the token. Each module must return an object literal.
 * @returns {{setEndpoint: setEndpoint, setAuth: setAuth, createToken: createToken}}
 * @constructor
 */
export default function Rebilly({modules = []} = {}) {
    const attrKey = 'data-rebilly';
    let endpoint = 'https://api.rebilly.com/v2.1/tokens';
    let authorization = null;

    /**
     * Process all existing modules and reduce their results into a single object literal.
     * @returns {Promise.<*>}
     */
    async function processModules() {
        const results = await Promise.all(modules);
        return results.reduce((result, value) => {
            result = {...result, ...value};
            return result;
        }, {});
    }

    /**
     * Overwrite the default endpoint URL with another value.
     * @param url {string}
     */
    function setEndpoint(url = null) {
        endpoint = url;
    }

    /**
     * Set the authorization value to authenticate the API request used to generate the payment token.
     * @param signature {string}
     */
    function setAuth(signature = null) {
        authorization = signature;
    }

    /**
     * Create the token and return its value via the callback provided.
     * @param payload {Object|Node}
     * @param callback {Function}
     * @returns {Promise.<void>}
     */
    async function createToken(payload, callback) {
        if (authorization === null) {
            throw new Error('missing Rebilly authorization value');
        }
        let data = {};
        // check whether we are handling a form node or an
        // object literal
        if (Object.prototype.isPrototypeOf(payload)) {
            data = {...payload};
        }
        else {
            data = serializeForm(payload);
        }
        const moduleData = await processModules();
        data = {...data, ...moduleData};
        // convert legacy method values if present
        if (data.method) {
            convertLegacyMethods(data);
        }
        // or detect the method when not defined
        else if (data.paymentInstrument) {
            detectMethod(data);
        }
        else {
            throw new Error('Missing method and payment instrument data');
        }
        xhr(getConfig(data), handleResponse(callback))
    }

    /**
     * Serialize the content of the form's Rebilly fields into an object literal.
     * @param form {Node}
     * @returns {Object}
     */
    function serializeForm(form) {
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
            if (field.hasAttribute(attrKey)) {
                const prop = field.getAttribute(attrKey);
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
    function getConfig(data) {
        return {
            method: 'post',
            body: JSON.stringify(data),
            uri: endpoint,
            json: true,
            headers: {
                'reb-auth': authorization
            }
        };
    }

    /**
     * Handle the response of the XHR request.
     * @param callback {Function}
     * @returns {Function}
     */
    function handleResponse(callback) {
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
    function convertLegacyMethods(data) {
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
    function detectMethod(data) {
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

    return {
        setEndpoint,
        setAuth,
        createToken
    };
}
