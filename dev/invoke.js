const Redis = require('redis');
const IPFSAPI = require('ipfs-http-client');
const _ = require('lodash');
const { PublicFileManager, tui } = require('../index');

( async()=>{
  const ipfs = await new IPFSAPI('127.0.0.1', 5001);   
  const redis = Redis.createClient({host: 'localhost'});
  const PFM = await new PublicFileManager(ipfs,redis);

  // tui();
})();
  