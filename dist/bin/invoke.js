'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs');
var os = require('os');
var Redis = require('redis');
var IPFSDaemonFactory = require('ipfsd-ctl');

var _require = require('../index'),
    Rhizome = _require.Rhizome;

module.exports = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var ipfsDaemon, redisClient;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return IPFSDaemonFactory.create().spawn({
            init: !fs.existsSync(os.homedir() + '/.ipfs'),
            disposable: false,
            start: true
          });

        case 2:
          ipfsDaemon = _context.sent;
          redisClient = Redis.createClient({
            host: 'hasty-aster-9378599e80.redisgreen.net',
            port: 11042,
            password: '683739877feb4c2ebeade9d9b39d7a51'
          });
          _context.next = 6;
          return new Rhizome(ipfsDaemon.api, redisClient);

        case 6:
          return _context.abrupt('return', _context.sent);

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));