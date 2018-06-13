const createJobUrl=a=>a.split('/').join('/job/'),sleep=a=>new Promise(b=>setTimeout(b,a));module.exports={createJobUrl,sleep};
