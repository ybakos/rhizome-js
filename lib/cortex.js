
const _ = require('lodash');

//Cortex currently requires an instance of ipfs and redis.
class Cortex {

  constructor(ipfs, redis) {
    return new Promise((resolve) => {
      this.storage = ipfs;
      this.links = redis;
      this.storage.id((err, id) => {
        this.publicKey = id.publicKey;
        resolve(this);
      })
    });
  }
  
  //publish any "thing" so long as it has a uri to be able to link
  async publish(thing) {
    const multiHash = await this.storage.add(thing);
    const hash = multiHash[0].hash;
    //set the things content
    thing.content = hash;
    await this.link(thing.uri, this.publicKey);
    return thing;
  }

  //link any two URI's together
  async link(sourceUri, destinationUri) {
    await this.links.append(sourceUri, `${destinationUri}_`);
    await this.links.append(destinationUri, `${sourceUri}_`);
    return true;
  }

  //given any "thing", return that things content
  async viewContent(thing) {
    const contentObject = await this.storage.get(thing.content);
    return contentObject[0].content.toString();
  }

  //given any "thing" return the URI's of any things linked to it
  async getLinksByUri(thing) {
    return new Promise((resolve, reject) => {
      this.links.get(thing.uri, (err, value) => {
        if (err) reject(err);
        if (value == null || value == undefined) {
          resolve(false);
          return;
        }
        //now not filtering out public keys/ URI's 
        const uris = value.split('_');

        resolve(uris);
      });
    })
  }
}

module.exports = Cortex;