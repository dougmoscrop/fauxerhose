'use strict';

module.exports = function destination(options = {}) {
  if (typeof options.destination === 'function') {
    return options.destination();
  }
  throw new Error('options.destination() must be a function');
};