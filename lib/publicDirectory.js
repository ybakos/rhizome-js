
const Redis = require('redis');
const IPFSAPI = require('ipfs-http-client');
const PublicFileManager = require('./PublicFileManager');
const _ = require('lodash');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const helperMessenger = (destination, PFM)=> {
  readline.question(`Please enter your message: `,async(message) => {
    await PFM.share(Buffer.from(message), destination);
    return await helperMessenger(destination,PFM);
  })
}

const redisHost = (process.env.DOCKER) ? 'host.docker.internal' : 'localhost';

const main = async()=> { 
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
  
  if (!process.env.DOCKER) {
    return readline.question(`Please enter you destination: `, async(destination) => {
      await helperMessenger(destination, PFM);
    })
  }

  //put into a worker
  if (process.env.DOCKER) {
    console.log(PFM.publicKey);
    let knownMessages = [];
    await setInterval(async() => {
      
      const links = await PFM.retrieveLinksRecursive([PFM.publicKey]);
      const resolvedHashes = await PFM.resolveLinks(links);
      const newMessages = _.differenceWith(resolvedHashes,knownMessages, _.isEqual );
      _.map(newMessages, hash => {
        console.log(hash[0].content.toString());
        knownMessages.push(hash);
      });
    }, 5000);
  }
}


module.exports = main;