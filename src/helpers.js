const axios = require('axios');


const createJobUrl = job => job.split('/').join('/job/');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const get = async (url, headers, raw = false) => {
  try {
    const result = await axios.get(url, headers);
    if (raw) return result;
    return result.data;
  } catch (e) {
    return e.response;
  }
};

const post = (url, params, headers) => {
  try {
    return axios.post(url, params, headers);
  } catch (e) {
    return e.response;
  }
};

module.exports = {
  createJobUrl,
  sleep,
  get,
  post,
};
