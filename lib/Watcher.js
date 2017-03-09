/**
 * Created by Nicholas on 2017/2/25.
 */
const events = require('events');

class Watcher extends events.EventEmitter {
    constructor(client, key, index, options) {
        super();
        this._client = client;
        this._key = key;
        this._index = index;
        this._options = options;
        this._started = false;
    }

    start(callback) {
        if (!this._started) {
            this._started = true;
            this.watch();
            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    stop(callback) {
        if (this._retry) {
            clearTimeout(this._retry);
            delete this._retry;
        }
        this._started = false;
        callback(null);
    }

    watch() {
        this._client.watch(this._key, this._index, this._options, (err, data) => {
            if (err) {
                this.emit('error', err);
                this._retry = setTimeout(() => {
                    this.watch(this._key, this._index, this._options);
                }, 5000);
            } else {
                this._index = data.node.modifiedIndex + 1;
                this.watch(this._key, this._index, this._options);
                if (this._started) {
                    this.emit(data.action, data);
                    if (data.action === 'set') {
                        this.emit('change', data);
                    }
                }
            }
        });
    }
}

module.exports = Watcher;