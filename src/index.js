const axios = require('axios');


class Jenkins {
  constructor(id, token) {
    this.token = token;
    this.baseUrl = `http://${id}:${token}@jenkins.pimpam.io:19080`;
    this.urlParams = { token };
    this.headers = { Authorization: this.urlParams.token };
    this.crumb = null;
  }

  async getCrumb() {
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

  async info() {
    const url = `${this.baseUrl}/api/json`;
    const crumb = this.crumb || await this.getCrumb();
    const headers = Object.assign({}, this.headers, { [crumb.crumbRequestField]: crumb.crumb });
    const result = await axios.get(url, { headers });
    return result.data;
  }

  toString() {
    return `<Jenkins ${this.token}>`;
  }
}

module.exports = Jenkins;
