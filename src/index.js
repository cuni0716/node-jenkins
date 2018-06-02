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

  async getCrumb() {
    const url = `${this.baseUrl}/crumbIssuer/api/json`;
    try {
      const result = await axios.get(url, this.headers);
      const crumb = result.data;
      this.crumb = crumb;
      return crumb;
    } catch (e) {
      return this.getCrumb();
    }
  }

  async getNextJobInfo() {
    const urlParams = qs.stringify(this.urlParams);
    const crumb = this.crumb || await this.getCrumb();
    const headers = Object.assign({}, this.headers, { [crumb.crumbRequestField]: crumb.crumb });
    const url = `${this.baseUrl}${this.jobUrl}/api/json?${urlParams}`;
    try {
      const result = await axios.get(url, { headers });
      const { data } = result;
      this.displayName = data.fullDisplayName;
      this.buildNumber = data.nextBuildNumber;
      this.originUrl = data.url;
    } catch (e) {
      this.getNextJobInfo();
    }
  }

  async build(params, showLogs) {
    const urlParams = qs.stringify(Object.assign({}, this.urlParams, params));
    const crumb = this.crumb || await this.getCrumb();
    const headers = Object.assign({}, this.headers, { [crumb.crumbRequestField]: crumb.crumb });
    const url = `${this.baseUrl}${this.jobUrl}/buildWithParameters?${urlParams}`;
    try {
      const result = await axios.post(url, {}, { headers });
      console.log(`---> Build #${this.buildNumber} ${this.displayName}: ${result.statusText}\n\t${this.originUrl}`);
      await this.retrieveInProgress(showLogs);
    } catch (e) { throw new Error(e); }
  }

  async retrieveInProgress(showLogs) {
    let isBuilding = true;
    let offset = 0;
    while (isBuilding) {
      try {
        const result = await axios.get(`${this.baseUrl}${this.jobUrl}/${this.buildNumber}/logText/progressiveText?start=${offset}`);
        isBuilding = result.headers['x-more-data'];
        offset = result.headers['x-text-size'];
        if (result.data) this.consoleOutput += result.data;
        if (showLogs && result.data) console.log(result.data);
        await sleep(500);
      } catch (e) {
        if (e.response.status !== 404) throw new Error(e);
      }
    }
    if (!showLogs) console.log(this.getFinishedStatus());
  }

  getFinishedStatus() {
    const lines = this.consoleOutput.split('\n');
    return lines[lines.length - 2];
  }
}
