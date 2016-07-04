import { PkgJSONInfo, PkgJSONInfoDict, PkgJSON, NameVersionRangeDict } from './index';
import { DEPENDENCIES, PEER_DEPENDENCIES, DEV_DEPENDENCIES } from './constants';
import { DependencyType } from './index';
import { merge } from 'lodash';

export interface UpdatePkgJSONResult {
  pkgJSON: PkgJSON;
  msgs: string[];
}

export function name(pkgJSON: PkgJSON): string {
  return pkgJSON ? pkgJSON.name : null;
}

export function version(pkgJSON: PkgJSON): string {
  return pkgJSON ? pkgJSON.version : null;
}

export function versionRange(dependencyName: string, dependencyType: DependencyType, pkgJSON: PkgJSON): string {
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
export function reduceDependencies<T>(pkgJSON: PkgJSON, cb: (acc: T, depName: string, ofType: DependencyType) => T, initialValue: T): T {
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

export function forEachDependency(pkgJSON: PkgJSON, cb: (name: string, versionRange: string, type: DependencyType) => void) {
  Object.keys(pkgJSON.dependencies || {}).forEach(dep => {
    cb(dep, pkgJSON.dependencies[dep], DEPENDENCIES);
  });
  Object.keys(pkgJSON.peerDependencies || {}).forEach(dep => {
    cb(dep, pkgJSON.peerDependencies[dep], PEER_DEPENDENCIES);
  });
  Object.keys(pkgJSON.devDependencies || {}).forEach(dep => {
    cb(dep, pkgJSON.devDependencies[dep], DEV_DEPENDENCIES);
  });
}

// Basically a reduce operation but takes care of always copying the given pkgJSON
export function updateDependencies(pkgJSON: PkgJSON, doUpdateCb: (accumulatedPkgJSON: PkgJSON, depName: string, ofType: DependencyType) => PkgJSON) {
  var copyOfPkgJSON = merge({}, pkgJSON);
  // iterate over original pkgJSON's dependencies updating copyOfPkgJSON
  return reduceDependencies(pkgJSON, (acc, depName, ofType) => {
    return doUpdateCb(acc, depName, ofType);
  }, copyOfPkgJSON);
}

export function updatePkgJSON(pkgName: string, pkgJSONInfoDict: PkgJSONInfoDict, versionRangePrefix: string): UpdatePkgJSONResult {
  versionRangePrefix = versionRangePrefix || '^';
  var pkgJSONInfo = pkgJSONInfoDict[pkgName];
  var pkgJSON = pkgJSONInfo.pkgJSON;
  var msgs = [];
  var updatedPkgJSON = updateDependencies(pkgJSON, (copyOfPkgJSON: PkgJSON, depName: string, ofType: DependencyType) => {
    var depPkgJSONInfo = pkgJSONInfoDict[depName];
    // if dep package is in npu packages dir
    if (depPkgJSONInfo){
      var newVersionRange = versionRangePrefix + depPkgJSONInfo.pkgJSON.version;
      msgs.push(`Updating ${pkgJSON.name}.${ofType}.${depName} from ${pkgJSON[ofType][depName]} to ${newVersionRange}`);
      copyOfPkgJSON[ofType][depName] = newVersionRange;
    }
    return copyOfPkgJSON;
  });
  return {
    pkgJSON: updatedPkgJSON,
    msgs
  };
}
