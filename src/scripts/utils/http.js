/**
 * Created by Administrator on 2018/3/19.
 */
import axios from 'axios'

export const http = {
	get (url, param, cb) {
		let params = {};
    if (param) {
      params = {
        ...param
      }
    }
    axios.get(url, params)
      .then(function (res) {
          cb(res.data)
      })
      .catch(function (error) {
        console.log(error)
      })
	}
};