const axios = require('axios');
const qs = require('qs');

const { createJobUrl } = require('./helpers');


class Jenkins {
  constructor(id, token, path, customHeaders = {}) {
    this.token = token;
    this.baseUrl = `http://${id}:${token}@${path}`;
    this.urlParams = { token };
    this.headers = Object.assign({}, { Authorization: this.urlParams.token }, customHeaders);
    this.crumb = null;
  }

  async info() {
    const [url, headers] = await this._getRequest('/api/json');
    const result = await axios.get(url, headers);
    return result.data;
  }

  async getJobInfo(job) {
    const [url, headers] = await this._getRequest(job, true);
    try {
      const result = await axios.get(url, headers);
      return result.data;
    } catch (e) {
      return e.statusText;
    }
  }

  async getBuildInfo(job, buildNumber) {
    const [url, headers] = await this._getRequest(job, true, `/${buildNumber}`);
    try {
      const result = await axios.get(url, headers);
      return result.data;
    } catch (e) {
      return e.statusText;
    }
  }

  async _getCrumb() {
    const url = `${this.baseUrl}/crumbIssuer/api/json`;
    try {
      const result = await axios.get(url, this.headers);
      const crumb = result.data;
      this.crumb = crumb;
      return crumb;
    } catch (e) {
      return e.statusText;
    }
  }

  async _getRequest(url, isJob = false, buildNumber = '') {
    url = url.startsWith('/') ? url : `/${url}`;
    const endpoint = `${this.baseUrl}${isJob ? `${createJobUrl(url)}${buildNumber}/api/json` : url}`;
    const crumb = this.crumb || await this._getCrumb();
    const headers = Object.assign({}, this.headers, { [crumb.crumbRequestField]: crumb.crumb });
    return [`${endpoint}?${qs.stringify(this.urlParams)}`, { headers }];
  }

  toString() {
    return `<Jenkins ${this.token}>`;
  }
}

module.exports = Jenkins;
