
const Redis = require('redis');
const IPFSAPI = require('ipfs-http-client');
const PublicFileManager = require('./PublicFileManager');

const redisHost = (process.env.DOCKER) ? 'host.docker.internal' : 'localhost';

const main = async()=> { 
  let ipfs;
  
  if (process.env.DOCKER) {
    const IPFSFactory = require('ipfsd-ctl');
    const f = IPFSFactory.create();
    const ipfsd = await f.spawn();
    ipfs = ipfsd.api;
  }else{
    ipfs = await new IPFSAPI('127.0.0.1', 5001);
  };

  const redis = Redis.createClient({host: redisHost});
  const PFM = await new PublicFileManager(ipfs,redis);
  const message = await PFM.upload(Buffer.from("Hey dude"));
  await PFM.link(message, 'tobyMcguire');
  
  console.log(await PFM.retrieveLinks(message));
  redis.set(message, '');
}


module.exports = main;