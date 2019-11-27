// Information Continuum. The whole set of all information.

const Thing = require('./thing')

class Continuum {

  constructor(things = []) {
    this.things = things
  }

  get(uri) {
    return this.things[uri]
  }

  store(information) {
    return this.things[
      this.things.push(
        new Thing(information, this.things.length)
      ) - 1
    ]
  }

}

module.exports = Continuum
