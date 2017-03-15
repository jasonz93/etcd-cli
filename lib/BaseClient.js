/**
 * Created by nicholas on 17-3-1.
 */
const Watcher = require('./Watcher');
const Promise = require('bluebird');
const deasync = require('deasync');
const arguejs = require('arguejs');

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
    /**
     *
     * @param key
     * @param options
     * @returns {Promise.<*>}
     */
    get(key, options) {
        return Promise.reject(new Error('Method not implemented.'));
    }

    set(key, value, options) {
        return Promise.reject(new Error('Method not implemented.'));
    }

    update(key, value, options) {
        return Promise.reject(new Error('Method not implemented.'));
    }

    ttl(key, ttl) {
        return Promise.reject(new Error('Method not implemented.'));
    }

    remove(key, options) {
        return Promise.reject(new Error('Method not implemented.'));
    }

    watch(key, index, options) {
        return Promise.reject(new Error('Method not implemented.'));
    }

    watcher(key, index, options) {
        let args = arguejs({
            key: String,
            index: [Number, undefined],
            options: [Object, {}]
        }, arguments);
        return Promise.resolve(new Watcher(this, args.key, args.index, args.options));
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
                    let args = arguments;
                    let callback = args[args.length - 1];
                    delete args[args.length - 1];
                    args.length --;
                    let promise = self[name].apply(self, arguments);
                    promise.then((data) => {
                        callback(null, data);
                    }).catch((err) => {
                        callback(err);
                    });
                });
            }
        });
        this._synced = target;
        return target;
    }
}

exports = module.exports = BaseClient;
