export const createJobUrl = job => job.split('/').join('/job/');

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
