const fs = require('fs');
const os = require('os');
const Redis = require('redis');
const IPFSDaemonFactory = require('ipfsd-ctl');
const { Rhizome } = require('../index');
const Tui = require('../tui/tui');

(async () => {
  // Spawn a non-disposable (deterministic key generation from init
  // file) daemon.
  const ipfsDaemon = await IPFSDaemonFactory.create().spawn({
    init: !fs.existsSync(`${os.homedir()}/.ipfs`),
    disposable: false,
    start: true
  });
  const redisClient = Redis.createClient({
    host: 'sprightly-redwood-7a63d23fa9.redisgreen.net',
    port: 11042,
    password: 'a4f74e5842c24c8db40013fc20ab8200'
  })
  new Tui(await new Rhizome(ipfsDaemon.api, redisClient)).render();
})();
