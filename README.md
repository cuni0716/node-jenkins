# node-jenkins

[![Travis][travis-image]][travis-url]
[![Version][npm-image]][npm-url]
![License][license-image]
![Issues][issues-image]
[![Vulnerabilities][vul-image]][vul-url]
[![Dependencies][deps-image]][deps-url]

## Usage

### Create an instance

__Options__

* __jenkinsId__: _`String`_ usually the email you use to log into your jenkins.
* __jenkinsToken:__ _`String`_ you can find it in your jenkins personal area.
* __jenkinsPath__: _`String`_ the url you use to acces to your jenkins.
* __customHeaders:__ _`Object`_ _`default={}`_ with custom headers to be sended in every request (don't worry about the _'Authorization'_ or _'crumb'_ headers, __node-jenkins__ do it for you :wink: ).

```js
import Jenkins from 'node-jenkins';

const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath, [customHeaders]);
```


### Info

__Retrieve server information.__

```js
const info = await jenkins.info();
```


### Jobs

__Retrieve job information__

* __jobName__: _`String`_ job full name _(e.g. 'Testing/Frontal/acceptance')_

```js
const info = await jenkins.getJobInfo(jobName);
```


### Builds

__Retrieve build information__

* __jobName__: _`String`_ job full name _(e.g. 'Testing/Frontal/acceptance')_
* __jobId__: _`Number`_ build id _(e.g. 86)_

```js
const info = await jenkins.getBuildInfo(jobName, jobId);
```

__Trigger build with parameters__

* __jobName__: _`String`_ job full name _(e.g. 'Testing/Frontal/acceptance')_
* __params__: _`Object`_ _`default={}`_ params to send to job building

```js
const build = await jenkins.buildWithParams(jobName, [params]);
```

__Trigger build now__

* __jobName__: _`String`_ job full name _(e.g. 'Testing/Frontal/acceptance')_

```js
const build = await jenkins.build(jobName);
```

__Show progressive console output__

* __jobName__: _`String`_ job full name _(e.g. 'Testing/Frontal/acceptance')_
* __jobId__: _`Number`_ build id _(e.g. 86)_
* __interval__: _`Number`_ _`default=100`_ interval to retrieve next output _in milliseconds_

```js
await jenkins.progressiveText(jobName, jobId, [interval]);
```

### Note that in all examples i use `async`/`await`, you can use `.then` instead

## More functions comming soon


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
