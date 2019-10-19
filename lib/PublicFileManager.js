const _ = require('lodash');

class PublicFileManager {

  constructor(ipfs, redis){
    return new Promise((resolve, reject)=>{
      this.ipfs = ipfs;
      this.datastore = redis;
      ipfs.key.list((err,keys) => {
        this.publicKey = keys[0];
        resolve(this);
      });
    });
  }

  async upload(fileBuffer) {
    const hash = await this.ipfs.add(fileBuffer)[0].hash;
    await this.datastore.append(this.publicKey, `${hash}/`);
    await this.datastore.append(hash, `${this.publicKey}/`);

    return true;
  }
  
  async link(hash, tag) {
    await this.datastore.append(hash, `${tag}/`);
    await this.datastore.append(tag, `${hash}/`);

    return true;
  }

  async retrieveLinks(rootHash) {
    const hashString = await this.datastore.get(rootHash);
    const hashes = hashString.split('/');

    return hashes;
  }

  async resolveLinks(hashLinks){
    const ipfsPromises = _.map(hashLinks, hash => {
      return this.ipfs.get(hash);
    });

    return await Promise.all(ipfsPromises);
  }

}

module.exports = PublicFileManager;