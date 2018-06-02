function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import axios from 'axios';
import qs from 'querystring';

import { createJobUrl, sleep } from './helpers';

export default class Jenkins {
  constructor(id, token, job) {
    this.baseUrl = `http://${id}:${token}@jenkins.pimpam.io:19080`;
    this.urlParams = { token };
    this.headers = { Authorization: this.urlParams.token };
    this.crumb = null;
    this.displayName = null;
    this.buildNumber = null;
    this.jobUrl = createJobUrl(job);
    this.originUrl = null;
    this.consoleOutput = '';
  }

  getCrumb() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const url = `${_this.baseUrl}/crumbIssuer/api/json`;
      try {
        const result = yield axios.get(url, _this.headers);
        const crumb = result.data;
        _this.crumb = crumb;
        return crumb;
      } catch (e) {
        return _this.getCrumb();
      }
    })();
  }

  getNextJobInfo() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const urlParams = qs.stringify(_this2.urlParams);
      const crumb = _this2.crumb || (yield _this2.getCrumb());
      const headers = Object.assign({}, _this2.headers, { [crumb.crumbRequestField]: crumb.crumb });
      const url = `${_this2.baseUrl}${_this2.jobUrl}/api/json?${urlParams}`;
      try {
        const result = yield axios.get(url, { headers });
        const { data } = result;
        _this2.displayName = data.fullDisplayName;
        _this2.buildNumber = data.nextBuildNumber;
        _this2.originUrl = data.url;
      } catch (e) {
        _this2.getNextJobInfo();
      }
    })();
  }

  build(params, showLogs) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const urlParams = qs.stringify(Object.assign({}, _this3.urlParams, params));
      const crumb = _this3.crumb || (yield _this3.getCrumb());
      const headers = Object.assign({}, _this3.headers, { [crumb.crumbRequestField]: crumb.crumb });
      const url = `${_this3.baseUrl}${_this3.jobUrl}/buildWithParameters?${urlParams}`;
      try {
        const result = yield axios.post(url, {}, { headers });
        console.log(`---> Build #${_this3.buildNumber} ${_this3.displayName}: ${result.statusText}\n\t${_this3.originUrl}`);
        yield _this3.retrieveInProgress(showLogs);
      } catch (e) {
        throw new Error(e);
      }
    })();
  }

  retrieveInProgress(showLogs) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let isBuilding = true;
      let offset = 0;
      while (isBuilding) {
        try {
          const result = yield axios.get(`${_this4.baseUrl}${_this4.jobUrl}/${_this4.buildNumber}/logText/progressiveText?start=${offset}`);
          isBuilding = result.headers['x-more-data'];
          offset = result.headers['x-text-size'];
          if (result.data) _this4.consoleOutput += result.data;
          if (showLogs && result.data) console.log(result.data);
          yield sleep(500);
        } catch (e) {
          if (e.response.status !== 404) throw new Error(e);
        }
      }
      if (!showLogs) console.log(_this4.getFinishedStatus());
    })();
  }

  getFinishedStatus() {
    const lines = this.consoleOutput.split('\n');
    return lines[lines.length - 2];
  }
}
