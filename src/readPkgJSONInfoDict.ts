import { readFileSync, readFile } from 'fs';
import { join } from 'path';
import { readDirectoryNamesInPath, readDirectoryNamesInPathSync } from './readers';
import { mapLimit, parallelLimit } from 'async';
import asyncOpsLimit from './asyncOpsLimit';
import { PkgJSONInfoDict, PkgJSONInfo } from './index';

interface PkgJSONInfoReader {
  (cb: (err: Error, res: PkgJSONInfo) => any): any;
}

interface AbsPathDirs {
  absPath: string;
  dirs: string[];
}

/**
 * Given an array of absolute paths, each path has its directories searched for a package.json
 * file. The result is an object. This object is keyed with the names of each package.json found.
 * The value for each key is an AbsPathPkgJSON.
 */
export function readPkgJSONInfoDict(paths:string[], pkgJSONInfoDictCb: (err: Error, result?: PkgJSONInfoDict) => any): any {

  mapLimit<string, PkgJSONInfoReader[]>(paths, asyncOpsLimit, (path: string, asyncResCb: AsyncResultCallback<PkgJSONInfoReader[]>): void => {
    readDirectoryNamesInPath(path, (err, dirs: string[]) => {
      if (err) {
        asyncResCb(err, undefined);
        return;
      }
      // pkgJSONInfoReaders is meant as input for parallelLimit below
      var pkgJSONInfoReaders: PkgJSONInfoReader[] = dirs.map(dir => {
        return (cb) => {
          var absPath = join(path, dir);
          readFile(join(absPath, 'package.json'), (err, data: Buffer) => {
            if (err) {
              if (err.code === 'ENOENT') {
                // if package.json file doesn't exist, set result to null
                cb(null, null);
                return;
              }
              cb(err);
              return;
            }
            cb(null, {
              absPath,
              pkgJSON: JSON.parse(data.toString())
            });
          });
        };
      });
      asyncResCb(null, pkgJSONInfoReaders);
    });
  }, (err, result: PkgJSONInfoReader[][]) => {
    // result is a PkgJSONInfoReader[][], i.e. there's a PkgJSONInfoReader for every dir containing a package.json (the first array)
    // in each path in the given paths:string[] to pkgJSONInfoDict function (the second array).
    mapLimit(result, asyncOpsLimit,
      function mapIteratee(pkgJSONInfoReaders: PkgJSONInfoReader[], mapIterateeCb: (err, pkgJSONInfos?: PkgJSONInfo[]) => any): any {
        parallelLimit(pkgJSONInfoReaders, asyncOpsLimit, (err, results: PkgJSONInfo[]) => {
          if (err) {
            mapIterateeCb(err);
            return;
          }
          mapIterateeCb(null, results);
        });
      },
      function mapResult(err, mapResults: PkgJSONInfo[][]): any {
        if (err) {
          pkgJSONInfoDictCb(err);
          return;
        }
        var pkgJSONInfoDict: PkgJSONInfoDict = {};
        mapResults.forEach((mapResult: PkgJSONInfo[]) => {
          pkgJSONInfoArrayToPkgJSONInfoDict(mapResult, pkgJSONInfoDict);
        });
        pkgJSONInfoDictCb(null, pkgJSONInfoDict);
      }
    );
  });
}

function pkgJSONInfoArrayToPkgJSONInfoDict(input: PkgJSONInfo[], objToMutate: PkgJSONInfoDict): void {
  if (input && input.forEach) {
    input.forEach(pkgJSONInfo => {
      if (pkgJSONInfo !== null) {
        objToMutate[pkgJSONInfo.pkgJSON.name] = {
          absPath: pkgJSONInfo.absPath,
          pkgJSON: pkgJSONInfo.pkgJSON,
        };
      }
    });
  }
}

export function readPkgJSONInfoDictSync(paths:string[]): PkgJSONInfoDict {
  var absPathsAndDirs: AbsPathDirs[] = paths.map(absPath => ({
    absPath,
    dirs: readDirectoryNamesInPathSync(absPath)
  }));

  return absPathsAndDirs.reduce((acc: PkgJSONInfoDict, val: AbsPathDirs) => {
    val.dirs.forEach(dir => {
      var pkgJSONString = undefined;
      try {
        pkgJSONString = readFileSync(join(val.absPath, dir, 'package.json')).toString();
      } catch(e) {
        if (e.code !== 'ENOENT') throw e;
      }
      if (pkgJSONString !== undefined) {
        var pkgJSON = JSON.parse(pkgJSONString);
        acc[pkgJSON.name] = {
          absPath: join(val.absPath, dir),
          pkgJSON
        };
      }
    });
    return acc;
  }, <PkgJSONInfoDict>{});
}
