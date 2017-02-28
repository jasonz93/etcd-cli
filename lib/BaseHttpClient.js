/**
 * Created by Nicholas on 2017/2/24.
 */
const _ = require('lodash');
const url_ = require('url');
const request = require('request');

class BaseHttpClient {
    constructor(hosts, options) {
        this.optLocations = {
            'refresh': 'form',
            'recursive': 'qs',
            'ttl': 'form',
            'prevExist': 'form',
            'wait': 'qs',
            'waitIndex': 'qs'
        };
        if (typeof hosts === 'string') {
            this.hosts = [hosts];
        } else if (hosts instanceof Array) {
            this.hosts = hosts;
        }
    }

    buildOptions(options) {
        let opt = {};
        if (typeof options === 'undefined') {
            return opt;
        }
        for (let option in options) {
            let loc = this.optLocations[option];
            if (loc) {
                if (!opt[loc]) {
                    opt[loc] = {};
                }
                opt[loc][option] = options[option];
            }
        }
        return opt;
    }

    /**
     * This method only perform http request and deal with normal 404 error,
     * 404 with json response should be process in business method.
     * @param method
     * @param path
     * @param value
     * @param options
     * @param callback
     */
    raw(method, path, value, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        if (typeof callback === 'undefined') {
            callback = (err, data) => {};
        }
        let opt = this.buildOptions(options);
        if (value) {
            _.mergeWith(opt, {
                form: {
                    value: value
                }
            });
        }
        opt.method = method;
        request(url_.resolve(this.getHost(), path), opt, (err, response, data) => {
            if (err) {
                //TODO: Failover
                callback(err);
            } else {
                if (response.statusCode === 200) {
                    callback(null, data);
                } else {
                    let contentType = response.headers['content-type'];
                    if (typeof contentType === 'string' && contentType.indexOf('application/json') >= 0) {
                        this.handleResponseError(JSON.parse(data), response, callback);
                    } else {
                        if (response.statusCode === 404) {
                            callback(new Error('API Not Found.'));
                        } else {
                            //TODO: Failover
                            let err = new Error('Unknown error.');
                            err.httpData = data;
                            callback(err);
                        }
                    }
                }
            }
        });
    }

    handleResponseError(data, response, callback) {
        callback(null, data);
    }

    getHost() {
        //TODO: Load balance and failover
        let host = this.hosts[0];
        if (_.startsWith(host, 'http:') || _.startsWith(host, 'https:')) {
            return host;
        } else {
            return 'http://' + host;
        }
    }
}

module.exports = BaseHttpClient;