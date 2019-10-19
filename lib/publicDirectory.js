
const Redis = require('redis');
const IPFS = require('ipfs-http-client');
const PublicFileManager = require('./PublicFileManager');


const main = async()=> { 
  const ipfs = await new IPFS();
  const redis = Redis.createClient();
  const PFM = await new PublicFileManager(ipfs,redis);
  
}


module.exports = main;