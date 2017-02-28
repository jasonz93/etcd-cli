/**
 * Created by Nicholas on 2017/2/24.
 */
const {expect} = require('chai');
const Etcd = require('../');

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
        etcd.raw('GET', '/123', null, (err, data) => {
            expect(err).not.to.be.equal(null);
            expect(err.message).to.be.equal('API Not Found.');
            done();
        })
    });

    it('Test raw request with keys api.', (done) => {
        etcd.raw('GET', '/v2/keys', null, (err, data) => {
            expect(err).to.be.equal(null);
            expect(data).not.to.be.equal(null);
            expect(data.action).to.be.equal('get');
            done();
        })
    });
});