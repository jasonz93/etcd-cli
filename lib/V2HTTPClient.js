/**
 * Created by Nicholas on 2017/2/24.
 */
const BaseHttpClient = require('./BaseHttpClient');
const path_ = require('path');
const _ = require('lodash');

/**
 * @class
 * @extends BaseClient
 */
class V2HTTPClient extends BaseHttpClient {
    constructor(hosts, options) {
        super(hosts, options);
    }

    set(key, value, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        this.raw('PUT', path_.join('v2', 'keys', key), value, options, callback);
    }

    get(key, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        this.raw('GET', path_.join('v2', 'keys', key), null, options, callback);
    }

    delete(key, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        this.raw('DELETE', path_.join('v2', 'keys', key), null, options, callback);
    }

    watch(key, index, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        if (typeof index === 'function') {
            callback = index;
            options = {};
            index = undefined;
        }
        if (typeof index === 'object' && index) {
            callback = options;
            options = index;
            index = undefined;
        }
        if (typeof options === 'undefined') {
            options = {};
        }
        options.wait = true;
        if (index) {
            options.waitIndex = index;
        }
        this.raw('GET', path_.join('v2', 'keys', key), null, options, callback);
    }
    
    handleResponseError(data, response, callback) {
        if (data.hasOwnProperty('errorCode')) {
            callback(_.merge(new Error(), data));
        } else {
            callback(null, {data, response});
        }
    }
}

module.exports = V2HTTPClient;