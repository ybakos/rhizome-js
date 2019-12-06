'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ipfs = require('ipfs-http-client');
var chokidar = require('chokidar');
var NodeCache = require('node-cache');
var fs = require('fs');
var cwd = process.cwd();

var init = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ipfs, cache) {
    var fileTable, ipfsNode;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileTable = new cache();
            _context.next = 3;
            return new ipfs();

          case 3:
            ipfsNode = _context.sent;
            _context.next = 6;
            return ipfsNode.files.mkdir('/sharedPrivate', { create: true, parents: true });

          case 6:
            return _context.abrupt('return', { ipfsNode: ipfsNode, fileTable: fileTable });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function init(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var cacheCheck = function cacheCheck(path, hash, fileTable) {
  var matches = hash === fileTable.get(path);
  return matches;
};

var fileUpdate = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ipfsNode, rootDirHash, fileTable) {
    var files, updatedFiles;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return ipfsNode.ls(rootDirHash);

          case 2:
            files = _context3.sent;
            updatedFiles = files.map(function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(file) {
                var fileHashPath, filePath, data;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(file.type === 'dir')) {
                          _context2.next = 3;
                          break;
                        }

                        _context2.next = 3;
                        return fileUpdate(ipfsNode, file.path, fileTable);

                      case 3:
                        if (!(file.type === 'file')) {
                          _context2.next = 14;
                          break;
                        }

                        fileHashPath = file.path.split('/');

                        fileHashPath.shift();
                        filePath = '/' + fileHashPath.join('/');
                        //check fileTable

                        if (!cacheCheck(filePath, file.hash, fileTable)) {
                          _context2.next = 9;
                          break;
                        }

                        return _context2.abrupt('return');

                      case 9:
                        _context2.next = 11;
                        return ipfsNode.get(file.path);

                      case 11:
                        data = _context2.sent;

                        data = data[0].content.toString();
                        fs.writeFile(filePath, data, function (err) {
                          if (err) throw err;
                        });

                      case 14:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }());
            return _context3.abrupt('return', updatedFiles);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function fileUpdate(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var fsHeartbeat = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(node, fileTable) {
    var _ref5, rootDirHash;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return node.files.stat('/sharedPrivate');

          case 2:
            _ref5 = _context4.sent;
            rootDirHash = _ref5.hash;
            _context4.next = 6;
            return fileUpdate(node, rootDirHash, fileTable);

          case 6:
            return _context4.abrupt('return');

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function fsHeartbeat(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var watch = function watch(directory, ipfsNode, fileTable) {
  var privatePath = '/sharedPrivate';
  var watcher = chokidar.watch(directory, {
    ignored: [/(^|[\/\\])\../, function (string) {
      return string.includes('node_modules');
    }]
  });

  watcher.on('add', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(path) {
      var _ref7, hash;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return ipfsNode.files.write(privatePath + path, path, { create: true, parents: true });

            case 2:
              _context5.next = 4;
              return ipfsNode.files.stat(privatePath + path);

            case 4:
              _ref7 = _context5.sent;
              hash = _ref7.hash;
              _context5.next = 8;
              return fileTable.set(path, hash);

            case 8:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    }));

    return function (_x9) {
      return _ref6.apply(this, arguments);
    };
  }()).on('change', function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(path) {
      var _ref9, hash;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return ipfsNode.files.write(privatePath + path, path, { create: true, parents: true });

            case 2:
              _context6.next = 4;
              return ipfsNode.files.stat(privatePath + path);

            case 4:
              _ref9 = _context6.sent;
              hash = _ref9.hash;
              _context6.next = 8;
              return fileTable.set(path, hash);

            case 8:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    return function (_x10) {
      return _ref8.apply(this, arguments);
    };
  }()).on('unlink', function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(path) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return ipfsNode.files.rm(privatePath + path, { recursive: true });

            case 3:
              _context7.next = 5;
              return fileTable.del(path);

            case 5:
              _context7.next = 10;
              break;

            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7['catch'](0);

              console.log(_context7.t0, "oops");

            case 10:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined, [[0, 7]]);
    }));

    return function (_x11) {
      return _ref10.apply(this, arguments);
    };
  }()).on('error', function (path) {});
  return watcher;
};

var main = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { directory: cwd };

    var _ref12, ipfsNode, fileTable;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return init(ipfs, NodeCache, config.ipfsSettings);

          case 2:
            _ref12 = _context9.sent;
            ipfsNode = _ref12.ipfsNode;
            fileTable = _ref12.fileTable;
            _context9.next = 7;
            return fsHeartbeat(ipfsNode, fileTable);

          case 7:
            watch(directory + '/dev', ipfsNode, fileTable);
            //put into a worker
            _context9.next = 10;
            return setInterval(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
              return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _context8.next = 2;
                      return fsHeartbeat(ipfsNode, fileTable);

                    case 2:
                    case 'end':
                      return _context8.stop();
                  }
                }
              }, _callee8, undefined);
            })), config.interval || 5000);

          case 10:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function main() {
    return _ref11.apply(this, arguments);
  };
}();

module.exports = main;