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

    it('Try to set a key with string value', (done) => {
        etcd.set('/unittest/akey', 'hello', (err, data) => {
            expect(err).to.be.equal(null);
            expect(data.action).to.be.equal('set');
            expect(data.node.value).to.be.equal('hello');
            done();
        })
    });

    it('Try to update an unexist key', (done) => {
        etcd.update('/unittest/notexist', 'foo', (err, data) => {
            expect(err).not.to.be.equal(null);
            done();
        })
    });

    it('Try to update a key', (done) => {
        etcd.update('/unittest/akey', 'updated', (err, data) => {
            expect(err).to.be.equal(null);
            etcd.get('/unittest/akey', (err, data) => {
                expect(err).to.be.equal(null);
                expect(data.node.value).to.be.equal('updated');
                done();
            })
        })
    });

    it('Try to remove the key created before.', (done) => {
        etcd.remove('/unittest/akey', (err, data) => {
            expect(err).to.be.equal(null);
            expect(data.action).to.be.equal('delete');
            expect(typeof data.node.value).to.be.equal('undefined');
            done();
        });
    });
});
