'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = require('path');
var rollupPluginutils = require('rollup-pluginutils');
var template = _interopDefault(require('lodash/template'));

function index () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var filter = rollupPluginutils.createFilter(options.include, options.exclude);

  var extensions = options.extensions || ['.html', '.ejs', '.jst'];

  var templateOptions = options.templateOptions || { variable: 'data' };

  return {
    transform: function transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      if (! ~extensions.indexOf(path.extname(id))) {
        return null;
      }

      var tpl = template(code, templateOptions);

      var hasEscape = false;
      var source = tpl.source.replace(/__e = _.escape/, function () {
        hasEscape = true;
        return '__e = escape';
      });

      var intro = hasEscape ? "import escape from 'underscore'" : "";

      return '\n      ' + intro + '\n      export default ' + source + '\n      ';
    }
  };
}

module.exports = index;