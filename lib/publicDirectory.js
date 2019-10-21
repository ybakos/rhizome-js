
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
  const message1 = await PFM.upload(Buffer.from("Hey dude1"));
  const message2 = await PFM.upload(Buffer.from("Hey dude2"));
  const message3 = await PFM.upload(Buffer.from("Hey dude3"));

  await PFM.link(message, message1);
  await PFM.link(message1, message2);
  await PFM.link(message2, message3);
  console.log(await PFM.retrieveLinksRecursive([message]));

  console.log(message1,message2,message3)
  // //put into a worker
  // if (process.env.DOCKER) {
  //   await setInterval(async() => {
  //     const links = await PFM.retrieveLinks(ipfsNode, fileTable);
  //     console.log(await PFM.resolveLinks(links));
  //   }, config.interval|| 5000);
  // }else{
    
  // };
  redis.set(message, '');
  redis.set(message1, '');
  redis.set(message2, '');
  redis.set(message3, '');
}


module.exports = main;