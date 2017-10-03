import xhr from 'xhr';

export default function Rebilly({modules = []} = {}) {
    let endpoint = 'https://api.rebilly.com/v2.1/tokens';
    let authorization = null;

    async function processModules() {
        const results = await Promise.all(modules);
        return results.reduce((result, value) => {
            result = {...result, ...value};
            return result;
        }, {});
    }

    function setEndpoint(url = null) {
        endpoint = url;
    }

    function setAuth(signature = null) {
        authorization = signature;
    }

    async function createToken() {
        let data = {};
        const moduleData = await processModules();
        data = {...data, ...moduleData};
        return new Promise((resolve, reject) => {
            xhr(getConfig(data), handleResponse(resolve, reject))
        });
    }

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
    
    function handleResponse(resolve, reject) {
        return (error, response, body) => {
            if (error) {
                reject({
                    error: true,
                    status: response.statusCode,
                    data: null,
                    message: error.message,
                    xhr: response.rawRequest
                });
            }
            else {
                resolve({
                    error: true,
                    status: response.statusCode,
                    data: body,
                    message: 'success',
                    xhr: response.rawRequest
                });
            }
        }
    }


    return {
        setEndpoint,
        setAuth,
        createToken
    };
}
