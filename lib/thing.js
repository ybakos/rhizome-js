// An information object, in the sense of "information as thing" (Buckland, 1991).

class Thing {

  constructor(information, uri, tags = [], targets = []) {
    this._information = information
    this._uri = uri
    this._tags = tags
    this._targets = targets
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

  get targets() {
    return this._targets
  }

  tag_with(other) {
    if (this.isTaggedBy(other)) return;
    this.tags.push(other.uri)
    other.tag(this)
  }

  tag(target) {
    if (this.isTagging(target)) return;
    this.targets.push(target.uri)
    target.tag_with(this)
  }

  isTaggedBy(other) {
    return this.tags.includes(other.uri)
  }

  isTagging(target) {
    return this.targets.includes(target.uri)
  }

}

module.exports = Thing
