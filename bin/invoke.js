const Redis = require('redis');
const IPFSAPI = require('ipfs-http-client');
const _ = require('lodash');
const { Rhizome } = require('../index');

const localHostRunner = async()=>{
  const ipfs = await new IPFSAPI('127.0.0.1', 5001);   
  const redis = Redis.createClient({host: 'localhost'});
  const PFM = await new Rhizome(ipfs,redis);
  
  return PFM;
}

module.exports = localHostRunner;
  