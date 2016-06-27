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
  dependencies?: { [el: string]: string };
  peerDependencies?: { [el: string]: string };
  devDependencies?: { [el: string]: string };
}

export { readPkgJSONInfoDict, readPkgJSONInfoDictSync } from './readPkgJSONInfoDict';
export { readPkgJSONInfo, readPkgJSONInfoSync } from './readPkgJSONInfo';
