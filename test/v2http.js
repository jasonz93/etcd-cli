/**
 * Created by Nicholas on 2017/2/24.
 */
const Etcd = require('../');
const {expect} = require('chai');

let etcd = new Etcd.V2HTTPClient('127.0.0.1:2379');

describe('Etcd API v2 HttpClient', () => {
    it('Try to get a key which is not exists.', (done) => {
        etcd.get('/key/not/exists', (err, data) => {
            expect(err).not.to.be.equal(null);
            expect(err.errorCode).to.be.equal(100);
            done();
        });
    });

    it('Try to set a key', (done) => {
        etcd.set('/unittest/akey', 'hello', (err, data) => {
            expect(err).to.be.equal(null);
            expect(data.action).to.be.equal('set');
            expect(data.node.value).to.be.equal('hello');
            done();
        })
    });

    it('Try to delete the key created before.', (done) => {
        etcd.delete('/unittest/akey', (err, data) => {
            expect(err).to.be.equal(null);
            expect(data.action).to.be.equal('delete');
            expect(typeof data.node.value).to.be.equal('undefined');
            done();
        });
    });
});
