const _ = require('lodash');
const isIPFS = require('is-ipfs');

class PublicFileManager {

  constructor(ipfs, redis){
    return new Promise((resolve, reject)=>{
      this.ipfs = ipfs;
      this.datastore = redis;
      ipfs.id((err, id) => {
        this.publicKey = id.publicKey;
        resolve(this);
      })
    });
  }

  async upload(fileBuffer) {
    const multihash = await this.ipfs.add(fileBuffer);
    const hash = multihash[0].hash;
    await this.link(hash, this.publicKey);

    return hash;
  }
  
  async link(hash, tag) {
    
    await this.datastore.append(hash, `${tag}_`);
    await this.datastore.append(tag, `${hash}_`);

    return true;
  }

  async retrieveLinks(rootHash) {
    return new Promise((resolve, reject)=> {
      this.datastore.get(rootHash, (err, value)=> {
        if (err) reject(err);
        if (value === null || value === undefined) return undefined;
        const hashes = value.split('_');
        //remove out public key entries
        const filteredHashes = _.filter(hashes, isIPFS.multihash);
        resolve(filteredHashes);
      });
    })
  }

  async retrieveLinksRecursive(hashes, knownHashes = []) {

    const nestedHashes = _.map(hashes, async(rootHash)=> {
      console.log(rootHash)
      return this.retrieveLinks(rootHash);
    });
    const resolvedHashes = await Promise.all(nestedHashes);
    const flattenedHashes = _.flatten(resolvedHashes);
    const filteredHashes = _.filter(flattenedHashes, null);
    const newKnownHashes= _.merge(filteredHashes, knownHashes );
    const uniqueHashes = _.uniq(newKnownHashes);

    if (uniqueHashes.length === knownHashes.length) {
      return uniqueHashes;
    } else {
      return this.retrieveLinksRecursive(_.difference(uniqueHashes,nestedHashes), uniqueHashes);
    }
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