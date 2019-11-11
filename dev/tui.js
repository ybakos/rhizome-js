const Redis = require('redis');
const IPFSAPI = require('ipfs-http-client');
const _ = require('lodash');
const { PublicFileManager, tui } = require('../index');

(async()=>{
  //this is for dynamic spawning, new private key is generated every time though
    // const IPFSFactory = require('ipfsd-ctl');
    // const f = IPFSFactory.create();
    // const ipfsd = await f.spawn();
    // ipfs = ipfsd.api; 
  const ipfs = await new IPFSAPI('127.0.0.1', 5001);   
  const redis = Redis.createClient({host: 'keen-whale-446f10c431.redisgreen.net', port:11042, password: 'a1e101ba45b240059d3f2241e45182a1'});
  const PFM = await new PublicFileManager(ipfs,redis);
  
  tui(PFM);
}
)();