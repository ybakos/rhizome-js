const fs = require('fs');
const os = require('os');
const Redis = require('redis');
const IPFSDaemonFactory = require('ipfsd-ctl');
const { Rhizome } = require('../src/index');
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
    host: 'hasty-aster-9378599e80.redisgreen.net',
    port: 11042,
    password: '683739877feb4c2ebeade9d9b39d7a51'
  })
  new Tui(await new Rhizome(ipfsDaemon.api, redisClient)).render();
})();
