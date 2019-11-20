const Redis = require('redis');
const IPFSAPI = require('ipfs-http-client');
const _ = require('lodash');
const { PublicFileManager } = require('../index');
const tui = require('../lib/tui/tui');

(async()=>{

  const ipfs = await new IPFSAPI('127.0.0.1', 5001);   
  const redis = Redis.createClient({host: 'keen-whale-446f10c431.redisgreen.net', port:11042, password: 'a1e101ba45b240059d3f2241e45182a1'});
  const PFM = await new PublicFileManager(ipfs,redis);
  
  tui(PFM);
}
)();