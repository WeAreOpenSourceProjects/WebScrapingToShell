const _ = require('lodash');

exports.converter = (obj, conf) => {
  for (let i in conf) {
    if (conf[i]._data === 'string') {
      convert(obj, conf[i]._type, conf[i]._path);
    } else if (conf[i]._data === 'array') {
      for (let j in _.get(obj, conf[i]._path)) {
        convert(obj, conf[i]._type, conf[i]._path + '[' + j + '].' + conf[i]._key);
      }
    }
  }
  return obj;
};

const convert = (obj, type, path) => {
  switch (type) {
    case 'money': {
      _.set(obj, path, parseFloat(_.get(obj, path).slice(0, -2).replace(',', '.')));
      break;
    }
    case 'timestamp': {
      _.set(obj, path, new Date(_.get(obj, path)).getTime());
      break;
    }
    case 'int': {
      _.set(obj, path, parseInt(_.get(obj, path)));
      break;
    }
    case 'float': {
      _.set(obj, path, parseFloat(_.get(obj, path)));
      break;
    }
    case 'schemeRelative': {
      _.set(obj, path, "https:" + _.get(obj, path));
      break;
    }
    case 'youtube': {
      _.set(obj, path, "https://www.youtube.com" + _.get(obj, path));
      break;
    }
    default:
      break;
  }
};
