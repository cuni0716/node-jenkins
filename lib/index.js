function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const axios = require('axios');

class Jenkins {
  constructor(id, token) {
    this.token = token;
    this.baseUrl = `http://${id}:${token}@jenkins.pimpam.io:19080`;
    this.urlParams = { token };
    this.headers = { Authorization: this.urlParams.token };
    this.crumb = null;
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
        return e.statusText;
      }
    })();
  }

  info() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const url = `${_this2.baseUrl}/api/json`;
      const crumb = _this2.crumb || (yield _this2.getCrumb());
      const headers = Object.assign({}, _this2.headers, { [crumb.crumbRequestField]: crumb.crumb });
      const result = yield axios.get(url, { headers });
      return result.data;
    })();
  }

  toString() {
    return `<Jenkins ${this.token}>`;
  }
}

module.exports = Jenkins;
