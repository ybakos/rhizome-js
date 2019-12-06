'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var blessed = require('blessed');
var contrib = require('blessed-contrib');
var _ = require('lodash');

var SCREEN_CONFIG = { autoPadding: true, smartCSR: true };
var QUIT_KEYS = ['escape', 'q', 'C-c'];

var Tui = function () {
  function Tui(rhizome) {
    _classCallCheck(this, Tui);

    this.rhizome = rhizome;
    this.screen = blessed.screen(SCREEN_CONFIG);
    this.screen.key(QUIT_KEYS, function (ch, key) {
      return process.exit(0);
    });
    this.grid = new contrib.grid({ rows: 1, cols: 2, screen: this.screen });
    this.menuBar = this._menuBar();
    this.screen.append(this.menuBar);
  }

  _createClass(Tui, [{
    key: 'render',
    value: function render() {
      this.screen.render();
    }
  }, {
    key: 'createEntryTree',
    value: function createEntryTree() {
      var _this = this;

      this.tree = this.grid.set(0, 0, 1, 1, contrib.tree, { style: { text: 'red' },
        template: { lines: true },
        label: 'Filesystem Tree' });
      this.tree.setData({ name: 'Looker',
        extended: true,
        children: {
          'Create': {
            function: function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt('return', _this.createShareForm());

                      case 1:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function _function() {
                return _ref.apply(this, arguments);
              };
            }()
          },
          'Explore': {
            function: function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.abrupt('return', _this.createExploreForm());

                      case 1:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }));

              return function _function() {
                return _ref2.apply(this, arguments);
              };
            }()
          }
        }
      });
      this.tree.on('select', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(node) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return node.function();

                case 2:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this);
        }));

        return function (_x) {
          return _ref3.apply(this, arguments);
        };
      }());
      this.tree.focus();
    }
  }, {
    key: 'taggedTable',
    value: function taggedTable(data, tag) {
      var _this2 = this;

      var list = this.grid.set(0, 1, 1, 1, blessed.list, { keys: true,
        fg: 'green',
        label: 'Hashes tagged: ' + tag,
        columnWidth: [24, 10, 10] });
      var textbox = blessed.textarea({
        parent: list,
        name: 'Details',
        keys: true,
        bottom: 0,
        left: 10,
        height: 1,
        width: '50%',
        style: {
          fg: 'white',
          bg: 'black'
        }
      });
      var tagInputLabel = blessed.text({
        parent: list,
        bottom: 0,
        left: 0,
        content: 'Message:'
      });
      list.focus();
      list.setItems(data);
      list.on('select', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
          var message;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return _this2.rhizome.read(data.content);

                case 2:
                  message = _context4.sent;

                  textbox.setText(message);
                  list.focus();
                  _this2.render();

                case 6:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, _this2);
        }));

        return function (_x2) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'createShareForm',
    value: function createShareForm() {
      var _blessed$button,
          _blessed$button2,
          _this3 = this;

      var form = this.grid.set(0, 0, 1, 1, blessed.form, { keys: true,
        fg: 'green',
        label: 'Share',
        columnWidth: [24, 10, 10] });

      var textInput = blessed.textbox({
        parent: form,
        name: 'Text',
        input: true,
        mouse: true,
        keys: true,
        top: 3,
        left: 5,
        height: 1,
        width: '70%',
        style: {
          fg: 'white',
          bg: 'black',
          focus: {
            bg: 'red',
            fg: 'white'
          }
        }
      });

      var textInputLabel = blessed.text({
        parent: form,
        top: 3,
        left: 0,
        content: 'Text:'
      });

      var tagInput = blessed.textbox({
        parent: form,
        name: 'Tags',
        input: true,
        mouse: true,
        keys: true,
        top: 5,
        left: 5,
        height: 1,
        width: '70%',
        style: {
          fg: 'white',
          bg: 'black',
          focus: {
            bg: 'red',
            fg: 'white'
          }
        }
      });

      var tagInputLabel = blessed.text({
        parent: form,
        top: 5,
        left: 0,
        content: 'Tags:'
      });

      var submit = blessed.button((_blessed$button = {
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1
        },
        left: 10,
        top: 10
      }, _defineProperty(_blessed$button, 'shrink', true), _defineProperty(_blessed$button, 'name', 'submit'), _defineProperty(_blessed$button, 'content', 'submit'), _defineProperty(_blessed$button, 'style', {
        bg: 'blue',
        focus: {
          bg: 'red'
        },
        hover: {
          bg: 'red'
        }
      }), _blessed$button));

      var cancel = blessed.button((_blessed$button2 = {
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1
        },
        left: 20,
        top: 10
      }, _defineProperty(_blessed$button2, 'shrink', true), _defineProperty(_blessed$button2, 'name', 'cancel'), _defineProperty(_blessed$button2, 'content', 'cancel'), _defineProperty(_blessed$button2, 'style', {
        bg: 'blue',
        focus: {
          bg: 'red'
        },
        hover: {
          bg: 'red'
        }
      }), _blessed$button2));

      textInput.on('press', function () {
        textInput.focus();
      });

      tagInput.on('press', function () {
        tagInput.focus();
      });

      submit.on('press', function () {
        form.submit();
      });

      cancel.on('press', function () {
        _this3.createEntryTree();
        _this3.render();
      });

      form.on('submit', function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data) {
          var contentHash, tags;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return _this3.rhizome.upload(data.Text);

                case 2:
                  contentHash = _context6.sent;
                  tags = _.split(data.Tags, ',');

                  _.forEach(tags, function () {
                    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(tag) {
                      return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              _context5.next = 2;
                              return _this3.rhizome.link(contentHash, tag);

                            case 2:
                            case 'end':
                              return _context5.stop();
                          }
                        }
                      }, _callee5, _this3);
                    }));

                    return function (_x4) {
                      return _ref6.apply(this, arguments);
                    };
                  }());
                  form.setContent('Submitted.');
                  _this3.render();

                case 7:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, _this3);
        }));

        return function (_x3) {
          return _ref5.apply(this, arguments);
        };
      }());
      textInput.focus();
      this.render();
      return form;
    }

    // form for exploring content, should only return a input for tags and return all message linked with that tag

  }, {
    key: 'createExploreForm',
    value: function createExploreForm() {
      var _blessed$button3,
          _blessed$button4,
          _this4 = this;

      var form = this.grid.set(0, 0, 1, 1, blessed.form, { keys: true,
        fg: 'green',
        label: 'Explore',
        columnWidth: [24, 10, 10] });

      var tagInput = blessed.textbox({
        parent: form,
        name: 'Tag',
        input: true,
        mouse: true,
        keys: true,
        top: 5,
        left: 5,
        height: 1,
        width: '30%',
        style: {
          fg: 'white',
          bg: 'black',
          focus: {
            bg: 'red',
            fg: 'white'
          }
        }
      });

      var tagInputLabel = blessed.text({
        parent: form,
        top: 5,
        left: 0,
        content: 'Tag:'
      });

      var submit = blessed.button((_blessed$button3 = {
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1
        },
        left: 10,
        top: 10
      }, _defineProperty(_blessed$button3, 'shrink', true), _defineProperty(_blessed$button3, 'name', 'submit'), _defineProperty(_blessed$button3, 'content', 'submit'), _defineProperty(_blessed$button3, 'style', {
        bg: 'blue',
        focus: {
          bg: 'red'
        },
        hover: {
          bg: 'red'
        }
      }), _blessed$button3));

      var cancel = blessed.button((_blessed$button4 = {
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1
        },
        left: 20,
        top: 10
      }, _defineProperty(_blessed$button4, 'shrink', true), _defineProperty(_blessed$button4, 'name', 'cancel'), _defineProperty(_blessed$button4, 'content', 'cancel'), _defineProperty(_blessed$button4, 'style', {
        bg: 'blue',
        focus: {
          bg: 'red'
        },
        hover: {
          bg: 'red'
        }
      }), _blessed$button4));

      tagInput.on('press', function () {
        tagInput.focus();
      });

      submit.on('press', function () {
        form.submit();
      });

      cancel.on('press', function () {
        _this4.createEntryTree();
        _this4.render();
      });

      form.on('submit', function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data) {
          var tag, taggedHashes;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  tag = data.Tag;
                  _context7.next = 3;
                  return _this4.rhizome.retrieveLinks(tag);

                case 3:
                  taggedHashes = _context7.sent;

                  if (tag === '') tag = 'Created by you.';

                  if (taggedHashes === false) {
                    taggedHashes = 'No hashes found under that tag.';
                    form.setContent(taggedHashes.toString());
                  } else {
                    _this4.taggedTable(taggedHashes, tag);
                  }

                case 6:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, _this4);
        }));

        return function (_x5) {
          return _ref7.apply(this, arguments);
        };
      }());

      tagInput.focus();
      this.render();
      return form;
    }
  }, {
    key: '_menuBar',
    value: function _menuBar() {
      var _this5 = this;

      return blessed.listbar({
        commands: [{
          text: 'Create',
          callback: function callback() {
            return _this5.createShareForm();
          }
        }, {
          text: 'Explore',
          callback: function callback() {
            return _this5.createExploreForm();
          }
        }, {
          text: 'TODO',
          callback: function callback() {
            return console.log('TODO');
          }
        }, {
          text: 'TODO',
          callback: function callback() {
            return console.log('TODO');
          }
        }, {
          text: 'Quit',
          callback: function callback() {
            return process.exit(0);
          }
        }],
        autoCommandKeys: true,
        keys: true,
        height: 'shrink',
        width: '100%',
        border: {
          type: 'line'
        },
        style: {
          hover: { bg: 'green' }
        }
      });
    }
  }]);

  return Tui;
}();

module.exports = Tui;