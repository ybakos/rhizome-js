'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var isIPFS = require('is-ipfs');

var Rhizome = function () {
  function Rhizome(ipfs, redis) {
    var _this = this;

    _classCallCheck(this, Rhizome);

    return new Promise(function (resolve, reject) {
      _this.ipfs = ipfs;
      _this.datastore = redis;
      ipfs.id(function (err, id) {
        _this.publicKey = id.publicKey;
        resolve(_this);
      });
    });
  }

  _createClass(Rhizome, [{
    key: 'upload',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileBuffer) {
        var multihash, hash;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.ipfs.add(fileBuffer);

              case 2:
                multihash = _context.sent;
                hash = multihash[0].hash;
                _context.next = 6;
                return this.link(hash, this.publicKey);

              case 6:
                return _context.abrupt('return', hash);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function upload(_x) {
        return _ref.apply(this, arguments);
      }

      return upload;
    }()
  }, {
    key: 'read',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(hash) {
        var contentObject;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.ipfs.get(hash);

              case 2:
                contentObject = _context2.sent;
                return _context2.abrupt('return', contentObject[0].content.toString());

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function read(_x2) {
        return _ref2.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: 'link',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(hash, tag) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.datastore.append(hash, tag + '_');

              case 2:
                _context3.next = 4;
                return this.datastore.append(tag, hash + '_');

              case 4:
                return _context3.abrupt('return', true);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function link(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return link;
    }()
  }, {
    key: 'retrieveLinks',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(index) {
        var _this2 = this;

        var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isIPFS.multihash;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (index === '') index = this.publicKey;
                return _context4.abrupt('return', new Promise(function (resolve, reject) {
                  _this2.datastore.get(index, function (err, value) {
                    if (err) reject(err);
                    if (value == null || value == undefined) {
                      resolve(false);
                      return;
                    }
                    var hashes = value.split('_');
                    //remove out public key entries
                    var filteredHashes = _.filter(hashes, filter);
                    resolve(filteredHashes);
                  });
                }));

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function retrieveLinks(_x5) {
        return _ref4.apply(this, arguments);
      }

      return retrieveLinks;
    }()
  }, {
    key: 'retrieveLinksRecursive',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(hashes) {
        var _this3 = this;

        var knownHashes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var nestedHashes, retrievedHashes, flattenedHashes, filteredHashes, newKnownHashes, uniqueHashes;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                nestedHashes = _.map(hashes, function (rootHash) {
                  return _this3.retrieveLinks(rootHash);
                });
                _context5.next = 3;
                return Promise.all(nestedHashes);

              case 3:
                retrievedHashes = _context5.sent;
                flattenedHashes = _.flatten(retrievedHashes);

                if (!_.isEmpty(flattenedHashes)) {
                  _context5.next = 7;
                  break;
                }

                return _context5.abrupt('return', knownHashes);

              case 7:
                ;
                filteredHashes = _.filter(flattenedHashes, null);
                newKnownHashes = _.merge(filteredHashes, knownHashes);
                uniqueHashes = _.uniq(newKnownHashes);

                if (!(uniqueHashes.length === knownHashes.length)) {
                  _context5.next = 15;
                  break;
                }

                return _context5.abrupt('return', uniqueHashes);

              case 15:
                return _context5.abrupt('return', this.retrieveLinksRecursive(_.difference(uniqueHashes, nestedHashes), uniqueHashes));

              case 16:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function retrieveLinksRecursive(_x7) {
        return _ref5.apply(this, arguments);
      }

      return retrieveLinksRecursive;
    }()
  }, {
    key: 'resolveLinks',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(links) {
        var _this4 = this;

        var hashLinks, ipfsPromises;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                hashLinks = _.map(links, function (link) {
                  if (isIPFS.multihash(link)) return link;
                });
                ipfsPromises = _.map(hashLinks, function (hash) {
                  return _this4.ipfs.get(hash);
                });
                _context6.next = 4;
                return Promise.all(ipfsPromises);

              case 4:
                return _context6.abrupt('return', _context6.sent);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function resolveLinks(_x9) {
        return _ref6.apply(this, arguments);
      }

      return resolveLinks;
    }()
  }, {
    key: 'share',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(message, link) {
        var hash;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.upload(message);

              case 2:
                hash = _context7.sent;
                _context7.next = 5;
                return this.link(hash, link);

              case 5:
                return _context7.abrupt('return', _context7.sent);

              case 6:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function share(_x10, _x11) {
        return _ref7.apply(this, arguments);
      }

      return share;
    }()
  }]);

  return Rhizome;
}();

module.exports = Rhizome;