/**
 * Created by Nicholas on 2017/2/24.
 */
const BaseHttpClient = require('./BaseHttpClient');
const path_ = require('path');
const _ = require('lodash');
const Watcher = require('./Watcher');
const arguejs = require('arguejs');
const Promise = require('bluebird');

/**
 * @class
 * @extends BaseClient
 */
class V2HTTPClient extends BaseHttpClient {
    constructor(hosts, options) {
        super(hosts, options);
    }

    set(key, value, options) {
        let args = arguejs({
            key: String,
            value: String,
            options: [Object, {}]
        }, arguments);
        return this.raw('PUT', path_.join('v2', 'keys', args.key), args.value, args.options);
    }

    get(key, options) {
        let args = arguejs({
            key: String,
            options: [Object, {}]
        }, arguments);
        return this.raw('GET', path_.join('v2', 'keys', args.key), args.options);
    }

    update(key, value, options) {
        let args = arguejs({
            key: String,
            value: String,
            options: [Object, {}]
        }, arguments);
        args.options.prevExist = true;
        return this.raw('PUT', path_.join('v2', 'keys', args.key), args.value, args.options);
    }

    ttl(key, ttl) {
        let args = arguejs({
            key: String,
            ttl: Number
        }, arguments);
        return this.raw('PUT', path_.join('v2', 'keys', args.key), {
            ttl: args.ttl,
            refresh: true,
            prevExist: true
        });
    }

    remove(key, options) {
        let args = arguejs({
            key: String,
            options: [Object, {}]
        }, arguments);
        return this.raw('DELETE', path_.join('v2', 'keys', args.key), args.options);
    }

    watch(key, index, options) {
        let args = arguejs({
            key: String,
            index: [Number, undefined],
            options: [Object, {}]
        }, arguments);
        args.options.wait = true;
        if (args.index) {
            args.options.waitIndex = args.index;
        }
        let path = path_.join('v2', 'keys', args.key);
        return this.raw('GET', path, args.options).catch((err) => {
            if (err.errorCode === 401) {
                return this.get(args.key).then((data) => {
                    args.options.waitIndex = data.etcdIndex + 1;
                    return this.raw('GET', path, args.options);
                });
            } else {
                return Promise.reject(err);
            }
        });
    }

    handleResponseError(data) {
        if (data.hasOwnProperty('errorCode')) {
            let err = _.merge(new Error(), data);
            err.message += JSON.stringify(data);
            return err;
        }
    }
}

exports = module.exports = V2HTTPClient;
