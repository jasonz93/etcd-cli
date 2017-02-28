/**
 * Created by Nicholas on 2017/2/28.
 */
const {expect} = require('chai');
const Etcd = require('../');
const Watcher = require('../lib/Watcher');

describe('Test watcher', () => {
    let etcd = new Etcd.V2HTTPClient('127.0.0.1:2379');

    it('Initialize data', (done) => {
        etcd.set('/unittest/watcher', 'initdata', (err, data) => {
            expect(err).to.be.equal(null);
            done();
        });
    })

    it('Watch data', (done) => {
        let watcher = new Watcher(etcd, '/unittest/watcher');
        watcher.on('change', (data) => {
            expect(data).not.to.be.equal(null);
            expect(data.node.value).to.be.equal('testdata');
            done();
        });
        watcher.start(() => {
            etcd.set('/unittest/watcher', 'testdata', (err, data) => {
                expect(err).to.be.equal(null);
            });
        });
    });

    it('Watch childs', (done) => {
        let watcher = new Watcher(etcd, '/unittest', null, {
            recursive: true
        });
        watcher.on('change', (childs) => {
            done();
        });
        watcher.start();
        etcd.set('/unittest/child/1', 'child1data', (err, data) => {
            expect(err).to.be.equal(null);
        });
        // etcd.set('/unittest/wchild', null, {dir: true}, (err) => {
        //     expect(err).to.be.equal(null);
        //
        // });
    })
});