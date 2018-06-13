const axios = require('axios');
const qs = require('querystring');

const { createJobUrl, get } = require('./helpers');


class Jenkins {
  constructor(id, token, path, customHeaders = {}) {
    this.token = token;
    this.baseUrl = `http://${id}:${token}@${path}`;
    this.urlParams = { token };
    this.headers = Object.assign({}, { Authorization: this.urlParams.token }, customHeaders);
    this.crumb = null;
  }

  async info() {
    return get(...await this._getRequest('/api/json'));
  }

  async getJobInfo(job) {
    return get(...await this._getRequest(job, true));
  }

  async getBuildInfo(job, buildNumber) {
    return get(...await this._getRequest(job, true, buildNumber));
  }

  async triggerBuild(job, params = {}) {
    const [url, headers] = await this._getRequest(job, true, '/buildWithParameters');
    try {
      const result = await axios.post(url, params, headers);
      return { statusText: result.statusText, status: result.status };
    } catch (e) {
      return { statusText: e.response.statusText, status: e.response.status };
    }
  }

  async _getCrumb() {
    const url = `${this.baseUrl}/crumbIssuer/api/json`;
    const result = await get(url);
    this.crumb = result;
    return result;
  }

  async _getRequest(url, isJob = false, extra = '') {
    url = url.startsWith('/') ? url : `/${url}`;
    if (extra.length && !extra.startsWith('/')) extra = `/${extra}`;
    const endpoint = `${this.baseUrl}${isJob ? `${createJobUrl(url)}${extra}/api/json` : url}`;
    const crumb = this.crumb || await this._getCrumb();
    const headers = Object.assign({}, this.headers, { [crumb.crumbRequestField]: crumb.crumb });
    return [`${endpoint}?${qs.stringify(this.urlParams)}`, { headers }];
  }

  toString() {
    return `<Jenkins ${this.token}>`;
  }
}

module.exports = Jenkins;
