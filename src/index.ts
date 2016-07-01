// an Object whose keys are of type PkgJSONInfo
export interface PkgJSONInfoDict {
  [el: string]: PkgJSONInfo;
}

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

import { name, version, versionRange, reduceDependencies } from './pkgJSONOps';
export var pkgJSONOps = {
  name,
  version,
  versionRange,
  reduceDependencies
};

import { DEPENDENCIES, PEER_DEPENDENCIES, DEV_DEPENDENCIES } from './constants';
export const constants = {
  DEPENDENCIES,
  PEER_DEPENDENCIES,
  DEV_DEPENDENCIES
};
