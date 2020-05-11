/*
 * CustomQueryEncoderHelper
 * Fix plus sign (+) not encoding, so sent as blank space
 * See: https://github.com/angular/angular/issues/11058#issuecomment-247367318
 */
import { HttpUrlEncodingCodec } from '@angular/common/http';

export class CustomQueryEncoder extends HttpUrlEncodingCodec {
  encodeKey(k: string): string {
    k = super.encodeKey(k);
    return k.replace(/\+/gi, '%2B');
  }
  encodeValue(v: string): string {
    v = super.encodeValue(v);
    return v.replace(/\+/gi, '%2B');
  }
}
