// Repertory. A searchable catalog of information, like Otlet's Repertoire
// Bibliographique Universel (RBU).

class Repertory {

  constructor(index = {}) {
    this._index = index
  }

  get index() {
    return this._index
  }

  register(thing) {
    if (this._index[thing.information()]) return
    this._index[thing.information()] = thing.uri()
  }

  seek(information) {
    return this.index[information]
  }

}

module.exports = Repertory
