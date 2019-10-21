
const Redis = require('redis');
const IPFS = require('ipfs-http-client');
const PublicFileManager = require('./PublicFileManager');


const main = async()=> { 
  const ipfs = await new IPFS();
  const redis = Redis.createClient();
  const PFM = await new PublicFileManager(ipfs,redis);
  const message = await PFM.upload(Buffer.from("Hey dude"));
  await PFM.link(message, 'tobyMcguire');
  
  console.log(await PFM.retrieveLinks(message));
  redis.set(message, '');
}


module.exports = main;