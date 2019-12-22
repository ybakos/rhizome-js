// Rhizome. A living distribution of all the world's information.

const Continuum = require('./continuum')
const Repertory = require('./repertory')

class Rhizome {

  constructor(continuum = new Continuum(), repertory = new Repertory()) {
    this._continuum = continuum
    this._repertory = repertory
  }

  store(information) {
    if (this.seek(information) != undefined) return this.seek(information)
    var thing = this._continuum.store(information)
    this._repertory.register(thing)
    return thing
  }

  retrieve(uri) {
    return this._continuum.retrieve(uri)
  }

  seek(information) {
    return this.retrieve(this._repertory.seek(information))
  }

}

module.exports = Rhizome
