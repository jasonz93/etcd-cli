/**
 * Created by Nicholas on 2017/2/24.
 */
const Etcd = require('../');
const {expect} = require('chai');

let etcd = new Etcd.V2HTTPClient('127.0.0.1:2379').promisify();

describe('Etcd API v2 HttpClient', () => {
    it('Try to get a key which is not exists.', (done) => {
        etcd.get('/key/not/exists').then((data) => {
        }).catch((err) => {
            expect(err).not.to.be.equal(null);
            expect(err.errorCode).to.be.equal(100);
            done();
        });
    });

    it('Try to set a key with string value', (done) => {
        etcd.set('/unittest/akey', 'hello').then((data) => {
            expect(data.action).to.be.equal('set');
            expect(data.node.value).to.be.equal('hello');
            done();
        }).catch(done)
    });

    it('Try to update an unexist key', (done) => {
        etcd.update('/unittest/notexist', 'foo').then((data) => {
        }).catch((err) => {
            expect(err).not.to.be.equal(null);
            expect(err.errorCode).to.be.equal(100);
            done();
        });
    });

    it('Try to update a key', (done) => {
        etcd.update('/unittest/akey', 'updated').then(etcd.get('/unittest/akey')).then((data) => {
            expect(data.node.value).to.be.equal('updated');
            done();
        }).catch(done);
    });

    it('Try to remove the key created before.', (done) => {
        etcd.remove('/unittest/akey').then((data) => {
            expect(data.action).to.be.equal('delete');
            expect(typeof data.node.value).to.be.equal('undefined');
            done();
        }).catch(done);
    });
});
