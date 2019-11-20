const Redis = require('redis');

// const IPFSAPI = require('ipfsd-ctl');
const _ = require('lodash');
const { PublicFileManager } = require('../index');
const tui = require('../lib/tui/tui');
const fs = require('fs');
const os = require('os');

(async()=>{
  //this is for dynamic spawning of a ipfs daemon
  const IPFSAPI = require('ipfsd-ctl');
  const f = IPFSAPI.create();
  const homedir = os.homedir();
  let init;
  //if the ipfs init file exists, don't init the daemon and visa versa
  try {
   fs.statSync(`${homedir}/.ipfs`);
   init = false;
  } catch (error) {
    init = true;
  }
  //spawn a non-disposable(deterministic key generation from init file) daemon
  const ipfsd = await f.spawn({init: init, disposable: false , start: true});
  ipfs = ipfsd.api;   
  const redis = Redis.createClient({host: 'sprightly-redwood-7a63d23fa9.redisgreen.net', port:11042, password: 'a4f74e5842c24c8db40013fc20ab8200'});
  
  const PFM = await new PublicFileManager(ipfs,redis);
  
  tui(PFM);
}
)();