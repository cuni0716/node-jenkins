# node-jenkins

[![Travis][travis-image]][travis-url]
[![Version][npm-image]][npm-url]
![License][license-image]
![Issues][issues-image]
[![Vulnerabilities][vul-image]][vul-url]
[![Dependencies][deps-image]][deps-url]

## Usage

### Create an instance

**Options**

- **jenkinsId**: _`String`_ usually the email you use to log into your jenkins.
- **jenkinsToken:** _`String`_ you can find it in your jenkins personal area.
- **jenkinsPath**: _`String`_ the url you use to acces to your jenkins.
- **customHeaders:** _`Object`_ _`default={}`_ with custom headers to be sended in every request (don't worry about the _'Authorization'_ or _'crumb'_ headers, **node-jenkins** do it for you :wink: ).

```js
import Jenkins from "node-jenkins";

const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath, [
  customHeaders
]);
```

### Info

**Retrieve server information.**

```js
const info = await jenkins.info();
```

### Jobs

**Retrieve job information**

- **jobName**: _`String`_ job url

```js
const info = await jenkins.info(jobName);
```

**Retrieve job configuration**

- **jobUrl**: _`String`_ job url

```js
const config = await jenkins.getJobConfig(jobUrl);
```

### Builds

**Retrieve build information**

- **jobName**: _`String`_ job url
- **jobId**: _`Number`_ build id

```js
const info = await jenkins.getBuildInfo(jobName, jobId);
```

**Trigger build with parameters**

- **jobName**: _`String`_ job url
- **params**: _`Object`_ _`default={}`_ params to send to job building

```js
const build = await jenkins.buildWithParams(jobName, [params]);
```

**Trigger build now**

- **jobName**: _`String`_ job url

```js
const build = await jenkins.build(jobName);
```

**Show progressive console output**

- **jobName**: _`String`_ job url
- **jobId**: _`Number`_ build id
- **showLogs**: _`Boolean`_ _`default=true`_ you can execute this function without displaying logs on console, only to waiting for the build finish
- **interval**: _`Number`_ _`default=100`_ interval to retrieve next output _in milliseconds_

```js
await jenkins.progressiveText(jobName, jobId, [showLogs, interval]);
```

### Note that in all examples i use `async`/`await`, you can use `.then` instead

### License

This work is licensed under the MIT License (see the LICENSE file).

[travis-image]: https://travis-ci.org/cuni0716/node-jenkins.svg?branch=master
[travis-url]: https://travis-ci.org/cuni0716/node-jenkins
[license-image]: https://img.shields.io/npm/l/node-jenkins.svg
[issues-image]: https://img.shields.io/github/issues/cuni0716/node-jenkins.svg
[deps-image]: https://david-dm.org/cuni0716/node-jenkins.svg
[deps-url]: https://david-dm.org/cuni0716/node-jenkins
[vul-image]: https://snyk.io/test/github/cuni0716/node-jenkins.git/badge.svg
[vul-url]: https://snyk.io/test/github/cuni0716/node-jenkins.git
[npm-image]: https://img.shields.io/npm/v/node-jenkins.svg
[npm-url]: https://npmjs.org/package/node-jenkins
