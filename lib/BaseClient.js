/**
 * Created by nicholas on 17-3-1.
 */
const Watcher = require('./Watcher');
const Promise = require('bluebird');
const deasync = require('deasync');

class ClientAPI {
    get() {

    }

    set() {

    }

    update() {

    }

    ttl() {

    }

    remove() {

    }

    watch() {

    }

    watcher() {

    }
}

class BaseClient extends ClientAPI {
    get(key, options, callback) {
        callback(new Error('Method not implemented.'));
    }

    set(key, value, options, callback) {
        callback(new Error('Method not implemented.'));
    }

    update(key, value, options, callback) {
        callback(new Error('Method not implemented.'));
    }

    ttl(key, ttl, callback) {
        callback(new Error('Method not implemented.'));
    }

    remove(key, options, callback) {
        callback(new Error('Method not implemented.'));
    }

    watch(key, index, options, callback) {
        callback(new Error('Method not implemented.'));
    }

    watcher(key, index, options, callback) {
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
        callback(null, new Watcher(this, key, index, options));
    }

    promisify() {
        if (this._promisified) {
            return this._promisified;
        }
        let target = {};
        let self = this;
        Object.getOwnPropertyNames(ClientAPI.prototype).forEach((name) => {
            if (typeof ClientAPI.prototype[name] === 'function') {
                target[name] = function () {
                    let args = arguments;
                    return new Promise(function (resolve, reject) {
                        args[args.length ++] = function (err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        };
                        self[name].apply(self, args);
                    });
                }
            }
        });
        this._promisified = target;
        return target;
    }

    sync() {
        if (this._synced) {
            return this._synced;
        }
        let target = {};
        let self = this;
        Object.getOwnPropertyNames(ClientAPI.prototype).forEach((name) => {
            if (typeof ClientAPI.prototype[name] === 'function') {
                target[name] = deasync(function () {
                    self[name].apply(self, arguments);
                });
            }
        });
        this._synced = target;
        return target;
    }
}

module.exports = BaseClient;