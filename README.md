# etcd-cli
A new promisify etcd client with more available options

## Quick start
```javascript
const Etcd = require('etcd-cli');

let etcd = new Etcd.V2HTTPClient('127.0.0.1:2379');

// Get content of a key
etcd.get('/some/key').then(console.log);

// Set content of a key
etcd.set('/some/key', 'foobar').then(console.log);

// Delete a key
etcd.remove('/some/key').then(console.log);

// Set a key with ttl of 30 seconds
etcd.set('/some/key', 'foobar', {
    ttl: 30
}).then(console.log);

// Refresh ttl of a key
etcd.ttl('/some/key', 30).then(console.log);

```

## Basic usage
```javascript
let etcd = new V2HTTPClient(hosts);
etcd.get(key, [options]);
etcd.set(key, value, [options]);
etcd.remove(key, [options]);
etcd.ttl(key, ttl);

let watcher = etcd.watcher(key, [options]);
watcher.on('change', (data) => {});
```
### Params
- hosts: Etcd hosts, can be a string or array in following patterns `http://127.0.0.1:2379` `127.0.0.1:2379`
- options: Object of operation options. Here is all available options: (Alse see official v2 API documents)
```
{
    refresh: false,     // When setting ttl
    recursive: true,    // Get nodes recursive
    ttl: 30,            // TTL is 30 seconds
    prevExist: true,    // Update
    prevIndex: 1000,    // CompareAndSwap
    prevValue: 'foobar',// CompareAndSwap
    noValueOnSuccess: true, // Skips returning the node as value
    wait: false,        // Used for watcher
    waitIndex: 1000     // Used for watcher
}
```

- value: Value of the node, must be a string
- ttl: TTL of the node, must be a number in seconds

