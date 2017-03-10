/**
 * Created by Nicholas on 2017/2/28.
 */
const {expect} = require('chai');
const Etcd = require('../');
const Watcher = require('../lib/Watcher');

describe('Test watcher', () => {
    let etcd = new Etcd.V2HTTPClient('127.0.0.1:2379');

    it('Initialize data', (done) => {
        etcd.set('/unittest/watcher', 'initdata').then(() => {
            done();
        }).catch(done);
    });

    it('Watch data', (done) => {
        let watcher = etcd.watcher('/unittest/watcher').then((watcher) => {
            watcher.on('change', (data) => {
                expect(data).not.to.be.equal(null);
                expect(data.node.value).to.be.equal('testdata');
                done();
            });
            watcher.start().then(() => {
                etcd.set('/unittest/watcher', 'testdata').catch(done);
            });
        });
    });

    it('Watch childs', (done) => {
        let watcher = new Watcher(etcd, '/unittest', {
            recursive: true
        });
        watcher.on('change', (childs) => {
            done();
        });
        watcher.start();
        etcd.set('/unittest/child/1', 'child1data').then(() => {
            done();
        }).catch(done);
    })
});