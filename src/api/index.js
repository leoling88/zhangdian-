import { http } from '../scripts/utils/http'
export default {
  queryDictionaryList (cb, param) {
    http.get('/mobile/queryDictionaryList?typeCodes=XZQ,XB,MZ,WHCD,ZZMM,HKXZ,HYZK,SF,JZFS,ZZDXZ,ZZSY,JZY', param, cb)
  }
}
