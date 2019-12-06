"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// An information object, in the sense of "information as thing" (Buckland, 1991).

var Thing = function () {
  function Thing(information, uri) {
    var tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, Thing);

    this._information = information;
    this._uri = uri;
    this._tags = tags;
  }

  _createClass(Thing, [{
    key: "tag",
    value: function tag(other) {
      if (this.isTagged(other)) return;
      this.tags.push(other.uri);
      other.tag(this);
    }
  }, {
    key: "isTagged",
    value: function isTagged(other) {
      return this.tags.includes(other.uri);
    }
  }, {
    key: "information",
    get: function get() {
      return this._information;
    }
  }, {
    key: "uri",
    get: function get() {
      return this._uri;
    }
  }, {
    key: "tags",
    get: function get() {
      return this._tags;
    }
  }]);

  return Thing;
}();

module.exports = Thing;