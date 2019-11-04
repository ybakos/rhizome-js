const Redis = require('redis');
const IPFSAPI = require('ipfs-http-client');
const _ = require('lodash');
const { PublicFileManager } = require('../index');

let ipfs;

if (process.env.DOCKER) {
  // const IPFSFactory = require('ipfsd-ctl');
  // const f = IPFSFactory.create();
  // const ipfsd = await f.spawn();
  // ipfs = ipfsd.api;
  ipfs = await new IPFSAPI('ipfs.infura.io', 5001, {protocol: 'https'});    
}else{
  ipfs = await new IPFSAPI('127.0.0.1', 5001);
};    

const redis = Redis.createClient({host: redisHost});
const PFM = await new PublicFileManager(ipfs,redis);

