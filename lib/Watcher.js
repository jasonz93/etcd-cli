/**
 * Created by Nicholas on 2017/2/25.
 */
const events = require('events');
const Promise = require('bluebird');
const arguejs = require('arguejs');

class Watcher extends events.EventEmitter {
    constructor(client, key, index, options) {
        super();
        let args = arguejs({
            client: Object,
            key: String,
            index: [Number, undefined],
            options: [Object, {}]
        }, arguments);
        this._client = args.client;
        this._key = args.key;
        this._index = args.index;
        this._options = args.options;
        this._started = false;
    }

    start() {
        return Promise.method(() => {
            if (!this._started) {
                this._started = true;
                this.watch();
                this.emit('start', {
                    key: this._key
                });
            }
        })();
    }

    stop() {
        return Promise.method(() => {
            if (this._retry) {
                clearTimeout(this._retry);
                delete this._retry;
            }
            this._started = false;
            this.emit('stop', {
                key: this._key,
                index: this._index
            });
        })();
    }

    watch() {
        this._client.watch(this._key, this._index, this._options).then((data) => {
            if (this._started) {
                this._index = data.node.modifiedIndex + 1;
                this.watch();
                this.emit(data.action, data);
                switch (data.action) {
                    case 'set':
                    case 'compareAndSwap':
                        this.emit('change', data);
                        break;
                }
            }
        }).catch((err) => {
            this.emit('error', err);
            this._retry = setTimeout(() => {
                this.watch();
            }, 5000);
        });
    }
}

exports = module.exports = Watcher;
