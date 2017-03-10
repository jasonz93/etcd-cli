/**
 * Created by Nicholas on 2017/2/24.
 */
const _ = require('lodash');
const url_ = require('url');
const request = require('request');
const BaseClient = require('./BaseClient');
const arguejs = require('arguejs');

class BaseHttpClient extends BaseClient {
    constructor(hosts, options) {
        super();
        this.optLocations = {
            'refresh': 'form',
            'recursive': 'qs',
            'ttl': 'form',
            'prevExist': 'form',
            'prevIndex': 'qs',
            'prevValue': 'qs',
            'noValueOnSuccess': 'qs',
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
     * @returns {Promise.<*>}
     */
    raw(method, path, value, options) {
        let args = arguejs({
            method: String,
            path: String,
            value: [String, null],
            options: [Object, {}]
        }, arguments);
        let opt = this.buildOptions(args.options);
        if (args.value) {
            _.mergeWith(opt, {
                form: {
                    value: value
                }
            });
        }
        opt.method = args.method;
        return new Promise((resolve, reject) => {
            request(url_.resolve(this.getHost(), args.path), opt, (err, response, data) => {
                if (err) {
                    //TODO: Failover
                    return reject(err);
                } else {
                    if (response.statusCode === 200) {
                        data = JSON.parse(data);
                        data.etcdIndex = Number(response.headers['x-etcd-index']);
                        data.etcdClusterId = response.headers['x-etcd-cluster-id'];
                        data.raftIndex = Number(response.headers['x-raft-index']);
                        data.raftTerm = Number(response.headers['x-raft-term']);
                        return resolve(data);
                    } else {
                        let contentType = response.headers['content-type'];
                        if (typeof contentType === 'string' && contentType.indexOf('application/json') >= 0) {
                            let json = JSON.parse(data);
                            let error = this.handleResponseError(json);
                            if (error) {
                                return reject(error);
                            } else {
                                return resolve(json);
                            }
                        } else {
                            if (response.statusCode === 404) {
                                return reject(new Error('API Not Found.'));
                            } else {
                                //TODO: Failover
                                let err = new Error('Unknown error.');
                                err.httpData = data;
                                return reject(err);
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     *
     * @param data
     * @returns {Promise.<T>}
     */
    handleResponseError(data) {

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