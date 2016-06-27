import { readFileSync, readFile } from 'fs';
import { join } from 'path';
import { PkgJSONInfoDict, PkgJSONInfo } from './index';

export function readPkgJSONInfo(path: string, cb: (err: Error, result?: PkgJSONInfo) => any): any {
  readFile(join(path, 'package.json'), (err, data: Buffer) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, {
      absPath: path,
      pkgJSON: JSON.parse(data.toString())
    });
  });
}

export function readPkgJSONInfoSync(path: string): PkgJSONInfo {
  var data = readFileSync(join(path, 'package.json'));
  return {
    absPath: path,
    pkgJSON: JSON.parse(data.toString())
  };
}
