import { PkgJSONInfo, PkgJSON, NameVersionRangeDict } from './index';
import { DEPENDENCIES, PEER_DEPENDENCIES, DEV_DEPENDENCIES } from './constants';

export function name(pkgJSON: PkgJSON): string {
  return pkgJSON ? pkgJSON.name : null;
}

export function version(pkgJSON: PkgJSON): string {
  return pkgJSON ? pkgJSON.version : null;
}

export function versionRange(dependencyName: string, dependencyType: string, pkgJSON: PkgJSON): string {
  if (pkgJSON) {
    var depType = pkgJSON[dependencyType];
    if (depType) {
      var depName = depType[dependencyName];
      return depName || null;
    }
  }

  return null;
}

// initialValue is mandatory
// ofType: 'dependencies' | 'peerDependencies' | 'devDependencies'
export function reduceDependencies<T>(pkgJSON: PkgJSON, cb: (acc: T, depName: string, ofType: string) => T, initialValue: T): T {
  var dependencies = pkgJSON.dependencies || {};
  var peerDependencies = pkgJSON.peerDependencies || {};
  var devDependencies = pkgJSON.devDependencies || {};

  var result = Object.keys(dependencies).reduce((prevVal, currVal) => {
    return cb(prevVal, currVal, DEPENDENCIES);
  }, initialValue);
  result = Object.keys(peerDependencies).reduce((prevVal, currVal) => {
    return cb(prevVal, currVal, PEER_DEPENDENCIES);
  }, initialValue);
  result = Object.keys(devDependencies).reduce((prevVal, currVal) => {
    return cb(prevVal, currVal, DEV_DEPENDENCIES);
  }, initialValue);

  return result;
}
