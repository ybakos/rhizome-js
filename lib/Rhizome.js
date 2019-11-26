const _ = require('lodash');
const isIPFS = require('is-ipfs');

class Rhizome {

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

  async read(hash) {
    const contentObject = await this.ipfs.get(hash);
    return contentObject[0].content.toString();
  }

  async link(hash, tag) {
    await this.datastore.append(hash, `${tag}_`);
    await this.datastore.append(tag, `${hash}_`);

    return true;
  }

  async retrieveLinks(index) {
    if (index === '') index = this.publicKey;
    return new Promise((resolve, reject)=> {
      this.datastore.get(index, (err, value)=> {
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

module.exports = Rhizome;
