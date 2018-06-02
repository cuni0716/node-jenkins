# node-jenkins

![Travis][travis-image]
[![Version][npm-image]][npm-url]
![License][license-image]
![Issues][issues-image]
![Vulnerabilities][vul-image]
[![Dependencies][deps-image]][deps-url]

### Usage

#### Create an instance

__Options__

* __jenkinsId__: _`String`_ usually the email you use to log into your jenkins.
* __jenkinsToken:__ _`String`_ you can find it in your jenkins personal area.
* __jenkinsPath__: _`String`_ the url you use to acces to your jenkins.
* __customHeaders:__ _`Object`_ with custom headers to be sended in every request (don't worry about the _'Authorization'_ or _crumb_ headers, __node-jenkins__ do it for you ).

```js
import Jenkins from 'node-jenkins';

const jenkins = new Jenkins(jenkinsId, jenkinsToken, jenkinsPath, [customHeaders]);
```


#### Info

__Retrieve server information.__

```js
const info = await jenkins.info();
```


## So much more comming soon...

[travis-image]: https://travis-ci.org/cuni0716/node-jenkins.svg?branch=master
[license-image]: https://img.shields.io/npm/l/node-jenkins.svg
[issues-image]: https://img.shields.io/github/issues/cuni0716/node-jenkins.svg
[deps-image]: https://david-dm.org/cuni0716/node-jenkins.svg
[deps-url]: https://david-dm.org/cuni0716/node-jenkins
[vul-image]: https://snyk.io/test/github/cuni0716/node-jenkins.git/badge.svg
[npm-image]: https://img.shields.io/npm/v/node-jenkins.svg
[npm-url]: https://npmjs.org/package/node-jenkins
