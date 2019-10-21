const _ = require('lodash');
const isIPFS = require('is-ipfs');

class PublicFileManager {

  constructor(ipfs, redis){
    return new Promise((resolve, reject)=>{
      this.ipfs = ipfs;
      this.datastore = redis;
      ipfs.key.list((err,keys) => {
        this.publicKey = keys[0].id;
        resolve(this);
      });
    });
  }

  async upload(fileBuffer) {
    const multihash = await this.ipfs.add(fileBuffer);
    const hash = multihash[0].hash;
    await this.datastore.append(this.publicKey, `${hash}/`);
    await this.datastore.append(hash, `${this.publicKey}/`);

    return hash;
  }
  
  async link(hash, tag) {
    await this.datastore.append(hash, `${tag}/`);
    await this.datastore.append(tag, `${hash}/`);

    return true;
  }

  async retrieveLinks(rootHash) {
    return new Promise((resolve, reject)=> {
      this.datastore.get(rootHash, (err, value)=> {
        if (err) reject(err);
        const hashes = value.split('/');
        resolve(hashes);
      });
    })
  }

  async resolveLinks(links){
    
    const hashLinks = _.map(links, link => {
      if (isIPFS.multihash(link)) return link;
    });

    const ipfsPromises = _.map(hashLinks, hash => {
      return this.ipfs.get(hash);
    });

    return await Promise.all(ipfsPromises);
  }

}

module.exports = PublicFileManager;