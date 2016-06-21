Given an array of filesystem paths, gives back a data structure describing the npm project(s) in each path.

Install: `npm i pkg-json-dict -S`

Usage:

```js
var pkgJSONInfoDict = require('pkg-json-info-dict').pkgJSONInfoDict;
var paths = [ '/abs/path/to/file1', '/abs/path/to/file2' ];
pkgJSONInfoDict(paths, (err, result) => {
 // here result is of type PkgJSONInfoDict
});
```

Type [PkgJSONInfoDict](src/index.ts):

```ts
// An Object whose keys are of type PkgJSONInfo.
// The keys themselves are the names of each package.
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
```
