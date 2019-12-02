// An information object, in the sense of "information as thing" (Buckland, 1991).

class Thing {

  constructor(information, uri, tags = []) {
    this._information = information
    this._uri = uri
    this._tags = tags
  }

  get information() {
    return this._information
  }

  get uri() {
    return this._uri
  }

  get tags() {
    return this._tags
  }

  tag(other) {
    if (this.isTagged(other)) return;
    this.tags.push(other.uri)
    other.tag(this)
  }

  isTagged(other) {
    return this.tags.includes(other.uri)
  }

}

module.exports = Thing
