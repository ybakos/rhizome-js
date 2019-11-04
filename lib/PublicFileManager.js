const _ = require('lodash');
const isIPFS = require('is-ipfs');

class PublicFileManager {

  constructor(ipfs, redis){
    return new Promise((resolve, reject)=>{
      this.ipfs = ipfs;
      this.datastore = redis;
      if (process.env.DOCKER) {
        this.publicKey = 'CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/LrOGvOZOpzEBCxLyszbbETRQhH4xwgi0d+M75ZcdVSyaOlHv8CQeaj0zbBJU2Oz034tzVHeUcoH3UPT89zOXYyakDwllz5Rb3ZSTPWqa3kLnK6FsZEn4YHkSJCdoDvltITCae3h+a2nq6rGCYm7uwYKTa3Q8IDdPoVsKoHAmPJFrGnamsJEa2i8GAPAx9YKGybErshzfIRkZYEmKBybGupZZjXlAr5BNV4F6WfjpqOzkwZf6kd0aqGW3b4zgQG9b1101csd1WKJB369opAEbvi8VdKmBz2hY8PQTEeSEFnq352tdITkO6g3Wn+n5cvii86FNqglT/3A/hDUqAGV7AgMBAAE=';
        resolve(this);
      }else{
        ipfs.id((err, id) => {
          this.publicKey = id.publicKey;
          resolve(this);
        })
      }
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
        if (value == null || value == undefined) {
          resolve(false);
          return;
        }
        const hashes = value.split('_');
        //remove out public key entries
        const filteredHashes = _.filter(hashes, isIPFS.multihash);
        resolve(filteredHashes);
      });
    })
  }  

  async retrieveLinksRecursive(hashes, knownHashes = []) {
    const nestedHashes = _.map(hashes,(rootHash)=> {

      return this.retrieveLinks(rootHash);
    });
    const retrievedHashes = await Promise.all(nestedHashes);
    const flattenedHashes = _.flatten(retrievedHashes);
    if (_.isEmpty(flattenedHashes)) { return knownHashes};
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

  async share(message, link) {
    const hash = await this.upload(message);

    return await this.link(hash, link);
  }

}

module.exports = PublicFileManager;