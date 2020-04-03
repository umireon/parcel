// @flow strict-local

import {Runtime} from '@parcel/plugin';

const CODE = `
var Refresh = require('react-refresh/runtime');

Refresh.injectIntoGlobalHook(window);
window.$RefreshReg$ = function() {};
window.$RefreshSig$ = function() {
  return function(type) {
    return type;
  };
};`;

export default (new Runtime({
  async apply({bundle, options}) {
    if (
      bundle.type !== 'js' ||
      !options.hmrOptions ||
      !bundle.env.isBrowser() ||
      bundle.env.isWorker() ||
      options.mode !== 'development'
    ) {
      return;
    }

    let entries = bundle.getEntryAssets();
    for (let entry of entries) {
      let pkg = await entry.getPackage();
      if (
        pkg?.dependencies?.react ||
        pkg?.devDependencies?.react ||
        pkg?.peerDependencies?.react
      ) {
        return {
          filePath: '/app/VIRTUAL.js',
          // filePath: __filename,
          code: CODE,
          isEntry: true,
        };
      }
    }
  },
}): Runtime);
