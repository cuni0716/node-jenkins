const createJobUrl = job => job.split('/').join('/job/');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  createJobUrl,
  sleep,
};
