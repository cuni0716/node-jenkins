const qs = require('querystring');


const {
  createJobUrl, sleep, get, post, parseString,
} = require('./helpers');


class Jenkins {
  constructor(id, token, path, customHeaders = {}) {
    this.token = token;
    this.baseUrl = `http://${id}:${token}@${path}`;
    this.urlParams = { token };
    this.headers = Object.assign({}, { Authorization: this.urlParams.token }, customHeaders);
    this.crumb = null;
  }

  async info(job = null) {
    if (job) return get(...await this._getRequest(`${job}/api/json`));
    return get(...await this._getRequest('/api/json'));
  }

  async getJobInfo(job) {
    return get(...await this._getRequest(job, true));
  }

  async getBuildInfo(job, buildNumber) {
    return get(...await this._getRequest(job, true, buildNumber));
  }

  async getJobConfig(job) {
    const rawConfig = await get(...await this._getRequest(`${job}/config.xml`));
    return parseString(rawConfig);
  }

  async build(job) {
    const [url, headers] = await this._getRequest(job, true, '/build');
    return post(url, null, headers);
  }

  async buildWithParams(job, params = {}) {
    const [url, headers] = await this._getRequest(job, true, '/buildWithParameters');
    return post(url, params, headers);
  }

  async progressiveText(job, id, interval = 100) {
    let isBuilding = true;
    let offset = 0;
    while (isBuilding) {
      const [url] = await this._getRequest(job, true, `/${id}/logText/progressiveText`);
      const result = await get(`${url}&start=${offset}`, this.headers, true);
      const log = result.data;
      isBuilding = result.headers['x-more-data'];
      offset = result.headers['x-text-size'];
      if (log) console.log(log); // eslint-disable-line
      await sleep(interval);
    }
  }

  async _getCrumb() {
    const url = `${this.baseUrl}/crumbIssuer/api/json`;
    const result = await get(url);
    this.crumb = result;
    return result;
  }

  async _getRequest(url, isJob = false, extra = '') {
    if (!url.startsWith('/')) url = `/${url}`;
    if (extra.length && !extra.startsWith('/')) extra = `/${extra}`;
    const endpoint = `${this.baseUrl}${(isJob && !url.includes('/job/')) ? `${createJobUrl(url)}${extra}/api/json` : url}`;
    const crumb = this.crumb || await this._getCrumb();
    const headers = Object.assign({}, this.headers, { [crumb.crumbRequestField]: crumb.crumb });
    return [`${endpoint}?${qs.stringify(this.urlParams)}`, { headers }];
  }

  toString() {
    return `<Jenkins ${this.token}>`;
  }
}

module.exports = Jenkins;
