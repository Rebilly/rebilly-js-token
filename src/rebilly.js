import Handler from './handler';
import validate from './validate';

/**
 * Generate a payment token creation handler with a set of modules
 * @param modules {Function[]} A list of modules to run when creating the token. Each module must return an object literal.
 * @returns {Object}
 * @constructor
 */
export default function Rebilly({modules = []} = {}) {
    const config = {modules, endpoint: 'https://api.rebilly.com/v2.1/tokens'};
    const handler = new Handler(config);

    return {
        setEndpoint: (url) => handler.setEndpoint(url),
        setAuth: (auth) => handler.setAuth(auth),
        setPublishableKey: (key) => handler.setPublishableKey(key),
        createToken: (payload, callback) => handler.createToken(payload, callback),
        validate
    };
}
