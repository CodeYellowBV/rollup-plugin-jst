import { extname } from 'path';
import { createFilter } from 'rollup-pluginutils';
import template from 'lodash/template';

function index () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var filter = createFilter(options.include, options.exclude);

  var extensions = options.extensions || ['.html', '.ejs', '.jst'];

  var templateOptions = options.templateOptions || { variable: 'data' };

  return {
    transform: function transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      if (! ~extensions.indexOf(extname(id))) {
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

export default index;