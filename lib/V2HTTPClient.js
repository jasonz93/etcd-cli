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

    update(key, value, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        options.prevExist = true;
        this.raw('PUT', path_.join('v2', 'keys', key), value, options, callback);
    }

    ttl(key, ttl, callback) {
        this.raw('PUT', path_.join('v2', 'keys', key), null, {
            ttl: ttl,
            refresh: true
        }, callback);
    }

    remove(key, options, callback) {
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
        let path = path_.join('v2', 'keys', key);
        this.raw('GET', path, null, options, (err, data) => {
            if (err) {
                if (err.errorCode === 401) {
                    options.waitIndex = data.etcdIndex + 1;
                    this.raw('GET', path, null, options, callback);
                } else {
                    callback(err);
                }
            } else {
                callback(err, data);
            }
        });
    }
    
    handleResponseError(data, callback) {
        if (data.hasOwnProperty('errorCode')) {
            callback(_.merge(new Error(), data));
        } else {
            callback(null, data);
        }
    }
}

module.exports = V2HTTPClient;