/**
 * Created by Nicholas on 2017/2/24.
 */
const Etcd = require('../');
const {expect} = require('chai');

let etcd = new Etcd.V2HTTPClient('127.0.0.1:2379').sync();

describe('Etcd API v2 HttpClient', () => {
    it('Try to get a key which is not exists.', () => {
        try {
            let data = etcd.get('/key/not/exists');
            expect(data).to.be.equal(null);
        } catch (err) {
            expect(err).not.to.be.equal(null);
            expect(err.errorCode).to.be.equal(100);
        }
    });

    it('Try to set a key with string value', () => {
        let data = etcd.set('/unittest/akey', 'hello');
        expect(data.action).to.be.equal('set');
        expect(data.node.value).to.be.equal('hello');
    });

    it('Try to update an unexist key', () => {
        try {
            let data = etcd.update('/unittest/notexist', 'foo');
            expect(data).to.be.equal(null);
        } catch (err) {
            expect(err).not.to.be.equal(null);
            expect(err.errorCode).to.be.equal(100);
        }
    });

    it('Try to update a key', () => {
        etcd.update('/unittest/akey', 'updated');
        let data = etcd.get('/unittest/akey');
        expect(data.node.value).to.be.equal('updated');
    });

    it('Try to remove the key created before.', () => {
        let data = etcd.remove('/unittest/akey');
        expect(data.action).to.be.equal('delete');
        expect(typeof data.node.value).to.be.equal('undefined');
    });
});
