// an Object whose keys are of type PkgJSONInfo
export interface PkgJSONInfoDict {
  [el: string]: PkgJSONInfo;
}

export { DependencyType } from './constants';

export interface PkgJSONInfo {
  // the absolute path to the directory holding the package.json file
  absPath: string;
  // the parsed contents of a package.json file
  pkgJSON: PkgJSON;
}

export interface PkgJSON {
  name: string;
  version: string;
  dependencies?: NameVersionRangeDict;
  peerDependencies?: NameVersionRangeDict;
  devDependencies?: NameVersionRangeDict;
}

export interface NameVersionRangeDict {
  [el: string]: string;
}

export { readPkgJSONInfoDict, readPkgJSONInfoDictSync } from './readPkgJSONInfoDict';
export { readPkgJSONInfo, readPkgJSONInfoSync } from './readPkgJSONInfo';

import * as _pkgJSONOps from './pkgJSONOps';
export const pkgJSONOps = _pkgJSONOps;

import * as _constants from './constants';
export const constants = _constants;
