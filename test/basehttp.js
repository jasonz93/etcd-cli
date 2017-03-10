/**
 * Created by Nicholas on 2017/2/24.
 */
const {expect} = require('chai');
const Etcd = require('../');
const Promise = require('bluebird');

describe('Base http tests', () => {
    it('Test get host', () => {
        let vals = [
            ['127.0.0.1:2379', 'http://127.0.0.1:2379'],
            ['http://127.0.0.1:2379', 'http://127.0.0.1:2379'],
            ['https://127.0.0.1:2379', 'https://127.0.0.1:2379']
        ];
        vals.forEach((val) => {
            let etcd = new Etcd.BaseHttpClient(val[0]);
            expect(etcd.getHost()).to.be.equal(val[1]);
        })
    });

    let etcd = new Etcd.BaseHttpClient('127.0.0.1:2379');

    it('Test raw request with wrong api.', (done) => {
        etcd.raw('GET', '/123').then(() => {
            return Promise.reject(new Error('This should not run.'));
        }).catch((err) => {
            expect(err.message).to.have.string('API Not Found.');
            done();
        }).catch(done);
    });

    it('Test raw request with keys api.', (done) => {
        etcd.raw('GET', '/v2/keys').then((data) => {
            expect(data).not.to.be.equal(null);
            expect(data.action).to.be.equal('get');
            done();
        }).catch(done);
    });
});